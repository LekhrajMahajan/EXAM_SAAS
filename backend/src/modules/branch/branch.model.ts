import { Schema, model } from "mongoose";

import {
  IBranch,
  BranchStatus,
  BranchSetupStatus,
  DocumentStatus,
  VerificationStatus,
} from "./branch.types";
import { BaseSchemaFields } from "../../shared/base.schema";

const LegalDocumentSchema = new Schema(
  {
    documentType: { type: String, required: true },
    url: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.PENDING,
    },
    expiryDate: { type: Date, default: null },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    uploadedAt: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    isMandatory: { type: Boolean, default: false },
    encryptionKeyHash: { type: String, default: null },
  },
  { _id: false }
);

const BranchSchema = new Schema<IBranch>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    branchCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    branchName: {
      type: String,
      required: true,
      trim: true,
    },

    examCenterCode: {
      type: String,
      default: "",
      trim: true,
    },

    totalLabs: {
      type: Number,
      default: 0,
    },

    totalSystems: {
      type: Number,
      default: 0,
    },

    facilities: {
      type: [String],
      default: [],
    },

    displayName: {
      type: String,
      default: "",
      trim: true,
    },

    logoUrl: {
      type: String,
      default: "",
    },

    branchManagerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    setupStatus: {
      type: String,
      enum: Object.values(BranchSetupStatus),
      default: BranchSetupStatus.DRAFT,
      index: true,
    },

    setupCurrentStep: {
      type: Number,
      default: 1,
      min: 1,
      max: 7,
    },

    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    readinessScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    addressDetails: {
      street: { type: String, default: "" },
      district: { type: String, default: "" },
      taluka: { type: String, default: "" },
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
      mapLocationUrl: { type: String, default: "" },
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    officeTiming: {
      openTime: { type: String, default: "09:00" },
      closeTime: { type: String, default: "18:00" },
      workingDays: {
        type: [String],
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
      timeZone: { type: String, default: "Asia/Kolkata" },
    },

    legalDocuments: {
      type: [LegalDocumentSchema],
      default: [],
    },

    verificationDetails: {
      panNumber: { type: String, default: "" },
      gstinNumber: { type: String, default: "" },
      aadhaarNumber: { type: String, default: "" },
      aadhaarOtpVerified: { type: Boolean, default: false },
      mobileOtpVerified: { type: Boolean, default: false },
      emailVerified: { type: Boolean, default: false },
      faceVerified: { type: Boolean, default: false },
      verificationStatus: {
        type: String,
        enum: Object.values(VerificationStatus),
        default: VerificationStatus.PENDING,
      },
      history: [
        {
          status: { type: String, required: true },
          remarks: { type: String, default: "" },
          updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
    },

    onboardingStaff: {
      type: [Object] as any,
      default: [],
    },

    onboardingInfrastructure: {
      type: [Object] as any,
      default: [],
    },

    examReadiness: {
      controlRoom: { type: Boolean, default: false },
      biometricCounters: { type: Number, default: 0 },
      waitingAreaCapacity: { type: Number, default: 0 },
      helpDeskAvailable: { type: Boolean, default: false },
      medicalRoomAvailable: { type: Boolean, default: false },
      strongRoomSecurity: { type: String, default: "" },
      questionPaperStorage: { type: Boolean, default: false },
      internetRedundancy: { type: String, default: "" },
      powerRedundancy: { type: String, default: "" },
      emergencyContacts: [
        {
          name: String,
          phone: String,
          relationship: String,
          role: String,
        },
      ],
      disasterRecoveryChecklist: { type: Schema.Types.Mixed, default: {} },
      readinessScore: { type: Number, default: 0 },
    },

    complianceChecklist: {
      fireSafety: { type: Boolean, default: false },
      cctvWorking: { type: Boolean, default: false },
      networkWorking: { type: Boolean, default: false },
      biometricDeviceTested: { type: Boolean, default: false },
      systemsTested: { type: Boolean, default: false },
      seatingVerified: { type: Boolean, default: false },
      staffAssigned: { type: Boolean, default: false },
      emergencyContactAvailable: { type: Boolean, default: false },
      generatorTested: { type: Boolean, default: false },
      internetBackupTested: { type: Boolean, default: false },
    },

    adminReviewRemarks: { type: String, default: "" },
    adminReviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    adminReviewedAt: { type: Date, default: null },

    managerName: {
      type: String,
      default: "",
      trim: true,
    },

    branchType: {
      type: String,
      default: "STANDARD",
      trim: true,
      index: true,
    },

    parentBranchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(BranchStatus),
      default: BranchStatus.ACTIVE,
      index: true,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
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
| Virtual
|--------------------------------------------------------------------------
*/

BranchSchema.virtual("fullAddress").get(function (this: IBranch) {
  return `${this.address}, ${this.city}, ${this.state}, ${this.country} - ${this.postalCode}`;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Branch Code must be unique within a company
BranchSchema.index(
  {
    companyId: 1,
    branchCode: 1,
  },
  {
    unique: true,
  },
);

// Branch Name must be unique within a company
BranchSchema.index(
  {
    companyId: 1,
    branchName: 1,
  },
  {
    unique: true,
  },
);

// Search, Advanced Filtering & Onboarding Statuses
BranchSchema.index({ companyId: 1, city: 1 });
BranchSchema.index({ companyId: 1, state: 1 });
BranchSchema.index({ companyId: 1, country: 1 });
BranchSchema.index({ companyId: 1, branchType: 1 });
BranchSchema.index({ companyId: 1, status: 1 });
BranchSchema.index({ companyId: 1, setupStatus: 1 });
BranchSchema.index({ companyId: 1, branchManagerId: 1 });
BranchSchema.index({ companyId: 1, isDeleted: 1 });
BranchSchema.index({ companyId: 1, createdAt: -1 });
BranchSchema.index({ companyId: 1, updatedAt: -1 });

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Branch = model<IBranch>("Branch", BranchSchema);

export default Branch;


