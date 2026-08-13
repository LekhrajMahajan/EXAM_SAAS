import { Schema, model } from "mongoose";
import { IPayment, PaymentStatus } from "./payment.types";

const paymentSchema = new Schema<IPayment>(
  {
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    planId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IPayment>("Payment", paymentSchema);
