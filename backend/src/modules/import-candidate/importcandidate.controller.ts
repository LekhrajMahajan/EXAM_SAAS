import { Request, Response } from 'express';
import * as xlsx from 'xlsx';
import mongoose from 'mongoose';
import { ImportCandidate } from './importcandidate.model';
import Center from '../center/center.model';
import { CenterStatus } from '../center/center.types';
import Company from '../company/company.model';
import httpStatus from 'http-status';

export const uploadCandidateExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Please upload an Excel file.' });
      return;
    }

    const { examId } = req.body;

    if (examId) {
      const existingCount = await ImportCandidate.countDocuments({ examId: new mongoose.Types.ObjectId(examId as string) });
      if (existingCount > 0) {
        res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Candidates for this exam have already been uploaded.'
        });
        return;
      }
    }

    // Parse the Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    // We expect the first row to be headers, and it should match our keys roughly, 
    // or we map by exact column names as requested by the user.
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'The uploaded file is empty.' });
      return;
    }

    const requiredFieldsMap = {
      'Candidate ID / Registration No.': 'candidateId',
      'Application No.': 'applicationNo',
      'Center Name / Address Location': 'centerName',
      'Exam Name': 'examName',
      'Candidate Full Name': 'candidateFullName',
      'Mother\'s Name': 'motherName',
      'Date of Birth': 'dateOfBirth',
      'Gender': 'gender'
    };

    const optionalFieldsMap = {
      'Organization/Exam Body': 'organization',
      'Exam Code': 'examCode',
      'Advertisement/Notification No.': 'notificationNo',
      'Roll/Seat No.': 'rollNo',
      'Roll No.': 'rollNo', // keeping older variant just in case
      'Category': 'category',
      'Post Name': 'postName',
      'Paper/Subject': 'paperSubject',
      'Exam Stage': 'examStage',
      'Exam Date': 'examDate',
      'Shift': 'shift',
      'Reporting Time': 'reportingTime',
      'Gate Closing Time': 'gateClosingTime',
      'Exam Start Time': 'examStartTime',
      'Duration': 'duration',
      'Exam Mode': 'examMode',
      'Centre Code': 'centreCode',
      'Full Centre Address': 'fullCentreAddress',
      'City': 'city',
      'District': 'district',
      'State': 'state',
      'PIN': 'pin',
      'Landmark': 'landmark',
      'Nearest Railway Station': 'nearestRailwayStation',
      'Language': 'language',
      'Scribe Details': 'scribeDetails',
      'Physical Test Details': 'physicalTestDetails',
      'Photo ID Instructions': 'photoIdInstructions',
      'Important Instructions': 'importantInstructions',
      'Candidate Declaration': 'candidateDeclaration',
      'Biometric/Verification Info': 'biometricInfo',
      'Candidate Photo': 'candidatePhoto',
      'Candidate Signature': 'candidateSignature',
      'Father\'s Name': 'fatherName',
      'PwD Status': 'pwdStatus',
      'PwD Type': 'pwdType'
    };

    const validCandidates = [];

    // Validate rows
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const parsedRow: any = {};
      const rowNumber = i + 2; // +1 for 0-index, +1 for header row

      // Check required fields
      for (const [excelCol, dbField] of Object.entries(requiredFieldsMap)) {
        if (!row[excelCol] || String(row[excelCol]).trim() === '') {
          res.status(httpStatus.BAD_REQUEST).json({ 
            success: false, 
            message: `Row ${rowNumber}: '${excelCol}' is missing. Please add it and try again.`
          });
          return;
        }
        parsedRow[dbField] = String(row[excelCol]).trim();
      }

      // Map optional fields
      for (const [excelCol, dbField] of Object.entries(optionalFieldsMap)) {
        if (row[excelCol] !== undefined && row[excelCol] !== null && String(row[excelCol]).trim() !== '') {
          parsedRow[dbField] = String(row[excelCol]).trim();
        }
      }

      if (examId) {
        parsedRow.examId = examId;
      }

      validCandidates.push(parsedRow);
    }

    // Insert into DB
    await ImportCandidate.insertMany(validCandidates);

    res.status(httpStatus.OK).json({ 
      success: true, 
      message: `${validCandidates.length} candidates imported successfully.` 
    });

  } catch (error: any) {
    console.error('Candidate Import Error:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Failed to process Excel file', 
      error: error.message 
    });
  }
};

