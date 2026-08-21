import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import activityLogRepository from "../modules/activity-log/activityLog.repository";
import { ActivityType, ActivityPriority, ActivityVisibility } from "../modules/activity-log/activityLog.types";

export const activityLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    // We only log mutating requests into activity log generally or specific important ones
    if (req.user && req.method !== "GET") {
      let activityType = ActivityType.CREATE;
      if (req.method === "PUT" || req.method === "PATCH") activityType = ActivityType.UPDATE;
      else if (req.method === "DELETE") activityType = ActivityType.DELETE;

      if (res.statusCode < 400) {
        const payload: any = {
          title: `${req.method} operation on ${req.baseUrl || req.path}`,
          description: `User performed ${req.method} on ${req.originalUrl}`,
          activityType,
          module: req.baseUrl || req.path,
          performedBy: new mongoose.Types.ObjectId(req.user.userId),
          performedByRole: req.user.role,
          companyId: req.user.companyId ? new mongoose.Types.ObjectId(req.user.companyId) : undefined,
          priority: ActivityPriority.MEDIUM,
          visibility: ActivityVisibility.PRIVATE,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Fire and forget
        activityLogRepository.create(payload).catch((err: any) => {
          console.error("Activity Log Creation Failed", err);
        });
      }
    }
  });

  next();
};
