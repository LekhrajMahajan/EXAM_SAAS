import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { subscriptionService } from "./subscription.service";
import { SubscriptionStatus } from "./subscription.types";

export const assignSubscription = asyncHandler(async (req: Request, res: Response) => {
  const result = await subscriptionService.assignSubscription(req.body, (req as any).user._id || (req as any).user.id);
  return sendResponse(res, HTTP_STATUS.CREATED, {
    success: true,
    message: "Subscription assigned successfully",
    data: result,
  });
});

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const result = await subscriptionService.getDashboardStats();
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Dashboard stats fetched successfully",
    data: result,
  });
});

export const getSubscriptionDetails = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await subscriptionService.getSubscriptionDetails(id);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subscription details fetched successfully",
    data: result,
  });
});

export const listSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const result = await subscriptionService.listSubscriptions(req.query);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subscriptions fetched successfully",
    data: result,
  });
});

export const renewSubscription = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await subscriptionService.renewSubscription(id, req.body, (req as any).user._id || (req as any).user.id);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subscription renewed successfully",
    data: result,
  });
});

export const upgradeSubscription = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await subscriptionService.upgradeSubscription(id, req.body, (req as any).user._id || (req as any).user.id);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subscription upgraded successfully",
    data: result,
  });
});

export const downgradeSubscription = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await subscriptionService.downgradeSubscription(id, req.body, (req as any).user._id || (req as any).user.id);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subscription downgraded successfully",
    data: result,
  });
});

export const suspendSubscription = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { notes } = req.body;
  const result = await subscriptionService.changeStatus(id, SubscriptionStatus.SUSPENDED, (req as any).user._id || (req as any).user.id, notes);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subscription suspended successfully",
    data: result,
  });
});

export const resumeSubscription = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { notes } = req.body;
  const result = await subscriptionService.changeStatus(id, SubscriptionStatus.ACTIVE, (req as any).user._id || (req as any).user.id, notes);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subscription resumed successfully",
    data: result,
  });
});

export const cancelSubscription = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { notes } = req.body;
  const result = await subscriptionService.changeStatus(id, SubscriptionStatus.CANCELLED, (req as any).user._id || (req as any).user.id, notes);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Subscription cancelled successfully",
    data: result,
  });
});

export const initiatePurchase = asyncHandler(async (req: Request, res: Response) => {
  const { planId, billingCycle } = req.body;
  const companyId = (req as any).user.companyId;
  const result = await subscriptionService.initiatePurchase(companyId, planId, billingCycle);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Purchase initiated successfully",
    data: result,
  });
});

export const verifyPurchase = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, paymentId, signature, planId, billingCycle } = req.body;
  const companyId = (req as any).user.companyId;
  const userId = (req as any).user._id || (req as any).user.id;
  const result = await subscriptionService.verifyAndActivatePurchase(companyId, orderId, paymentId, signature, planId, billingCycle, userId);
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Purchase verified and subscription activated successfully",
    data: result,
  });
});
