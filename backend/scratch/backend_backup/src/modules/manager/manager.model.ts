import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IManager, Gender, ManagerStatus } from "./manager.types";

const ManagerSchema = new Schema<IManager>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    managerCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
      default: null,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    alternateMobile: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      default: null,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    dob: Date,
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    salary: {
      type: Number,
      default: 0,
    },
    reportingManager: {
      type: Schema.Types.ObjectId,
      refPath: "manager", // Using self ref, but maybe need refPath if it can be Admin
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: "India",
    },
    pincode: String,
    status: {
      type: String,
      enum: Object.values(ManagerStatus),
      default: ManagerStatus.ACTIVE,
      index: true,
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
    lastLogin: {
      type: Date,
    },
    passwordChangedAt: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      refPath: "creatorModel",
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      refPath: "creatorModel",
      default: null,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ManagerSchema.index({ companyId: 1, managerCode: 1 });
ManagerSchema.index({ companyId: 1, department: 1 });
ManagerSchema.index({ companyId: 1, designation: 1 });
ManagerSchema.index({ companyId: 1, status: 1 });

ManagerSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

ManagerSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const Manager = mongoose.models.Manager || model<IManager>("Manager", ManagerSchema);

export default Manager;
