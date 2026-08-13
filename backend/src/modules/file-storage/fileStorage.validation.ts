import { z } from "zod";

import { FileStatus, FileType, StorageProvider } from "./fileStorage.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Upload File
|--------------------------------------------------------------------------
*/

export const uploadFileSchema = z.object({
  body: z.object({
    originalName: z.string().min(1).max(500),

    fileName: z.string().min(1).max(500),

    extension: z.string().min(1).max(20),

    mimeType: z.string().min(1).max(100),

    fileType: z.nativeEnum(FileType),

    size: z.number().positive(),

    url: z.string().url(),

    path: z.string().min(1),

    folder: z.string().optional(),

    bucket: z.string().optional(),

    storageProvider: z.nativeEnum(StorageProvider).optional(),

    status: z.nativeEnum(FileStatus).optional(),

    isPublic: z.boolean().optional(),

    checksum: z.string().optional(),

    companyId: objectId.optional(),

    branchId: objectId.optional(),

    candidateId: objectId.optional(),

    employeeId: objectId.optional(),

    examId: objectId.optional(),

    paperId: objectId.optional(),

    questionId: objectId.optional(),

    certificateId: objectId.optional(),

    reportId: objectId.optional(),

    metadata: z.record(z.string(), z.any()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Bulk Upload
|--------------------------------------------------------------------------
*/

export const bulkUploadSchema = z.object({
  body: z.object({
    files: z.array(uploadFileSchema.shape.body).min(1),
  }),
});

/*
|--------------------------------------------------------------------------
| File Id
|--------------------------------------------------------------------------
*/

export const fileStorageIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Download
|--------------------------------------------------------------------------
*/

export const downloadFileSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Preview
|--------------------------------------------------------------------------
*/

export const previewFileSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreFileSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteFileSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const fileStorageQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    companyId: objectId.optional(),

    candidateId: objectId.optional(),

    employeeId: objectId.optional(),

    examId: objectId.optional(),

    paperId: objectId.optional(),

    questionId: objectId.optional(),

    certificateId: objectId.optional(),

    reportId: objectId.optional(),

    fileType: z.nativeEnum(FileType).optional(),

    storageProvider: z.nativeEnum(StorageProvider).optional(),

    status: z.nativeEnum(FileStatus).optional(),

    isPublic: z.coerce.boolean().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboardSchema = z.object({
  query: z.object({
    companyId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statisticsSchema = z.object({
  query: z.object({
    companyId: objectId.optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),
  }),
});
