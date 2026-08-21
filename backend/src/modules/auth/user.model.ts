import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

import { IUser, UserDocument } from "./user.types";
import { UserRole } from "../../constants/roles";
import { BaseSchemaFields } from "../../shared/base.schema";

const UserSchema = new Schema<IUser>(
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
      default: UserRole.COMPANY_ADMIN,
      index: true,
    },

    profileImage: String,

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

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

UserSchema.index({
  companyId: 1,
  role: 1,
});

UserSchema.index({
  companyId: 1,
  email: 1,
});

const User = mongoose.models.User || model<IUser>("User", UserSchema);

export default User;
