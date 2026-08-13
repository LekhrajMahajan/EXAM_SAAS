import { Router } from "express";
import {
  getBranchStaffs,
  createBranchStaff,
  updateBranchStaff,
  deleteBranchStaff,
  verifyBranchStaffOtp,
} from "./branchStaff.controller";

import {
  getBranchLabs,
  createBranchLab,
  updateBranchLab,
  deleteBranchLab,
} from "./branchLab.controller";

import {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  updateBranchStatus,
  deleteBranch,
  restoreBranch,
  getBranchStatistics,
  getBranchDashboard,
  getBranchAnalytics,
  getBranchCapacity,
  getBranchAuditHistory,
  activateBranch,
  deactivateBranch,
  archiveBranch,
  bulkArchiveBranches,
  bulkDeleteBranches,
  bulkRestoreBranches,
  bulkStatusBranches,
  exportBranches,
  validateBranchImport,
  getOnboardingStatus,
  updateProfileStep,
  updateLegalDocumentsStep,
  updateVerificationStep,
  registerStaffStep,
  setupInfrastructureStep,
  updateExamReadinessStep,
  submitOnboarding,
  reviewOnboarding,
  getPendingVerifications,
  getManagerDashboard,
  getMyBranch,
} from "./branch.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { checkUsageLimit } from "../../middleware/checkUsageLimit";
import Branch from "./branch.model";

import { UserRole } from "../../constants/roles";

import {
  createBranchSchema,
  updateBranchSchema,
  updateBranchStatusSchema,
  branchIdSchema,
  branchAnalyticsSchema,
  branchQuerySchema,
  bulkOperationSchema,
  bulkStatusSchema,
  importValidationSchema,
  onboardingBranchParamSchema,
  reviewOnboardingSchema,
  stepProfileSchema,
  stepDocumentsSchema,
  stepStaffSchema,
} from "./branch.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Static Routes (MUST proceed dynamic ID routes)
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Branch Staff Roster Database Endpoints
|--------------------------------------------------------------------------
*/
router.get(
  "/staff",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getBranchStaffs,
);

router.post(
  "/staff",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  createBranchStaff,
);

router.patch(
  "/staff/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  updateBranchStaff,
);

router.delete(
  "/staff/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  deleteBranchStaff,
);

router.post(
  "/staff/:id/verify-otp",
  authenticate,
  verifyBranchStaffOtp,
);

/*
|--------------------------------------------------------------------------
| Branch Labs Database Endpoints (Collection: branchlabs)
|--------------------------------------------------------------------------
*/
router.get(
  "/labs",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getBranchLabs,
);

router.post(
  "/labs",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  createBranchLab,
);

router.patch(
  "/labs/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  updateBranchLab,
);

router.delete(
  "/labs/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  deleteBranchLab,
);

/*
|--------------------------------------------------------------------------
| Phase 5.2: Static Onboarding & Workflow Routes (MUST precede dynamic ID routes)
|--------------------------------------------------------------------------
*/
router.get(
  "/my-branch",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getMyBranch,
);

router.get(
  "/onboarding/pending-verifications",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getPendingVerifications,
);

router.get(
  "/onboarding/manager-dashboard",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  getManagerDashboard,
);

router.get(
  "/onboarding/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  getOnboardingStatus,
);

router.patch(
  "/onboarding/profile",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(stepProfileSchema),
  updateProfileStep,
);

router.patch(
  "/onboarding/documents",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(stepDocumentsSchema),
  updateLegalDocumentsStep,
);

router.patch(
  "/onboarding/verification",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  updateVerificationStep,
);

router.patch(
  "/onboarding/staff",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(stepStaffSchema),
  registerStaffStep,
);

router.patch(
  "/onboarding/infrastructure",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  setupInfrastructureStep,
);

router.patch(
  "/onboarding/readiness",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  updateExamReadinessStep,
);

router.post(
  "/onboarding/submit",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  submitOnboarding,
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/
router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getBranchStatistics,
);

/*
|--------------------------------------------------------------------------
| Dashboard API
|--------------------------------------------------------------------------
*/
router.get(
  "/dashboard",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  getBranchDashboard,
);

