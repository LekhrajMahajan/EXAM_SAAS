import { Router } from "express";

import {
  createBiometricVerification,
  verifyFingerprint,
  verifyIris,
  verifyFace,
  verifyLiveness,
  verifyMultiFactor,
  retryVerification,
  getBiometricVerifications,
  getBiometricVerificationById,
  getBiometricVerificationByCandidate,
  getBiometricVerificationByExam,
  biometricDashboard,
  biometricStatistics,
  biometricReport,
  updateBiometricVerification,
  updateBiometricVerificationStatus,
  deleteBiometricVerification,
  restoreBiometricVerification,
  verifyBiometricMock,
} from "./biometricVerification.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import {
  createBiometricVerificationSchema,
  verifyCandidateSchema,
  retryVerificationSchema,
  updateBiometricVerificationSchema,
  updateVerificationStatusSchema,
  biometricVerificationQuerySchema,
  biometricStatisticsSchema,
  verifyBiometricMockSchema,
} from "./biometricVerification.validation";

import { UserRole } from "../../constants/roles";
import { requireFeature } from "../../middleware/requireFeature";

const router = Router();

router.use(requireFeature("biometric"));

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
  validate(biometricStatisticsSchema),
  biometricStatistics,
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
  ),
  biometricDashboard,
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
  biometricReport,
);

/*
|--------------------------------------------------------------------------
| Create Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.CENTER_MANAGER),
  validate(createBiometricVerificationSchema),
  createBiometricVerification,
);

router.post(
  "/verify",
  authenticate,
  validate(verifyBiometricMockSchema),
  verifyBiometricMock,
);

/*
|--------------------------------------------------------------------------
| Fingerprint Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/fingerprint",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER),
  validate(verifyCandidateSchema),
  verifyFingerprint,
);

/*
|--------------------------------------------------------------------------
| Iris Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/iris",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER),
  validate(verifyCandidateSchema),
  verifyIris,
);

/*
|--------------------------------------------------------------------------
| Face Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/face",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER),
  validate(verifyCandidateSchema),
  verifyFace,
);

/*
|--------------------------------------------------------------------------
| Liveness Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/liveness",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER),
  verifyLiveness,
);

/*
|--------------------------------------------------------------------------
| Multi Factor Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/multi-factor",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER),
  verifyMultiFactor,
);

/*
|--------------------------------------------------------------------------
| Retry Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/retry",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.CENTER_MANAGER),
  validate(retryVerificationSchema),
  retryVerification,
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
  ),
  validate(biometricVerificationQuerySchema),
  getBiometricVerifications,
);

/*
|--------------------------------------------------------------------------
| Get By Candidate
|--------------------------------------------------------------------------
*/

router.get(
  "/candidate/:candidateId",
  authenticate,
  getBiometricVerificationByCandidate,
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
  getBiometricVerificationByExam,
);

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

router.get("/:id", authenticate, getBiometricVerificationById);

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  validate(updateBiometricVerificationSchema),
  updateBiometricVerification,
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
  validate(updateVerificationStatusSchema),
  updateBiometricVerificationStatus,
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
  restoreBiometricVerification,
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
  deleteBiometricVerification,
);

export default router;
