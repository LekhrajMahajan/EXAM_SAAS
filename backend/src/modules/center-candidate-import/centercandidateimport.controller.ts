import { Request, Response } from 'express';
import * as xlsx from 'xlsx';
import { CenterCandidateImport } from './centercandidateimport.model';
import httpStatus from 'http-status';

export const uploadCandidateExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(httpStatus.BAD_REQUEST).json({ success: false, message: 'Please upload an Excel file.' });
      return;
    }

    const { examId } = req.body;

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
    await CenterCandidateImport.insertMany(validCandidates);

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
    const candidates = await CenterCandidateImport.find({}).sort({ importedAt: -1 });
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

export const updateImportedCandidate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCandidate = await CenterCandidateImport.findByIdAndUpdate(
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

    const deletedCandidate = await CenterCandidateImport.findByIdAndDelete(id);

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
