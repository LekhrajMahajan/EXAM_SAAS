import companyService from "../company/company.service";
import subjectService from "../subject/subject.service";
import paperService from "../paper/paper.service";
import systemSettingsService from "../system-settings/systemSettings.service";
import { SettingCategory } from "../system-settings/systemSettings.types";

import examRepository from "./exam.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ExamApprovalStatus, ExamStatus, IExam } from "./exam.types";
import { PaperApprovalStatus } from "../paper/paper.types";
import { BaseService } from "../../common/base.service";

class ExamService extends BaseService<IExam> {
  constructor() {
    super(examRepository, "Exam");
  }

  /*
  |--------------------------------------------------------------------------
  | Compute Display Status (Dynamic)
  |--------------------------------------------------------------------------
  | Determines the real-time display status based on exam timing.
  */

  static computeDisplayStatus(exam: any): string {
    // If result is published → RESULT_GENERATED
    if (exam.isResultPublished) return "RESULT_GENERATED";

    // If already in a terminal state, return as-is
    const terminalStatuses = ["COMPLETED", "CANCELLED", "ARCHIVED", "EXAM_ENDED", "RESULT_GENERATED"];
    if (terminalStatuses.includes(exam.status)) return exam.status;

    // For ACTIVE or EXAM_STARTED exams, compute based on time
    if (exam.status === "ACTIVE" || exam.status === "EXAM_STARTED") {
      try {
        const now = new Date();
        const examDate = new Date(exam.examDate);

        // Parse startTime (HH:MM)
        const [startH, startM] = (exam.startTime || "").split(":").map(Number);
        if (!isNaN(startH) && !isNaN(startM)) {
          const startDateTime = new Date(examDate);
          startDateTime.setHours(startH, startM, 0, 0);

          // Parse endTime (HH:MM)
          const [endH, endM] = (exam.endTime || "").split(":").map(Number);
          if (!isNaN(endH) && !isNaN(endM)) {
            const endDateTime = new Date(examDate);
            endDateTime.setHours(endH, endM, 0, 0);

            if (now >= endDateTime) return "EXAM_ENDED";
            if (now >= startDateTime) return "EXAM_STARTED";
          } else {
            // Fallback: use startTime + duration
            if (exam.duration) {
              const endDateTime = new Date(startDateTime.getTime() + exam.duration * 60000);
              if (now >= endDateTime) return "EXAM_ENDED";
            }
            if (now >= startDateTime) return "EXAM_STARTED";
          }
        }
      } catch {
        // If time parsing fails, return DB status
      }
    }

    return exam.status;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All (Override to enrich with displayStatus)
  |--------------------------------------------------------------------------
  */

  async getAll(filters: any, populateFields?: string[]) {
    const result = await super.getAll(filters, populateFields);

    // Enrich each exam with computed displayStatus
    const enrichExams = (exams: any[]) => {
      return exams.map((exam: any) => {
        const examObj = exam.toObject ? exam.toObject() : { ...exam };
        examObj.displayStatus = ExamService.computeDisplayStatus(examObj);
        return examObj;
      });
    };

    if (result.exams) {
      result.exams = enrichExams(result.exams);
    } else if (result.data) {
      result.data = enrichExams(result.data);
    }

    return result;
  }
  /*
  |--------------------------------------------------------------------------
  | Create Exam
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IExam>) {
    await companyService.getActiveById(payload.companyId!.toString());
    
    if (payload.subjectId) {
      await subjectService.getActiveById(payload.subjectId.toString());
    }
    
    if (payload.paperId) {
      const paper = await paperService.getActiveById(payload.paperId.toString());
      // if (paper.approvalStatus !== PaperApprovalStatus.PUBLISHED) {
      //   throw new ApiError(
      //     HTTP_STATUS.BAD_REQUEST,
      //     "Only published papers can be assigned to an exam.",
      //   );
      // }
    }

    const existingCode = await examRepository.findByExamCode(
      payload.companyId!.toString(),
      payload.examCode!,
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Exam code already exists.");
    }

    const existingTitle = await examRepository.findByExamTitle(
      payload.companyId!.toString(),
      payload.examTitle!,
    );

    if (existingTitle) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Exam title already exists.");
    }

    // Dynamic settings validation
    const examSettingsRaw = await systemSettingsService.getByCategory(SettingCategory.EXAM);
    const examSettings = examSettingsRaw.reduce((acc: Record<string, any>, setting: any) => {
        acc[setting.key] = setting.value;
        return acc;
    }, {});

    const minDuration = 1;
    const maxDuration = examSettings.EXAM_MAX_DURATION ?? 180;

    if (payload.duration && (payload.duration < minDuration || payload.duration > maxDuration)) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Duration must be between ${minDuration} and ${maxDuration} minutes.`);
    }

    if (!payload.passingMarks && payload.totalMarks) {
        const passPercent = examSettings.EXAM_DEFAULT_PASSING_PERCENTAGE ?? 40;
        payload.passingMarks = (payload.totalMarks * passPercent) / 100;
    }

    // Set default security settings if not provided
    if (!payload.securitySettings) {
        payload.securitySettings = {
            faceVerification: examSettings.PROCTORING_FACE_VERIFICATION ?? false,
            webcamMonitoring: examSettings.PROCTORING_WEBCAM_MONITORING ?? false,
            screenRecording: examSettings.PROCTORING_SCREEN_RECORDING ?? false,
            screenSharingDetection: false,
            tabSwitchLimit: examSettings.PROCTORING_TAB_SWITCH_DETECTION ? 3 : 0,
            browserLock: examSettings.PROCTORING_BROWSER_LOCK ?? false,
            fullScreenMode: examSettings.PROCTORING_FULL_SCREEN ?? false,
            copyPasteAllowed: !(examSettings.PROCTORING_COPY_PASTE_BLOCK ?? true),
            rightClickDisabled: examSettings.PROCTORING_RIGHT_CLICK_BLOCK ?? true,
            developerToolsBlocked: true,
            multipleLoginAllowed: false,
            geoFence: false,
            ipRestriction: false,
            candidateHeartbeat: true,
            autoSubmitOnViolation: examSettings.SUBMISSION_AUTO_SUBMIT ?? false,
        };
    }

    return await super.create(payload);
  }



  /*
  |--------------------------------------------------------------------------
  | Update Exam
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IExam>) {
    const exam = await super.getById(id);

    if (exam.approvalStatus === ExamApprovalStatus.PUBLISHED && exam.examCode !== "STAFFSELF" && exam.examCode !== "STAFFSELE") {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Published exam cannot be modified.",
      );
    }

    const companyId =
      (exam.companyId as any)._id?.toString() ?? exam.companyId.toString();

    if (payload.examCode && payload.examCode !== exam.examCode) {
      const exists = await examRepository.findByExamCode(
        companyId,
        payload.examCode,
      );

      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Exam code already exists.");
      }
    }

    if (payload.examTitle && payload.examTitle !== exam.examTitle) {
      const exists = await examRepository.findByExamTitle(
        companyId,
        payload.examTitle,
      );

      if (exists) {
        throw new ApiError(HTTP_STATUS.CONFLICT, "Exam title already exists.");
      }
    }

    // Dynamic settings validation for updates
    if (payload.duration || payload.totalMarks || payload.passingMarks === undefined) {
        const examSettingsRaw = await systemSettingsService.getByCategory(SettingCategory.EXAM);
        const examSettings = examSettingsRaw.reduce((acc: Record<string, any>, setting: any) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});

        if (payload.duration) {
            const minDuration = 1;
            const maxDuration = examSettings.EXAM_MAX_DURATION ?? 180;
            if (payload.duration < minDuration || payload.duration > maxDuration) {
                throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Duration must be between ${minDuration} and ${maxDuration} minutes.`);
            }
        }
        
        // If they updated total marks but didn't pass passingMarks, we might want to recalculate
        // though normally passingMarks should be provided or kept as is.
    }

    return await super.update(id, payload);
  }



  /*
  |--------------------------------------------------------------------------
  | Get Preview
  |--------------------------------------------------------------------------
  */

  async getPreview(id: string) {
    const exam = await examRepository.getPreview(id);
    
    if (!exam) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam not found.");
    }

    let paperData = null;
    let questions: any[] = [];

    if (exam.paperId) {
      const paperIdStr = (exam.paperId as any)._id?.toString() || exam.paperId.toString();
      try {
        const paperPreview = await paperService.getPreview(paperIdStr);
        paperData = paperPreview.paper;
        questions = paperPreview.questions;
      } catch (error) {
        // If paper not found or errored, we can just ignore or log
      }
    }

    return {
      exam,
      paper: paperData,
      questions,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Clone Exam
  |--------------------------------------------------------------------------
  */

  async clone(
    id: string,
    payload: {
      examTitle: string;
      examCode: string;
      examDate: Date;
      shiftId: string;
      copyCandidates: boolean;
      copySecuritysettings: boolean;
      copyPaper: boolean;
      status?: ExamStatus;
    }
  ) {
    const originalExam = await super.getById(id);
    const companyId = (originalExam.companyId as any)._id?.toString() ?? originalExam.companyId.toString();

    // Check for unique code and title
    const existingCode = await examRepository.findByExamCode(
      companyId,
      payload.examCode
    );

    if (existingCode) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Exam code already exists.");
    }

    const existingTitle = await examRepository.findByExamTitle(
      companyId,
      payload.examTitle
    );

    if (existingTitle) {
      throw new ApiError(HTTP_STATUS.CONFLICT, "Exam title already exists.");
    }

    // Prepare cloned data
    const cloneData: Partial<IExam> = {
      companyId: originalExam.companyId,
      branchId: originalExam.branchId,
      centerId: originalExam.centerId,
      shiftId: payload.shiftId as any,

      examCode: payload.examCode,
      examTitle: payload.examTitle,
      description: originalExam.description,
      examDate: payload.examDate,
      startTime: originalExam.startTime,
      endTime: originalExam.endTime,
      duration: originalExam.duration,
      totalMarks: originalExam.totalMarks,
      passingMarks: originalExam.passingMarks,

      status: payload.status || ExamStatus.DRAFT,
      approvalStatus: ExamApprovalStatus.DRAFT,

      candidateIds: payload.copyCandidates ? originalExam.candidateIds : [],
      
      securitySettings: payload.copySecuritysettings 
        ? originalExam.securitySettings 
        : {
            faceVerification: false,
            webcamMonitoring: false,
            screenRecording: false,
            screenSharingDetection: false,
            tabSwitchLimit: 0,
            browserLock: false,
            fullScreenMode: false,
            copyPasteAllowed: false,
            rightClickDisabled: false,
            developerToolsBlocked: false,
            multipleLoginAllowed: false,
            geoFence: false,
            ipRestriction: false,
            candidateHeartbeat: false,
            autoSubmitOnViolation: false,
          }
    };

    if (payload.copyPaper) {
      cloneData.subjectId = originalExam.subjectId;
      cloneData.paperId = originalExam.paperId;
    }

    return await super.create(cloneData);
  }



  /*
  |--------------------------------------------------------------------------
  | Update Approval
  |--------------------------------------------------------------------------
  */

  async updateApproval(id: string, approvalStatus: ExamApprovalStatus) {
    const exam = await super.getById(id);

    return await examRepository.updateApproval(id, approvalStatus);
  }
  /*
  |--------------------------------------------------------------------------
  | Submit For Approval
  |--------------------------------------------------------------------------
  */

  async submitForApproval(
    id: string,
    payload: { approvalStatus?: string; submittedBy?: string; remarks?: string },
  ) {
    const exam = await super.getById(id);
    const status = (payload.approvalStatus as ExamApprovalStatus) || ExamApprovalStatus.SUBMITTED;

    return await examRepository.updateApproval(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Approve Exam
  |--------------------------------------------------------------------------
  */

  async approveExam(
    id: string,
    payload: { approvalStatus?: string; approvedBy?: string; approvalRemarks?: string },
  ) {
    const exam = await super.getById(id);
    const status = (payload.approvalStatus as ExamApprovalStatus) || ExamApprovalStatus.APPROVED;

    return await examRepository.updateApproval(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Reject Exam
  |--------------------------------------------------------------------------
  */

  async rejectExam(
    id: string,
    payload: { approvalStatus?: string; rejectedBy?: string; rejectionReason?: string; rejectionRemarks?: string },
  ) {
    const exam = await super.getById(id);
    const status = (payload.approvalStatus as ExamApprovalStatus) || ExamApprovalStatus.REJECTED;

    return await examRepository.updateApproval(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Start Exam
  |--------------------------------------------------------------------------
  */

  async startExam(
    id: string,
    payload: { startedBy: string; startRemarks?: string; forceStart?: boolean },
  ) {
    const exam = await super.getById(id);

    if (exam.status === ExamStatus.COMPLETED || exam.status === ExamStatus.CANCELLED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot start a completed or cancelled exam.");
    }

    const validApprovalStatuses = [
      ExamApprovalStatus.APPROVED,
      ExamApprovalStatus.PUBLISHED,
    ];

    if (!payload.forceStart && !validApprovalStatuses.includes(exam.approvalStatus)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Only approved or published exams can be started unless force started.");
    }

    return await examRepository.update(id, {
      status: ExamStatus.EXAM_STARTED,
      startedBy: payload.startedBy as any,
      startRemarks: payload.startRemarks,
      startedAt: new Date(),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | End Exam
  |--------------------------------------------------------------------------
  */

  async endExam(
    id: string,
    payload: { endedBy: string; endRemarks?: string; forceEnd?: boolean },
  ) {
    const exam = await super.getById(id);

    const canEnd = [ExamStatus.ACTIVE, ExamStatus.EXAM_STARTED].includes(exam.status as ExamStatus);
    if (!canEnd && !payload.forceEnd) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Only active/started exams can be ended unless force ended.");
    }

    return await examRepository.update(id, {
      status: ExamStatus.EXAM_ENDED,
      endedBy: payload.endedBy as any,
      endRemarks: payload.endRemarks,
      endedAt: new Date(),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Publish Exam Result
  |--------------------------------------------------------------------------
  */

  async publishResult(
    id: string,
    payload: {
      publishedBy: string;
      publishType: string;
      sendEmail: boolean;
      sendSMS: boolean;
      sendNotification: boolean;
      generateRank: boolean;
      generateMeritList: boolean;
      applyGraceMarks: boolean;
      publishRemarks?: string;
    },
  ) {
    const exam = await super.getById(id);

    const canPublish = [ExamStatus.COMPLETED, ExamStatus.EXAM_ENDED].includes(exam.status as ExamStatus);
    if (!canPublish) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Only completed/ended exams can have their results published.");
    }

    return await examRepository.update(id, {
      status: ExamStatus.RESULT_GENERATED,
      isResultPublished: true,
      resultPublishedAt: new Date(),
      resultPublishedBy: payload.publishedBy as any,
      resultPublishSettings: {
        publishType: payload.publishType,
        sendEmail: payload.sendEmail,
        sendSMS: payload.sendSMS,
        sendNotification: payload.sendNotification,
        generateRank: payload.generateRank,
        generateMeritList: payload.generateMeritList,
        applyGraceMarks: payload.applyGraceMarks,
        publishRemarks: payload.publishRemarks,
      },
    });
  }
  /*
  |--------------------------------------------------------------------------
  | Auto Select Paper
  |--------------------------------------------------------------------------
  */

  async autoSelectPaper(examId: string) {
    const exam = await super.getById(examId);

    const mongoose = require('mongoose');
    const Paper = mongoose.model('Paper');
    const papers = await Paper.find({
      examId: exam._id,
      approvalStatus: { $in: [PaperApprovalStatus.SUBMITTED, PaperApprovalStatus.APPROVED, PaperApprovalStatus.PUBLISHED] }
    });

    if (!papers || papers.length === 0) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No submitted papers available for auto-selection.");
    }

    const randomIndex = Math.floor(Math.random() * papers.length);
    const selectedPaper: any = papers[randomIndex];
    const variantIds = [selectedPaper._id, selectedPaper._id, selectedPaper._id, selectedPaper._id]; // Mock variants A, B, C, D

    return await examRepository.update(examId, {
      finalPaperId: selectedPaper._id,
      paperVariants: variantIds,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(companyId?: string) {
    const totalExams = await examRepository.count(companyId);

    const activeExams = await examRepository.countByStatus(
      ExamStatus.ACTIVE,
      companyId,
    );

    const completedExams = await examRepository.countByStatus(
      ExamStatus.COMPLETED,
      companyId,
    );

    const cancelledExams = await examRepository.countByStatus(
      ExamStatus.CANCELLED,
      companyId,
    );

    const draftExams = await examRepository.countByApproval(
      ExamApprovalStatus.DRAFT,
      companyId,
    );

    const approvedExams = await examRepository.countByApproval(
      ExamApprovalStatus.APPROVED,
      companyId,
    );

    const publishedExams = await examRepository.countByApproval(
      ExamApprovalStatus.PUBLISHED,
      companyId,
    );

    return {
      totalExams,
      activeExams,
      completedExams,
      cancelledExams,
      draftExams,
      approvedExams,
      publishedExams,
    };
  }
}

export default new ExamService();
