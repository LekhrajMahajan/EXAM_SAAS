import { Request, Response } from 'express';
import { ImportCenterAssignExamModel } from './importCenterAssignExam.model';
import mongoose from 'mongoose';
import Center from '../center/center.model';
import Employee from '../employee/employee.model';
import StaffAssignmentModel from '../staff-assignment/staffAssignment.model';
import notificationService from '../notification/notification.service';
import { NotificationType, NotificationChannel, NotificationPriority } from '../notification/notification.types';
import Candidate from '../candidate/candidate.model';

export const createImportCenterAssignExam = async (req: Request, res: Response) => {
  try {
    const { examId, centers } = req.body;

    if (!examId) {
      return res.status(400).json({ success: false, message: 'Exam ID is required.' });
    }

    if (!centers || !Array.isArray(centers) || centers.length === 0) {
      return res.status(400).json({ success: false, message: 'Centers data is required.' });
    }

    // Check if an import for this exam already exists
    const existingImport = await ImportCenterAssignExamModel.findOne({ examId });

    if (existingImport) {
      // Find duplicates by matching centerCode or centerName
      const existingCenterCodes = new Set(existingImport.centers.map((c: any) => c.centerCode));
      const existingCenterNames = new Set(existingImport.centers.map((c: any) => c.centerName?.toLowerCase()));

      const duplicates = centers.filter(
        (c: any) => existingCenterCodes.has(c.centerCode) || (c.centerName && existingCenterNames.has(c.centerName.toLowerCase()))
      );

      if (duplicates.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Some centers are already uploaded for this exam (e.g., ${duplicates[0].centerName || duplicates[0].centerCode}). Please remove duplicate centers from the file.`,
        });
      }

      // Merge new centers
      existingImport.centers.push(...centers);
      const savedImport = await existingImport.save();

      return res.status(200).json({
        success: true,
        message: 'New centers merged successfully.',
        data: savedImport,
      });
    }

    // Create new if not exists
    const newImport = new ImportCenterAssignExamModel({
      examId,
      centers,
    });

    const savedImport = await newImport.save();

    return res.status(201).json({
      success: true,
      message: 'Centers imported successfully.',
      data: savedImport,
    });
  } catch (error) {
    console.error('Error in createImportCenterAssignExam:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while importing centers.',
    });
  }
};

export const getImportCenterAssignExamById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    const importData = await ImportCenterAssignExamModel.findById(id).populate('examId', 'examName examCode');

    if (!importData) {
      return res.status(404).json({ success: false, message: 'Import data not found.' });
    }

    res.status(200).json({
      success: true,
      data: importData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching import data.',
    });
  }
};

export const getAllImportCenterAssignExams = async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query.sentToAdmin === 'true') {
      query.isSentToCompanyAdmin = true;
    }

    if (req.user && req.user.role === 'PRIVATE_AUTHORITY') {
      // Find employee to get their StaffAssignment examId
      const employee = await Employee.findOne({ userId: (req.user as any).userId });
      if (employee) {
        const assignments = await StaffAssignmentModel.find({ employeeId: employee._id, isDeleted: false });
        const assignedExamIds = assignments.map((a: any) => a.examId).filter((id: any) => id);
        
        if (assignedExamIds.length > 0) {
          query.examId = { $in: assignedExamIds };
        } else {
          // No assignment found, restrict access
          query.examId = new mongoose.Types.ObjectId();
        }
      } else {
        query.examId = new mongoose.Types.ObjectId();
      }
    } else if (req.user && req.user.role === 'GOVT_AUTHORITY') {
      // Govt Authority sees all exams except those explicitly assigned to Private Authority
      const privateAssignments = await StaffAssignmentModel.find({ role: 'PRIVATE_AUTHORITY' }).select('examId');
      const privateExamIds = privateAssignments.map((a: any) => a.examId).filter((id: any) => id);
      if (privateExamIds.length > 0) {
        query.examId = { $nin: privateExamIds };
      }
    }

    const importData = await ImportCenterAssignExamModel.find(query)
      .populate('examId', 'examName examTitle examCode status examDate startTime endTime isResultGenerated isResultPublished')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: importData,
    });
  } catch (error) {
    console.error('Error in getAllImportCenterAssignExams:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching all import data.',
    });
  }
};

export const sendToCompanyAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    const updatedImport = await ImportCenterAssignExamModel.findByIdAndUpdate(
      id,
      { isSentToCompanyAdmin: true },
      { new: true }
    );

    if (!updatedImport) {
      return res.status(404).json({ success: false, message: 'Import data not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Successfully sent to company admin.',
      data: updatedImport,
    });
  } catch (error) {
    console.error('Error in sendToCompanyAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending to company admin.',
    });
  }
};

export const sendToCenters = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format.' });
    }

    const importRecord = await ImportCenterAssignExamModel.findById(id);

    if (!importRecord) {
      return res.status(404).json({ success: false, message: 'Import data not found.' });
    }

    // Iterate through centers and find matching Center in our DB
    for (const centerData of importRecord.centers) {
      const match = await Center.findOne({
        centerCode: new RegExp(`^${centerData.centerCode}$`, 'i'),
      });

      if (match) {
        centerData.matchedCenterId = match._id as mongoose.Types.ObjectId;

        // Generate notification if center has a manager
        if (match.centerManagerId) {
          try {
            await notificationService.create({
              title: "New Exam Assigned",
              message: `An exam (${centerData.examName}) has been assigned to your center (${match.centerName}).`,
              type: NotificationType.SYSTEM,
              channel: NotificationChannel.IN_APP,
              priority: NotificationPriority.HIGH,
              recipientId: match.centerManagerId as mongoose.Types.ObjectId,
              companyId: match.companyId as mongoose.Types.ObjectId,
            });
          } catch (notifErr) {
            console.error("Failed to create exam assignment notification:", notifErr);
          }
        }
      }
    }

    importRecord.isSentToCenters = true;
    await importRecord.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully assigned exams to matched centers.',
      data: importRecord,
    });
  } catch (error) {
    console.error('Error in sendToCenters:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending to centers.',
    });
  }
};

export const getAssignedExamsForCenter = async (req: Request, res: Response) => {
  try {
    const { centerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(centerId as string)) {
      return res.status(400).json({ success: false, message: 'Invalid Center ID.' });
    }

    const assignedExams = await ImportCenterAssignExamModel.find({
      isSentToCenters: true,
      'centers.matchedCenterId': new mongoose.Types.ObjectId(centerId as string)
    })
      .populate({
        path: 'examId',
        populate: {
          path: 'shiftId'
        }
      })
      .sort({ createdAt: -1 });

    const formattedExams = await Promise.all(assignedExams.map(async (record: any) => {
      const centerDetails = record.centers.find(
        (c: any) => c.matchedCenterId?.toString() === centerId
      );

      const { ImportCandidate } = require('../import-candidate/importcandidate.model');
      const count = await ImportCandidate.countDocuments({
        centerId: new mongoose.Types.ObjectId(centerId as string),
        examId: record.examId?._id || record.examId,
        isSentToCenter: true
      });

      return {
        id: record._id,
        examId: record.examId,
        assignedCandidatesCount: count,
        status: 'Assigned & Active',
        venueDetails: centerDetails
      };
    }));

    res.status(200).json({
      success: true,
      data: formattedExams,
    });
  } catch (error) {
    console.error('Error in getAssignedExamsForCenter:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching assigned exams.',
    });
  }
};
