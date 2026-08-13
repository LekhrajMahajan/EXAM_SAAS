import { Schema, model } from "mongoose";
import { SettingCategory } from "./systemSettings.types";
import { ConfigurationStatus, ConfigurationApprovalStatus, IConfigurationHistory } from "./configurationHistory.types";

const configurationHistorySchema = new Schema<IConfigurationHistory>(
  {
    configurationName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    module: {
      type: String,
      enum: Object.values(SettingCategory),
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: Object.values(SettingCategory),
      required: true,
      index: true,
    },
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    oldValue: {
      type: Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(ConfigurationStatus),
      default: ConfigurationStatus.PUBLISHED,
      index: true,
    },
    approvalStatus: {
      type: String,
      enum: Object.values(ConfigurationApprovalStatus),
      default: ConfigurationApprovalStatus.NOT_REQUIRED,
      index: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    approvalNotes: {
      type: String,
      trim: true,
    },
    approvalTimestamp: {
      type: Date,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    versionNotes: {
      type: String,
      trim: true,
    },
    versionTags: [
      {
        type: String,
        trim: true,
      },
    ],
    rollbackPoint: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

configurationHistorySchema.index({ module: 1, category: 1, createdAt: -1 });

export const ConfigurationHistory = model<IConfigurationHistory>("ConfigurationHistory", configurationHistorySchema);
