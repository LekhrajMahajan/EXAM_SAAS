import { z } from "zod";
import { ChapterStatus } from "./chapter.types";

/*
|--------------------------------------------------------------------------
| Mongo ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Chapter
|--------------------------------------------------------------------------
*/

const baseChapterSchema = z.object({
  companyId: objectId,

  subjectId: objectId,

  chapterCode: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .transform((value) => value.toUpperCase()),

  chapterName: z.string().trim().min(2).max(150),

  chapterNumber: z.number().int().min(1),

  description: z.string().trim().max(1000).optional(),

  estimatedQuestions: z.number().int().min(0),

  estimatedMarks: z.number().min(0),

  displayOrder: z.number().int().min(1),

  status: z.nativeEnum(ChapterStatus).optional(),
});

const chapterPreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };
    
    if (data.chapterOrder !== undefined && data.chapterNumber === undefined) {
      data.chapterNumber = data.chapterOrder;
    }
    if (data.chapterOrder !== undefined && data.displayOrder === undefined) {
      data.displayOrder = data.chapterOrder;
    }
    if (data.estimatedQuestions === undefined) {
      data.estimatedQuestions = 0;
    }
    if (data.estimatedMarks === undefined) {
      data.estimatedMarks = 0;
    }
    
    return data;
  }
  return val;
};

export const createChapterSchema = z.object({
  body: z.preprocess(chapterPreprocess, baseChapterSchema),
});

/*
|--------------------------------------------------------------------------
| Update Chapter
|--------------------------------------------------------------------------
*/

export const updateChapterSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess(chapterPreprocess, baseChapterSchema.partial()),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateChapterStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(ChapterStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const chapterIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const chapterQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    companyId: objectId.optional(),
    subjectId: objectId.optional(),
    status: z.nativeEnum(ChapterStatus).optional(),
  }),
});
