import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validate } from "../../middleware/validate";
import { createOrder, verifyPayment, getAllPayments } from "./payment.controller";
import { createOrderSchema, verifyPaymentSchema } from "./payment.validation";

const router = Router();

router.get("/", authenticate, getAllPayments);

router.post(
  "/create-order",
  authenticate,
  validate(createOrderSchema),
  createOrder
);

router.post(
  "/verify",
  authenticate,
  validate(verifyPaymentSchema),
  verifyPayment
);

export default router;
