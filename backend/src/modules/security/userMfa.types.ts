import { Document, Types } from "mongoose";

export interface IUserMfa extends Document {
  userId: Types.ObjectId;
  isMfaEnabled: boolean;
  currentMethod: "totp" | "emailOtp" | "smsOtp" | null;
  secretKey?: string; // e.g., TOTP secret
  backupCodes: string[];
  trustedDevicesCount: number;
  lastVerificationAt?: Date;
  failedAttempts: number;
  isLocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
