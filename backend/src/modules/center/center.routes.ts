import { Router } from "express";

import {
  createCenter,
  sendCredentialsEmail,
  testSmtpEmail,
  testDb,
  testValidation,
  testCreateMock,
  getCenters,
  getCenterById,
  updateCenter,
  updateCenterStatus,
  deleteCenter,
  restoreCenter,
  getCenterStatistics,
  startOnboarding,
  saveOnboardingAgreement,
  saveOnboardingProfile,
  saveOnboardingDocuments,
  saveOnboardingStaff,
  saveOnboardingInfrastructure,
  saveOnboardingShiftPlanning,
  saveOnboardingCompliance,
  submitOnboarding,
  getOnboardingStatus,
  getCenterDashboard,
  getCenterReadiness,
  getCenterCompliance,
  getCommercialAgreement,
  getPendingVerifications,
  approveDocument,
  rejectDocument,
  verifyCenterSetup,
  uploadMou,
} from "./center.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { checkUsageLimit } from "../../middleware/checkUsageLimit";
import Center from "./center.model";
import { UserRole } from "../../constants/roles";

import {
  createCenterSchema,
  updateCenterSchema,
  updateCenterStatusSchema,
  saveOnboardingStepSchema,
  verifyDocumentSchema,
  verifyCenterSetupSchema,
} from "./center.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics & Pending Verifications
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  getCenterStatistics,
);

// SMTP Test Route (no auth needed for debugging)
router.get("/test-email", testSmtpEmail);
router.get("/test-db", testDb);
router.get("/test-validation", testValidation);
router.get("/test-create-mock", testCreateMock);




router.get(
  "/pending-verifications",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  getPendingVerifications,
);

/*
|--------------------------------------------------------------------------
| Center Dashboard Analytics & Operations (Phase 5.3)
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getCenterDashboard,
);

router.get(
  "/readiness",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getCenterReadiness,
);

router.get(
  "/compliance",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getCenterCompliance,
);

router.get(
  "/commercial-agreement",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getCommercialAgreement,
);

/*
|--------------------------------------------------------------------------
| Center Manager Onboarding Wizard Routes (Phase 5.3)
|--------------------------------------------------------------------------
*/

router.post(
  "/onboarding/start",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  startOnboarding,
);

router.get(
  "/onboarding/status",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  getOnboardingStatus,
);

router.put(
  "/onboarding/agreement",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(saveOnboardingStepSchema),
  saveOnboardingAgreement,
);

router.put(
  "/onboarding/profile",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(saveOnboardingStepSchema),
  saveOnboardingProfile,
);

router.put(
  "/onboarding/documents",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(saveOnboardingStepSchema),
  saveOnboardingDocuments,
);

router.put(
  "/onboarding/staff",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(saveOnboardingStepSchema),
  saveOnboardingStaff,
);

router.put(
  "/onboarding/infrastructure",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(saveOnboardingStepSchema),
  saveOnboardingInfrastructure,
);

router.put(
  "/onboarding/shift-planning",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(saveOnboardingStepSchema),
  saveOnboardingShiftPlanning,
);

router.put(
  "/onboarding/compliance",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(saveOnboardingStepSchema),
  saveOnboardingCompliance,
);

router.post(
  "/onboarding/submit",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  submitOnboarding,
);

/*
|--------------------------------------------------------------------------
| Document Approval Workflow & Center Verification (Company Admin)
|--------------------------------------------------------------------------
*/

router.patch(
  "/documents/:id/approve",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  approveDocument,
);

router.patch(
  "/documents/:id/reject",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(verifyDocumentSchema),
  rejectDocument,
);

router.patch(
  "/:id/verify",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(verifyCenterSetupSchema),
  verifyCenterSetup,
);

/*
|--------------------------------------------------------------------------
| Center Staff Management (Dynamic Phase)
|--------------------------------------------------------------------------
*/
import {
  getCenterStaffs,
  createCenterStaff,
  updateCenterStaff,
  deleteCenterStaff,
  verifyCenterStaffOtp
} from "./centerStaff.controller";

import {
  getCenterLabs,
  createCenterLab,
  updateCenterLab,
  deleteCenterLab
} from "./centerLab.controller";

router.get(
  "/staff/all",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getCenterStaffs,
);

router.post(
  "/staff/create",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  createCenterStaff,
);

router.put(
  "/staff/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  updateCenterStaff,
);

router.delete(
  "/staff/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  deleteCenterStaff,
);

router.patch(
  "/staff/:id/verify-otp",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  verifyCenterStaffOtp,
);

/*
|--------------------------------------------------------------------------
| Center Lab Routes (Phase 5.4)
|--------------------------------------------------------------------------
*/

router.get(
  "/labs",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getCenterLabs,
);

router.post(
  "/labs",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  createCenterLab,
);

router.put(
  "/labs/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  updateCenterLab,
);

router.delete(
  "/labs/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  deleteCenterLab,
);

/*
|--------------------------------------------------------------------------
| Center Infrastructure Routes (Dynamic Phase)
|--------------------------------------------------------------------------
*/
import { CenterInfrastructureController } from "./centerInfrastructure.controller";
import { CenterPhotoController } from "./centerPhoto.controller";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.get(
  "/infrastructure",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  CenterInfrastructureController.getInfrastructure,
);

router.post(
  "/infrastructure",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  CenterInfrastructureController.saveInfrastructure,
);

/*
|--------------------------------------------------------------------------
| Center Photos Routes
|--------------------------------------------------------------------------
*/


router.get(
  "/photos",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  CenterPhotoController.getPhotos,
);

router.post(
  "/photos",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  CenterPhotoController.updatePhoto,
);

router.post(
  "/photos/upload",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  upload.single('file'),
  CenterPhotoController.uploadPhoto,
);

router.post(
  "/mou/upload",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  upload.single('file'),
  uploadMou,
);

/*
|--------------------------------------------------------------------------
| Center Location Routes
|--------------------------------------------------------------------------
*/
import { CenterLocationController } from "./centerLocation.controller";

router.get(
  "/location",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  CenterLocationController.getLocation,
);

router.patch(
  "/location",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  CenterLocationController.updateLocation,
);

/*
|--------------------------------------------------------------------------
| Standard CRUD Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(createCenterSchema),
  checkUsageLimit("maxCenters", Center),
  createCenter,
);

router.post(
  "/send-credentials",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  sendCredentialsEmail,
);

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getCenters,
);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER, UserRole.ENTRY_CHECKER),
  getCenterById,
);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(updateCenterSchema),
  updateCenter,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(updateCenterStatusSchema),
  updateCenterStatus,
);

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreCenter,
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteCenter,
);

export default router;
