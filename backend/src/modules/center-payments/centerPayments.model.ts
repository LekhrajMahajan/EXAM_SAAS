import { Schema, model } from "mongoose";

const CenterPaymentsSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      index: true,
      required: true,
    },
    shiftId: {
      type: Schema.Types.ObjectId,
      ref: "Shift",
    },
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Processing", "Failed"],
      default: "Paid",
    },
    paymentMethod: {
      type: String,
    },
    referenceNumber: {
      type: String,
    },
    remarks: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CenterPayments = model("CenterPayments", CenterPaymentsSchema);
export default CenterPayments;
