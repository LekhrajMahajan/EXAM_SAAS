import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IAdmin } from "./admin.types";
import { UserRole } from "../../constants/roles";
import { Gender, UserStatus, UserTheme, UserLanguage } from "../user/user.types"; // Will update this import later when we delete user

const adminSchema = new Schema<IAdmin>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
      default: null,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    alternateMobile: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: [UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN],
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
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
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.models.Admin || model<IAdmin>("Admin", adminSchema);

export default Admin;