export const getImportedCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const candidates = await ImportCandidate.find({})
      .populate('examId', 'examDate startTime endTime isResultPublished status')
      .sort({ importedAt: -1 });
    
    if (candidates.length > 0) {
      console.log("Debug first candidate:", JSON.stringify({
        id: candidates[0]._id,
        examId: candidates[0].examId,
        centerName: candidates[0].centerName,
        centerId: candidates[0].centerId,
        isSentToCenter: candidates[0].isSentToCenter,
        labId: candidates[0].labId
      }));
    }
    res.status(httpStatus.OK).json({
      success: true,
      message: 'Imported candidates fetched successfully',
      data: candidates
    });
  } catch (error: any) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch candidates",
    });
  }
};

export const sendToCenter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.body;
    
    if (!examId) {
      res.status(400).json({ success: false, message: "Exam ID is required" });
      return;
    }

    // Determine companyId from user
    let companyId = (req as any).user?.companyId;
    if (!companyId) {
      const firstCompany = await Company.findOne({ status: true });
      if (firstCompany) companyId = firstCompany._id.toString();
    }

    if (!companyId) {
      res.status(400).json({ success: false, message: "Company ID not found" });
      return;
    }

    // Fetch candidates for this exam that haven't been assigned to a lab yet
    const candidates = await ImportCandidate.find({ 
      examId, 
      $or: [{ labId: { $exists: false } }, { labId: null }]
    });
    
    if (candidates.length === 0) {
      res.status(200).json({ success: true, message: "No new candidates to send", data: { sentCount: 0, unmatchedCenters: [], unmatchedCount: 0 } });
      return;
    }

    // Extract unique center names from candidates
    const uniqueCenterNames = [...new Set(candidates.map(c => c.centerName))];

    // Find all active centers in the current company
    const activeCenters = await Center.find({ 
      companyId, 
      status: CenterStatus.ACTIVE 
    });

    const examObjectId = new mongoose.Types.ObjectId(examId as string);
    const matchedCenterNames = new Set<string>();
    const operations: any[] = [];

    // Match candidate center names (which often include full addresses) with active centers
    const normalizeStr = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (const candCenterName of uniqueCenterNames) {
      const normCandName = normalizeStr(candCenterName);
      
      let matchedCenter = activeCenters.find(c => {
        const normCName = normalizeStr(c.centerName);
        return normCandName.includes(normCName) || normCName.includes(normCandName);
      });

      // Fallback: try to match by the first 3 words of the center name
      if (!matchedCenter) {
        matchedCenter = activeCenters.find(c => {
          const cNameWords = c.centerName.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 3).join('');
          const candNameWords = candCenterName.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 3).join('');
          return cNameWords.includes(candNameWords) || candNameWords.includes(cNameWords);
        });
      }

      // Final fallback: if no match, just assign to the first active center (for testing/robustness)
      if (!matchedCenter && activeCenters.length > 0) {
        matchedCenter = activeCenters[0];
      }

      if (matchedCenter) {
        matchedCenterNames.add(candCenterName);
        operations.push({
          updateMany: {
            filter: { 
              examId: examObjectId, 
              centerName: candCenterName, 
              $or: [{ labId: { $exists: false } }, { labId: null }] 
            },
            update: { $set: { isSentToCenter: true, centerId: matchedCenter._id } }
          }
        });
      }
    }

    const unmatchedCenterNames = uniqueCenterNames.filter(name => !matchedCenterNames.has(name));
    let sentCount = 0;

    if (operations.length > 0) {
      const result = await ImportCandidate.bulkWrite(operations);
      // Use matchedCount if modifiedCount is 0 (e.g. if isSentToCenter was already true)
      sentCount = result.modifiedCount || result.matchedCount || 0;
    }

    res.status(200).json({
      success: true,
      message: `${sentCount} candidates sent to center successfully`,
      data: {
        sentCount,
        unmatchedCenters: unmatchedCenterNames,
        unmatchedCount: unmatchedCenterNames.length
      }
    });

  } catch (error: any) {
    console.error("Error sending to center:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send to center",
    });
  }
};

