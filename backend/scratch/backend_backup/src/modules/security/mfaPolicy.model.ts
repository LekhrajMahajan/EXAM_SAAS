import mongoose, { Schema, model } from "mongoose";
import { IMfaPolicy } from "./mfaPolicy.types";
import { UserRole } from "../../constants/roles";

const mfaPolicySchema = new Schema<IMfaPolicy>(
  {
    type: {
      type: String,
      required: true,
      default: "SYSTEM_MFA_POLICY",
      unique: true,
    },
    supportedMethods: {
      totp: { type: Boolean, default: true },
      emailOtp: { type: Boolean, default: false },
      smsOtp: { type: Boolean, default: false },
      backupCodes: { type: Boolean, default: true },
    },
    roleEnforcements: [
      {
        role: { type: String, enum: Object.values(UserRole) },
        requirement: { type: String, enum: ["Required", "Optional", "Disabled"], default: "Optional" }
      }
    ],
    trustedDeviceSettings: {
      rememberDevice: { type: Boolean, default: true },
      trustDurationDays: { type: Number, default: 30 },
      maxTrustedDevices: { type: Number, default: 5 },
    },
    loginFlowSettings: {
      requireEveryLogin: { type: Boolean, default: false },
      skipOnTrustedDevice: { type: Boolean, default: true },
      requireOnNewDevice: { type: Boolean, default: true },
      requireAfterPasswordChange: { type: Boolean, default: true },
      requireAfterRiskDetection: { type: Boolean, default: true },
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save hook to ensure default role enforcements exist
mfaPolicySchema.pre("save", function(next) {
  if (this.isNew || this.roleEnforcements.length === 0) {
    const defaultEnforcements = [
      { role: UserRole.MASTER_ADMIN, requirement: "Required" },
      { role: UserRole.COMPANY_ADMIN, requirement: "Required" },
      { role: UserRole.EXAM_MANAGER, requirement: "Optional" },
      { role: UserRole.OBSERVER, requirement: "Optional" },
      { role: UserRole.CANDIDATE, requirement: "Disabled" },
    ];
    // If not all default roles are present, merge them
    if (this.roleEnforcements.length === 0) {
      this.roleEnforcements = defaultEnforcements as any;
    }
  }
  // @ts-ignore
  next();
});

export const MfaPolicy = mongoose.models.MfaPolicy || model<IMfaPolicy>("MfaPolicy", mfaPolicySchema);
