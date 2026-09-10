import { subscriptionRepository } from "./subscription.repository";
import companyRepository from "../company/company.repository";
import planRepository from "../plan/plan.repository";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { Types } from "mongoose";
import { SubscriptionStatus, BillingCycle } from "./subscription.types";
import paymentService from "../payment/payment.service";
import { invoiceService } from "../invoice/invoice.service";
import { InvoiceStatus, PaymentStatus as InvoicePaymentStatus } from "../invoice/invoice.types";
import { permissionCache } from "../../middleware/permission";
import sidebarService from "../sidebar/sidebar.service";

class SubscriptionService {
  /**
   * Immediately invalidate both RBAC permission cache and dynamic navigation sidebar cache
   * whenever a company's subscription plan, features, usage limits, or status changes.
   */
  private invalidateTenantCaches(companyId: any): void {
    if (!companyId) return;
    const cid = companyId.toString();
    permissionCache.invalidate(cid);
    sidebarService.invalidateCache(cid, null);
  }

  async assignSubscription(payload: any, assignedBy: string) {
    const {
      companyId,
      planId,
      billingCycle,
      startDate,
      endDate,
      notes,
      autoRenewal,
      ...overrides
    } = payload;

    const company = await companyRepository.findById(companyId);
    if (!company)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");

    const plan = await planRepository.findById(planId);
    if (!plan) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Plan not found");

    // Prevent duplicate active subscriptions
    const activeCount =
      await subscriptionRepository.countActiveSubscriptions(companyId);
    if (activeCount > 0) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        "Company already has an active subscription",
      );
    }

    const subscriptionId =
      await subscriptionRepository.generateSubscriptionId();

    const subscription = await subscriptionRepository.create({
      subscriptionId,
      companyId: new Types.ObjectId(companyId),
      planId: new Types.ObjectId(planId),
      billingCycle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: SubscriptionStatus.ACTIVE,
      autoRenewal: autoRenewal || false,
      notes,
      assignedBy: new Types.ObjectId(assignedBy),

      maxCenters: plan.usageLimits?.maxCenters,
      maxEmployees: plan.usageLimits?.maxEmployees,
      maxCandidates: plan.usageLimits?.maxCandidates,
      storageLimitGB: plan.usageLimits?.storageLimitGB,
      ...overrides,
    });

    await subscriptionRepository.createHistory({
      subscriptionId: subscription._id as Types.ObjectId,
      action: "CREATED",
      newPlanId: new Types.ObjectId(planId),
      newEndDate: new Date(endDate),
      performedBy: new Types.ObjectId(assignedBy),
      notes: "Assigned new subscription",
    });

    // Update Company legacy fields and limits for backward compatibility
    await companyRepository.update(companyId, {
      subscriptionPlan: plan.planCode as "STARTER" | "PROFESSIONAL" | "ENTERPRISE", // Legacy enum logic might conflict, but we try
      subscriptionStartDate: new Date(startDate),
      subscriptionEndDate: new Date(endDate),

      maxCenters: plan.usageLimits?.maxCenters,
      maxEmployees: plan.usageLimits?.maxEmployees,
      maxCandidates: plan.usageLimits?.maxCandidates,
    });

    this.invalidateTenantCaches(companyId);
    return subscription;
  }

  async renewSubscription(id: string, payload: any, performedBy: string) {
    const subscription = await subscriptionRepository.findById(id);
    if (!subscription)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Subscription not found");

    const { planId, billingCycle, startDate, endDate, notes } = payload;
    const pId = planId || subscription.planId;

    const updated = await subscriptionRepository.update(id, {
      planId: new Types.ObjectId(pId.toString()),
      billingCycle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: SubscriptionStatus.ACTIVE,
    });

    await subscriptionRepository.createHistory({
      subscriptionId: subscription._id as Types.ObjectId,
      action: "RENEWED",
      previousPlanId: subscription.planId,
      newPlanId: new Types.ObjectId(pId.toString()),
      previousEndDate: subscription.endDate,
      newEndDate: new Date(endDate),
      performedBy: new Types.ObjectId(performedBy),
      notes: notes || "Subscription renewed",
    });

    this.invalidateTenantCaches(subscription.companyId);
    return updated;
  }

  async upgradeSubscription(id: string, payload: any, performedBy: string) {
    // Similar to renew but with specific action
    const subscription = await subscriptionRepository.findById(id);
    if (!subscription)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Subscription not found");

    const { planId, billingCycle, startDate, endDate, notes } = payload;

    const updated = await subscriptionRepository.update(id, {
      planId: new Types.ObjectId(planId),
      billingCycle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await subscriptionRepository.createHistory({
      subscriptionId: subscription._id as Types.ObjectId,
      action: "UPGRADED",
      previousPlanId: subscription.planId,
      newPlanId: new Types.ObjectId(planId),
      previousEndDate: subscription.endDate,
      newEndDate: new Date(endDate),
      performedBy: new Types.ObjectId(performedBy),
      notes: notes || "Subscription upgraded",
    });

    this.invalidateTenantCaches(subscription.companyId);
    return updated;
  }

  async downgradeSubscription(id: string, payload: any, performedBy: string) {
    const subscription = await subscriptionRepository.findById(id);
    if (!subscription)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Subscription not found");

    const { planId, billingCycle, startDate, endDate, notes } = payload;

    const updated = await subscriptionRepository.update(id, {
      planId: new Types.ObjectId(planId),
      billingCycle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await subscriptionRepository.createHistory({
      subscriptionId: subscription._id as Types.ObjectId,
      action: "DOWNGRADED",
      previousPlanId: subscription.planId,
      newPlanId: new Types.ObjectId(planId),
      previousEndDate: subscription.endDate,
      newEndDate: new Date(endDate),
      performedBy: new Types.ObjectId(performedBy),
      notes: notes || "Subscription downgraded",
    });

    this.invalidateTenantCaches(subscription.companyId);
    return updated;
  }

  async changeStatus(
    id: string,
    status: SubscriptionStatus,
    performedBy: string,
    notes?: string,
  ) {
    const subscription = await subscriptionRepository.findById(id);
    if (!subscription)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Subscription not found");

    if (status === SubscriptionStatus.ACTIVE) {
      if (new Date(subscription.endDate) < new Date()) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Subscription has expired. Please renew it instead of resuming.");
      }
    }

    const updated = await subscriptionRepository.update(id, { status });

    let action: any = "UPDATED";
    if (status === SubscriptionStatus.SUSPENDED) action = "SUSPENDED";
    if (status === SubscriptionStatus.ACTIVE) action = "RESUMED"; // Assuming returning from suspended
    if (status === SubscriptionStatus.CANCELLED) action = "CANCELLED";

    await subscriptionRepository.createHistory({
      subscriptionId: subscription._id as Types.ObjectId,
      action,
      performedBy: new Types.ObjectId(performedBy),
      notes: notes || `Status changed to ${status}`,
    });

    this.invalidateTenantCaches(subscription.companyId);
    return updated;
  }

  async getSubscriptionDetails(id: string) {
    const subscription = await subscriptionRepository.findById(id, [
      "companyId",
      "planId",
      "assignedBy",
    ]);

    if (!subscription)
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Subscription not found");

    const history = await subscriptionRepository.getHistoryBySubscription(id);

    return { subscription, history };
  }

  async listSubscriptions(query: any = {}) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      paymentStatus,
      billingCycle,
      planId,
      companyId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (billingCycle) filter.billingCycle = billingCycle;
    if (planId) filter.planId = new Types.ObjectId(planId);
    if (companyId) filter.companyId = new Types.ObjectId(companyId);

    // Search by subscriptionId if provided
    if (search) {
      filter.subscriptionId = { $regex: search, $options: "i" };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const data = await subscriptionRepository.findWithDetails(filter, {
      skip,
      limit,
      sort,
      populate: ["companyId", "planId", "assignedBy"],
    });

    const total = await subscriptionRepository.count(filter);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async initiatePurchase(companyId: string, planId: string, billingCycle: BillingCycle) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");

    const plan = await planRepository.findById(planId);
    if (!plan) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Plan not found");

    if (plan.status !== "ACTIVE") {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Selected plan is not active");
    }

    let baseAmount = 0;
    if (billingCycle === BillingCycle.MONTHLY) {
      baseAmount = plan.pricing?.monthlyPrice || 0;
    } else if (billingCycle === BillingCycle.YEARLY) {
      baseAmount = plan.pricing?.yearlyPrice || 0;
    } else if (billingCycle === BillingCycle.QUARTERLY) {
      baseAmount = plan.pricing?.quarterlyPrice || 0;
    } else if (billingCycle === BillingCycle.HALF_YEARLY) {
      baseAmount = plan.pricing?.halfYearlyPrice || 0;
    } else {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid billing cycle");
    }

    // Apply discount
    const discountPercent = plan.pricing?.discountPercent || 0;
    const discountAmount = (baseAmount * discountPercent) / 100;
    const amountAfterDiscount = baseAmount - discountAmount;

    // Apply GST (taxPercent)
    const gstPercent = plan.pricing?.taxPercent || 0;
    const gstAmount = (amountAfterDiscount * gstPercent) / 100;
    
    // Final Amount
    const finalAmount = Math.round(amountAfterDiscount + gstAmount); // Ensure it's an integer or whatever Razorpay needs, but Razorpay takes in paise so we'll pass amount and paymentService multiplies by 100

    if (finalAmount <= 0) {
      // Free plan logic if needed, but for now we expect paid plans
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Amount must be greater than 0");
    }

    // Call PaymentService to create order
    const orderData = await paymentService.createOrder(companyId, planId, finalAmount);

    return {
      orderId: orderData.orderId,
      paymentId: orderData.payment._id,
      amount: finalAmount,
      currency: "INR",
      planName: plan.planName,
      billingCycle,
    };
  }

  async verifyAndActivatePurchase(companyId: string, orderId: string, paymentId: string, signature: string, planId: string, billingCycle: BillingCycle, userId?: string) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found");

    const plan = await planRepository.findById(planId);
    if (!plan) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Plan not found");

    // Verify payment using PaymentService
    // PaymentService's verifyPayment internally creates an invoice and marks payment as SUCCESS
    const payment = await paymentService.verifyPayment(orderId, paymentId, signature);

    // End date calculation
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === BillingCycle.MONTHLY) {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === BillingCycle.YEARLY) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else if (billingCycle === BillingCycle.QUARTERLY) {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (billingCycle === BillingCycle.HALF_YEARLY) {
      endDate.setMonth(endDate.getMonth() + 6);
    }

    // Prevent duplicate active subscriptions by suspending previous ones or just checking
    const activeSubscriptions = await subscriptionRepository.findWithDetails({ companyId, status: SubscriptionStatus.ACTIVE });
    for (const sub of activeSubscriptions) {
      await subscriptionRepository.update(sub.id, { status: SubscriptionStatus.SUSPENDED });
    }

    const subscriptionIdStr = await subscriptionRepository.generateSubscriptionId();
    const actorId = new Types.ObjectId(userId || company.createdBy || companyId);

    const subscription = await subscriptionRepository.create({
      subscriptionId: subscriptionIdStr,
      companyId: new Types.ObjectId(companyId),
      planId: new Types.ObjectId(planId),
      billingCycle,
      startDate,
      endDate,
      status: SubscriptionStatus.ACTIVE,
      autoRenewal: false,
      notes: `Purchased via Razorpay Order: ${orderId}`,
      assignedBy: actorId,

      maxCenters: plan.usageLimits?.maxCenters,
      maxEmployees: plan.usageLimits?.maxEmployees,
      maxCandidates: plan.usageLimits?.maxCandidates,
      storageLimitGB: plan.usageLimits?.storageLimitGB,
    });

    await subscriptionRepository.createHistory({
      subscriptionId: subscription._id as Types.ObjectId,
      action: "CREATED",
      newPlanId: new Types.ObjectId(planId),
      newEndDate: endDate,
      performedBy: actorId,
      notes: `Purchased subscription`,
    });

    // Update Company legacy fields and limits for backward compatibility
    await companyRepository.update(companyId, {
      subscriptionPlan: plan.planCode as "STARTER" | "PROFESSIONAL" | "ENTERPRISE",
      planId: plan._id,
      subscriptionId: subscription._id as Types.ObjectId,
      subscriptionStartDate: startDate,
      subscriptionEndDate: endDate,

      maxCenters: plan.usageLimits?.maxCenters,
      maxEmployees: plan.usageLimits?.maxEmployees,
      maxCandidates: plan.usageLimits?.maxCandidates,
      paymentStatus: "SUCCESS",
    });

    return {
      subscription,
      payment,
    };
  }

  async getDashboardStats() {
    return subscriptionRepository.getDashboardStats();
  }
}

export const subscriptionService = new SubscriptionService();
