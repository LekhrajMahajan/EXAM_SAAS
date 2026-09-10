import { z } from "zod";

const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/*
|--------------------------------------------------------------------------
| Candidate Exam Login
|--------------------------------------------------------------------------
*/

export const candidateExamLoginSchema = z.object({
  body: z.object({
    applicationNo: z.string().trim().min(1),
    dateOfBirth: z.string().trim().min(1),
    deviceId: z.string().optional(),
    browser: z.string().optional(),
    operatingSystem: z.string().optional(),
    ipAddress: z.string().optional(),
    loginLatitude: z.number().optional(),
    loginLongitude: z.number().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Face Verification
|--------------------------------------------------------------------------
*/

export const faceVerificationSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    capturedImage: z.string().min(1),
    livenessScore: z.number().min(0).max(100).optional(),
    deviceId: z.string().optional(),
    verificationTime: z.string().datetime().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Device Registration
|--------------------------------------------------------------------------
*/

export const deviceRegistrationSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    deviceId: z.string().min(1),
    deviceName: z.string().optional(),
    deviceType: z.string().optional(),
    browser: z.object({
      name: z.string(),
      version: z.string()
    }).optional(),
    operatingSystem: z.object({
      name: z.string(),
      version: z.string()
    }).optional(),
    screenResolution: z.string().optional(),
    webcamAvailable: z.boolean().optional(),
    microphoneAvailable: z.boolean().optional(),
    internetSpeed: z.number().optional(),
    fingerprint: z.string().optional(),
    registeredAt: z.string().datetime().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Geo Verification
|--------------------------------------------------------------------------
*/

export const geoVerificationSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId.optional(),
    latitude: z.number(),
    longitude: z.number(),
    accuracy: z.number().optional(),
    ipAddress: z.string().optional(),
    deviceId: z.string().optional(),
    isVpnDetected: z.boolean().optional(),
    isMockLocation: z.boolean().optional(),
    verifiedAt: z.string().datetime().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Start Exam
|--------------------------------------------------------------------------
*/

export const startExamSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    deviceId: z.string().optional(),
    browser: z.string().optional(),
    startTime: z.string().datetime().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Get Questions
|--------------------------------------------------------------------------
*/

export const getQuestionsSchema = z.object({
  query: z.object({
    questionNo: z.string().optional(),
    sessionId: z.string().optional(),
    examId: z.string().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Save Answer
|--------------------------------------------------------------------------
*/

export const saveAnswerSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    questionId: objectId,
    questionNumber: z.number().int().min(1),
    selectedOption: z.string().nullable(),
    answerStatus: z.string(),
    savedAt: z.string().datetime().optional(),
    autoSaved: z.boolean().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Mark For Review
|--------------------------------------------------------------------------
*/

export const markForReviewSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    questionId: objectId,
    questionNumber: z.number().int().min(1),
    markForReview: z.boolean(),
    selectedOption: z.string().nullable().optional(),
    reviewedAt: z.string().datetime().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Clear Response
|--------------------------------------------------------------------------
*/

export const clearResponseSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    questionId: objectId,
    questionNumber: z.number().int().min(1),
    clearReviewFlag: z.boolean().optional(),
    clearedAt: z.string().datetime().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Save & Next
|--------------------------------------------------------------------------
*/

export const saveNextSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    currentQuestionId: objectId,
    currentQuestionNumber: z.number().int().min(1),
    selectedOption: z.string().nullable().optional(),
    autoSaved: z.boolean().optional(),
    savedAt: z.string().datetime().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Previous Question
|--------------------------------------------------------------------------
*/

export const previousQuestionSchema = z.object({
  query: z.object({
    sessionId: z.string().optional(),
    currentQuestionNumber: z.string().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Submit Exam
|--------------------------------------------------------------------------
*/

export const submitExamSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    submitType: z.string().optional(),
    confirmation: z.boolean().optional(),
    submittedAt: z.string().datetime().optional(),
    answers: z.any().optional(),
    statuses: z.any().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Auto Submit Exam
|--------------------------------------------------------------------------
*/

export const autoSubmitExamSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    submitReason: z.string().optional(),
    triggeredBy: z.string().optional(),
    submittedAt: z.string().datetime().optional(),
    answers: z.any().optional(),
    statuses: z.any().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Result Preview
|--------------------------------------------------------------------------
*/

export const resultPreviewSchema = z.object({
  query: z.object({
    sessionId: z.string().optional(),
    candidateId: objectId.optional(),
    examId: objectId.optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Violation Logs
|--------------------------------------------------------------------------
*/

export const violationLogsSchema = z.object({
  query: z.object({
    sessionId: z.string().optional(),
    candidateId: objectId.optional(),
    examId: objectId.optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Session Heartbeat
|--------------------------------------------------------------------------
*/

export const sessionHeartbeatSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    deviceId: z.string().optional(),
    heartbeatAt: z.string().datetime().optional(),
    remainingTime: z.number().int().optional(),
    networkLatency: z.number().optional(),
    fullscreen: z.boolean().optional(),
    webcamActive: z.boolean().optional(),
    microphoneActive: z.boolean().optional(),
    faceDetected: z.boolean().optional(),
    tabActive: z.boolean().optional(),
    internetConnected: z.boolean().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Reconnect Session
|--------------------------------------------------------------------------
*/

export const reconnectSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1),
    candidateId: objectId,
    examId: objectId,
    deviceId: z.string().optional(),
    browser: z.string().optional(),
    ipAddress: z.string().optional(),
    reconnectReason: z.string().optional(),
    reconnectedAt: z.string().datetime().optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Exam Summary
|--------------------------------------------------------------------------
*/

export const examSummarySchema = z.object({
  query: z.object({
    sessionId: z.string().optional(),
    candidateId: objectId.optional(),
    examId: objectId.optional(),
  })
});

/*
|--------------------------------------------------------------------------
| Candidate Final Result
|--------------------------------------------------------------------------
*/

export const finalResultSchema = z.object({
  query: z.object({
    sessionId: z.string().optional(),
    candidateId: objectId.optional(),
    examId: objectId.optional(),
  })
});
