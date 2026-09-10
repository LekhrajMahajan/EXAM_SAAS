import mongoose, { Schema } from "mongoose";
import {
  IIpRule,
  IpRuleType,
  IpRuleCategory,
  IpRuleStatus,
  IpRiskLevel,
} from "./ipRule.types";

const ipRuleSchema = new Schema<IIpRule>(
  {
    ipAddress: {
      type: String,
      trim: true,
      index: true,
    },
    cidrRange: {
      type: String,
      trim: true,
      index: true,
    },
    ruleType: {
      type: String,
      enum: Object.values(IpRuleType),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(IpRuleCategory),
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      index: true,
    },
    examCenterId: {
      type: Schema.Types.ObjectId,
      ref: "ExamCenter",
    },
    status: {
      type: String,
      enum: Object.values(IpRuleStatus),
      default: IpRuleStatus.ACTIVE,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: Object.values(IpRiskLevel),
      default: IpRiskLevel.LOW,
    },
    expiryDate: {
      type: Date,
    },
    lastMatched: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate rules for the same IP or CIDR in the same category
ipRuleSchema.index(
  { ipAddress: 1, category: 1, companyId: 1 },
  { unique: true, partialFilterExpression: { ipAddress: { $type: "string" } } }
);

ipRuleSchema.index(
  { cidrRange: 1, category: 1, companyId: 1 },
  { unique: true, partialFilterExpression: { cidrRange: { $type: "string" } } }
);

export default mongoose.model<IIpRule>("IpRule", ipRuleSchema);
