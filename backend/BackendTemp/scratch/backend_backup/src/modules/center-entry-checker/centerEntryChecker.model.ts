import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { BaseSchemaFields } from "../../shared/base.schema";

export interface ICenterEntryChecker extends mongoose.Document {
  companyId: mongoose.Types.ObjectId;
  centerId: mongoose.Types.ObjectId;
  staffId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  forcePasswordChange: boolean;
  loginAttempts: number;
  lockoutUntil?: Date;
  lastLogin?: Date;
  refreshToken?: string;
  passwordChangedAt?: Date;
  status: string;
  isDeleted: boolean;
}

const CenterEntryCheckerSchema = new Schema<ICenterEntryChecker>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      default: null,
      index: true,
    },
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      default: null,
      index: true,
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "CenterStaff",
      default: null,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      default: "ENTRY_CHECKER",
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    forcePasswordChange: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: Date,
    lastLogin: Date,
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordChangedAt: Date,
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED", "DELETED"],
      default: "ACTIVE",
      index: true,
    },
    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CenterEntryCheckerSchema.pre("save", async function (this: ICenterEntryChecker) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

const CenterEntryChecker = model<ICenterEntryChecker>("CenterEntryChecker", CenterEntryCheckerSchema);

export default CenterEntryChecker;
