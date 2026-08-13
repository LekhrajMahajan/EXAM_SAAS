import { Schema, model } from "mongoose";

import { ICompany } from "./company.types";
import { BaseSchemaFields } from "../../shared/base.schema";

const CompanySchema = new Schema<ICompany>(
  {
    companyCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    legalName: {
      type: String,
      trim: true,
      default: null,
    },

    companyType: {
      type: String,
      trim: true,
      default: "ENTERPRISE",
    },

    ownerName: {
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
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      default: null,
    },

    website: {
      type: String,
      default: null,
    },


    registrationDocument: {
      type: String,
      default: null,
    },

    mouDocument: {
      type: String,
      default: null,
    },

    panCardDocument: {
      type: String,
      default: null,
    },

    gstDocument: {
      type: String,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    address: {
      type: String,
      default: null,
    },

    city: {
      type: String,
      default: null,
    },

    state: {
      type: String,
      default: null,
    },

    country: {
      type: String,
      default: "India",
    },

    pincode: {
      type: String,
      default: null,
    },

    gstNumber: {
      type: String,
      default: null,
    },

    panNumber: {
      type: String,
      default: null,
    },

    registrationNumber: {
      type: String,
      default: null,
    },

    subscriptionPlan: {
      type: String,
      default: "STARTER",
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },

    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    subscriptionStartDate: Date,

    subscriptionEndDate: Date,

    maxBranches: {
      type: Number,
      default: 1,
    },

    maxCenters: {
      type: Number,
      default: 1,
    },

    maxEmployees: {
      type: Number,
      default: 5,
    },

    maxCandidates: {
      type: Number,
      default: 100,
    },

    status: {
      type: Boolean,
      default: false,
    },

    onboardingCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    approvalStatus: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "FAILED"],
      default: "PENDING",
    },

    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    rejectionRemarks: {
      type: String,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: Date,

    rejectedAt: Date,

    ...BaseSchemaFields,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/


CompanySchema.index({
  companyName: 1,
});


CompanySchema.index({
  status: 1,
});

CompanySchema.index({
  city: 1,
  state: 1,
});

CompanySchema.index({
  subscriptionPlan: 1,
});

/*
|--------------------------------------------------------------------------
| Virtual
|--------------------------------------------------------------------------
*/

CompanySchema.virtual("fullAddress").get(function () {
  return [this.address, this.city, this.state, this.country, this.pincode]
    .filter(Boolean)
    .join(", ");
});

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const Company = model<ICompany>("Company", CompanySchema);

export default Company;
