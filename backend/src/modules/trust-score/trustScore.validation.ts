import { z } from "zod";

export const calculateCandidateScoreSchema = z.object({
  body: z.object({
    candidateId: z.string().min(1, "Candidate ID is required"),
    examId: z.string().min(1, "Exam ID is required"),
  }),
});

export const calculateCenterScoreSchema = z.object({
  body: z.object({
    centerId: z.string().min(1, "Center ID is required"),
    examId: z.string().min(1, "Exam ID is required"),
  }),
});

export const getCandidateScoreSchema = z.object({
  params: z.object({
    examId: z.string().min(1, "Exam ID is required"),
    candidateId: z.string().min(1, "Candidate ID is required"),
  }),
});

export const getCenterScoreSchema = z.object({
  params: z.object({
    examId: z.string().min(1, "Exam ID is required"),
    centerId: z.string().min(1, "Center ID is required"),
  }),
});

export const calculateTrustScoreSchema = z.object({
  body: z.object({
    examId: z.string().min(1, "Exam ID is required"),
    calculationType: z.string().optional(),
    includeFaceVerification: z.boolean().optional(),
    includeBiometricVerification: z.boolean().optional(),
    includeLiveMonitoring: z.boolean().optional(),
    includeGeoMonitoring: z.boolean().optional(),
    includeBrowserViolations: z.boolean().optional(),
    forceRecalculate: z.boolean().optional(),
  }),
});
