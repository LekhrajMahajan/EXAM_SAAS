import { Schema, model } from "mongoose";

import {
  IExam,
  ExamApprovalStatus,
  ExamStatus,
} from "./exam.types";

import { BaseSchemaFields } from "../../shared/base.schema";

/*
|--------------------------------------------------------------------------
| Exam Schema
|--------------------------------------------------------------------------
*/

const ExamSchema = new Schema<IExam>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      index: true,
    },

    shiftId: {
      type: Schema.Types.ObjectId,
      ref: "Shift",
      index: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      index: true,
    },

    paperId: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      index: true,
    },

    finalPaperId: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      index: true,
    },

    paperVariants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Paper",
      }
    ],

    examCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    examTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    examDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    shift: {
      type: String,
      trim: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },

    passingMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    
    negativeMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    examType: {
      type: String,
      trim: true,
    },

    examCategory: {
      type: String,
      trim: true,
    },

    examMode: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "HYBRID"],
      default: "ONLINE",
    },

    language: {
      type: String,
      default: "English",
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
    },

    instructions: {
      type: String,
      trim: true,
    },

    shuffleSubjects: {
      type: Boolean,
      default: false,
    },

    shuffleQuestions: {
      type: Boolean,
      default: false,
    },

    subjects: [
      {
        name: { type: String, required: true },
        questions: { type: Number, required: true },
      },
    ],

    candidateIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Candidate",
      },
    ],

    securitySettings: {
      faceVerification: { type: Boolean, default: false },
      faceDetectionEnabled: { type: Boolean, default: false },
      faceDetectionLimit: { type: Number, default: 15 },
      multipleFacesEnabled: { type: Boolean, default: false },
      multipleFacesLimit: { type: Number, default: 15 },
      proctoringWarningEnabled: { type: Boolean, default: false },
      proctoringWarningLimit: { type: Number, default: 3 },
      webcamMonitoring: { type: Boolean, default: false },
      screenRecording: { type: Boolean, default: false },
      screenSharingDetection: { type: Boolean, default: false },
      tabSwitchingEnabled: { type: Boolean, default: false },
      tabSwitchLimit: { type: Number, default: 0 },
      browserLock: { type: Boolean, default: false },
      fullScreenMode: { type: Boolean, default: false },
      copyPasteAllowed: { type: Boolean, default: false },
      rightClickDisabled: { type: Boolean, default: false },
      developerToolsBlocked: { type: Boolean, default: false },
      multipleLoginAllowed: { type: Boolean, default: false },
      geoFence: { type: Boolean, default: false },
      ipRestriction: { type: Boolean, default: false },
      candidateHeartbeat: { type: Boolean, default: false },
      autoSubmitOnViolation: { type: Boolean, default: false },
    },

    approvalStatus: {
      type: String,
      enum: Object.values(ExamApprovalStatus),
      default: ExamApprovalStatus.DRAFT,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(ExamStatus),
      default: ExamStatus.ACTIVE,
      index: true,
    },

    startedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    startedAt: {
      type: Date,
    },

    startRemarks: {
      type: String,
    },

    endedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    endedAt: {
      type: Date,
    },

    endRemarks: {
      type: String,
    },

    isResultGenerated: {
      type: Boolean,
      default: false,
    },

    resultGeneratedAt: {
      type: Date,
    },

    resultGeneratedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    isResultPublished: {
      type: Boolean,
      default: false,
    },

    resultPublishedAt: {
      type: Date,
    },

    resultPublishedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    resultPublishSettings: {
      publishType: { type: String },
      sendEmail: { type: Boolean, default: false },
      sendSMS: { type: Boolean, default: false },
      sendNotification: { type: Boolean, default: false },
      generateRank: { type: Boolean, default: false },
      generateMeritList: { type: Boolean, default: false },
      applyGraceMarks: { type: Boolean, default: false },
      publishRemarks: { type: String },
    },

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Unique Index
|--------------------------------------------------------------------------
*/

ExamSchema.index(
  {
    companyId: 1,
    examCode: 1,
  },
  {
    unique: true,
  },
);

/*
|--------------------------------------------------------------------------
| Search Index
|--------------------------------------------------------------------------
*/

ExamSchema.index({
  examCode: "text",
  examTitle: "text",
  description: "text",
});

/*
|--------------------------------------------------------------------------
| Company Wise
|--------------------------------------------------------------------------
*/

ExamSchema.index({
  companyId: 1,
  status: 1,
});

/*
|--------------------------------------------------------------------------
| Subject Wise
|--------------------------------------------------------------------------
*/

ExamSchema.index({
  subjectId: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Exam Date
|--------------------------------------------------------------------------
*/

ExamSchema.index({
  examDate: 1,
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

ExamSchema.index({
  companyId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Exam = model<IExam>("Exam", ExamSchema);

export default Exam;
