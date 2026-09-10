import mongoose, { Schema, model } from "mongoose";
import { IUserMfa } from "./userMfa.types";

const userMfaSchema = new Schema<IUserMfa>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    isMfaEnabled: {
      type: Boolean,
      default: false,
    },
    currentMethod: {
      type: String,
      enum: ["totp", "emailOtp", "smsOtp", null],
      default: null,
    },
    secretKey: {
      type: String,
      select: false, // Don't expose secret by default
    },
    backupCodes: {
      type: [String],
      select: false,
      default: [],
    },
    trustedDevicesCount: {
      type: Number,
      default: 0,
    },
    lastVerificationAt: {
      type: Date,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserMfa = mongoose.models.UserMfa || model<IUserMfa>("UserMfa", userMfaSchema);
