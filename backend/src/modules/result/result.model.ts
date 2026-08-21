import { Schema, model } from "mongoose";

import {
  IResult,
  PassStatus,
  ResultStatus,
  EvaluationMethod,
} from "./result.types";

const resultSchema = new Schema<IResult>(
  {
    /*
        |--------------------------------------------------------------------------
        | References
        |--------------------------------------------------------------------------
        */

    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: "Attendance",
      index: true,
      default: null,
    },

    submissionId: {
      type: Schema.Types.ObjectId,
      ref: "ExamSubmission",
      index: true,
      default: null,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    candidateAssignmentId: {
      type: Schema.Types.ObjectId,
      ref: "CandidateAssignment",
      index: true,
      default: null,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
      index: true,
    },

    paperId: {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      index: true,
      default: null,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      index: true,
      default: null,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
      default: null,
    },

    examCenterId: {
      type: Schema.Types.ObjectId,
      ref: "ExamCenter",
      index: true,
      default: null,
    },

    examRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ExamRoom",
      index: true,
      default: null,
    },

    /*
        |--------------------------------------------------------------------------
        | Evaluation
        |--------------------------------------------------------------------------
        */

    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    attemptedQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    correctAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    wrongAnswers: {
      type: Number,
      default: 0,
      min: 0,
    },

    unansweredQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    marksObtained: {
      type: Number,
      default: 0,
    },

    negativeMarks: {
      type: Number,
      default: 0,
    },

    passingMarks: {
      type: Number,
      default: 0,
      min: 0,
    },

    percentage: {
      type: Number,
      default: 0,
    },

    rank: {
      type: Number,
      default: null,
    },

    /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */

    passStatus: {
      type: String,
      enum: Object.values(PassStatus),
      default: PassStatus.FAILED,
      index: true,
    },

    resultStatus: {
      type: String,
      enum: Object.values(ResultStatus),
      default: ResultStatus.DRAFT,
      index: true,
    },

    /*
        |--------------------------------------------------------------------------
        | Evaluation Info
        |--------------------------------------------------------------------------
        */

    evaluationMethod: {
      type: String,
      enum: Object.values(EvaluationMethod),
      default: EvaluationMethod.AUTO,
    },

    evaluationVersion: {
      type: Number,
      default: 1,
    },

    evaluationDuration: {
      type: Number,
      default: 0,
    },

    /*
        |--------------------------------------------------------------------------
        | Timeline
        |--------------------------------------------------------------------------
        */

    submittedAt: Date,

    evaluatedAt: Date,

    publishedAt: Date,

    approvedAt: Date,

    /*
        |--------------------------------------------------------------------------
        | Approval
        |--------------------------------------------------------------------------
        */

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/


resultSchema.index({
  examId: 1,
  candidateId: 1,
});

resultSchema.index({
  examId: 1,
  rank: 1,
});

resultSchema.index({
  examId: 1,
  percentage: -1,
});



resultSchema.index({
  examCenterId: 1,
  examRoomId: 1,
});

resultSchema.index({
  passStatus: 1,
  resultStatus: 1,
});



const Result = model<IResult>("Result", resultSchema);

export default Result;
