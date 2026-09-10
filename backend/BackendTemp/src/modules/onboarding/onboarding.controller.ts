import { Request, Response, NextFunction } from "express";
import { OnboardingService } from "./onboarding.service";
import { HTTP_STATUS } from "../../constants/httpStatus";
import ApiError from "../../utils/ApiError";

const onboardingService = new OnboardingService();

export class OnboardingController {
  async complete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !(req.user as any).companyId) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Company context required for onboarding.");
      }
      const u = req.user as any;
      const userId = u._id || u.id || u.userId;
      const meta = {
        ip: req.ip || req.headers["x-forwarded-for"] || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "Unknown Browser",
      };

      const result = await onboardingService.completeOnboarding(
        u.companyId.toString(),
        userId.toString(),
        req.body,
        meta
      );

      res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getNavigation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !(req.user as any).companyId) {
        res.status(HTTP_STATUS.OK).json({ success: true, data: { menu: [], onboardingCompleted: false } });
        return;
      }
      const navData = await onboardingService.getDynamicNavigation(req.user as any);
      res.status(HTTP_STATUS.OK).json({ success: true, data: navData });
    } catch (error) {
      next(error);
    }
  }
}

export const onboardingController = new OnboardingController();
