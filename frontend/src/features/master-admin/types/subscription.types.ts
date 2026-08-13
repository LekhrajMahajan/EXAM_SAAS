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

export interface ISubscription {
  _id: string;
  subscriptionId: string;
  companyId: any; // Populated Company object or string
  planId: any; // Populated Plan object or string
  billingCycle: BillingCycle;
  
  startDate: string;
  endDate: string;
  
  status: SubscriptionStatus;
  paymentStatus: SubscriptionPaymentStatus;
  
  autoRenewal: boolean;
  
  maxBranches?: number;
  maxCenters?: number;
  maxEmployees?: number;
  maxCandidates?: number;
  storageLimitGB?: number;
  
  notes?: string;
  
  assignedBy?: any; // Populated User
  
  createdAt: string;
  updatedAt: string;
}

export interface ISubscriptionHistory {
  _id: string;
  subscriptionId: string;
  action: "CREATED" | "RENEWED" | "UPGRADED" | "DOWNGRADED" | "SUSPENDED" | "RESUMED" | "CANCELLED" | "UPDATED";
  previousPlanId?: any;
  newPlanId?: any;
  previousEndDate?: string;
  newEndDate?: string;
  performedBy: any;
  notes?: string;
  createdAt: string;
}

export interface AssignSubscriptionPayload {
  companyId: string;
  planId: string;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  autoRenewal?: boolean;
  maxBranches?: number;
  maxCenters?: number;
  maxEmployees?: number;
  maxCandidates?: number;
  storageLimitGB?: number;
  notes?: string;
}

export interface RenewSubscriptionPayload {
  planId?: string;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface ChangeSubscriptionPayload {
  planId: string;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface StatusChangePayload {
  notes?: string;
}
