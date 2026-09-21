import { Schema, model, HydratedDocument, Types } from "mongoose";
import { BaseSchemaFields } from "../../shared/base.schema";

export enum PaymentMode {
  UPI = "UPI",
  BANK_TRANSFER = "BANK_TRANSFER",
  RAZORPAY = "RAZORPAY"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export interface ICompanyCenterPayment {
  companyId: Types.ObjectId;
  centerId: Types.ObjectId;
  examId?: Types.ObjectId;
  shift?: string;
  amount: number;
  paymentMode: PaymentMode;
  transactionId?: string;
  status: PaymentStatus;
  paymentDate?: Date;
  
  // Snapshot of where the money was sent
  paymentDetailsSnapshot: {
    mode: "UPI" | "BANK";
    upiId?: string;
    accountNumber?: string;
    ifscCode?: string;
    bankName?: string;
    accountHolderName?: string;
  };

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  notes?: string;

  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyCenterPaymentDocument = HydratedDocument<ICompanyCenterPayment>;

const CompanyCenterPaymentSchema = new Schema<ICompanyCenterPayment>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true,
      index: true,
    },
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      index: true,
    },
    shift: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      enum: Object.values(PaymentMode),
      required: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentDate: {
      type: Date,
    },
    paymentDetailsSnapshot: {
      mode: { type: String, enum: ["UPI", "BANK"], required: true },
      upiId: { type: String, trim: true },
      accountNumber: { type: String, trim: true },
      ifscCode: { type: String, trim: true },
      bankName: { type: String, trim: true },
      accountHolderName: { type: String, trim: true },
    },
    razorpayOrderId: { type: String, trim: true },
    razorpayPaymentId: { type: String, trim: true },
    razorpaySignature: { type: String, trim: true },
    notes: { type: String, trim: true },

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CompanyCenterPayment = model<ICompanyCenterPayment>("CompanyCenterPayment", CompanyCenterPaymentSchema);

export default CompanyCenterPayment;
