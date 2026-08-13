import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import {
  calculateCandidateScore,
  calculateCenterScore,
  getCandidateScore,
  getCenterScore,
  getDashboard,
  getIndividualCandidateScore,
  getIndividualCenterScore,
  getIndividualExamScore,
  getHighRiskCandidates,
  recalculateTrustScore,
  getHistory,
  calculateTrustScore,
} from "./trustScore.controller";
import {
  calculateCandidateScoreSchema,
  calculateCenterScoreSchema,
  getCandidateScoreSchema,
  getCenterScoreSchema,
  calculateTrustScoreSchema,
} from "./trustScore.validation";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  getDashboard
);

router.get(
  "/history/:candidateId",
  authenticate,
  getHistory
);

router.get(
  "/high-risk-candidates",
  authenticate,
  getHighRiskCandidates
);

router.get(
  "/candidate/:candidateId",
  authenticate,
  getIndividualCandidateScore
);

router.get(
  "/center/:centerId",
  authenticate,
  getIndividualCenterScore
);

router.get(
  "/exam/:examId",
  authenticate,
  getIndividualExamScore
);

router.post(
  "/recalculate",
  authenticate,
  recalculateTrustScore
);

router.post(
  "/calculate",
  authenticate,
  validate(calculateTrustScoreSchema),
  calculateTrustScore
);

router.post(
  "/calculate/candidate",
  authenticate,
  validate(calculateCandidateScoreSchema),
  calculateCandidateScore
);

router.post(
  "/calculate/center",
  authenticate,
  validate(calculateCenterScoreSchema),
  calculateCenterScore
);

router.get(
  "/exam/:examId/candidate/:candidateId",
  authenticate,
  validate(getCandidateScoreSchema),
  getCandidateScore
);

router.get(
  "/exam/:examId/center/:centerId",
  authenticate,
  validate(getCenterScoreSchema),
  getCenterScore
);

export default router;
