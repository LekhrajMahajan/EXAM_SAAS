import { Router } from "express";

import {
  createEmployee,
  inviteEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
  updateEmployeeStatus,
  assignEmployeeRole,
  getEmployeeStatistics,
  resetEmployeePassword,
  getEmployeeLoginHistory,
  getEmployeeActivity,
  completeProfile,
  uploadDocuments,
  faceEnrollment,
  submitVerification,
  approveVerification,
  rejectVerification,
  getEmployeeDashboard,
  transferEmployee,
  getEmployeeDevices,
  logoutEmployeeDevices,
  bulkEmployeeOperation,
  exportEmployees,
} from "./employee.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
  updateEmployeeStatusSchema,
  assignEmployeeRoleSchema,
  inviteEmployeeSchema,
  completeProfileSchema,
  uploadDocumentsSchema,
  faceEnrollmentSchema,
  approveVerificationSchema,
  rejectVerificationSchema,
  transferEmployeeSchema,
  bulkOperationSchema,
} from "./employee.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| STATIC & ADMINISTRATIVE ROUTES (Must precede /:id routes)
|--------------------------------------------------------------------------
*/

// Statistics Report
router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getEmployeeStatistics,
);

// Export Employee Reports
router.get(
  "/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  exportEmployees,
);

// Bulk Operations (Verify, Suspend, Activate, Archive, Reset Password)
router.post(
  "/bulk-action",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(bulkOperationSchema),
  bulkEmployeeOperation,
);

// Invite / Automated Onboarding
router.post(
  "/invite",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(inviteEmployeeSchema),
  inviteEmployee,
);

router.post(
  "/create",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(createEmployeeSchema),
  createEmployee,
);

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(createEmployeeSchema),
  createEmployee,
);

// Admin Approval & Rejection of Statutory Verification
router.post(
  "/approve-verification",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(approveVerificationSchema),
  approveVerification,
);

router.post(
  "/reject-verification",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  rejectVerification,
);

/*
|--------------------------------------------------------------------------
| SELF-SERVICE ONBOARDING, BIOMETRICS & DASHBOARD UNLOCK (For current Logged In Employee)
|--------------------------------------------------------------------------
*/

router.patch(
  "/complete-profile",
  authenticate,
  validate(completeProfileSchema),
  completeProfile,
);

router.post(
  "/upload-documents",
  authenticate,
  validate(uploadDocumentsSchema),
  uploadDocuments,
);

router.post(
  "/face-enrollment",
  authenticate,
  validate(faceEnrollmentSchema),
  faceEnrollment,
);

router.post(
  "/submit-verification",
  authenticate,
  submitVerification,
);

router.get(
  "/dashboard",
  authenticate,
  getEmployeeDashboard,
);

router.get(
  "/devices",
  authenticate,
  getEmployeeDevices,
);

router.post(
  "/logout-devices",
  authenticate,
  logoutEmployeeDevices,
);

/*
|--------------------------------------------------------------------------
| GENERAL LISTING
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  getEmployees,
);

/*
|--------------------------------------------------------------------------
| DYNAMIC ID-BASED ROUTES & ADMIN OVERRIDES
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  getEmployeeById,
);

router.patch(
  "/:id/complete-profile",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(completeProfileSchema),
  completeProfile,
);

router.post(
  "/:id/upload-documents",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(uploadDocumentsSchema),
  uploadDocuments,
);

router.post(
  "/:id/face-enrollment",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(faceEnrollmentSchema),
  faceEnrollment,
);

router.post(
  "/:id/submit-verification",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  submitVerification,
);

router.patch(
  "/:id/approve-verification",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  approveVerification,
);

router.patch(
  "/:id/reject-verification",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(rejectVerificationSchema),
  rejectVerification,
);

router.patch(
  "/:id/transfer",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(transferEmployeeSchema),
  transferEmployee,
);

router.get(
  "/:id/dashboard",
  authenticate,
  getEmployeeDashboard,
);

router.get(
  "/:id/devices",
  authenticate,
  getEmployeeDevices,
);

router.post(
  "/:id/logout-devices",
  authenticate,
  logoutEmployeeDevices,
);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(updateEmployeeSchema),
  updateEmployee,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(updateEmployeeStatusSchema),
  updateEmployeeStatus,
);

router.patch(
  "/:id/reset-password",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  resetEmployeePassword,
);

router.patch(
  "/:id/assign-role",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(assignEmployeeRoleSchema),
  assignEmployeeRole,
);

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  restoreEmployee,
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  deleteEmployee,
);

router.get(
  "/:id/login-history",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getEmployeeLoginHistory,
);

router.get(
  "/:id/activity",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getEmployeeActivity,
);

export default router;
