import { Request, Response } from "express";
import Candidate from "../candidate/candidate.model";
import SeatAllocation from "../seat-allocation/seatAllocation.model";
import { AttendanceModel as Attendance } from "../attendance/attendance.model";
import { AttendanceStatus, VerificationStatus } from "../attendance/attendance.types";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import mongoose from "mongoose";
import { ImportCandidate } from "../import-candidate/importcandidate.model";
import { CenterCandidateSeatAllocation } from "../center/centerCandidateSeatAllocation.model";

export const searchCandidateForEntry = asyncHandler(async (req: Request, res: Response) => {
  const { applicationNo } = req.params;
  const centerId = req.user?.centerId;

  if (!centerId) {
    return sendResponse(res, HTTP_STATUS.FORBIDDEN, {
      success: false,
      message: "Access denied. Entry Checker must be assigned to a center.",
    });
  }

  // Find Candidate by applicationNo, candidateCode, or enrollmentNo
  let isImported = false;
  let candidate: any = null;
  let seatAllocation: any = null;

  // First try to find in imported candidates (since they are actively assigned by center manager)
  let importedCandidate = await ImportCandidate.findOne({
    $or: [
      { applicationNo },
      { candidateId: applicationNo },
      { rollNo: applicationNo }
    ]
  });

  if (importedCandidate) {
    // Check if they have an allocation in this center
    const importedAllocation = await CenterCandidateSeatAllocation.findOne({
      candidateId: importedCandidate._id,
      centerId: centerId
    }).populate("examId labId");

    if (importedAllocation) {
      candidate = importedCandidate;
      seatAllocation = importedAllocation;
      isImported = true;
    }
  }

  // If not found or not allocated in imported, check native candidates
  if (!seatAllocation) {
    let nativeCandidate = await Candidate.findOne({ 
      $or: [
        { applicationNo },
        { candidateCode: applicationNo },
        { enrollmentNo: applicationNo }
      ]
    });

    if (nativeCandidate) {
      const nativeAllocation = await SeatAllocation.findOne({
        candidateId: nativeCandidate._id,
        examCenterId: centerId,
        isDeleted: false,
      }).populate("examId examRoomId seatId shiftId");

      if (nativeAllocation) {
        candidate = nativeCandidate;
        seatAllocation = nativeAllocation;
        isImported = false;
      } else if (!candidate) {
        // Just to return "not assigned to your center" later
        candidate = nativeCandidate;
      }
    }
  }

  // If still no candidate, it means they don't exist at all
  if (!candidate && !importedCandidate) {
    return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
      success: false,
      message: "Candidate not found.",
    });
  }

  // Seat Allocation check is already done above.
  if (!seatAllocation) {
    return sendResponse(res, HTTP_STATUS.FORBIDDEN, {
      success: false,
      message: "This candidate is not assigned to your center.",
    });
  }

  // Check Attendance Status
  const attendance = await Attendance.findOne({
    candidateId: candidate._id,
    examCenterId: centerId,
    isDeleted: false,
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Candidate verified for this center.",
    data: {
      candidate,
      seatAllocation,
      attendanceStatus: attendance?.attendanceStatus || AttendanceStatus.PENDING,
      isImported,
    },
  });
});

