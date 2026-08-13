import { Schema, model } from "mongoose";

import {
  ICertificate,
  CertificateStatus,
  CertificateType,
  VerificationStatus,
} from "./certificate.types";

/*
|--------------------------------------------------------------------------
| Certificate Schema
|--------------------------------------------------------------------------
*/

const certificateSchema = new Schema<ICertificate>(
  {
    /*
            |--------------------------------------------------------------------------
            | References
            |--------------------------------------------------------------------------
            */

    resultId: {
      type: Schema.Types.ObjectId,
      ref: "Result",
      required: true,
      unique: true,
      index: true,
    },

    approvalId: {
      type: Schema.Types.ObjectId,
      ref: "Result",
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

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      index: true,
      default: null,
    },

    examCenterId: {
      type: Schema.Types.ObjectId,
      ref: "ExamCenter",
      index: true,
      default: null,
    },

    /*
            |--------------------------------------------------------------------------
            | Certificate
            |--------------------------------------------------------------------------
            */

    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    verificationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    verificationUrl: {
      type: String,
      required: true,
      trim: true,
    },

    certificateUrl: {
      type: String,
      default: "",
    },

    qrCodeUrl: {
      type: String,
      default: "",
    },

    certificateType: {
      type: String,
      enum: Object.values(CertificateType),
      default: CertificateType.QUALIFICATION,
      index: true,
    },

    certificateStatus: {
      type: String,
      enum: Object.values(CertificateStatus),
      default: CertificateStatus.PENDING,
      index: true,
    },

    /*
            |--------------------------------------------------------------------------
            | Timeline
            |--------------------------------------------------------------------------
            */

    generatedAt: Date,

    issuedAt: Date,

    expiryDate: Date,

    revokedAt: Date,

    /*
            |--------------------------------------------------------------------------
            | Verification
            |--------------------------------------------------------------------------
            */

    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.VERIFIED,
      index: true,
    },

    verifiedAt: Date,

    /*
            |--------------------------------------------------------------------------
            | Approval
            |--------------------------------------------------------------------------
            */

    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    revokedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },

    remarks: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
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

certificateSchema.index({
  examId: 1,
  candidateId: 1,
});

certificateSchema.index({
  companyId: 1,
  branchId: 1,
});

certificateSchema.index({
  examCenterId: 1,
  certificateStatus: 1,
});

certificateSchema.index({
  verificationCode: 1,
  verificationStatus: 1,
});

certificateSchema.index({
  generatedBy: 1,
});

certificateSchema.index({
  revokedBy: 1,
});

certificateSchema.index({
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Certificate = model<ICertificate>("Certificate", certificateSchema);

export default Certificate;
