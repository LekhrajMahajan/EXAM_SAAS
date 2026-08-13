import { z } from "zod";

import { ExamApprovalStatus, ExamStatus } from "./exam.types";

/*
|--------------------------------------------------------------------------
| ObjectId
|--------------------------------------------------------------------------
*/

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Time Format (HH:MM)
|--------------------------------------------------------------------------
*/

const timeString = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");

/*
|--------------------------------------------------------------------------
| Security Settings Schema
|--------------------------------------------------------------------------
*/

const securitySettingsSchema = z.object({
  faceVerification: z.boolean().default(false),
  webcamMonitoring: z.boolean().default(false),
  screenRecording: z.boolean().default(false),
  screenSharingDetection: z.boolean().default(false),
  tabSwitchLimit: z.number().int().min(0).default(0),
  browserLock: z.boolean().default(false),
  fullScreenMode: z.boolean().default(false),
  copyPasteAllowed: z.boolean().default(false),
  rightClickDisabled: z.boolean().default(false),
  developerToolsBlocked: z.boolean().default(false),
  multipleLoginAllowed: z.boolean().default(false),
  geoFence: z.boolean().default(false),
  ipRestriction: z.boolean().default(false),
  candidateHeartbeat: z.boolean().default(false),
  autoSubmitOnViolation: z.boolean().default(false),
});

/*
|--------------------------------------------------------------------------
| Create Exam
|--------------------------------------------------------------------------
*/

const examBaseSchema = z.object({
  companyId: objectId,
  branchId: objectId.optional(),
  centerId: objectId.optional(),
  shiftId: objectId.optional(),
  subjectId: objectId.optional(),
  paperId: objectId.optional(),

  examCode: z
    .string()
    .trim()
    .min(2)
    .max(30)
    .transform((value) => value.toUpperCase()),

  examTitle: z.string().trim().min(3).max(200),

  description: z.string().trim().max(1000).optional(),

  examDate: z.coerce.date(),

  startTime: timeString,

  endTime: timeString,

  duration: z.number().int().min(1),

  totalMarks: z.number().min(0),

  passingMarks: z.number().min(0),

  negativeMarks: z.number().min(0).optional().default(0),

  examType: z.string().trim().optional(),

  examCategory: z.string().trim().optional(),

  examMode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).optional().default("ONLINE"),

  language: z.string().trim().optional().default("English"),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional().default("MEDIUM"),

  instructions: z.string().trim().optional(),

  subjects: z.array(z.object({
    name: z.string().min(1),
    questions: z.number().int().min(1),
  })).optional(),

  candidateIds: z.array(objectId).default([]),

  securitySettings: securitySettingsSchema,

  approvalStatus: z.nativeEnum(ExamApprovalStatus).optional(),

  status: z.nativeEnum(ExamStatus).optional(),
});

export const createExamSchema = z.object({
  body: examBaseSchema.superRefine((data, ctx) => {
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }

    if (data.passingMarks > data.totalMarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passingMarks"],
        message: "Passing marks cannot be greater than total marks.",
      });
    }
  })
});

/*
|--------------------------------------------------------------------------
| Update Exam
|--------------------------------------------------------------------------
*/

export const updateExamSchema = z.object({
  params: z.object({ id: objectId }),
  body: examBaseSchema.partial().strict()
});

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateExamStatusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    status: z.nativeEnum(ExamStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Update Approval
|--------------------------------------------------------------------------
*/

export const updateExamApprovalSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(ExamApprovalStatus),
  })
});

/*
|--------------------------------------------------------------------------
| Params
|--------------------------------------------------------------------------
*/

export const examIdSchema = z.object({
  params: z.object({
    id: objectId,
  })
});

/*
|--------------------------------------------------------------------------
| Query
|--------------------------------------------------------------------------
*/

export const examQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(100).default(10),

    search: z.string().trim().optional(),

    companyId: objectId.optional(),

    branchId: objectId.optional(),

    centerId: objectId.optional(),

    shiftId: objectId.optional(),

    subjectId: objectId.optional(),

    paperId: objectId.optional(),

    status: z.nativeEnum(ExamStatus).optional(),

    approvalStatus: z.nativeEnum(ExamApprovalStatus).optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Clone Exam
|--------------------------------------------------------------------------
*/

export const cloneExamSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    examTitle: z.string().trim().min(3).max(200),
    examCode: z
      .string()
      .trim()
      .min(2)
      .max(30)
      .transform((value) => value.toUpperCase()),
    examDate: z.coerce.date(),
    shiftId: objectId,
    copyCandidates: z.boolean().default(false),
    copySecuritysettings: z.boolean().default(false),
    copyPaper: z.boolean().default(false),
    status: z.nativeEnum(ExamStatus).optional(),
  }),
});

/*
|--------------------------------------------------------------------------
| Submit For Approval
|--------------------------------------------------------------------------
*/

export const submitExamForApprovalSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(ExamApprovalStatus).optional(),
    submittedBy: objectId.optional(),
    remarks: z.string().trim().max(1000).optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Approve Exam
|--------------------------------------------------------------------------
*/

export const approveExamSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(ExamApprovalStatus).optional(),
    approvedBy: objectId.optional(),
    approvalRemarks: z.string().trim().max(1000).optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Reject Exam
|--------------------------------------------------------------------------
*/

export const rejectExamSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    approvalStatus: z.nativeEnum(ExamApprovalStatus).optional(),
    rejectedBy: objectId.optional(),
    rejectionReason: z.string().trim().min(3).max(200).optional(),
    rejectionRemarks: z.string().trim().max(1000).optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Start Exam
|--------------------------------------------------------------------------
*/

export const startExamSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    startedBy: objectId,
    startRemarks: z.string().trim().max(1000).optional(),
    forceStart: z.boolean().default(false),
  })
});

/*
|--------------------------------------------------------------------------
| End Exam
|--------------------------------------------------------------------------
*/

export const endExamSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    endedBy: objectId,
    endRemarks: z.string().trim().max(1000).optional(),
    forceEnd: z.boolean().default(false),
  })
});

/*
|--------------------------------------------------------------------------
| Publish Exam Result
|--------------------------------------------------------------------------
*/

export const publishExamResultSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    publishedBy: objectId,
    publishType: z.string().trim().min(1),
    sendEmail: z.boolean().default(false),
    sendSMS: z.boolean().default(false),
    sendNotification: z.boolean().default(false),
    generateRank: z.boolean().default(false),
    generateMeritList: z.boolean().default(false),
    applyGraceMarks: z.boolean().default(false),
    publishRemarks: z.string().trim().max(1000).optional(),
  })
});
