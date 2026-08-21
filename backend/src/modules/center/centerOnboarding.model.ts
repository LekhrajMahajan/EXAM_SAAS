import mongoose, { Schema, Document, Types } from "mongoose";
import { CenterSetupStatus, DocumentApprovalStatus } from "./center.types";

export interface ICenterOnboarding extends Document {
  centerId: Types.ObjectId;
  companyId: Types.ObjectId;
  status: CenterSetupStatus;
  
  commercialAgreement: {
    shiftName: string;
    candidateCapacity: number;
    pricePerCandidate: number;
    minimumGuarantee: number;
    maximumCapacity: number;
    paymentTerms: string;
    includedFacilities: string[];
    requiredInfrastructure: string[];
    penaltyRules: string[];
    bonusRules: string[];
    specialNotes: string;
  }[];

  agreementDetails: {
    acceptedBy: string;
    acceptedTime: Date;
    acceptedIp: string;
    browser: string;
    device: string;
    geoLocation?: {
      latitude: number;
      longitude: number;
      city: string;
    };
  };

  documents: {
    _id?: Types.ObjectId;
    documentType: string;
    isMandatory: boolean;
    fileName: string;
    fileSize?: string;
    fileUrl: string;
    version: number;
    status: DocumentApprovalStatus;
    uploadedAt: Date;
    verifiedAt?: Date;
    verifiedBy?: string;
    rejectionReason?: string;
    correctionNotes?: string;
  }[];

  adminReviewRemarks: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const CenterOnboardingSchema = new Schema<ICenterOnboarding>(
  {
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(CenterSetupStatus),
      default: CenterSetupStatus.DRAFT,
      index: true,
    },
    commercialAgreement: [
      {
        shiftName: { type: String, default: "Standard Shift" },
        candidateCapacity: { type: Number, default: 0 },
        pricePerCandidate: { type: Number, default: 0 },
        minimumGuarantee: { type: Number, default: 0 },
        maximumCapacity: { type: Number, default: 0 },
        paymentTerms: { type: String, default: "Net 30 after exam completion" },
        includedFacilities: [{ type: String }],
        requiredInfrastructure: [{ type: String }],
        penaltyRules: [{ type: String }],
        bonusRules: [{ type: String }],
        specialNotes: { type: String, default: "" },
      },
    ],
    agreementDetails: {
      acceptedBy: { type: String, default: "" },
      acceptedTime: { type: Date },
      acceptedIp: { type: String, default: "" },
      browser: { type: String, default: "" },
      device: { type: String, default: "" },
      geoLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        city: { type: String },
      },
    },
    documents: [
      {
        documentType: { type: String, required: true },
        isMandatory: { type: Boolean, default: false },
        fileName: { type: String, default: "" },
        fileSize: { type: String, default: "" },
        fileUrl: { type: String, default: "" },
        version: { type: Number, default: 1 },
        status: {
          type: String,
          enum: Object.values(DocumentApprovalStatus),
          default: DocumentApprovalStatus.PENDING,
        },
        uploadedAt: { type: Date, default: Date.now },
        verifiedAt: { type: Date },
        verifiedBy: { type: String },
        rejectionReason: { type: String },
        correctionNotes: { type: String },
      },
    ],
    adminReviewRemarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICenterOnboarding>("CenterOnboarding", CenterOnboardingSchema);
