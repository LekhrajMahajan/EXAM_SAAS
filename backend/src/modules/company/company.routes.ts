import { Router } from "express";

import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  updateSubscription,
  deleteCompany,
  restoreCompany,
  updateCompanyStatus,
  getCompanyStatistics,
  verifyPayment,
  getApprovalStatistics,
  assignReviewer,
  approveCompany,
  rejectCompany,
  registerCompany,
} from "./company.controller";

import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

import { UserRole } from "../../constants/roles";

import {
  createCompanySchema,
  updateCompanySchema,
  updateCompanyStatusSchema,
  updateSubscriptionSchema,
  registerCompanySchema,
} from "./company.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Register Company (Public)
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  validate(registerCompanySchema),
  registerCompany,
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getCompanyStatistics,
);

router.get(
  "/approvals/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getApprovalStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Company
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(createCompanySchema),
  createCompany,
);

/*
|--------------------------------------------------------------------------
| Get Companies
|--------------------------------------------------------------------------
*/

router.get("/", authenticate, authorize(UserRole.MASTER_ADMIN), getCompanies);

/*
|--------------------------------------------------------------------------
| Get Company By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getCompanyById,
);

/*
|--------------------------------------------------------------------------
| Update Company
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(updateCompanySchema),
  updateCompany,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(updateCompanyStatusSchema),
  updateCompanyStatus,
);

/*
|--------------------------------------------------------------------------
| Update Subscription
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/subscription",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(updateSubscriptionSchema),
  updateSubscription,
);

/*
|--------------------------------------------------------------------------
| Verify Payment
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/verify-payment",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  verifyPayment,
);

/*
|--------------------------------------------------------------------------
| Approval Actions
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/assign-reviewer",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  assignReviewer,
);

router.post(
  "/:id/approve",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  approveCompany,
);

router.post(
  "/:id/reject",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  rejectCompany,
);

/*
|--------------------------------------------------------------------------
| Restore Company
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreCompany,
);

/*
|--------------------------------------------------------------------------
| Delete Company
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteCompany,
);

export default router;
