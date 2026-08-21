export enum IpRuleType {
  SINGLE_IP = "SINGLE_IP",
  CIDR_RANGE = "CIDR_RANGE",
  SUBNET = "SUBNET",
  CORPORATE_NETWORK = "CORPORATE_NETWORK",
  EXAM_CENTER_NETWORK = "EXAM_CENTER_NETWORK",
  TEMPORARY_BLOCK = "TEMPORARY_BLOCK",
  PERMANENT_BLOCK = "PERMANENT_BLOCK",
}

export enum IpRuleCategory {
  WHITELIST = "WHITELIST",
  BLACKLIST = "BLACKLIST",
}

export enum IpRuleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
}

export enum IpRiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface IIpRule {
  _id: string;
  ipAddress?: string;
  cidrRange?: string;
  ruleType: IpRuleType;
  category: IpRuleCategory;
  companyId?: string | Record<string, unknown>; // could be object or string based on populate
  examCenterId?: string | Record<string, unknown>;
  status: IpRuleStatus;
  riskLevel: IpRiskLevel;
  expiryDate?: string;
  lastMatched?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- Authentication Policies Types ---
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

export interface IAuthPolicy {
  _id: string;
  type: string;
  passwordPolicy: IPasswordPolicy;
  accountLockout: IAccountLockoutPolicy;
  loginPolicy: ILoginPolicy;
  tokenPolicy: ITokenPolicy;
  examSecurity: IExamSecurityPolicy;
  authenticationSettings: IAuthenticationSettings;
  passwordReset: IPasswordResetPolicy;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IpRuleStatistics {
  total: number;
  whitelisted: number;
  blacklisted: number;
  temporaryBlocks: number;
  expiredBlocks: number;
  activeRanges: number;
  corporateNetworks: number;
}

// --- MFA Types ---
export interface ISupportedMethods {
  totp: boolean;
  emailOtp: boolean;
  smsOtp: boolean;
  backupCodes: boolean;
}

export interface IRoleEnforcement {
  role: string;
  requirement: "Required" | "Optional" | "Disabled";
}

export interface ITrustedDeviceSettings {
  rememberDevice: boolean;
  trustDurationDays: number;
  maxTrustedDevices: number;
}

export interface ILoginFlowSettings {
  requireEveryLogin: boolean;
  skipOnTrustedDevice: boolean;
  requireOnNewDevice: boolean;
  requireAfterPasswordChange: boolean;
  requireAfterRiskDetection: boolean;
}

export interface IMfaPolicy {
  _id: string;
  type: string;
  supportedMethods: ISupportedMethods;
  roleEnforcements: IRoleEnforcement[];
  trustedDeviceSettings: ITrustedDeviceSettings;
  loginFlowSettings: ILoginFlowSettings;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMfaStatistics {
  totalUsers: number;
  mfaEnabledUsers: number;
  mfaDisabledUsers: number;
  pendingEnrollment: number;
  lockedAccounts: number;
  recoveryCodesGenerated: number;
  failedMfaAttempts: number;
  trustedDevices: number;
}

export interface IMfaUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isMfaEnabled: boolean;
  currentMethod: "totp" | "emailOtp" | "smsOtp" | null;
  trustedDevicesCount: number;
  lastVerificationAt?: string;
  isLocked: boolean;
}

// ==========================================
// THREAT DETECTION & SECURITY EVENTS
// ==========================================

export enum EventSeverity {
  CRITICAL = "Critical",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
  INFORMATIONAL = "Informational",
}

export enum EventStatus {
  OPEN = "Open",
  INVESTIGATING = "Investigating",
  RESOLVED = "Resolved",
  DISMISSED = "Dismissed",
}

export interface ISecurityEvent {
  _id: string;
  eventId: string;
  eventType: string;
  category: string;
  severity: EventSeverity;
  
  userId?: { _id: string; firstName: string; lastName: string; email: string; role?: string; };
  employeeId?: string;
  companyId?: { _id: string; name: string; };
  
  ipAddress?: string;
  device?: string;
  browser?: string;
  operatingSystem?: string;
  location?: string;
  
  status: EventStatus;
  assignedTo?: { _id: string; firstName: string; lastName: string; email: string; };
  
  metadata?: Record<string, any>;
  recommendedAction?: string;
  relatedEvents?: any[];
  
  createdAt: string;
  updatedAt: string;
}

export interface ISecurityEventFilters {
  severity?: string;
  status?: string;
  category?: string;
  search?: string;
}

export interface IThreatStatistics {
  totalEvents: number;
  criticalAlerts: number;
  highRiskEvents: number;
  mediumRiskEvents: number;
  lowRiskEvents: number;
  activeThreats: number;
  resolvedThreats: number;
  eventsToday: number;
  eventsThisWeek: number;
}
