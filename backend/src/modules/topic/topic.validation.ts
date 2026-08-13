import { z } from "zod";
import { TopicStatus } from "./topic.types";

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
| Create Topic
|--------------------------------------------------------------------------
*/

const baseTopicSchema = z.object({
  companyId: objectId,

  subjectId: objectId.optional(),
  subjectName: z.string().trim().optional(),

  chapterId: objectId.optional(),

  topicCode: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .transform((value) => value.toUpperCase()),

  topicName: z.string().trim().min(2).max(150),

  topicNumber: z.number().int().min(1),

  description: z.string().trim().max(1000).optional(),

  estimatedQuestions: z.number().int().min(0),

  estimatedMarks: z.number().min(0),

  displayOrder: z.number().int().min(1),

  estimatedDuration: z.number().min(0).optional(),

  difficultyLevel: z.string().trim().optional(),

  status: z.nativeEnum(TopicStatus).optional(),
});

const topicPreprocess = (val: any) => {
  if (val && typeof val === "object") {
    const data = { ...val };
    if (data.topicOrder !== undefined && data.topicNumber === undefined) {
      data.topicNumber = data.topicOrder;
    }
    if (data.topicOrder !== undefined && data.displayOrder === undefined) {
      data.displayOrder = data.topicOrder;
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

export const createTopicSchema = z.object({
  body: z.preprocess(topicPreprocess, baseTopicSchema),
});

/*
|--------------------------------------------------------------------------
| Update Topic
|--------------------------------------------------------------------------
*/

export const updateTopicSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.preprocess(topicPreprocess, baseTopicSchema.partial()),
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateTopicStatusSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    status: z.nativeEnum(TopicStatus),
  }),
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const topicIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const topicQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().trim().optional(),
    companyId: objectId.optional(),
    subjectId: objectId.optional(),
    chapterId: objectId.optional(),
    status: z.nativeEnum(TopicStatus).optional(),
  }),
});
