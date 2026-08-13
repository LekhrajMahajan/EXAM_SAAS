import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import companyRepository from "../modules/company/company.repository";
import { UserRole } from "../constants/roles";

export const requireSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    // Master admins and candidates don't need company subscription check in the same way
    // or maybe they do? Usually this is for Company routes.
    if (user?.role === UserRole.MASTER_ADMIN) {
      return next();
    }

    if (!user?.companyId) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "User does not belong to a company"));
    }

    const company = await companyRepository.findById(user.companyId);

    if (!company) {
      return next(new ApiError(HTTP_STATUS.NOT_FOUND, "Company not found"));
    }

    // Check if subscription is active
    // If we only rely on subscriptionEndDate, we also check if it's > now.
    if (!company.subscriptionEndDate || new Date(company.subscriptionEndDate) < new Date()) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, "SUBSCRIPTION_REQUIRED"));
    }

    next();
  } catch (error) {
    next(error);
  }
};
