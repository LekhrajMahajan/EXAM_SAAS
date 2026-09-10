import { Schema, model, Document } from "mongoose";

export interface ICenterStaff extends Document {
  staffId: string;
  name: string;
  role: string;
  aadharNumber: string;
  mobileNumber: string;
  email?: string;
  otpVerified: boolean;
  status: string;
  centerCode?: string;
  companyId?: Schema.Types.ObjectId;
  centerId?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const centerStaffSchema = new Schema<ICenterStaff>(
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
    centerCode: {
      type: String,
      trim: true,
      default: "",
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const CenterStaff = model<ICenterStaff>("CenterStaff", centerStaffSchema, "centerstaffs");

export default CenterStaff;
