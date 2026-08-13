import { Schema, model } from "mongoose";
import { ICompliancePolicy } from "./compliancePolicy.types";

const compliancePolicySchema = new Schema<ICompliancePolicy>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    frameworks: [
      {
        name: { type: String, required: true },
        enabled: { type: Boolean, default: false },
        score: { type: Number, default: 0 },
      },
    ],
    retentionDays: {
      type: Number,
      default: 365,
    },
    autoCleanup: {
      type: Boolean,
      default: true,
    },
    legalHold: {
      type: Boolean,
      default: false,
    },
    exportBeforeDeletion: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const CompliancePolicyModel = model<ICompliancePolicy>(
  "CompliancePolicy",
  compliancePolicySchema,
);
