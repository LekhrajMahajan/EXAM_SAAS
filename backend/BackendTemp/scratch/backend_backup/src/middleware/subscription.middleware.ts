import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UserRole } from "../constants/roles";
import Company from "../modules/company/company.model";

export const requireSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
    }

    if (user.role === UserRole.MASTER_ADMIN) {
      return next();
    }

    if (!user.companyId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "No company associated with this user.");
    }

    const company = await Company.findById(user.companyId).select("paymentStatus subscriptionEndDate status").lean();
    
    if (!company) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found.");
    }

    if (!company.status) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Company account is inactive.");
    }

    if (company.paymentStatus !== "SUCCESS") {
      throw new ApiError(HTTP_STATUS.PAYMENT_REQUIRED, "Active subscription required. Please complete your payment.");
    }

    if (company.subscriptionEndDate && new Date(company.subscriptionEndDate) < new Date()) {
      throw new ApiError(HTTP_STATUS.PAYMENT_REQUIRED, "Subscription has expired. Please renew your plan.");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const requireFeature = (featureKey: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
      }

      if (user.role === UserRole.MASTER_ADMIN) {
        return next();
      }

      const enabledFeatures = (user as any).enabledFeatures;

      if (!enabledFeatures || enabledFeatures[featureKey] !== true) {
        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Your current subscription plan does not include the '${featureKey}' feature. Please upgrade your plan.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireUsageLimit = (limitKey: string, checkValueFn: (req: Request) => Promise<number>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");
      }

      if (user.role === UserRole.MASTER_ADMIN) {
        return next();
      }

      const usageLimits = (user as any).usageLimits;
      if (!usageLimits) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, "No usage limits found for your subscription.");
      }

      const limit = usageLimits[limitKey];
      if (limit === undefined || limit === null) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, `Limit for '${limitKey}' is not defined in your plan.`);
      }

      // 0 or -1 usually means unlimited
      if (limit === 0 || limit === -1) {
        return next();
      }

      const currentUsage = await checkValueFn(req);

      if (currentUsage >= limit) {
        throw new ApiError(
          HTTP_STATUS.PAYMENT_REQUIRED,
          `You have reached the maximum allowed limit for ${limitKey} (${limit}). Please upgrade your plan.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
