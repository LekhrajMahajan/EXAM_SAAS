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
  faceDetectionEnabled: z.boolean().default(false),
  faceDetectionLimit: z.number().int().min(0).default(15),
  multipleFacesEnabled: z.boolean().default(false),
  multipleFacesLimit: z.number().int().min(0).default(15),
  proctoringWarningEnabled: z.boolean().default(false),
  proctoringWarningLimit: z.number().int().min(0).default(3),
  webcamMonitoring: z.boolean().default(false),
  screenRecording: z.boolean().default(false),
  screenSharingDetection: z.boolean().default(false),
  tabSwitchingEnabled: z.boolean().default(false),
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
  centerId: objectId.optional(),
  shiftId: objectId.optional(),
  shift: z.string().trim().optional(),
  examGroupId: z.string().trim().optional().nullable(),
  hasMultipleShifts: z.boolean().optional().default(false),
  normalizationEnabled: z.boolean().optional().default(false),
  normalizationMethod: z.enum(["PERCENTILE", "MEAN_EQUATING"]).optional().default("PERCENTILE"),
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

  cutoffType: z.enum(["MARKS", "PERCENTAGE"]).optional().default("MARKS"),

  overallQualifyingPercent: z.number().min(0).max(100).optional().nullable(),

  sectionalCutoffEnabled: z.boolean().optional().default(false),

  sectionalTimeLimitEnabled: z.boolean().optional().default(false),

  partWiseCutoffEnabled: z.boolean().optional().default(false),

  parts: z.array(z.object({
    partName: z.string().min(1, "Part name is required"),
    subjectIds: z.array(z.string()).min(1, "At least one subject is required in a part"),
    cutoffType: z.enum(["MARKS", "PERCENTAGE"]).default("MARKS"),
    cutoffValue: z.number().min(0, "Cutoff value must be at least 0"),
  })).optional(),

  categoryWiseCutoff: z.array(z.object({
    category: z.string().min(1),
    cutoffPercent: z.number().min(0).max(100)
  })).optional(),

  rankType: z.enum(["COMBINED", "CATEGORY_WISE"]).optional().default("COMBINED"),

  tieBreakRules: z.array(z.object({
    order: z.number().int().min(1),
    ruleType: z.enum([
      "HIGHER_MARKS",
      "HIGHER_PERCENTAGE",
      "MORE_CORRECT",
      "LOWER_NEGATIVE",
      "OLDER_AGE",
      "YOUNGER_AGE",
      "APPLICATION_NUMBER",
    ])
  })).optional(),

  isMultiStage: z.boolean().optional().default(false),

  stageType: z.enum(["QUALIFYING_ONLY", "SCORE_CARRIED_FORWARD"]).optional().default("SCORE_CARRIED_FORWARD"),

  stageWeightagePercent: z.number().min(0).max(100).optional().default(100),

  linkedNextExamId: objectId.optional().nullable(),

  resultDeclarationDate: z.coerce.date().optional().nullable(),

  examType: z.string().trim().optional(),

  examCategory: z.string().trim().optional(),

  examMode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]).optional().default("ONLINE"),

  language: z.string().trim().optional().default("English"),

  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional().default("MEDIUM"),

  instructions: z.string().trim().optional(),

  subjects: z.array(z.object({
    subjectId: objectId,
    name: z.string().min(1),
    questions: z.number().int().min(1),
    marksPerQuestion: z.number().min(0),
    negativeMarksPerQuestion: z.number().min(0).optional(),
    sectionalCutoff: z.number().min(0).optional().nullable(),
    timeAllottedMinutes: z.number().min(1).optional().nullable(),
  })).optional(),

  shuffleSubjects: z.boolean().default(false).optional(),

  shuffleQuestions: z.boolean().default(false).optional(),

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

    if (data.sectionalTimeLimitEnabled) {
      if (!data.subjects || data.subjects.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subjects"],
          message: "Subjects are required when sectional time limit is enabled.",
        });
      } else {
        let totalAllocatedTime = 0;
        data.subjects.forEach((subject, index) => {
          if (!subject.timeAllottedMinutes || subject.timeAllottedMinutes <= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["subjects", index, "timeAllottedMinutes"],
              message: "Time allotted is required and must be greater than 0.",
            });
          } else {
            totalAllocatedTime += subject.timeAllottedMinutes;
          }
        });

        if (totalAllocatedTime !== data.duration) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sectionalTimeLimitEnabled"], // Or on duration
            message: `Sum of subject time allocations (${totalAllocatedTime} min) does not match exam duration (${data.duration} min)`,
          });
        }
      }
    }

    if (data.partWiseCutoffEnabled) {
      if (!data.parts || data.parts.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["parts"],
          message: "At least one part is required when part-wise cutoff is enabled.",
        });
      } else {
        const seenSubjects = new Set<string>();
        for (let i = 0; i < data.parts.length; i++) {
          const part = data.parts[i];
          for (let j = 0; j < part.subjectIds.length; j++) {
            const subjectId = String(part.subjectIds[j]);
            if (seenSubjects.has(subjectId)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["parts", i, "subjectIds", j],
                message: `Duplicate subject found across parts. A subject can only belong to one part.`,
              });
            }
            seenSubjects.add(subjectId);
          }
        }
      }
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
  body: examBaseSchema.partial().strict().superRefine((data, ctx) => {
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "End time must be after start time.",
      });
    }

    if (data.passingMarks !== undefined && data.totalMarks !== undefined && data.passingMarks > data.totalMarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["passingMarks"],
        message: "Passing marks cannot be greater than total marks.",
      });
    }

    if (data.sectionalTimeLimitEnabled) {
      if (!data.subjects || data.subjects.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["subjects"],
          message: "Subjects are required when sectional time limit is enabled.",
        });
      } else if (data.duration !== undefined) {
        let totalAllocatedTime = 0;
        data.subjects.forEach((subject, index) => {
          if (!subject.timeAllottedMinutes || subject.timeAllottedMinutes <= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["subjects", index, "timeAllottedMinutes"],
              message: "Time allotted is required and must be greater than 0.",
            });
          } else {
            totalAllocatedTime += subject.timeAllottedMinutes;
          }
        });

        if (totalAllocatedTime !== data.duration && data.duration !== undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["sectionalTimeLimitEnabled"],
            message: `Sum of subject time allocations (${totalAllocatedTime} min) does not match exam duration (${data.duration} min)`,
          });
        }
      }
    }

    if (data.partWiseCutoffEnabled) {
      if (!data.parts || data.parts.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["parts"],
          message: "At least one part is required when part-wise cutoff is enabled.",
        });
      } else {
        const seenSubjects = new Set<string>();
        for (let i = 0; i < data.parts.length; i++) {
          const part = data.parts[i];
          for (let j = 0; j < part.subjectIds.length; j++) {
            const subjectId = String(part.subjectIds[j]);
            if (seenSubjects.has(subjectId)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["parts", i, "subjectIds", j],
                message: `Duplicate subject found across parts. A subject can only belong to one part.`,
              });
            }
            seenSubjects.add(subjectId);
          }
        }
      }
    }
  })
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
