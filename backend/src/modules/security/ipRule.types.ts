import { Document, Types } from "mongoose";

export enum IpRuleType {
  SINGLE_IP = "SINGLE_IP",
  CIDR_RANGE = "CIDR_RANGE",
  SUBNET = "SUBNET",
  CORPORATE_NETWORK = "CORPORATE_NETWORK",
  EXAM_CENTER_NETWORK = "EXAM_CENTER_NETWORK",
  TEMPORARY_BLOCK = "TEMPORARY_BLOCK",
  PERMANENT_BLOCK = "PERMANENT_BLOCK",
}

export enum IpRuleCategory {
  WHITELIST = "WHITELIST",
  BLACKLIST = "BLACKLIST",
}

export enum IpRuleStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED",
}

export enum IpRiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export interface IIpRule extends Document {
  ipAddress?: string;
  cidrRange?: string;
  ruleType: IpRuleType;
  category: IpRuleCategory;
  companyId?: Types.ObjectId;
  branchId?: Types.ObjectId;
  examCenterId?: Types.ObjectId;
  status: IpRuleStatus;
  riskLevel: IpRiskLevel;
  expiryDate?: Date;
  lastMatched?: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
