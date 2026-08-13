import { Document, Types } from "mongoose";

export interface IPasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialCharacters: boolean;
  passwordHistoryCount: number;
  passwordExpiryDays: number;
  minimumPasswordAgeDays: number;
  preventUsernameInPassword: boolean;
  preventCommonPasswords: boolean;
  preventSequentialPasswords: boolean;
}

export interface IAccountLockoutPolicy {
  failedLoginAttempts: number;
  lockoutDurationMinutes: number;
  permanentLockOption: boolean;
  autoUnlock: boolean;
  manualUnlock: boolean;
}

export interface ILoginPolicy {
  maxConcurrentSessions: number;
  allowMultipleDevices: boolean;
  allowMultipleBrowsers: boolean;
  sessionTimeoutMinutes: number;
  idleTimeoutMinutes: number;
  forceLogoutAfterPasswordChange: boolean;
  rememberDevice: boolean;
  rememberBrowser: boolean;
}

export interface ITokenPolicy {
  jwtExpiryMinutes: number;
  refreshTokenExpiryDays: number;
  refreshTokenRotation: boolean;
  maxActiveRefreshTokens: number;
  forceTokenRevocation: boolean;
}

export interface IExamSecurityPolicy {
  allowLoginBeforeExam: boolean;
  loginCutoffBeforeExamMinutes: number;
  autoLogoutAfterExam: boolean;
  restrictLoginDuringExam: boolean;
  singleActiveExamSession: boolean;
}

export interface IAuthenticationSettings {
  emailLogin: boolean;
  employeeIdLogin: boolean;
  usernameLogin: boolean;
  mobileLogin: boolean;
  caseSensitiveUsername: boolean;
}

export interface IPasswordResetPolicy {
  otpExpiryMinutes: number;
  resetLinkExpiryHours: number;
  maxResetRequestsPerDay: number;
  cooldownPeriodMinutes: number;
}

export interface IAuthPolicy extends Document {
  _id: Types.ObjectId;
  type: string; // 'SYSTEM_AUTH_POLICY'
  passwordPolicy: IPasswordPolicy;
  accountLockout: IAccountLockoutPolicy;
  loginPolicy: ILoginPolicy;
  tokenPolicy: ITokenPolicy;
  examSecurity: IExamSecurityPolicy;
  authenticationSettings: IAuthenticationSettings;
  passwordReset: IPasswordResetPolicy;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
