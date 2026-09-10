import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import auditLogRepository from "../modules/audit-log/auditLog.repository";
import { AuditAction, AuditSeverity, AuditStatus } from "../modules/audit-log/auditLog.types";

export const auditLogMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only log if the user is authenticated and it's a mutating request or we log all
  res.on("finish", () => {
    if (req.user) {
      let action = AuditAction.READ;
      if (req.method === "POST") action = AuditAction.CREATE;
      else if (req.method === "PUT" || req.method === "PATCH") action = AuditAction.UPDATE;
      else if (req.method === "DELETE") action = AuditAction.DELETE;

      const status = res.statusCode >= 400 ? AuditStatus.FAILED : AuditStatus.SUCCESS;
      
      const payload: any = {
        action,
        module: req.baseUrl || req.path,
        description: `${req.method} ${req.originalUrl}`,
        performedBy: new mongoose.Types.ObjectId(req.user.userId),
        performedByRole: req.user.role,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        responseStatus: res.statusCode,
        severity: AuditSeverity.LOW,
        status,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Only save body for mutating requests to avoid bloated logs
      if (req.method !== "GET") {
        payload.requestBody = req.body;
      }

      // Fire and forget
      auditLogRepository.create(payload).catch((err: any) => {
        console.error("Audit Log Creation Failed", err);
      });
    }
  });

  next();
};
