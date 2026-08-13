import { z } from "zod";

import { SubmissionStatus } from "./examSubmission.types";

/*
|--------------------------------------------------------------------------
| Common Validators
|--------------------------------------------------------------------------
*/

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Start Exam
|--------------------------------------------------------------------------
*/

export const startExamSchema = z.object({
  body: z.object({
    attendanceId: objectId,

    candidateId: objectId,

    candidateAssignmentId: objectId,

    examId: objectId,

    paperId: objectId,

    subjectId: objectId,

    companyId: objectId,

    branchId: objectId,

    examCenterId: objectId,

    examRoomId: objectId,

    totalQuestions: z.number().int().positive(),

    totalTime: z.number().positive(),

    browserInfo: z.string().optional(),

    ipAddress: z.string().optional(),

    deviceInfo: z.string().optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Resume Exam
|--------------------------------------------------------------------------
*/

export const resumeExamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Pause Exam
|--------------------------------------------------------------------------
*/

export const pauseExamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Submit Exam
|--------------------------------------------------------------------------
*/

export const submitExamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Auto Submit
|--------------------------------------------------------------------------
*/

export const autoSubmitSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Heartbeat
|--------------------------------------------------------------------------
*/

export const heartbeatSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Update Remaining Time
|--------------------------------------------------------------------------
*/

export const updateRemainingTimeSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z.object({
    remainingTime: z.number().min(0),
  }),
});

/*
|--------------------------------------------------------------------------
| Submission Id
|--------------------------------------------------------------------------
*/

export const submissionIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const submissionQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(20),

    candidateId: objectId.optional(),

    examId: objectId.optional(),

    paperId: objectId.optional(),

    companyId: objectId.optional(),

    branchId: objectId.optional(),

    examCenterId: objectId.optional(),

    submissionStatus: z.nativeEnum(SubmissionStatus).optional(),
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

    branchId: objectId.optional(),
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
