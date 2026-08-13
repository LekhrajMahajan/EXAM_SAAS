import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { env } from "../config/env";
import ApiError from "../utils/ApiError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UserRole } from "../constants/roles";
import { activityLogMiddleware } from "./activity-log";
import { auditLogMiddleware } from "./audit-log";
import { checkPasswordChange, checkBranchSetup } from "./branchManagerGuard.middleware";
import { checkCenterPasswordChange, checkCenterSetup } from "./centerManagerGuard.middleware";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
  companyId?: string;
  branchId?: string;
  centerId?: string;
  roleId?: string;
  subscriptionId?: string;
  planId?: string;
  permissionVersion?: number;
  featureVersion?: number;
  sessionId?: string;
  enabledFeatures?: any;
  usageLimits?: any;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Access token missing");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = decoded;
  } catch (error: any) {
    if (error?.name !== "TokenExpiredError") {
      console.error("Authentication Error:", error);
    }

    return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid or expired token"));
  }

  // Attach middlewares to record activities and enforce enterprise manager onboarding security guards
  activityLogMiddleware(req, res, () => {
    auditLogMiddleware(req, res, () => {
      checkPasswordChange(req, res, () => {
        checkBranchSetup(req, res, () => {
          checkCenterPasswordChange(req, res, () => {
            checkCenterSetup(req, res, () => {
              next();
            });
          });
        });
      });
    });
  });
};

