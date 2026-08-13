import { Schema, model } from "mongoose";

import { BaseSchemaFields } from "../../shared/base.schema";

import { EmployeeStatus, EmployeeVerificationStatus, IEmployee, Gender } from "./employee.types";

const EmployeeDocumentSchema = new Schema(
  {
    documentType: { type: String, required: true, trim: true },
    documentUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, default: 0 },
    version: { type: Number, default: 1 },
    expiryDate: { type: Date, default: null },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    rejectionReason: { type: String, default: null },
    uploadedAt: { type: Date, default: Date.now },
    auditLogs: [
      {
        action: { type: String, required: true },
        performedBy: { type: Schema.Types.Mixed, required: true },
        timestamp: { type: Date, default: Date.now },
        remarks: { type: String, default: null },
      },
    ],
  },
  { _id: true, timestamps: false }
);

const EmployeeBiometricsSchema = new Schema(
  {
    isEnrolled: { type: Boolean, default: false },
    encryptedEmbedding: { type: String, default: null, select: false },
    faceQualityScore: { type: Number, default: null },
    lastEnrolledAt: { type: Date, default: null },
    enrollmentHistory: [
      {
        attemptedAt: { type: Date, default: Date.now },
        status: { type: String, required: true },
        qualityScore: { type: Number, default: null },
        remarks: { type: String, default: null },
      },
    ],
    verificationHistory: [
      {
        verifiedAt: { type: Date, default: Date.now },
        status: { type: String, required: true },
        matchingScore: { type: Number, required: true },
        deviceId: { type: String, default: null },
      },
    ],
  },
  { _id: false, timestamps: false }
);

const EmployeeLifecycleHistorySchema = new Schema(
  {
    status: { type: String, enum: Object.values(EmployeeStatus), required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    reason: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false, timestamps: false }
);

const EmployeeSchema = new Schema<IEmployee>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    employeeCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    firstName: {
      type: String,
      trim: true,
      required: true,
    },

    middleName: {
      type: String,
      trim: true,
      default: null,
    },

    lastName: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      index: true,
    },

    username: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      required: true,
    },

    alternateMobile: {
      type: String,
      trim: true,
      default: null,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
      index: true,
    },

    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      default: null,
      index: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    joiningDate: {
      type: Date,
      required: true,
      index: true,
    },

    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
      default: null,
    },

    bloodGroup: {
      type: String,
      trim: true,
      default: null,
    },

    salary: {
      type: Number,
      default: 0,
    },

    reportingManager: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
      index: true,
    },

    profileImage: {
      type: String,
      default: null,
    },

    digitalSignature: {
      type: String,
      default: null,
    },

    address: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: "India" },
    pincode: { type: String, default: null },

    status: {
      type: String,
      enum: Object.values(EmployeeStatus),
      default: EmployeeStatus.ACTIVE,
      index: true,
    },

    verificationStatus: {
      type: String,
      enum: Object.values(EmployeeVerificationStatus),
      default: EmployeeVerificationStatus.PENDING,
      index: true,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    mobileVerified: {
      type: Boolean,
      default: false,
    },

    aadhaarVerified: {
      type: Boolean,
      default: false,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    correctionNotes: {
      type: String,
      default: null,
    },

    documents: {
      type: [EmployeeDocumentSchema],
      default: [],
    },

    biometrics: {
      type: EmployeeBiometricsSchema,
      default: () => ({ isEnrolled: false, enrollmentHistory: [], verificationHistory: [] }),
    },

    bankDetails: {
      accountName: { type: String, trim: true, default: null },
      accountNumber: { type: String, trim: true, default: null },
      bankName: { type: String, trim: true, default: null },
      ifscCode: { type: String, trim: true, default: null },
      branchName: { type: String, trim: true, default: null },
      accountType: { type: String, enum: ["SAVINGS", "CURRENT", "SALARY"], default: "SALARY" },
    },

    emergencyContact: {
      name: { type: String, trim: true, default: null },
      relationship: { type: String, trim: true, default: null },
      phone: { type: String, trim: true, default: null },
      alternatePhone: { type: String, trim: true, default: null },
      address: { type: String, trim: true, default: null },
    },

    education: {
      type: [
        {
          degree: { type: String, trim: true },
          institution: { type: String, trim: true },
          boardOrUniversity: { type: String, trim: true },
          yearOfPassing: { type: Number },
          percentageOrCgpa: { type: String, trim: true },
        },
      ],
      default: [],
    },

    experience: {
      type: [
        {
          companyName: { type: String, trim: true },
          designation: { type: String, trim: true },
          startDate: { type: Date },
          endDate: { type: Date },
          responsibilities: { type: String, trim: true },
        },
      ],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    certifications: {
      type: [String],
      default: [],
    },

    languages: {
      type: [String],
      default: [],
    },

    lifecycleHistory: {
      type: [EmployeeLifecycleHistorySchema],
      default: [],
    },

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

EmployeeSchema.index({
  companyId: 1,
  employeeCode: 1,
});

EmployeeSchema.index({
  companyId: 1,
  department: 1,
});

EmployeeSchema.index({
  companyId: 1,
  designation: 1,
});

EmployeeSchema.index({
  companyId: 1,
  status: 1,
});

EmployeeSchema.index({
  companyId: 1,
  verificationStatus: 1,
});

EmployeeSchema.index({
  companyId: 1,
  branchId: 1,
  centerId: 1,
});

const Employee = model<IEmployee>("Employee", EmployeeSchema, "generaterolecredentials");

export default Employee;
