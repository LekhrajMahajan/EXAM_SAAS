import { Schema, model, Document } from "mongoose";

export interface IBranchStaff extends Document {
  staffId: string;
  name: string;
  role: string;
  aadharNumber: string;
  mobileNumber: string;
  email?: string;
  otpVerified: boolean;
  status: string;
  branchCode?: string;
  companyId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const branchStaffSchema = new Schema<IBranchStaff>(
  {
    staffId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    aadharNumber: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "Active",
    },
    branchCode: {
      type: String,
      trim: true,
      default: "",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const BranchStaff = model<IBranchStaff>("BranchStaff", branchStaffSchema, "branchstaffs");

export default BranchStaff;
