import { z } from "zod";
import { BillingCycle, SubscriptionStatus, SubscriptionPaymentStatus } from "./subscription.types";

export const assignSubscriptionSchema = z.object({
  body: z.object({
    companyId: z.string().min(1, "Company ID is required"),
    planId: z.string().min(1, "Plan ID is required"),
    billingCycle: z.nativeEnum(BillingCycle),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    autoRenewal: z.boolean().optional(),

    maxCenters: z.number().optional(),
    maxEmployees: z.number().optional(),
    maxCandidates: z.number().optional(),
    storageLimitGB: z.number().optional(),
    notes: z.string().optional(),
  })
});

export const updateSubscriptionSchema = z.object({
  body: z.object({
    billingCycle: z.nativeEnum(BillingCycle).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    autoRenewal: z.boolean().optional(),

    maxCenters: z.number().optional(),
    maxEmployees: z.number().optional(),
    maxCandidates: z.number().optional(),
    storageLimitGB: z.number().optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(SubscriptionStatus).optional(),
    paymentStatus: z.nativeEnum(SubscriptionPaymentStatus).optional(),
  })
});

export const renewSubscriptionSchema = z.object({
  body: z.object({
    planId: z.string().optional(), // Can renew to same plan or different plan
    billingCycle: z.nativeEnum(BillingCycle),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    notes: z.string().optional(),
  })
});

export const changeSubscriptionSchema = z.object({
  body: z.object({
    planId: z.string(),
    billingCycle: z.nativeEnum(BillingCycle),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    notes: z.string().optional(),
  })
});

export const statusChangeSchema = z.object({
  body: z.object({
    notes: z.string().optional(),
  })
});

export const subscriptionQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().transform(Number),
    limit: z.string().regex(/^\d+$/).optional().transform(Number),
    search: z.string().optional(),
    status: z.nativeEnum(SubscriptionStatus).optional(),
    paymentStatus: z.nativeEnum(SubscriptionPaymentStatus).optional(),
    billingCycle: z.nativeEnum(BillingCycle).optional(),
    planId: z.string().optional(),
    companyId: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
});
