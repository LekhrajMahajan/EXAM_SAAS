import mongoose, { Document, Schema, Types } from "mongoose";

export enum CenterPaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export interface ICenterPayment extends Document {
  companyId: Types.ObjectId;
  centerId: Types.ObjectId;
  examId: Types.ObjectId;
  shift: string;
  amount: number;
  upiId?: string;
  status: CenterPaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CenterPaymentSchema = new Schema<ICenterPayment>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    centerId: { type: Schema.Types.ObjectId, ref: "Center", required: true },
    examId: { type: Schema.Types.ObjectId, ref: "Exam", required: true },
    shift: { type: String, required: true },
    amount: { type: Number, required: true },
    upiId: { type: String },
    status: {
      type: String,
      enum: Object.values(CenterPaymentStatus),
      default: CenterPaymentStatus.PENDING,
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

export const CenterPayment = mongoose.model<ICenterPayment>("CenterPayment", CenterPaymentSchema);
export default CenterPayment;
