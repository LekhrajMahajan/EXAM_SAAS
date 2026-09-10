import { Router } from "express";
import {
  getCenterPaymentDetails,
  createPaymentRecord,
  verifyPayment,
  getCompanyPayments,
  createRazorpayOrder
} from "./companyCenterPayment.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

const router = Router();

// Get center payment details for paying
router.get(
  "/center/:centerId",
  authenticate,
  authorize(UserRole.COMPANY_ADMIN, UserRole.MASTER_ADMIN),
  getCenterPaymentDetails
);

// Get all payments made by a company
router.get(
  "/company",
  authenticate,
  authorize(UserRole.COMPANY_ADMIN, UserRole.MASTER_ADMIN),
  getCompanyPayments
);

// Create a new payment record (initiate payment)
router.post(
  "/",
  authenticate,
  authorize(UserRole.COMPANY_ADMIN, UserRole.MASTER_ADMIN),
  createPaymentRecord
);

// Verify/complete a payment record manually
router.patch(
  "/:paymentId/verify",
  authenticate,
  authorize(UserRole.COMPANY_ADMIN, UserRole.MASTER_ADMIN),
  verifyPayment
);

// Create Razorpay order
router.post(
  "/:paymentId/razorpay-order",
  authenticate,
  authorize(UserRole.COMPANY_ADMIN, UserRole.MASTER_ADMIN),
  createRazorpayOrder
);

// Verify Razorpay payment
router.post(
  "/:paymentId/verify-razorpay",
  authenticate,
  authorize(UserRole.COMPANY_ADMIN, UserRole.MASTER_ADMIN),
  verifyPayment
);

export default router;
