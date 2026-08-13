import { Router } from "express";

import {
  createFaceVerification,
  verifyFace,
  verifyLiveness,
  verifySpoof,
  retryVerification,
  completeVerification,
  getFaceVerifications,
  getFaceVerificationById,
  getFaceVerificationByCandidate,
  getFaceVerificationByExam,
  faceDashboard,
  faceStatistics,
  faceVerificationReport,
  updateFaceVerification,
  updateFaceVerificationStatus,
  deleteFaceVerification,
  restoreFaceVerification,
  verifyFaceMock,
} from "./faceVerification.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import {
  createFaceVerificationSchema,
  verifyFaceSchema,
  livenessSchema,
  spoofDetectionSchema,
  retryFaceVerificationSchema,
  updateFaceVerificationSchema,
  updateFaceVerificationStatusSchema,
  faceVerificationQuerySchema,
  faceStatisticsSchema,
  verifyFaceMockSchema,
} from "./faceVerification.validation";

import { UserRole } from "../../constants/roles";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(faceStatisticsSchema),
  faceStatistics,
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard/:examId",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.OBSERVER,
  ),
  faceDashboard,
);

/*
|--------------------------------------------------------------------------
| Report
|--------------------------------------------------------------------------
*/

router.get(
  "/report/:examId",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  faceVerificationReport,
);

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.CENTER_MANAGER),
  validate(createFaceVerificationSchema),
  createFaceVerification,
);

router.post(
  "/verify",
  authenticate,
  validate(verifyFaceMockSchema),
  verifyFaceMock,
);

/*
|--------------------------------------------------------------------------
| AI Face Match
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/verify",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.AI_PROCTOR),
  validate(verifyFaceSchema),
  verifyFace,
);

/*
|--------------------------------------------------------------------------
| Liveness
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/liveness",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.AI_PROCTOR),
  validate(livenessSchema),
  verifyLiveness,
);

/*
|--------------------------------------------------------------------------
| Spoof Detection
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/spoof",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.AI_PROCTOR),
  validate(spoofDetectionSchema),
  verifySpoof,
);

/*
|--------------------------------------------------------------------------
| Retry
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/retry",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.CENTER_MANAGER),
  validate(retryFaceVerificationSchema),
  retryVerification,
);

/*
|--------------------------------------------------------------------------
| Complete Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/complete",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.CENTER_MANAGER),
  completeVerification,
);

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.OBSERVER,
  ),
  validate(faceVerificationQuerySchema),
  getFaceVerifications,
);

/*
|--------------------------------------------------------------------------
| Get By Candidate
|--------------------------------------------------------------------------
*/

router.get(
  "/candidate/:candidateId",
  authenticate,
  getFaceVerificationByCandidate,
);

/*
|--------------------------------------------------------------------------
| Get By Exam
|--------------------------------------------------------------------------
*/

router.get(
  "/exam/:examId",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  getFaceVerificationByExam,
);

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

router.get("/:id", authenticate, getFaceVerificationById);

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  validate(updateFaceVerificationSchema),
  updateFaceVerification,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  validate(updateFaceVerificationStatusSchema),
  updateFaceVerificationStatus,
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreFaceVerification,
);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteFaceVerification,
);

export default router;