export const verifyCandidateEntry = asyncHandler(async (req: Request, res: Response) => {
  const { candidateId, seatAllocationId } = req.body;
  const centerId = req.user?.centerId;

  if (!centerId) {
    return sendResponse(res, HTTP_STATUS.FORBIDDEN, {
      success: false,
      message: "Access denied.",
    });
  }

  let seatAlloc: any = await SeatAllocation.findOne({
    _id: seatAllocationId,
    candidateId: candidateId,
    examCenterId: centerId,
    isDeleted: false,
  });

  if (!seatAlloc) {
    seatAlloc = await CenterCandidateSeatAllocation.findOne({
      _id: seatAllocationId,
      candidateId: candidateId,
      centerId: centerId
    });
  }

  if (!seatAlloc) {
    return sendResponse(res, HTTP_STATUS.FORBIDDEN, {
      success: false,
      message: "Seat allocation not found for this candidate in your center.",
    });
  }

  let attendance = await Attendance.findOne({
    candidateId: candidateId,
    examCenterId: centerId,
    isDeleted: false,
  });

  if (!attendance) {
    attendance = new Attendance({
      candidateId: candidateId,
      examId: seatAlloc.examId,
      shiftId: seatAlloc.shiftId || undefined,
      examCenterId: centerId,
      examRoomId: seatAlloc.examRoomId || seatAlloc.labId || undefined,
      seatAllocationId: seatAlloc._id,
      candidateAssignmentId: candidateId, // placeholder
      admitCardId: candidateId, // placeholder
      attendanceStatus: AttendanceStatus.PRESENT,
      manualVerification: VerificationStatus.SUCCESS,
      biometricVerification: VerificationStatus.PENDING,
      faceVerification: VerificationStatus.PENDING,
      qrVerification: VerificationStatus.PENDING,
      checkInTime: new Date(),
      verifiedBy: (req.user as any)?.userId,
      verifiedAt: new Date(),
    });
  } else {
    attendance.attendanceStatus = AttendanceStatus.PRESENT;
    attendance.manualVerification = VerificationStatus.SUCCESS;
    attendance.checkInTime = attendance.checkInTime || new Date();
    attendance.verifiedBy = (req.user as any)?.userId as any;
    attendance.verifiedAt = new Date();
  }

  await attendance.save();

  // Also save to the user requested centerassigncandidateattendence collection
  try {
    const CenterAssignCandidateAttendance = require('../center-assign-candidate-attendance/centerAssignCandidateAttendance.model').default;
    await CenterAssignCandidateAttendance.findOneAndUpdate(
      { centerId: centerId, candidateId: candidateId },
      { 
        $set: {
          centerId: centerId,
          examId: seatAlloc.examId,
          candidateId: candidateId,
          attendanceStatus: AttendanceStatus.PRESENT,
          verifiedAt: new Date(),
          verifiedBy: (req.user as any)?.userId,
        }
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error("Failed to save to centerassigncandidateattendence:", error);
  }

  // Enable login credentials for the candidate
  try {
    const importedUpdate = await ImportCandidate.updateOne(
      { _id: candidateId },
      { $set: { isLoginEnabled: true } }
    );
    
    if (importedUpdate.modifiedCount === 0) {
      await Candidate.updateOne(
        { _id: candidateId },
        { $set: { isLoginEnabled: true } }
      );
    }
  } catch (error) {
    console.error("Failed to enable login for candidate:", error);
    // Don't fail the verification if this fails, just log it
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Candidate marked as verified successfully.",
    data: attendance,
  });
});

export const getMyAssignments = asyncHandler(async (req: Request, res: Response) => {
  const centerId = (req.user as any)?.centerId;
  const staffId = (req.user as any)?.id || (req.user as any)?._id || (req.user as any)?.roleId;
  
  if (!centerId || !staffId) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
      success: false,
      message: "Missing centerId or staffId in user token",
    });
  }

  try {
    const CenterAssignExamStaff = mongoose.connection.db?.collection('centerassignexamstaffs');
    
    if (!CenterAssignExamStaff) {
      return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
        success: false,
        message: "Database connection not ready",
      });
    }

    const query: any = {
      centerId: new mongoose.Types.ObjectId(centerId)
    };

    if (mongoose.Types.ObjectId.isValid(staffId)) {
      query["assignments.staffId"] = new mongoose.Types.ObjectId(staffId);
    } else {
      query["assignments.staffId"] = staffId;
    }
    
    // Find all assignments for this center where this staff is assigned
    const assignments = await CenterAssignExamStaff.find(query).toArray();

    const examIds = assignments.map((a: any) => a.examId).filter(Boolean);
    const uniqueExamIds = [...new Set(examIds.map(id => id.toString()))].map(id => new mongoose.Types.ObjectId(id));

    const ExamModel = require("../exam/exam.model").default;
    const exams = await ExamModel.find(
      { _id: { $in: uniqueExamIds } },
      { examTitle: 1, examDate: 1, startTime: 1, endTime: 1 }
    ).lean();

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Assignments fetched successfully",
      data: {
        examNames: exams.map((e: any) => e.examTitle),
        exams: exams,
      }
    });
  } catch (error: any) {
    console.error("Error in getMyAssignments:", error);
    return sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message || "Failed to fetch assignments",
    });
  }
});

