import { z } from "zod";

import { QueueType } from "./queue.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Job Options
|--------------------------------------------------------------------------
*/

const jobOptionsSchema = z.object({
  delay: z.number().min(0).optional(),

  priority: z.number().min(1).optional(),

  attempts: z.number().min(1).max(20).optional(),

  removeOnComplete: z.boolean().optional(),

  removeOnFail: z.boolean().optional(),

  backoff: z
    .object({
      type: z.enum(["fixed", "exponential"]),

      delay: z.number().min(0),
    })
    .optional(),
});

/*
|--------------------------------------------------------------------------
| Create Job
|--------------------------------------------------------------------------
*/

export const createJobSchema = z.object({
  body: z.object({
    queue: z.nativeEnum(QueueType),

    name: z.string().min(1).max(255),

    data: z.record(z.string(), z.any()),

    options: jobOptionsSchema.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Email Job
|--------------------------------------------------------------------------
*/

export const emailJobSchema = z.object({
  body: z.object({
    to: z.union([z.string().email(), z.array(z.string().email())]),

    subject: z.string().min(1),

    html: z.string().min(1),

    text: z.string().optional(),

    options: jobOptionsSchema.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| PDF Job
|--------------------------------------------------------------------------
*/

export const pdfJobSchema = z.object({
  body: z.object({
    type: z.string().min(1),

    payload: z.record(z.string(), z.any()),

    options: jobOptionsSchema.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Report Job
|--------------------------------------------------------------------------
*/

export const reportJobSchema = z.object({
  body: z.object({
    reportType: z.string().min(1),

    payload: z.record(z.string(), z.any()),

    options: jobOptionsSchema.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Job Id
|--------------------------------------------------------------------------
*/

export const jobIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Retry Job
|--------------------------------------------------------------------------
*/

export const retryJobSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Remove Job
|--------------------------------------------------------------------------
*/

export const removeJobSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});
