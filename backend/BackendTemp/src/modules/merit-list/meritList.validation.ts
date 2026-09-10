import { z } from "zod";

import { MeritStatus } from "./meritList.types";

/*
|--------------------------------------------------------------------------
| Common ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Merit List
|--------------------------------------------------------------------------
*/

export const createMeritListSchema = z.object({
  body: z.object({
    examId: objectId,

    resultId: objectId,

    certificateId: objectId,

    candidateId: objectId,

    companyId: objectId,

    examCenterId: objectId,

    subjectId: objectId,

    category: z.string().min(1).max(100),

    gender: z.string().min(1).max(20),

    remarks: z.string().max(1000).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Merit List Id
|--------------------------------------------------------------------------
*/

export const meritListIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Generate Merit List
|--------------------------------------------------------------------------
*/

export const generateMeritListSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Publish Merit List
|--------------------------------------------------------------------------
*/

export const publishMeritListSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Cancel Merit List
|--------------------------------------------------------------------------
*/

export const cancelMeritListSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    remarks: z.string().min(5).max(1000),
  }),
});

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreMeritListSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteMeritListSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Merit Query
|--------------------------------------------------------------------------
*/

export const meritListQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    examId: objectId.optional(),

    candidateId: objectId.optional(),

    companyId: objectId.optional(),

    examCenterId: objectId.optional(),

    subjectId: objectId.optional(),

    meritStatus: z.nativeEnum(MeritStatus).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboardSchema = z.object({
  query: z.object({
    examId: objectId.optional(),

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
    examId: objectId.optional(),

    companyId: objectId.optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Candidate Merit
|--------------------------------------------------------------------------
*/

export const candidateMeritSchema = z.object({
  params: z.object({
    candidateId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Exam Merit
|--------------------------------------------------------------------------
*/

export const examMeritSchema = z.object({
  params: z.object({
    examId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Top N
|--------------------------------------------------------------------------
*/

export const topListSchema = z.object({
  query: z.object({
    examId: objectId,

    limit: z.coerce.number().min(1).max(100).default(10),
  }),
});
