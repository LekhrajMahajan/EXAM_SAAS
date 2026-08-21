import { Schema, model } from "mongoose";

import { IExamSubmission, SubmissionStatus } from "./examSubmission.types";

const examSubmissionSchema = new Schema<IExamSubmission>(
  {
    attendanceId: {
      type: Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      index: true,
    },

    candidateAssignmentId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
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
      required: true,
      index: true,
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    examCenterId: {
      type: Schema.Types.ObjectId,
      ref: "ExamCenter",
      required: true,
      index: true,
    },

    examRoomId: {
      type: Schema.Types.ObjectId,
      ref: "ExamRoom",
      required: true,
      index: true,
    },

    startedAt: {
      type: Date,
      required: true,
    },

    submittedAt: {
      type: Date,
    },

    totalTime: {
      type: Number,
      required: true,
      min: 0,
    },

    remainingTime: {
      type: Number,
      required: true,
      min: 0,
    },

    totalQuestions: {
      type: Number,
      required: true,
      min: 0,
    },

    answeredQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    unansweredQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    reviewQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },

    submissionStatus: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.NOT_STARTED,
      index: true,
    },

    autoSubmitted: {
      type: Boolean,
      default: false,
    },

    browserInfo: {
      type: String,
      trim: true,
    },

    ipAddress: {
      type: String,
      trim: true,
    },

    deviceInfo: {
      type: String,
      trim: true,
    },

    lastHeartbeatAt: {
      type: Date,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    updatedBy: {
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


examSubmissionSchema.index({
  candidateId: 1,
  examId: 1,
});

examSubmissionSchema.index({
  examId: 1,
  submissionStatus: 1,
});



examSubmissionSchema.index({
  examCenterId: 1,
  examRoomId: 1,
});

examSubmissionSchema.index({
  lastHeartbeatAt: 1,
});

const ExamSubmission = model<IExamSubmission>(
  "ExamSubmission",
  examSubmissionSchema,
);

export default ExamSubmission;
