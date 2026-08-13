import { z } from "zod";

import { FileFormat, ImportExportType } from "./importExport.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId.");

/*
|--------------------------------------------------------------------------
| Import
|--------------------------------------------------------------------------
*/

export const importSchema = z.object({
  body: z.object({
    type: z.nativeEnum(ImportExportType),

    format: z.nativeEnum(FileFormat),

    fileUrl: z.string().url(),
  }),
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export const exportSchema = z.object({
  body: z.object({
    type: z.nativeEnum(ImportExportType),

    format: z.nativeEnum(FileFormat),

    filters: z.record(z.string(), z.unknown()).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| History Id
|--------------------------------------------------------------------------
*/

export const historyIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Download
|--------------------------------------------------------------------------
*/

export const downloadSchema = historyIdSchema;

/*
|--------------------------------------------------------------------------
| Cancel Import
|--------------------------------------------------------------------------
*/

export const cancelImportSchema = historyIdSchema;

/*
|--------------------------------------------------------------------------
| Validate Import
|--------------------------------------------------------------------------
*/

export const validateImportSchema = z.object({
  body: z.object({
    type: z.nativeEnum(ImportExportType),

    format: z.nativeEnum(FileFormat),

    fileUrl: z.string().url(),
  }),
});

/*
|--------------------------------------------------------------------------
| Import History Filter
|--------------------------------------------------------------------------
*/

export const importHistorySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    type: z.nativeEnum(ImportExportType).optional(),

    format: z.nativeEnum(FileFormat).optional(),
  }),
});
