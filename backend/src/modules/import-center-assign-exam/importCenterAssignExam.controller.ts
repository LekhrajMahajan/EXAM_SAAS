import { Request, Response } from 'express';
import { ImportCenterAssignExamModel } from './importCenterAssignExam.model';
import mongoose from 'mongoose';
import Center from '../center/center.model';

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

    const importData = await ImportCenterAssignExamModel.find(query)
      .populate('examId', 'examName examTitle examCode status')
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

    const formattedExams = assignedExams.map(record => {
      const centerDetails = record.centers.find(
        (c) => c.matchedCenterId?.toString() === centerId
      );

      return {
        id: record._id,
        examId: record.examId,
        assignedCandidatesCount: 0,
        status: 'Assigned & Active',
        venueDetails: centerDetails
      };
    });

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
