import { Request, Response } from 'express';
import * as xlsx from 'xlsx';
import mongoose from 'mongoose';
import AdmZip from 'adm-zip';
import path from 'path';
import { ImportCandidate } from './importcandidate.model';
import Employee from '../employee/employee.model';
import StaffAssignmentModel from '../staff-assignment/staffAssignment.model';
import Center from '../center/center.model';
import { CenterStatus } from '../center/center.types';
import Company from '../company/company.model';
import httpStatus from 'http-status';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

// Upload image buffer directly to cloudinary, returns the secure_url
const uploadBufferToCloudinary = (buffer: Buffer, folder: string, publicId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary returned no result'));
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const uploadCandidateExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    // Now accepts ONE zip file (field name: "file") containing:
    //   - one Excel/CSV file (.xlsx, .xls, .csv)
    //   - photo files named as CandidateID.jpg/jpeg/png (in any folder or root)
    if (!req.file) {
      res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Please upload a ZIP file.' });
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

    // Configure cloudinary from env
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // --- Extract the ZIP ---
    let zip: AdmZip;
    try {
      zip = new AdmZip(req.file.buffer);
    } catch {
      res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Invalid or corrupted ZIP file.' });
      return;
    }

    const zipEntries = zip.getEntries();

    // Find the Excel/CSV file inside ZIP
    const EXCEL_EXTS = ['.xlsx', '.xls', '.csv'];
    const IMAGE_EXTS = ['.jpg', '.jpeg', '.png'];

    let excelBuffer: Buffer | null = null;
    let excelExt = '';
    const zipImagesMap = new Map<string, { buffer: Buffer; ext: string }>();

    zipEntries.forEach(entry => {
      if (entry.isDirectory) return;
      const basename = path.basename(entry.entryName);
      const ext = path.extname(basename).toLowerCase();
      const nameWithoutExt = path.basename(basename, ext).toLowerCase();

      if (!excelBuffer && EXCEL_EXTS.includes(ext)) {
        excelBuffer = entry.getData();
        excelExt = ext;
      } else if (IMAGE_EXTS.includes(ext)) {
        // Index image by its filename-without-extension (lowercase)
        zipImagesMap.set(nameWithoutExt, { buffer: entry.getData(), ext });
      }
    });

    if (!excelBuffer) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'No Excel/CSV file found inside the ZIP. Please include a .xlsx, .xls, or .csv file.'
      });
      return;
    }

    if (zipImagesMap.size === 0) {
      res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: 'No images found inside the ZIP. Please include candidate photos (.jpg, .jpeg, .png) named by Candidate ID.'
      });
      return;
    }

    // --- Parse Excel ---
    const workbook = xlsx.read(excelBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'The Excel file inside the ZIP is empty.' });
      return;
    }

    const requiredFieldsMap: Record<string, string> = {
      'Candidate ID / Registration No.': 'candidateId',
      'Application No.': 'applicationNo',
      'Center Name / Address Location': 'centerName',
      'Exam Name': 'examName',
      'Candidate Full Name': 'candidateFullName',
      'Father\'s Name': 'fatherName',
      'Mother\'s Name': 'motherName',
      'Date of Birth': 'dateOfBirth',
      'Gender': 'gender',
      'Aadhaar No.': 'aadharNumber'
    };

    const optionalFieldsMap: Record<string, string> = {
      'Organization/Exam Body': 'organization',
      'Exam Code': 'examCode',
      'Advertisement/Notification No.': 'notificationNo',
      'Roll/Seat No.': 'rollNo',
      'Roll No.': 'rollNo',
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
      'Candidate Signature': 'candidateSignature',
      'PwD Status': 'pwdStatus',
      'PwD Type': 'pwdType'
    };

    const validCandidates: any[] = [];
    const errors: string[] = [];
    const seenCandidateIds = new Set<string>();

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const parsedRow: any = {};
      const rowNumber = i + 2;
      let isRowValid = true;

      // Validate required fields
      for (const [excelCol, dbField] of Object.entries(requiredFieldsMap)) {
        if (!row[excelCol] || String(row[excelCol]).trim() === '') {
          errors.push(`Row ${rowNumber}: Required column '${excelCol}' is missing or empty.`);
          isRowValid = false;
          break;
        }
        parsedRow[dbField] = String(row[excelCol]).trim();
      }
      if (!isRowValid) continue;

      const candidateId = parsedRow.candidateId as string;

      // Duplicate Candidate ID check
      if (seenCandidateIds.has(candidateId.toLowerCase())) {
        errors.push(`Row ${rowNumber}: Duplicate Candidate ID "${candidateId}".`);
        continue;
      }
      seenCandidateIds.add(candidateId.toLowerCase());

      // Match photo from ZIP images by Candidate ID (case-insensitive)
      const imageEntry = zipImagesMap.get(candidateId.toLowerCase());
      if (!imageEntry) {
        errors.push(`Row ${rowNumber}: Photo missing for ID "${candidateId}" — expected ${candidateId}.jpg / .jpeg / .png inside ZIP.`);
        continue;
      }

      // Map optional fields (missing = OK)
      for (const [excelCol, dbField] of Object.entries(optionalFieldsMap)) {
        if (row[excelCol] !== undefined && row[excelCol] !== null && String(row[excelCol]).trim() !== '') {
          parsedRow[dbField] = String(row[excelCol]).trim();
        }
      }

      // Capture dynamic extra columns
      const dynamicFields: Record<string, any> = {};
      const knownExcelCols = new Set([...Object.keys(requiredFieldsMap), ...Object.keys(optionalFieldsMap)]);
      for (const excelCol of Object.keys(row)) {
        if (!knownExcelCols.has(excelCol)) {
          dynamicFields[excelCol] = row[excelCol];
        }
      }
      parsedRow.dynamicFields = dynamicFields;

      if (examId) {
        parsedRow.examId = examId;
      }

      // Upload image to Cloudinary
      try {
        const photoUrl = await uploadBufferToCloudinary(
          imageEntry.buffer,
          'candidate-photos',
          `${candidateId}_${Date.now()}`
        );
        parsedRow.candidatePhoto = photoUrl;
        validCandidates.push(parsedRow);
      } catch (uploadErr: any) {
        console.error(`Photo upload failed for ${candidateId}:`, uploadErr);
        errors.push(`Row ${rowNumber}: Photo upload failed for ID "${candidateId}": ${uploadErr.message}`);
      }
    }

    // Bulk insert valid candidates
    if (validCandidates.length > 0) {
      await ImportCandidate.insertMany(validCandidates);
    }

    const successCount = validCandidates.length;
    const errorCount = errors.length;

    res.status(httpStatus.OK).json({
      success: true,
      message: `Import complete. ${successCount} candidate(s) imported successfully${errorCount > 0 ? `, ${errorCount} skipped` : ''}.`,
      data: { successCount, errorCount, errors }
    });

  } catch (error: any) {
    console.error('Candidate Import Error:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Failed to process import files.',
      error: error.message
    });
  }
};



