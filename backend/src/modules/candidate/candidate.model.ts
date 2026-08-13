import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

import {
  ICandidate,
  CandidateStatus,
  Gender,
  Category,
} from "./candidate.types";

import { BaseSchemaFields } from "../../shared/base.schema";

const CandidateSchema = new Schema<ICandidate>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },

    seatId: {
      type: Schema.Types.ObjectId,
      ref: "Seat",
      default: null,
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      default: null,
      index: true,
    },

    candidateCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    applicationNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    enrollmentNo: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      default: "",
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    alternateMobile: {
      type: String,
      default: "",
      trim: true,
    },

    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
      index: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    category: {
      type: String,
      enum: Object.values(Category),
      required: true,
      index: true,
    },

    bloodGroup: {
      type: String,
      default: "",
      trim: true,
    },

    photo: {
      type: String,
      default: "",
    },

    signature: {
      type: String,
      default: "",
    },

    aadharNumber: {
      type: String,
      default: "",
      trim: true,
    },

    governmentId: {
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
      default: "India",
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    biometricVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    faceVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    mobileVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    hallTicketGenerated: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: Object.values(CandidateStatus),
      default: CandidateStatus.ACTIVE,
      index: true,
    },

    password: {
      type: String,
      select: false,
    },
    devices: [
      {
        deviceId: String,
        deviceName: String,
        browser: String,
        browserVersion: String,
        operatingSystem: String,
        trusted: { type: Boolean, default: false },
        isBlocked: { type: Boolean, default: false },
        riskScore: { type: Number, default: 0 },
        ipAddress: String,
        location: String,
        firstLoginAt: Date,
        lastLoginAt: Date,
      },
    ],
    sessions: [
      {
        sessionId: String,
        deviceId: String,
        ipAddress: String,
        browser: String,
        operatingSystem: String,
        loginAt: Date,
        lastActivityAt: Date,
        expiresAt: Date,
      },
    ],
    loginHistory: [
      {
        ipAddress: String,
        browser: String,
        operatingSystem: String,
        location: String,
        loginAt: Date,
        successful: Boolean,
      },
    ],
    lastLogin: Date,
    passwordChangedAt: Date,
    loginAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date, default: null },
    refreshToken: { type: String, default: null },
    isLoginEnabled: { type: Boolean, default: false },

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

CandidateSchema.virtual("displayName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/*
|--------------------------------------------------------------------------
| Compound Indexes
|--------------------------------------------------------------------------
*/

// Candidate Code
CandidateSchema.index(
  {
    companyId: 1,
    candidateCode: 1,
  },
  {
    unique: true,
  },
);

// Application Number
CandidateSchema.index(
  {
    companyId: 1,
    applicationNo: 1,
  },
  {
    unique: true,
  },
);

// Enrollment Number
CandidateSchema.index(
  {
    companyId: 1,
    enrollmentNo: 1,
  },
  {
    unique: true,
  },
);

// Email
CandidateSchema.index({
  companyId: 1,
  email: 1,
});

// Mobile
CandidateSchema.index({
  companyId: 1,
  mobile: 1,
});

// Center Wise
CandidateSchema.index({
  companyId: 1,
  centerId: 1,
});

// Seat Wise


// Exam Wise


// Status
CandidateSchema.index({
  companyId: 1,
  status: 1,
});

// Soft Delete
CandidateSchema.index({
  companyId: 1,
  isDeleted: 1,
});

/*
|--------------------------------------------------------------------------
| Authentication Hooks
|--------------------------------------------------------------------------
*/

CandidateSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

CandidateSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Candidate = model<ICandidate>("Candidate", CandidateSchema);

export default Candidate;
