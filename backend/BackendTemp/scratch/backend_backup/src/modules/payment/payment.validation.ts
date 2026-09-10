import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    companyId: z.string().min(1, "Company ID is required"),
    planId: z.string().min(1, "Plan ID is required"),
    amount: z.number().positive("Amount must be greater than zero"),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, "Order ID is required"),
    razorpay_payment_id: z.string().min(1, "Payment ID is required"),
    razorpay_signature: z.string().min(1, "Signature is required"),
  }),
});
