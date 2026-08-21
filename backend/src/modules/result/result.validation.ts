import { z } from "zod";

import { ResultStatus, PassStatus } from "./result.types";

/*
|--------------------------------------------------------------------------
| Common Validator
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Create Result
|--------------------------------------------------------------------------
*/

export const createResultSchema = z.object({
  body: z.object({
    candidateId: objectId,

    examId: objectId,

    paperId: objectId.optional(),

    centerId: objectId.optional(),

    shiftId: objectId.optional(),

    attendanceId: objectId.optional(),

    submissionId: objectId.optional(),

    candidateAssignmentId: objectId.optional(),

    subjectId: objectId.optional(),

    companyId: objectId.optional(),

    examCenterId: objectId.optional(),

    examRoomId: objectId.optional(),

    totalMarks: z.number().positive().optional(),

    passingMarks: z.number().positive().optional(),
    
    obtainedMarks: z.number().optional(),
    
    percentage: z.number().optional(),
    
    correctAnswers: z.number().optional(),
    
    wrongAnswers: z.number().optional(),
    
    unanswered: z.number().optional(),
    
    negativeMarks: z.number().optional(),
    
    rank: z.number().optional(),
    
    grade: z.string().optional(),
    
    trustScore: z.number().optional(),
    
    resultStatus: z.string().optional(),
    
    evaluationStatus: z.string().optional(),
    
    remarks: z.string().optional()
  }),
});

/*
|--------------------------------------------------------------------------
| Generate Results
|--------------------------------------------------------------------------
*/

export const generateResultSchema = z.object({
  body: z.object({
    examId: objectId,
    generateFor: z.string().optional(),
    forceRegenerate: z.boolean().optional(),
    publishAfterGeneration: z.boolean().optional(),
    includeTrustScore: z.boolean().optional(),
    negativeMarking: z.boolean().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Bulk Publish Results
|--------------------------------------------------------------------------
*/

export const bulkPublishResultSchema = z.object({
  body: z.object({
    examId: objectId,
    publishType: z.string().optional(),
    candidateIds: z.array(z.string()).optional(),
    sendNotification: z.boolean().optional(),
    publishAt: z.string().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Result Id
|--------------------------------------------------------------------------
*/

export const resultIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Publish Result
|--------------------------------------------------------------------------
*/

export const publishResultSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Approve Result
|--------------------------------------------------------------------------
*/

export const approveResultSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Reject Result
|--------------------------------------------------------------------------
*/

export const rejectResultSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    remarks: z

      .string()

      .min(5)

      .max(1000),
  }),
});

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreResultSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteResultSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Candidate Result
|--------------------------------------------------------------------------
*/

export const candidateResultSchema = z.object({
  params: z.object({
    candidateId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Exam Result
|--------------------------------------------------------------------------
*/

export const examResultSchema = z.object({
  params: z.object({
    examId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const resultQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    examId: objectId.optional(),

    candidateId: objectId.optional(),

    paperId: objectId.optional(),

    subjectId: objectId.optional(),

    companyId: objectId.optional(),

    examCenterId: objectId.optional(),

    examRoomId: objectId.optional(),

    centerId: objectId.optional(),

    shiftId: objectId.optional(),

    status: z.string().optional(),

    search: z.string().optional(),

    sortBy: z.string().optional(),

    sortOrder: z.string().optional(),

    passStatus: z.string().optional(),

    resultStatus: z.string().optional(),
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
  }),
});

/*
|--------------------------------------------------------------------------
| Merit List
|--------------------------------------------------------------------------
*/

export const meritListSchema = z.object({
  query: z.object({
    examId: objectId,

    limit: z.coerce.number().min(1).max(500).default(100),
  }),
});

/*
|--------------------------------------------------------------------------
| Topper
|--------------------------------------------------------------------------
*/

export const topperSchema = z.object({
  params: z.object({
    examId: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Pass Percentage
|--------------------------------------------------------------------------
*/

export const passPercentageSchema = z.object({
  params: z.object({
    examId: objectId,
  }),
});
