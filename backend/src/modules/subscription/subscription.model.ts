import { Schema, model } from "mongoose";
import { 
  ISubscription, 
  ISubscriptionHistory, 
  SubscriptionStatus, 
  SubscriptionPaymentStatus, 
  BillingCycle 
} from "./subscription.types";

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriptionId: {
      type: String,
      required: true,
      unique: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    billingCycle: {
      type: String,
      enum: Object.values(BillingCycle),
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(SubscriptionPaymentStatus),
      default: SubscriptionPaymentStatus.PENDING,
    },
    autoRenewal: {
      type: Boolean,
      default: false,
    },
    maxBranches: { type: Number },
    maxCenters: { type: Number },
    maxEmployees: { type: Number },
    maxCandidates: { type: Number },
    storageLimitGB: { type: Number },
    notes: { type: String },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const subscriptionHistorySchema = new Schema<ISubscriptionHistory>(
  {
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["CREATED", "RENEWED", "UPGRADED", "DOWNGRADED", "SUSPENDED", "RESUMED", "CANCELLED", "UPDATED"],
      required: true,
    },
    previousPlanId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },
    newPlanId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },
    previousEndDate: {
      type: Date,
    },
    newEndDate: {
      type: Date,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export const SubscriptionModel = model<ISubscription>("Subscription", subscriptionSchema);
export const SubscriptionHistoryModel = model<ISubscriptionHistory>("SubscriptionHistory", subscriptionHistorySchema);
