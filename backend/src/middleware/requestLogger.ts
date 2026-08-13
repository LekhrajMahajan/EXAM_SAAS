import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import activityLogService from "../modules/activity-log/activityLog.service";
import { ActivityType } from "../modules/activity-log/activityLog.types";

import auditLogService from "../modules/audit-log/auditLog.service";
import { AuditAction, AuditStatus, AuditSeverity } from "../modules/audit-log/auditLog.types";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Capture response finish event
  res.on("finish", () => {
    // Only log if the request was authenticated (req.user is set by authenticate middleware)
    if (req.user) {
      const moduleName = req.baseUrl || req.path;
      const status = res.statusCode >= 400 ? AuditStatus.FAILED : AuditStatus.SUCCESS;
      const severity = res.statusCode >= 500 ? AuditSeverity.HIGH : AuditSeverity.MEDIUM;
      
      let activityType = ActivityType.CREATE;
      let auditAction = AuditAction.CREATE;

      // Map HTTP method to Activity/Audit types
      switch (req.method.toUpperCase()) {
        case "GET":
          activityType = ActivityType.CREATE; // READ isn't in ActivityType, fallback to CREATE or omit. Let's use CREATE as a fallback or skip. Wait, ActivityType has no READ.
          auditAction = AuditAction.READ;
          break;
        case "POST":
          activityType = ActivityType.CREATE;
          auditAction = AuditAction.CREATE;
          break;
        case "PUT":
        case "PATCH":
          activityType = ActivityType.UPDATE;
          auditAction = AuditAction.UPDATE;
          break;
        case "DELETE":
          activityType = ActivityType.DELETE;
          auditAction = AuditAction.DELETE;
          break;
        default:
          activityType = ActivityType.CREATE;
          auditAction = AuditAction.CREATE;
      }

      // 1. Log Activity
      // ActivityLogService requires a session usually? Let's check if we can pass it without session.
      // In activityLogService.log(), it creates its own session and transaction.
      activityLogService.log({
        title: `${req.method} Request to ${moduleName}`,
        description: `User ${req.user.userId} performed ${req.method} on ${req.originalUrl} with status ${res.statusCode}`,
        activityType,
        module: moduleName,
        performedBy: new Types.ObjectId(req.user.userId),
        performedByRole: req.user.role
      }).catch(err => console.error("Error logging activity:", err));

      // 2. Log Audit
      auditLogService.log({
        action: auditAction,
        module: moduleName,
        description: `Audit: User ${req.user.userId} performed ${req.method} on ${req.originalUrl} (Status: ${res.statusCode})`,
        severity,
        status,
        performedBy: new Types.ObjectId(req.user.userId),
        performedByRole: req.user.role
      }).catch(err => console.error("Error logging audit:", err));
    }
  });

  next();
};
