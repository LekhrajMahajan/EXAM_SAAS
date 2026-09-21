import mongoose, { Schema, Document, Types } from "mongoose";

// ─────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────

export enum CompanyAdminRequestStatus {
  PENDING = "PENDING",                     // Request sent, waiting for center manager to upload docs
  PENDING_DOCUMENTS = "PENDING_DOCUMENTS", // Company admin rejected some docs, waiting for re-upload
  UNDER_REVIEW = "UNDER_REVIEW",           // Center manager uploaded docs, company admin reviewing
  APPROVED = "APPROVED",                   // All docs approved, connection established
  REJECTED = "REJECTED",                   // Company admin permanently rejected
}

// ─────────────────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────────────────

export interface IRequestDocument {
  _id?: Types.ObjectId;
  documentType: string;         // "Signed MOU", "PAN Card", "GST Certificate", etc.
  isMandatory: boolean;
  fileName: string;
  fileUrl: string;
  fileSize?: string;
  version: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  uploadedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface IShiftRate {
  shiftName: string;
  pricePerCandidate: number;
  candidateCapacity: number;
  maximumCapacity: number;
  timings?: string;
  specialNotes?: string;
}

export interface ICompanyAdminRequest extends Document {
  // Who is requesting
  companyId: Types.ObjectId;
  companyAdminId: Types.ObjectId;  // The user who initiated the request

  // Which center is being requested
  centerId: Types.ObjectId;

  // MOU file sent by company admin
  mouFileUrl?: string;
  mouFileName?: string;

  // Shift pricing proposed by company admin
  shiftRates: IShiftRate[];

  // Documents uploaded by Center Manager
  documents: IRequestDocument[];

  // Overall status of the request
  status: CompanyAdminRequestStatus;

  // Remarks from company admin during rejection
  adminRejectRemarks?: string;

  // When did the center manager last upload/re-upload docs
  lastDocumentUploadAt?: Date;

  // When was the final approval done
  approvedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────

const RequestDocumentSchema = new Schema(
  {
    documentType: { type: String, required: true },
    isMandatory: { type: Boolean, default: true },
    fileName: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    fileSize: { type: String },
    version: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    uploadedAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
    rejectionReason: { type: String },
  },
  { _id: true }
);

const ShiftRateSchema = new Schema(
  {
    shiftName: { type: String, required: true },
    pricePerCandidate: { type: Number, default: 250 },
    candidateCapacity: { type: Number, default: 100 },
    maximumCapacity: { type: Number, default: 100 },
    timings: { type: String, default: "" },
    specialNotes: { type: String, default: "" },
  },
  { _id: false }
);

const CompanyAdminRequestSchema = new Schema<ICompanyAdminRequest>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    companyAdminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },
    mouFileUrl: { type: String, default: "" },
    mouFileName: { type: String, default: "" },
    shiftRates: [ShiftRateSchema],
    documents: [RequestDocumentSchema],
    status: {
      type: String,
      enum: Object.values(CompanyAdminRequestStatus),
      default: CompanyAdminRequestStatus.PENDING,
      index: true,
    },
    adminRejectRemarks: { type: String, default: "" },
    lastDocumentUploadAt: { type: Date },
    approvedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Ensure one company can only have one active request per center
CompanyAdminRequestSchema.index(
  { companyId: 1, centerId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $nin: [CompanyAdminRequestStatus.APPROVED, CompanyAdminRequestStatus.REJECTED] },
    },
  }
);

export default mongoose.model<ICompanyAdminRequest>(
  "CompanyAdminRequest",
  CompanyAdminRequestSchema
);
