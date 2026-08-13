import { Document, Types } from "mongoose";

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  SUSPENDED = "SUSPENDED",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
}

export enum SubscriptionPaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum BillingCycle {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  HALF_YEARLY = "HALF_YEARLY",
  YEARLY = "YEARLY",
}

export interface ISubscription extends Document {
  _id: Types.ObjectId;
  subscriptionId: string; // e.g. SUB-12345
  companyId: Types.ObjectId;
  planId: Types.ObjectId;
  billingCycle: BillingCycle;
  
  startDate: Date;
  endDate: Date;
  
  status: SubscriptionStatus;
  paymentStatus: SubscriptionPaymentStatus;
  
  autoRenewal: boolean;
  
  // Custom Usage Limits (Overrides plan limits if set)
  maxBranches?: number;
  maxCenters?: number;
  maxEmployees?: number;
  maxCandidates?: number;
  storageLimitGB?: number;
  
  notes?: string;
  
  assignedBy?: Types.ObjectId; // User who assigned it (Master Admin)
  
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface ISubscriptionHistory extends Document {
  subscriptionId: Types.ObjectId;
  action: "CREATED" | "RENEWED" | "UPGRADED" | "DOWNGRADED" | "SUSPENDED" | "RESUMED" | "CANCELLED" | "UPDATED";
  previousPlanId?: Types.ObjectId;
  newPlanId?: Types.ObjectId;
  previousEndDate?: Date;
  newEndDate?: Date;
  performedBy: Types.ObjectId; // User ID
  notes?: string;
  createdAt: Date;
}
