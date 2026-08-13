import { Schema, model } from "mongoose";

import {
  FileStatus,
  FileType,
  IFileStorage,
  StorageProvider,
} from "./fileStorage.types";

/*
|--------------------------------------------------------------------------
| File Storage Schema
|--------------------------------------------------------------------------
*/

const fileStorageSchema = new Schema<IFileStorage>(
  {
    /*
        |--------------------------------------------------------------------------
        | File Information
        |--------------------------------------------------------------------------
        */

    originalName: {
      type: String,

      required: true,

      trim: true,

      maxlength: 500,
    },

    fileName: {
      type: String,

      required: true,

      unique: true,

      trim: true,

      index: true,
    },

    extension: {
      type: String,

      required: true,

      trim: true,

      lowercase: true,
    },

    mimeType: {
      type: String,

      required: true,

      trim: true,
    },

    fileType: {
      type: String,

      enum: Object.values(FileType),

      required: true,

      index: true,
    },

    size: {
      type: Number,

      required: true,

      min: 0,
    },

    /*
        |--------------------------------------------------------------------------
        | Storage
        |--------------------------------------------------------------------------
        */

    url: {
      type: String,

      required: true,

      trim: true,
    },

    path: {
      type: String,

      required: true,

      trim: true,
    },

    folder: {
      type: String,

      trim: true,
    },

    bucket: {
      type: String,

      trim: true,
    },

    storageProvider: {
      type: String,

      enum: Object.values(StorageProvider),

      default: StorageProvider.LOCAL,

      index: true,
    },

    status: {
      type: String,

      enum: Object.values(FileStatus),

      default: FileStatus.ACTIVE,

      index: true,
    },

    isPublic: {
      type: Boolean,

      default: false,

      index: true,
    },

    checksum: {
      type: String,

      trim: true,

      index: true,
    },

    /*
        |--------------------------------------------------------------------------
        | Relations
        |--------------------------------------------------------------------------
        */

    uploadedBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",

      index: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,

      ref: "Company",

      index: true,
    },

    branchId: {
      type: Schema.Types.ObjectId,

      ref: "Branch",

      index: true,
    },

    candidateId: {
      type: Schema.Types.ObjectId,

      ref: "Candidate",

      index: true,
    },

    employeeId: {
      type: Schema.Types.ObjectId,

      ref: "Employee",

      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,

      ref: "Exam",

      index: true,
    },

    paperId: {
      type: Schema.Types.ObjectId,

      ref: "Paper",

      index: true,
    },

    questionId: {
      type: Schema.Types.ObjectId,

      ref: "Question",

      index: true,
    },

    certificateId: {
      type: Schema.Types.ObjectId,

      ref: "Certificate",

      index: true,
    },

    reportId: {
      type: Schema.Types.ObjectId,

      ref: "Report",

      index: true,
    },

    /*
        |--------------------------------------------------------------------------
        | Metadata
        |--------------------------------------------------------------------------
        */

    metadata: {
      type: Schema.Types.Mixed,

      default: {},
    },

    /*
        |--------------------------------------------------------------------------
        | Audit
        |--------------------------------------------------------------------------
        */

    createdBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    updatedBy: {
      type: Schema.Types.ObjectId,

      ref: "Employee",
    },

    isDeleted: {
      type: Boolean,

      default: false,

      index: true,
    },

    deletedAt: {
      type: Date,

      default: null,
    },
  },

  {
    timestamps: true,

    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

fileStorageSchema.index({
  companyId: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  candidateId: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  employeeId: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  examId: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  paperId: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  questionId: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  certificateId: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  reportId: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  storageProvider: 1,

  status: 1,
});

fileStorageSchema.index({
  fileType: 1,

  createdAt: -1,
});

fileStorageSchema.index({
  isDeleted: 1,

  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const FileStorage = model<IFileStorage>("FileStorage", fileStorageSchema);

export default FileStorage;
