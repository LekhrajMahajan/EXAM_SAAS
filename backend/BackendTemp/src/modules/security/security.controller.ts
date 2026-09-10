import { Request, Response } from "express";
import { SecurityService } from "./security.service";
import { asyncHandler } from "../../utils/asyncHandler";

export class SecurityController {
  private securityService: SecurityService;

  constructor() {
    this.securityService = new SecurityService();
  }

  public getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const dashboard = await this.securityService.getDashboardStats();
    res.status(200).json({ success: true, data: dashboard });
  });

  public getStatistics = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.securityService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  });

  public getAlerts = asyncHandler(async (req: Request, res: Response) => {
    const alerts = await this.securityService.getAlerts();
    res.status(200).json({ success: true, data: alerts });
  });

  public getLoginAnalytics = asyncHandler(
    async (req: Request, res: Response) => {
      const analytics = await this.securityService.getLoginAnalytics();
      res.status(200).json({ success: true, data: analytics });
    },
  );

  public getRecentActivities = asyncHandler(
    async (req: Request, res: Response) => {
      const activities = await this.securityService.getRecentActivities();
      res.status(200).json({ success: true, data: activities });
    },
  );

  public getSessions = asyncHandler(async (req: Request, res: Response) => {
    const sessions = await this.securityService.getAllSessions(req.query);
    res.status(200).json({ success: true, data: sessions });
  });

  public getSessionStatistics = asyncHandler(
    async (req: Request, res: Response) => {
      const stats = await this.securityService.getSessionStatistics();
      res.status(200).json({ success: true, data: stats });
    },
  );

  public getSessionById = asyncHandler(async (req: Request, res: Response) => {
    const session = await this.securityService.getSessionById(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: session });
  });

  public terminateSession = asyncHandler(
    async (req: Request, res: Response) => {
      await this.securityService.terminateSession(req.params.id as string);
      res
        .status(200)
        .json({ success: true, message: "Session terminated successfully" });
    },
  );

  public logoutAllSessions = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.body;
      await this.securityService.logoutAllSessions(userId);
      res.status(200).json({
        success: true,
        message: "All sessions logged out successfully",
      });
    },
  );

  public revokeRefreshToken = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.body;
      await this.securityService.revokeRefreshToken(userId);
      res
        .status(200)
        .json({ success: true, message: "Refresh token revoked successfully" });
    },
  );

  public getDevices = asyncHandler(async (req: Request, res: Response) => {
    const devices = await this.securityService.getAllDevices(req.query);
    res.status(200).json({ success: true, data: devices });
  });

  public getDeviceStatistics = asyncHandler(
    async (req: Request, res: Response) => {
      const stats = await this.securityService.getDeviceStatistics();
      res.status(200).json({ success: true, data: stats });
    },
  );

  public getDeviceById = asyncHandler(async (req: Request, res: Response) => {
    const device = await this.securityService.getDeviceById(
      req.params.id as string,
    );
    res.status(200).json({ success: true, data: device });
  });

  public trustDevice = asyncHandler(async (req: Request, res: Response) => {
    // req.user from authentication middleware contains the actor
    const actorId = (req as any).user?._id;
    await this.securityService.updateDeviceTrust(
      req.params.id as string,
      true,
      actorId,
    );
    res
      .status(200)
      .json({ success: true, message: "Device trusted successfully" });
  });

  public untrustDevice = asyncHandler(async (req: Request, res: Response) => {
    const actorId = (req as any).user?._id;
    await this.securityService.updateDeviceTrust(
      req.params.id as string,
      false,
      actorId,
    );
    res
      .status(200)
      .json({ success: true, message: "Device untrusted successfully" });
  });

  public blockDevice = asyncHandler(async (req: Request, res: Response) => {
    const actorId = (req as any).user?._id;
    await this.securityService.updateDeviceBlock(
      req.params.id as string,
      true,
      actorId,
    );
    res
      .status(200)
      .json({ success: true, message: "Device blocked successfully" });
  });

  public unblockDevice = asyncHandler(async (req: Request, res: Response) => {
    const actorId = (req as any).user?._id;
    await this.securityService.updateDeviceBlock(
      req.params.id as string,
      false,
      actorId,
    );
    res
      .status(200)
      .json({ success: true, message: "Device unblocked successfully" });
  });

  public removeDevice = asyncHandler(async (req: Request, res: Response) => {
    const actorId = (req as any).user?._id;
    await this.securityService.removeDevice(req.params.id as string, actorId);
    res
      .status(200)
      .json({ success: true, message: "Device removed successfully" });
  });

  // --- IP Rule Management ---
  public getIpRuleStatistics = asyncHandler(
    async (req: Request, res: Response) => {
      res.status(501).json({ success: false, message: "Not implemented" });
    },
  );
  public importIpRules = asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  });
  public exportIpRules = asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  });
  public getIpRules = asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  });
  public getIpRuleById = asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  });
  public createIpRule = asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  });
  public updateIpRule = asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  });
  public deleteIpRule = asyncHandler(async (req: Request, res: Response) => {
    res.status(501).json({ success: false, message: "Not implemented" });
  });

  // --- Auth Policies ---

  public getAuthPolicies = asyncHandler(async (req: Request, res: Response) => {
    const policies = await this.securityService.getAuthPolicies();
    res.status(200).json({ success: true, data: policies });
  });

  public updateAuthPolicies = asyncHandler(
    async (req: Request, res: Response) => {
      // req.user is populated by authentication middleware
      const userId = (req as any).user?._id;
      const policies = await this.securityService.updateAuthPolicies(
        req.body,
        userId,
      );
      res.status(200).json({ success: true, data: policies });
    },
  );

  public resetAuthPolicies = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req as any).user?._id;
      const policy = await this.securityService.resetAuthPolicies(userId);
      res.status(200).json({
        success: true,
        data: policy,
        message: "Auth Policies reset to defaults successfully",
      });
    },
  );

  // ==========================================
  // MULTI-FACTOR AUTHENTICATION (MFA)
  // ==========================================

  public getMfaSettings = asyncHandler(async (req: Request, res: Response) => {
    const policy = await this.securityService.getMfaSettings();
    res.status(200).json({
      success: true,
      data: policy,
      message: "MFA Policies retrieved successfully",
    });
  });

  public updateMfaSettings = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req as any).user?._id;
      const updates = req.body;
      const policy = await this.securityService.updateMfaSettings(
        updates,
        userId,
      );
      res.status(200).json({
        success: true,
        data: policy,
        message: "MFA Policies updated successfully",
      });
    },
  );

  public getMfaStatistics = asyncHandler(
    async (req: Request, res: Response) => {
      const stats = await this.securityService.getMfaStatistics();
      res.status(200).json({
        success: true,
        data: stats,
        message: "MFA Statistics retrieved successfully",
      });
    },
  );

  public getMfaUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const users = await this.securityService.getMfaUsers(page, limit);
    res.status(200).json({
      success: true,
      data: users,
      message: "MFA Users retrieved successfully",
    });
  });

  public disableMfaUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const targetUserId = req.params.id as string;
    const result = await this.securityService.disableMfaUser(
      targetUserId,
      userId,
    );
    res.status(200).json({
      success: true,
      data: result,
      message: "User MFA disabled successfully",
    });
  });

  public resetMfaUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?._id;
    const targetUserId = req.params.id as string;
    const result = await this.securityService.resetMfaUser(
      targetUserId,
      userId,
    );
    res.status(200).json({
      success: true,
      data: result,
      message: "User MFA reset successfully",
    });
  });

  public generateRecoveryCodes = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req as any).user?._id;
      const targetUserId = req.params.id as string;
      const result = await this.securityService.generateRecoveryCodes(
        targetUserId,
        userId,
      );
      res.status(200).json({
        success: true,
        data: result,
        message: "Recovery codes generated successfully",
      });
    },
  );

  // ==========================================
  // THREAT DETECTION & SECURITY EVENTS
  // ==========================================

  public getSecurityEvents = asyncHandler(
    async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const filters = {
        severity: req.query.severity,
        status: req.query.status,
        category: req.query.category,
        search: req.query.search,
      };
      const events = await this.securityService.getSecurityEvents(
        filters,
        page,
        limit,
      );
      res.status(200).json({
        success: true,
        data: events,
        message: "Security events retrieved successfully",
      });
    },
  );

  public getSecurityEventStatistics = asyncHandler(
    async (req: Request, res: Response) => {
      const stats = await this.securityService.getSecurityEventStatistics();
      res.status(200).json({
        success: true,
        data: stats,
        message: "Security statistics retrieved successfully",
      });
    },
  );

  public getSecurityEventDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const event = await this.securityService.getSecurityEventDetails(
        req.params.id as string,
      );
      res.status(200).json({
        success: true,
        data: event,
        message: "Security event details retrieved successfully",
      });
    },
  );

  public updateSecurityEventStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const actorId = (req as any).user?._id;
      const { status } = req.body;
      const event = await this.securityService.updateSecurityEventStatus(
        req.params.id as string,
        status,
        actorId,
      );
      res.status(200).json({
        success: true,
        data: event,
        message: "Security event status updated successfully",
      });
    },
  );

  public assignSecurityEvent = asyncHandler(
    async (req: Request, res: Response) => {
      const actorId = (req as any).user?._id;
      const { userId } = req.body;
      const event = await this.securityService.assignSecurityEvent(
        req.params.id as string,
        userId,
        actorId,
      );
      res.status(200).json({
        success: true,
        data: event,
        message: "Security event assigned successfully",
      });
    },
  );

  // ==========================================
  // AUDIT LOGS & COMPLIANCE
  // ==========================================

  public getAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const audits = await this.securityService.getAuditLogs(req.query);
    res.status(200).json({
      success: true,
      data: audits,
      message: "Audit logs fetched successfully",
    });
  });

  public getAuditLogDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const audit = await this.securityService.getAuditLogById(
        req.params.id as string,
      );
      res.status(200).json({
        success: true,
        data: audit,
        message: "Audit log fetched successfully",
      });
    },
  );

  public getAuditStatistics = asyncHandler(
    async (req: Request, res: Response) => {
      const stats = await this.securityService.getAuditStatistics(
        req.query.companyId as string,
      );
      res.status(200).json({
        success: true,
        data: stats,
        message: "Audit statistics fetched successfully",
      });
    },
  );

  public exportAuditLogs = asyncHandler(async (req: Request, res: Response) => {
    const buffer = await this.securityService.exportAuditLogs(req.query);
    res.setHeader("Content-Disposition", "attachment; filename=audit-logs.csv");
    res.setHeader("Content-Type", "text/csv");
    res.status(200).send(buffer);
  });

  public getComplianceSettings = asyncHandler(
    async (req: Request, res: Response) => {
      const settings = await this.securityService.getComplianceSettings(
        req.query.companyId as string,
      );
      res.status(200).json({
        success: true,
        data: settings,
        message: "Compliance settings fetched successfully",
      });
    },
  );

  public updateComplianceSettings = asyncHandler(
    async (req: Request, res: Response) => {
      const actorId = (req as any).user?._id;
      const settings = await this.securityService.updateComplianceSettings(
        req.body,
        actorId,
        req.query.companyId as string,
      );
      res.status(200).json({
        success: true,
        data: settings,
        message: "Compliance settings updated successfully",
      });
    },
  );
}
