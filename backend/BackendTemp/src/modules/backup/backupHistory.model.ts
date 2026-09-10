import { Schema, model } from "mongoose";

export enum BackupType {
  FULL = "FULL",
  DATABASE = "DATABASE",
  UPLOADED_FILES = "UPLOADED_FILES",
  CONFIGURATION = "CONFIGURATION",
  MODULE_WISE = "MODULE_WISE",
  CUSTOM = "CUSTOM",
}

export enum BackupStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

const backupHistorySchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(BackupType),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(BackupStatus),
      default: BackupStatus.PENDING,
    },

    size: {
      type: Number,
      default: 0,
    },

    path: {
      type: String,
      required: false,
    },

    storageProvider: {
      type: String, // LOCAL, AWS_S3, etc.
      required: false,
    },

    checksum: {
      type: String,
      required: false,
    },

    triggeredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Null means system cron
    },

    errorLog: {
      type: String,
      required: false,
    },

    duration: {
      type: Number, // milliseconds
      required: false,
    },

    module: {
      type: String, // If module wise
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

export const BackupHistory = model("BackupHistory", backupHistorySchema);