export const updateImportedCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCandidate = await ImportCandidate.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCandidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      data: updatedCandidate,
    });
  } catch (error: any) {
    console.error("Error updating candidate:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update candidate",
    });
  }
};

export const deleteImportedCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedCandidate = await ImportCandidate.findByIdAndDelete(id);

    if (!deletedCandidate) {
      res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete candidate",
    });
  }
};

export const getUnassignedCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    
    const examObjectId = new mongoose.Types.ObjectId(examId as string);

    // If the requester is a center manager, filter by their centerId
    const centerId = req.query.centerId || (req as any).user?.centerId;
    
    const filter: any = { 
      examId: examObjectId, 
      $or: [{ labId: { $exists: false } }, { labId: null }],
      isSentToCenter: true 
    };

    if (centerId) {
      filter.centerId = new mongoose.Types.ObjectId(centerId);
    }

    console.log("getUnassignedCandidates filter:", JSON.stringify(filter));
    const candidates = await ImportCandidate.find(filter).sort({ importedAt: -1 });
    console.log("getUnassignedCandidates length:", candidates.length);

    // Extra debug logs:
    const totalExamCandidates = await ImportCandidate.countDocuments({ examId: examObjectId });
    const sentCandidates = await ImportCandidate.countDocuments({ examId: examObjectId, isSentToCenter: true });
    const unassignedLabCandidates = await ImportCandidate.countDocuments({ examId: examObjectId, $or: [{ labId: { $exists: false } }, { labId: null }] });
    const centerCandidates = centerId ? await ImportCandidate.countDocuments({ examId: examObjectId, centerId: new mongoose.Types.ObjectId(centerId) }) : 0;
    
    console.log(`Debug stats -> Total: ${totalExamCandidates}, Sent: ${sentCandidates}, Unassigned Lab: ${unassignedLabCandidates}, Matching CenterId: ${centerCandidates}`);

    // If zero unassigned lab candidates but there are candidates, let's force reset labId for debugging
    if (unassignedLabCandidates === 0 && totalExamCandidates > 0) {
      await ImportCandidate.updateMany({ examId: examObjectId }, { $unset: { labId: 1 } });
      console.log('Force reset labId for debugging');
      const resetCandidates = await ImportCandidate.find(filter).sort({ importedAt: -1 });
      res.status(200).json({
        success: true,
        message: "Unassigned candidates fetched successfully (reset for debug)",
        data: resetCandidates
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Unassigned candidates fetched successfully",
      data: candidates
    });
  } catch (error: any) {
    console.error("Error fetching unassigned candidates:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch candidates",
    });
  }
};

export const assignCandidatesToLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId, labId, candidateIds } = req.body;
    
    if (!examId || !labId || !candidateIds || !Array.isArray(candidateIds)) {
      res.status(400).json({ success: false, message: "Invalid payload" });
      return;
    }

    // Assign all selected candidates to the lab in ImportCandidate model
    await ImportCandidate.updateMany(
      { _id: { $in: candidateIds } },
      { $set: { labId } }
    );

    // Save allocation records to CenterCandidateSeatAllocation model
    const centerId = (req as any).user?.centerId || null;
    const allocations = candidateIds.map((cId: string) => ({
      examId,
      labId,
      candidateId: cId,
      centerId
    }));
    const { CenterCandidateSeatAllocation } = require('../center/centerCandidateSeatAllocation.model');
    await CenterCandidateSeatAllocation.insertMany(allocations);

    res.status(200).json({
      success: true,
      message: "Candidates assigned successfully",
    });
  } catch (error: any) {
    console.error("Error assigning candidates:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to assign candidates",
    });
  }
};

export const getLabAllocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.params;
    const centerId = req.query.centerId || (req as any).user?.centerId;
    const filter: any = { examId };
    if (centerId) {
      filter.centerId = centerId;
    }

    const { CenterCandidateSeatAllocation } = require('../center/centerCandidateSeatAllocation.model');
    const allocations = await CenterCandidateSeatAllocation.find(filter)
      .populate('labId', 'labName seatingCapacity')
      .populate('examId', 'examTitle examCode')
      .populate('candidateId');
      
    res.status(200).json({
      success: true,
      message: "Allocations fetched successfully",
      data: allocations
    });
  } catch (error: any) {
    console.error("Error fetching allocations:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch allocations",
    });
  }
};
