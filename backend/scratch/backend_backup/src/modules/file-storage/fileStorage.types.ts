import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Storage Provider
|--------------------------------------------------------------------------
*/

export enum StorageProvider {
  LOCAL = "LOCAL",

  AWS_S3 = "AWS_S3",

  CLOUDINARY = "CLOUDINARY",

  AZURE_BLOB = "AZURE_BLOB",

  GOOGLE_CLOUD = "GOOGLE_CLOUD",

  MINIO = "MINIO",
}

/*
|--------------------------------------------------------------------------
| File Type
|--------------------------------------------------------------------------
*/

export enum FileType {
  IMAGE = "IMAGE",

  PDF = "PDF",

  DOCUMENT = "DOCUMENT",

  EXCEL = "EXCEL",

  VIDEO = "VIDEO",

  AUDIO = "AUDIO",

  ZIP = "ZIP",

  OTHER = "OTHER",
}

/*
|--------------------------------------------------------------------------
| File Status
|--------------------------------------------------------------------------
*/

export enum FileStatus {
  UPLOADING = "UPLOADING",

  ACTIVE = "ACTIVE",

  FAILED = "FAILED",

  ARCHIVED = "ARCHIVED",

  DELETED = "DELETED",
}

/*
|--------------------------------------------------------------------------
| File Storage
|--------------------------------------------------------------------------
*/

export interface IFileStorage {
  originalName: string;

  fileName: string;

  extension: string;

  mimeType: string;

  fileType: FileType;

  size: number;

  url: string;

  path: string;

  folder?: string;

  bucket?: string;

  storageProvider: StorageProvider;

  status: FileStatus;

  isPublic: boolean;

  checksum?: string;

  uploadedBy?: Types.ObjectId;

  companyId?: Types.ObjectId;
  candidateId?: Types.ObjectId;

  employeeId?: Types.ObjectId;

  examId?: Types.ObjectId;

  paperId?: Types.ObjectId;

  questionId?: Types.ObjectId;

  certificateId?: Types.ObjectId;

  reportId?: Types.ObjectId;

  metadata?: Record<string, unknown>;

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

export type FileStorageDocument = HydratedDocument<IFileStorage>;
