import { Document, Types } from "mongoose";
import { UserRole } from "../../constants/roles";

export interface ISupportedMethods {
  totp: boolean;
  emailOtp: boolean;
  smsOtp: boolean;
  backupCodes: boolean;
}

export interface IRoleEnforcement {
  role: UserRole;
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

export interface IMfaPolicy extends Document {
  type: string;
  supportedMethods: ISupportedMethods;
  roleEnforcements: IRoleEnforcement[];
  trustedDeviceSettings: ITrustedDeviceSettings;
  loginFlowSettings: ILoginFlowSettings;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
