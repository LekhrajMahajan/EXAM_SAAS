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
  registerCompany,
  rejectCompany,
} from "./company.controller";

import { getCompanyUsageStats } from "./company-usage.controller";
import User from "../user/user.model";
import Center from "../center/center.model";

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

router.get("/dump", async (req, res) => {
  try {
    const users = await User.find().select("email companyId role").lean();
    const centers = await Center.find().select("centerName companyId").lean();
    res.json({ users, centers });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/*
|--------------------------------------------------------------------------
| DEBUG ROUTE
|--------------------------------------------------------------------------
*/
router.get("/debug-centers", async (req, res) => {
  try {
    const Center = require("../center/center.model").default;
    const centers = await Center.find().select("centerName companyId accessibleByCompanies").lean();
    res.json(centers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/*
|--------------------------------------------------------------------------
| Register Company (Public)
|--------------------------------------------------------------------------
*/

router.post("/register", validate(registerCompanySchema), registerCompany);

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
| Get Usage Stats
|--------------------------------------------------------------------------
*/

router.get(
  "/usage-stats",
  authenticate,
  authorize(UserRole.COMPANY_ADMIN, UserRole.MASTER_ADMIN),
  getCompanyUsageStats,
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
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
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
