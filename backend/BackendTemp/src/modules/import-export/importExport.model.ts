import { Schema, model } from "mongoose";

import {
  ExportStatus,
  FileFormat,
  ImportExportType,
  ImportStatus,
} from "./importExport.types";

const importExportSchema = new Schema(
  {
    operation: {
      type: String,

      enum: ["IMPORT", "EXPORT"],

      required: true,
    },

    type: {
      type: String,

      enum: Object.values(ImportExportType),

      required: true,
    },

    format: {
      type: String,

      enum: Object.values(FileFormat),

      required: true,
    },

    fileName: {
      type: String,

      trim: true,
    },

    fileUrl: {
      type: String,

      trim: true,
    },

    status: {
      type: String,

      enum: [
        ...Object.values(ImportStatus),

        ...Object.values(ExportStatus),

        "CANCELLED",
      ],

      default: ImportStatus.PENDING,
    },

    totalRecords: {
      type: Number,

      default: 0,
    },

    processedRecords: {
      type: Number,

      default: 0,
    },

    successRecords: {
      type: Number,

      default: 0,
    },

    failedRecords: {
      type: Number,

      default: 0,
    },

    filters: {
      type: Schema.Types.Mixed,
    },

    result: {
      type: Schema.Types.Mixed,
    },

    errorLogs: [
      {
        row: Number,

        message: String,
      },
    ],

    startedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },
  },

  {
    timestamps: true,

    versionKey: false,
  },
);

const ImportExport = model(
  "ImportExport",

  importExportSchema,
);

export default ImportExport;
