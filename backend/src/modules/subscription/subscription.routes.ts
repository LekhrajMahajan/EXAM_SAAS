import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../constants/roles";
import {
  assignSubscription,
  getDashboardStats,
  getSubscriptionDetails,
  listSubscriptions,
  renewSubscription,
  upgradeSubscription,
  downgradeSubscription,
  suspendSubscription,
  resumeSubscription,
  cancelSubscription,
  initiatePurchase,
  verifyPurchase,
} from "./subscription.controller";
import {
  assignSubscriptionSchema,
  renewSubscriptionSchema,
  changeSubscriptionSchema,
  statusChangeSchema,
  subscriptionQuerySchema,
} from "./subscription.validation";

const router = Router();

router.use(authenticate);

// Company Admin Routes
router.post("/purchase", authorize(UserRole.COMPANY_ADMIN), initiatePurchase);
router.post("/verify-purchase", authorize(UserRole.COMPANY_ADMIN), verifyPurchase);

// Master Admin Routes
router.get("/", authorize(UserRole.MASTER_ADMIN), validate(subscriptionQuerySchema), listSubscriptions);
router.get("/dashboard-stats", authorize(UserRole.MASTER_ADMIN), getDashboardStats);
router.post("/", authorize(UserRole.MASTER_ADMIN), validate(assignSubscriptionSchema), assignSubscription);
router.get("/:id", authorize(UserRole.MASTER_ADMIN), getSubscriptionDetails);

router.post("/:id/renew", authorize(UserRole.MASTER_ADMIN), validate(renewSubscriptionSchema), renewSubscription);
router.post("/:id/upgrade", authorize(UserRole.MASTER_ADMIN), validate(changeSubscriptionSchema), upgradeSubscription);
router.post("/:id/downgrade", authorize(UserRole.MASTER_ADMIN), validate(changeSubscriptionSchema), downgradeSubscription);

router.post("/:id/suspend", authorize(UserRole.MASTER_ADMIN), validate(statusChangeSchema), suspendSubscription);
router.post("/:id/resume", authorize(UserRole.MASTER_ADMIN), validate(statusChangeSchema), resumeSubscription);
router.post("/:id/cancel", authorize(UserRole.MASTER_ADMIN), validate(statusChangeSchema), cancelSubscription);

export default router;
