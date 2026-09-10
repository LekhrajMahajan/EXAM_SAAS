import mongoose from "mongoose";
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import ApiError from "../../utils/ApiError";

import CompanyModel from "./company.model";
import Center from "../center/center.model";
import User from "../user/user.model";
import Candidate from "../candidate/candidate.model";
import Subject from "../subject/subject.model";
import Exam from "../exam/exam.model";
import Paper from "../paper/paper.model";
import Question from "../question-bank/question.model";
import ExamRoom from "../exam-room/examRoom.model";
import Shift from "../shift/shift.model";
import FileStorage from "../file-storage/fileStorage.model";
import Employee from "../employee/employee.model";
import { ImportCandidate } from "../import-candidate/importcandidate.model";

export const getCompanyUsageStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userRole = (req.user as any)?.role;
    const userCompanyId =
      req.user?.companyId?.toString() ||
      (req.user as any)?.company?.toString();

    // MASTER_ADMIN can pass ?companyId=<id> to inspect any company's stats.
    // COMPANY_ADMIN always sees their own company only.
    const companyId =
      userRole === "MASTER_ADMIN" && req.query.companyId
        ? (req.query.companyId as string)
        : userCompanyId;

    if (!companyId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Company ID is missing");
    }

    const company = await CompanyModel.findById(companyId).populate("planId");
    if (!company) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");
    }

    const plan = company.planId as any;
    if (!plan || !plan.usageLimits) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Company does not have an active plan with usage limits"
      );
    }

    const companyIdObj = new mongoose.Types.ObjectId(companyId);
    const limits = plan.usageLimits;

    const companyExamIds = await Exam.find({ companyId: companyIdObj }, "_id")
      .lean()
      .then((docs) => docs.map((d) => d._id));

    console.log("\n==========================================");
    console.log(`[USAGE-DEBUG] Company: ${company.companyName} (${company.subscriptionPlan})`);
    console.log(`[USAGE-DEBUG] Populated Plan: ${plan.planName} (${plan.planCode})`);
    console.log(`[USAGE-DEBUG] Plan _id: ${plan._id}`);
    console.log(`[USAGE-DEBUG] Plan MaxCenters: ${plan.usageLimits?.maxCenters}`);
    console.log("==========================================\n");

    // ── All counts in parallel ──────────────────────────────────────────────
    const [
      centersCount,
      employeesCount,
      candidatesCount,
      subjectsCount,
      examsCount,
      papersCount,
      questionsCount,
      examRoomsCount,   // via parent examId (ExamRoom has no companyId)
      shiftsCount,
      managersCount,
      invigilatorsCount,
      observersCount,
    ] = await Promise.all([
      // Count centers this company owns OR has been approved to access via CompanyAdminRequest
      Center.countDocuments({
        $or: [
          { companyId: companyIdObj },
          { accessibleByCompanies: companyIdObj },
        ],
        isDeleted: { $ne: true },
      }).catch(() => 0),
      Employee.countDocuments({ companyId: companyIdObj, isDeleted: { $ne: true } }).catch(() => 0),
      Candidate.countDocuments({ companyId: companyIdObj, isDeleted: { $ne: true } }).catch(() => 0),
      Subject.countDocuments({ companyId: companyIdObj, isDeleted: { $ne: true } }).catch(() => 0),
      Exam.countDocuments({ companyId: companyIdObj, isDeleted: { $ne: true } }).catch(() => 0),
      Paper.countDocuments({ companyId: companyIdObj, isDeleted: { $ne: true } }).catch(() => 0),
      Question.countDocuments({ companyId: companyIdObj, isDeleted: { $ne: true } }).catch(() => 0),
      ExamRoom.countDocuments({ examId: { $in: companyExamIds }, isDeleted: { $ne: true } }).catch(() => 0),
      Shift.countDocuments({ companyId: companyIdObj, isDeleted: { $ne: true } }).catch(() => 0),
      Employee.countDocuments({ companyId: companyIdObj, role: { $in: ["CENTER_MANAGER", "EXAM_MANAGER"] }, isDeleted: { $ne: true } }).catch(() => 0),
      Employee.countDocuments({ companyId: companyIdObj, role: "INVIGILATOR", isDeleted: { $ne: true } }).catch(() => 0),
      Employee.countDocuments({ companyId: companyIdObj, role: "OBSERVER", isDeleted: { $ne: true } }).catch(() => 0),
    ]);

    // ── Debug log (shows per-company counts in server terminal) ─────────────
    console.log("\n==========================================");
    console.log("[USAGE] req.user:", JSON.stringify(req.user));
    console.log("[USAGE] userRole:", userRole);
    console.log("[USAGE] userCompanyId (from token):", userCompanyId);
    console.log("[USAGE] resolved companyId:", companyId);
    console.log("[USAGE] companyIdObj:", companyIdObj.toString());

    // Raw direct count for debugging — bypasses isDeleted to catch ALL centers
    const rawCenterCountAll = await Center.countDocuments({ companyId: companyIdObj });
    const rawCenterCountNotDeleted = await Center.countDocuments({ companyId: companyIdObj, isDeleted: { $ne: true } });
    const rawCenterCountDeletedTrue = await Center.countDocuments({ companyId: companyIdObj, isDeleted: true });
    console.log(`[USAGE] RAW Center count (ALL):        ${rawCenterCountAll}`);
    console.log(`[USAGE] RAW Center count (not deleted):${rawCenterCountNotDeleted}`);
    console.log(`[USAGE] RAW Center count (deleted=true):${rawCenterCountDeletedTrue}`);

    console.log(`  Centers:    ${centersCount}`);
    console.log(`  Employees:  ${employeesCount}`);
    console.log(`  Candidates: ${candidatesCount}`);
    console.log(`  Subjects:   ${subjectsCount}`);
    console.log(`  Exams:      ${examsCount}`);
    console.log(`  Papers:     ${papersCount}`);
    console.log(`  Questions:  ${questionsCount}`);
    console.log(`  ExamRooms:  ${examRoomsCount}  (via ${companyExamIds.length} exam IDs)`);
    console.log(`  Shifts:     ${shiftsCount}`);
    console.log("==========================================\n");

    // ── Imported Candidates via company's exams ─────────────────────────────
    // Imported candidates belong to an exam. Counting by centerId would incorrectly 
    // count other companies' candidates if they share the same center.
    const importedCandidatesCount = await ImportCandidate.countDocuments({
      examId: { $in: companyExamIds },
    }).catch(() => 0);
    const totalCandidatesCount = candidatesCount + importedCandidatesCount;

    // ── Storage via company users ───────────────────────────────────────────
    const companyUsers = await User.find({ companyId: companyIdObj }).lean();
    const companyUserIds = companyUsers.map((u) => u._id);

    const fileStats = await FileStorage.aggregate([
      { $match: { createdBy: { $in: companyUserIds }, isDeleted: { $ne: true } } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]);
    const totalSizeBytes = fileStats.length > 0 ? fileStats[0].totalSize : 0;
    const fileUploadSizeMB = Math.round(totalSizeBytes / (1024 * 1024));
    const storageUsedGB = Number((totalSizeBytes / (1024 * 1024 * 1024)).toFixed(2));

    // ── Active Login Devices ────────────────────────────────────────────────
    const maxLoginDevices =
      companyUsers.reduce((acc, user) => {
        // @ts-ignore
        return acc + (user.sessions?.length || 0) + (user.devices?.length || 0);
      }, 0) || 1;

    // ── Build response ──────────────────────────────────────────────────────
    const currentUsage = {
      maxCenters: centersCount,
      maxEmployees: employeesCount,
      maxCandidates: totalCandidatesCount,
      maxSubjects: subjectsCount,
      maxExams: examsCount,
      maxPapers: papersCount,
      maxQuestionBankSize: questionsCount,
      maxExamRooms: examRoomsCount,
      maxActiveShifts: shiftsCount,
      maxManagers: managersCount,
      maxInvigilators: invigilatorsCount,
      maxObservers: observersCount,
      storageLimitGB: storageUsedGB,
      maxFileUploadSizeMB: fileUploadSizeMB,
      apiRequestsPerMonth: 0,
      maxConcurrentExams: 0,
      maxAiProctorSessions: 0,
      sessionTimeoutMinutes: 0,
      maxLoginDevices: maxLoginDevices,
      backupRetentionDays: 0,
      auditLogRetentionDays: 0,
      reportRetentionDays: 0,
    };

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Usage stats fetched successfully",
      data: {
        limits,
        currentUsage,
      },
    });
  }
);