/*
|--------------------------------------------------------------------------
| Export Branches
|--------------------------------------------------------------------------
*/
router.get(
  "/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  exportBranches,
);

/*
|--------------------------------------------------------------------------
| Import Validation
|--------------------------------------------------------------------------
*/
router.post(
  "/import/validate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(importValidationSchema),
  validateBranchImport,
);

/*
|--------------------------------------------------------------------------
| Bulk Operations
|--------------------------------------------------------------------------
*/
router.post(
  "/bulk/archive",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(bulkOperationSchema),
  bulkArchiveBranches,
);

router.post(
  "/bulk/delete",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(bulkOperationSchema),
  bulkDeleteBranches,
);

router.post(
  "/bulk/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(bulkOperationSchema),
  bulkRestoreBranches,
);

router.post(
  "/bulk/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(bulkStatusSchema),
  bulkStatusBranches,
);

/*
|--------------------------------------------------------------------------
| Create Branch
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(createBranchSchema),
  checkUsageLimit("maxBranches", Branch),
  createBranch,
);

/*
|--------------------------------------------------------------------------
| Get All Branches
|--------------------------------------------------------------------------
*/
router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(branchQuerySchema),
  getBranches,
);

/*
|--------------------------------------------------------------------------
| Dynamic ID Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get Branch Analytics
|--------------------------------------------------------------------------
*/
router.get(
  "/:branchId/analytics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(branchAnalyticsSchema),
  getBranchAnalytics,
);

/*
|--------------------------------------------------------------------------
| Get Branch Capacity
|--------------------------------------------------------------------------
*/
router.get(
  "/:id/capacity",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(branchIdSchema),
  getBranchCapacity,
);

/*
|--------------------------------------------------------------------------
| Get Branch Audit History
|--------------------------------------------------------------------------
*/
router.get(
  "/:id/audit",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(branchIdSchema),
  getBranchAuditHistory,
);

/*
|--------------------------------------------------------------------------
| Get Branch By Id
|--------------------------------------------------------------------------
*/
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(branchIdSchema),
  getBranchById,
);

/*
|--------------------------------------------------------------------------
| Update Branch
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(updateBranchSchema),
  updateBranch,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(updateBranchStatusSchema),
  updateBranchStatus,
);

/*
|--------------------------------------------------------------------------
| Activate Branch
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/activate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(branchIdSchema),
  activateBranch,
);

/*
|--------------------------------------------------------------------------
| Deactivate Branch
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/deactivate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(branchIdSchema),
  deactivateBranch,
);

/*
|--------------------------------------------------------------------------
| Archive Branch
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/archive",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(branchIdSchema),
  archiveBranch,
);

/*
|--------------------------------------------------------------------------
| Restore Branch
|--------------------------------------------------------------------------
*/
router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(branchIdSchema),
  restoreBranch,
);

/*
|--------------------------------------------------------------------------
| Delete Branch
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(branchIdSchema),
  deleteBranch,
);

/*
|--------------------------------------------------------------------------
| Phase 5.2: Dynamic ID Onboarding & Review Routes
|--------------------------------------------------------------------------
*/
router.get(
  "/:branchId/onboarding/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(onboardingBranchParamSchema),
  getOnboardingStatus,
);

router.patch(
  "/:branchId/onboarding/profile",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(stepProfileSchema),
  updateProfileStep,
);

router.patch(
  "/:branchId/onboarding/documents",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(stepDocumentsSchema),
  updateLegalDocumentsStep,
);

router.patch(
  "/:branchId/onboarding/verification",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  updateVerificationStep,
);

router.patch(
  "/:branchId/onboarding/staff",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  validate(stepStaffSchema),
  registerStaffStep,
);

router.patch(
  "/:branchId/onboarding/infrastructure",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  setupInfrastructureStep,
);

router.patch(
  "/:branchId/onboarding/readiness",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  updateExamReadinessStep,
);

router.post(
  "/:branchId/onboarding/submit",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.BRANCH_MANAGER),
  submitOnboarding,
);

router.post(
  "/:branchId/onboarding/review",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(reviewOnboardingSchema),
  reviewOnboarding,
);

export default router;

