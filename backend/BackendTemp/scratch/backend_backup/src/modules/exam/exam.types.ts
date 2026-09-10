import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Exam Status
|--------------------------------------------------------------------------
*/

export enum ExamStatus {
  DRAFT = "DRAFT",

  ACTIVE = "ACTIVE",

  EXAM_STARTED = "EXAM_STARTED",

  EXAM_ENDED = "EXAM_ENDED",

  INACTIVE = "INACTIVE",

  COMPLETED = "COMPLETED",

  CANCELLED = "CANCELLED",

  ARCHIVED = "ARCHIVED",

  RESULT_GENERATED = "RESULT_GENERATED",
}

/*
|--------------------------------------------------------------------------
| Approval Status
|--------------------------------------------------------------------------
*/

export enum ExamApprovalStatus {
  DRAFT = "DRAFT",

  PENDING_APPROVAL = "PENDING_APPROVAL",

  SUBMITTED = "SUBMITTED",

  REVIEWED = "REVIEWED",

  APPROVED = "APPROVED",

  PUBLISHED = "PUBLISHED",

  REJECTED = "REJECTED",
}

/*
|--------------------------------------------------------------------------
| Security Settings Interface
|--------------------------------------------------------------------------
*/

export interface ISecuritySettings {
  faceVerification: boolean;
  faceDetectionEnabled: boolean;
  faceDetectionLimit: number;
  multipleFacesEnabled: boolean;
  multipleFacesLimit: number;
  proctoringWarningEnabled: boolean;
  proctoringWarningLimit: number;
  webcamMonitoring: boolean;
  screenRecording: boolean;
  screenSharingDetection: boolean;
  tabSwitchingEnabled: boolean;
  tabSwitchLimit: number;
  browserLock: boolean;
  fullScreenMode: boolean;
  copyPasteAllowed: boolean;
  rightClickDisabled: boolean;
  developerToolsBlocked: boolean;
  multipleLoginAllowed: boolean;
  geoFence: boolean;
  ipRestriction: boolean;
  candidateHeartbeat: boolean;
  autoSubmitOnViolation: boolean;
}

/*
|--------------------------------------------------------------------------
| Exam Interface
|--------------------------------------------------------------------------
*/

export interface IExam {
  companyId: Types.ObjectId;

  branchId: Types.ObjectId;

  centerId: Types.ObjectId;

  shiftId: Types.ObjectId;

  subjectId: Types.ObjectId;

  paperId: Types.ObjectId;

  finalPaperId?: Types.ObjectId;

  paperVariants?: Types.ObjectId[];

  examCode: string;

  examTitle: string;

  description?: string;

  examDate: Date;

  startTime: string;

  endTime: string;

  shift?: string;

  examGroupId?: string | null;

  hasMultipleShifts?: boolean;

  normalizationEnabled?: boolean;

  normalizationMethod?: "PERCENTILE" | "MEAN_EQUATING";

  duration: number;

  totalMarks: number;

  passingMarks: number;
  
  negativeMarks?: number;

  cutoffType?: "MARKS" | "PERCENTAGE";

  overallQualifyingPercent?: number | null;

  sectionalCutoffEnabled?: boolean;

  sectionalTimeLimitEnabled?: boolean;

  categoryWiseCutoff?: { category: string; cutoffPercent: number }[];

  rankType?: "COMBINED" | "CATEGORY_WISE";

  tieBreakRules?: {
    order: number;
    ruleType:
      | "HIGHER_MARKS"
      | "HIGHER_PERCENTAGE"
      | "MORE_CORRECT"
      | "LOWER_NEGATIVE"
      | "OLDER_AGE"
      | "YOUNGER_AGE"
      | "APPLICATION_NUMBER";
  }[];

  isMultiStage?: boolean;

  stageType?: "QUALIFYING_ONLY" | "SCORE_CARRIED_FORWARD";

  stageWeightagePercent?: number;

  linkedNextExamId?: Types.ObjectId | null;

  resultDeclarationDate?: Date | null;

  examType?: string;
  
  examCategory?: string;
  
  examMode?: string;
  
  language?: string;
  
  difficulty?: string;
  
  instructions?: string;
  
  shuffleSubjects?: boolean;

  shuffleQuestions?: boolean;
  
  subjects?: {
    name: string;
    subjectId?: string;
    questions: number;
    marksPerQuestion: number;
    negativeMarksPerQuestion?: number;
    sectionalCutoff?: number | null;
    timeAllottedMinutes?: number | null;
  }[];

  candidateIds: Types.ObjectId[];

  partWiseCutoffEnabled?: boolean;
  parts?: {
    partName: string;
    subjectIds: Types.ObjectId[] | string[];
    cutoffType: "MARKS" | "PERCENTAGE";
    cutoffValue: number;
  }[];

  securitySettings: ISecuritySettings;

  approvalStatus: ExamApprovalStatus;

  status: ExamStatus;

  startedBy?: Types.ObjectId | null;

  startedAt?: Date | null;

  startRemarks?: string;

  endedBy?: Types.ObjectId | null;

  endedAt?: Date | null;

  endRemarks?: string;
  
  isResultGenerated: boolean;

  resultGeneratedAt?: Date | null;

  resultGeneratedBy?: Types.ObjectId | null;

  isResultPublished: boolean;

  resultPublishedAt?: Date | null;

  resultPublishedBy?: Types.ObjectId | null;

  resultPublishSettings?: {
    publishType: string;
    sendEmail: boolean;
    sendSMS: boolean;
    sendNotification: boolean;
    generateRank: boolean;
    generateMeritList: boolean;
    applyGraceMarks: boolean;
    publishRemarks?: string;
  };

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Exam Document
|--------------------------------------------------------------------------
*/

export type ExamDocument = HydratedDocument<IExam>;
