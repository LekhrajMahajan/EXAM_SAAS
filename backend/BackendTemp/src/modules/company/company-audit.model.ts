import { Schema, model } from "mongoose";
import { ICompanyAuditLog } from "./company-audit.types";

const CompanyAuditLogSchema = new Schema<ICompanyAuditLog>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    action: {
      type: String,
      enum: ["SUBMITTED", "REVIEW_STARTED", "REVIEW_COMPLETED", "APPROVED", "REJECTED", "DOCUMENT_VIEWED", "REVIEWER_ASSIGNED"],
      required: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    details: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

CompanyAuditLogSchema.index({ companyId: 1, createdAt: -1 });

const CompanyAuditLog = model<ICompanyAuditLog>("CompanyAuditLog", CompanyAuditLogSchema);

export default CompanyAuditLog;
