import mongoose, { Schema } from "mongoose";
import { IAuthPolicy } from "./authPolicy.types";

const passwordPolicySchema = new Schema({
  minLength: { type: Number, default: 8 },
  maxLength: { type: Number, default: 64 },
  requireUppercase: { type: Boolean, default: true },
  requireLowercase: { type: Boolean, default: true },
  requireNumbers: { type: Boolean, default: true },
  requireSpecialCharacters: { type: Boolean, default: true },
  passwordHistoryCount: { type: Number, default: 5 },
  passwordExpiryDays: { type: Number, default: 90 },
  minimumPasswordAgeDays: { type: Number, default: 1 },
  preventUsernameInPassword: { type: Boolean, default: true },
  preventCommonPasswords: { type: Boolean, default: true },
  preventSequentialPasswords: { type: Boolean, default: true },
}, { _id: false });

const accountLockoutSchema = new Schema({
  failedLoginAttempts: { type: Number, default: 5 },
  lockoutDurationMinutes: { type: Number, default: 30 },
  permanentLockOption: { type: Boolean, default: false },
  autoUnlock: { type: Boolean, default: true },
  manualUnlock: { type: Boolean, default: true },
}, { _id: false });

const loginPolicySchema = new Schema({
  maxConcurrentSessions: { type: Number, default: 3 },
  allowMultipleDevices: { type: Boolean, default: true },
  allowMultipleBrowsers: { type: Boolean, default: true },
  sessionTimeoutMinutes: { type: Number, default: 120 },
  idleTimeoutMinutes: { type: Number, default: 30 },
  forceLogoutAfterPasswordChange: { type: Boolean, default: true },
  rememberDevice: { type: Boolean, default: true },
  rememberBrowser: { type: Boolean, default: false },
}, { _id: false });

const tokenPolicySchema = new Schema({
  jwtExpiryMinutes: { type: Number, default: 15 },
  refreshTokenExpiryDays: { type: Number, default: 7 },
  refreshTokenRotation: { type: Boolean, default: true },
  maxActiveRefreshTokens: { type: Number, default: 5 },
  forceTokenRevocation: { type: Boolean, default: false },
}, { _id: false });

const examSecurityPolicySchema = new Schema({
  allowLoginBeforeExam: { type: Boolean, default: true },
  loginCutoffBeforeExamMinutes: { type: Number, default: 30 },
  autoLogoutAfterExam: { type: Boolean, default: true },
  restrictLoginDuringExam: { type: Boolean, default: true },
  singleActiveExamSession: { type: Boolean, default: true },
}, { _id: false });

const authenticationSettingsSchema = new Schema({
  emailLogin: { type: Boolean, default: true },
  employeeIdLogin: { type: Boolean, default: false },
  usernameLogin: { type: Boolean, default: false },
  mobileLogin: { type: Boolean, default: false },
  caseSensitiveUsername: { type: Boolean, default: false },
}, { _id: false });

const passwordResetPolicySchema = new Schema({
  otpExpiryMinutes: { type: Number, default: 10 },
  resetLinkExpiryHours: { type: Number, default: 24 },
  maxResetRequestsPerDay: { type: Number, default: 3 },
  cooldownPeriodMinutes: { type: Number, default: 15 },
}, { _id: false });

const authPolicySchema = new Schema<IAuthPolicy>({
  type: { type: String, default: "SYSTEM_AUTH_POLICY", unique: true },
  passwordPolicy: { type: passwordPolicySchema, default: () => ({}) },
  accountLockout: { type: accountLockoutSchema, default: () => ({}) },
  loginPolicy: { type: loginPolicySchema, default: () => ({}) },
  tokenPolicy: { type: tokenPolicySchema, default: () => ({}) },
  examSecurity: { type: examSecurityPolicySchema, default: () => ({}) },
  authenticationSettings: { type: authenticationSettingsSchema, default: () => ({}) },
  passwordReset: { type: passwordResetPolicySchema, default: () => ({}) },
  updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
}, { timestamps: true });

export default mongoose.models.AuthPolicy || mongoose.model<IAuthPolicy>("AuthPolicy", authPolicySchema);