export const getImportedCandidates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.query;
    const query: any = examId ? { examId } : {};

    if ((req as any).user && (req as any).user.role === 'PRIVATE_AUTHORITY') {
      const employee = await Employee.findOne({ userId: (req as any).user.userId });
      if (employee) {
        const assignments = await StaffAssignmentModel.find({ employeeId: employee._id, isDeleted: false });
        const assignedExamIds = assignments.map((a: any) => a.examId).filter((id: any) => id);
        
        if (assignedExamIds.length > 0) {
          query.examId = { $in: assignedExamIds };
        } else {
          query.examId = new mongoose.Types.ObjectId();
        }
      } else {
        query.examId = new mongoose.Types.ObjectId();
      }
    } else if ((req as any).user && (req as any).user.role === 'GOVT_AUTHORITY') {
      const privateAssignments = await StaffAssignmentModel.find({ role: 'PRIVATE_AUTHORITY' }).select('examId');
      const privateExamIds = privateAssignments.map((a: any) => a.examId).filter((id: any) => id);
      if (privateExamIds.length > 0) {
        query.examId = { $nin: privateExamIds };
      }
    }

    const candidates = await ImportCandidate.find(query)
      .populate('examId', 'examName examTitle examCode examDate startTime endTime isResultGenerated isResultPublished status')
      .populate('centerId', 'centerName centerCode city state')
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

export const sendToCompanyAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.body;
    if (!examId) {
      res.status(400).json({ success: false, message: 'examId is required' });
      return;
    }

    const result = await ImportCandidate.updateMany(
      { examId: new mongoose.Types.ObjectId(examId as string) },
      { $set: { isSentToCompanyAdmin: true } }
    );

    res.status(200).json({
      success: true,
      message: 'Candidates sent to Company Admin successfully',
      data: result
    });
  } catch (error: any) {
    console.error("Error sending to company admin:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send to company admin",
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
    const filter: any = {};
    if (examId && examId !== 'ALL') {
      filter.examId = examId;
    }
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
