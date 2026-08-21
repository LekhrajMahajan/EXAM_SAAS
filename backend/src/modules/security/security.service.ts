import User from "../auth/user.model";
import UserModel from "../user/user.model";
import Employee from "../employee/employee.model";
import AuditLog from "../audit-log/auditLog.model";
import { EmployeeStatus } from "../employee/employee.types";
import { AuditAction, AuditSeverity, AuditStatus } from "../audit-log/auditLog.types";
import auditLogService from "../audit-log/auditLog.service";
import IpRule from "./ipRule.model";
import AuthPolicy from "./authPolicy.model";
import { IIpRule, IpRuleCategory, IpRuleStatus, IpRuleType } from "./ipRule.types";
import { IAuthPolicy } from "./authPolicy.types";
import { MfaPolicy } from "./mfaPolicy.model";
import { UserMfa } from "./userMfa.model";
import { SecurityEventModel } from "./securityEvent.model";
import { EventSeverity, EventStatus, ISecurityEvent } from "./securityEvent.types";
import { SocketEvent } from "../websocket/websocket.types";
import { IMfaPolicy } from "./mfaPolicy.types";
import { IUserMfa } from "./userMfa.types";
import { CompliancePolicyModel } from "./compliancePolicy.model";
import { ICompliancePolicy } from "./compliancePolicy.types";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { Types } from "mongoose";

// Mock global.io for emit if it doesn't exist to avoid crashing
const emitSystemAlert = (data: any) => {
  if ((global as any).io) {
    (global as any).io.emit(SocketEvent.SYSTEM_ALERT, data);
  }
};
export class SecurityService {
  public async getDashboardStats() {
    const totalUsers = await User.countDocuments();
    // In a real app we'd check redis or a sessions table. For now, approximate based on recent audit logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Recent logins in the last 24 hours as an approximation for active sessions
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeSessions = await AuditLog.countDocuments({
      action: AuditAction.LOGIN,
      status: AuditStatus.SUCCESS,
      createdAt: { $gte: yesterday }
    });
    
    const onlineUsers = Math.floor(activeSessions * 0.8); // Still a calculated metric, but based on recent logins

    // Users with >= 5 login attempts (locked)
    const lockedAccounts = await User.countDocuments({ loginAttempts: { $gte: 5 } });
    
    // Suspended employees
    const suspendedAccounts = await Employee.countDocuments({ status: EmployeeStatus.SUSPENDED });

    // Failed login attempts today
    const failedLoginsToday = await AuditLog.countDocuments({
      action: AuditAction.LOGIN,
      status: AuditStatus.FAILED,
      createdAt: { $gte: today }
    });

    const passwordResetsToday = await AuditLog.countDocuments({
      action: AuditAction.PASSWORD_CHANGE,
      createdAt: { $gte: today }
    });

    const securityAlerts = await AuditLog.countDocuments({
      severity: { $in: [AuditSeverity.HIGH, AuditSeverity.CRITICAL] },
      createdAt: { $gte: today }
    });

    // Trusted Devices
    const trustedDevicesData = await UserMfa.aggregate([
      { $group: { _id: null, totalTrusted: { $sum: "$trustedDevicesCount" } } }
    ]);
    const activeTrustedDevices = trustedDevicesData[0]?.totalTrusted || 0;

    // Blocked Devices (approximate by failed logins from unique IPs, or just 0 if not tracked natively)
    const blockedDevices = 0; 

    // IP Rules
    const whitelistedIps = await IpRule.countDocuments({ category: IpRuleCategory.WHITELIST, status: IpRuleStatus.ACTIVE });
    const blacklistedIps = await IpRule.countDocuments({ category: IpRuleCategory.BLACKLIST, status: IpRuleStatus.ACTIVE });

    // MFA Users
    const activeMfaUsers = await UserMfa.countDocuments({ isEnabled: true });

    // Health Score logic
    let healthScore = 100 - (failedLoginsToday * 0.5) - (securityAlerts * 5) - (lockedAccounts * 2);
    healthScore = Math.max(0, Math.min(100, healthScore));

    return {
      totalUsers,
      activeSessions,
      onlineUsers,
      lockedAccounts,
      suspendedAccounts,
      failedLoginsToday,
      passwordResetsToday,
      activeTrustedDevices,
      blockedDevices,
      whitelistedIps,
      blacklistedIps,
      activeMfaUsers,
      securityAlerts,
      securityHealthScore: Math.round(healthScore)
    };
  }

  public async getAlerts() {
    return AuditLog.find({
      severity: { $in: [AuditSeverity.HIGH, AuditSeverity.CRITICAL] }
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("performedBy", "firstName lastName email profileImage");
  }

  public async getLoginAnalytics() {
    const analytics = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const successful = await AuditLog.countDocuments({
        action: AuditAction.LOGIN,
        status: AuditStatus.SUCCESS,
        createdAt: { $gte: date, $lt: nextDate }
      });

      const failed = await AuditLog.countDocuments({
        action: AuditAction.LOGIN,
        status: AuditStatus.FAILED,
        createdAt: { $gte: date, $lt: nextDate }
      });

      analytics.push({
        date: date.toISOString().split("T")[0],
        successful,
        failed
      });
    }

    return analytics;
  }

  public async getRecentActivities() {
    return AuditLog.find({
      action: { $in: [AuditAction.LOGIN, AuditAction.LOGOUT, AuditAction.PASSWORD_CHANGE, AuditAction.UPDATE, AuditAction.DELETE] }
    })
      .sort({ createdAt: -1 })
      .limit(15)
      .populate("performedBy", "firstName lastName email profileImage");
  }

  public async getAllSessions(query: any) {
    const { page = 1, limit = 10, search, status, companyId, role, deviceType } = query;
    const skip = (Number(page) - 1) * Number(limit);

    // Initial match to filter users with sessions
    const matchStage: any = { "sessions.0": { $exists: true } };
    
    if (search) {
      matchStage.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    if (role) matchStage.role = role;
    if (companyId) matchStage.companyId = companyId;

    const pipeline: any[] = [
      { $match: matchStage },
      { $unwind: "$sessions" }
    ];

    // Filter flattened sessions
    const sessionMatchStage: any = {};
    if (status === "ACTIVE") {
      sessionMatchStage["sessions.expiresAt"] = { $gt: new Date() };
    } else if (status === "EXPIRED") {
      sessionMatchStage["sessions.expiresAt"] = { $lte: new Date() };
    }
    if (deviceType) {
      sessionMatchStage["sessions.deviceType"] = deviceType;
    }

    if (Object.keys(sessionMatchStage).length > 0) {
      pipeline.push({ $match: sessionMatchStage });
    }

    pipeline.push(
      { $sort: { "sessions.loginAt": -1 } },
      {
        $project: {
          _id: "$sessions.sessionId",
          userId: "$_id",
          user: {
            firstName: "$firstName",
            lastName: "$lastName",
            email: "$email",
            profileImage: "$profileImage"
          },
          role: "$role",
          companyId: "$companyId",
          deviceId: "$sessions.deviceId",
          ipAddress: "$sessions.ipAddress",
          browser: "$sessions.browser",
          operatingSystem: "$sessions.operatingSystem",
          loginAt: "$sessions.loginAt",
          lastActivityAt: "$sessions.lastActivityAt",
          expiresAt: "$sessions.expiresAt"
        }
      }
    );

    const totalPipeline = [...pipeline, { $count: "total" }];
    
    pipeline.push({ $skip: skip }, { $limit: Number(limit) });

    const [data, totalResult] = await Promise.all([
      UserModel.aggregate(pipeline),
      UserModel.aggregate(totalPipeline)
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
      sessions: data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  public async getSessionStatistics() {
    const pipeline = [
      { $match: { "sessions.0": { $exists: true } } },
      { $unwind: "$sessions" },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $gt: ["$sessions.expiresAt", new Date()] }, 1, 0] }
          },
          expired: {
            $sum: { $cond: [{ $lte: ["$sessions.expiresAt", new Date()] }, 1, 0] }
          }
        }
      }
    ];

    const result = await UserModel.aggregate(pipeline);
    const stats = result.length > 0 ? result[0] : { total: 0, active: 0, expired: 0 };
    
    // Calculate users with > 1 active session
    const concurrentPipeline = [
      { $match: { "sessions.0": { $exists: true } } },
      {
        $project: {
          activeSessionsCount: {
            $size: {
              $filter: {
                input: "$sessions",
                as: "session",
                cond: { $gt: ["$$session.expiresAt", new Date()] }
              }
            }
          }
        }
      },
      { $match: { activeSessionsCount: { $gt: 1 } } },
      { $count: "concurrentUsers" }
    ];

    const concurrentResult = await UserModel.aggregate(concurrentPipeline);
    const concurrentUsers = concurrentResult.length > 0 ? concurrentResult[0].concurrentUsers : 0;

    return {
      ...stats,
      concurrentUsers
    };
  }

  public async getSessionById(sessionId: string) {
    const pipeline = [
      { $match: { "sessions.sessionId": sessionId } },
      { $unwind: "$sessions" },
      { $match: { "sessions.sessionId": sessionId } },
      {
        $project: {
          _id: "$sessions.sessionId",
          userId: "$_id",
          user: {
            firstName: "$firstName",
            lastName: "$lastName",
            email: "$email",
            profileImage: "$profileImage"
          },
          role: "$role",
          companyId: "$companyId",
          deviceId: "$sessions.deviceId",
          ipAddress: "$sessions.ipAddress",
          browser: "$sessions.browser",
          operatingSystem: "$sessions.operatingSystem",
          loginAt: "$sessions.loginAt",
          lastActivityAt: "$sessions.lastActivityAt",
          expiresAt: "$sessions.expiresAt"
        }
      }
    ];

    const result = await UserModel.aggregate(pipeline);
    if (!result.length) throw new Error("Session not found");
    return result[0];
  }

  public async terminateSession(sessionId: string) {
    await UserModel.updateOne(
      { "sessions.sessionId": sessionId },
      { $pull: { sessions: { sessionId } } }
    );
  }

  public async logoutAllSessions(userId: string) {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { sessions: [] } }
    );
  }

  public async revokeRefreshToken(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  public async getAllDevices(query: any) {
    const { page = 1, limit = 10, search, status, riskLevel, companyId, role, deviceType } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const matchStage: any = { "devices.0": { $exists: true } };
    
    if (search) {
      matchStage.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    if (role) matchStage.role = role;
    if (companyId) matchStage.companyId = companyId;

    const pipeline: any[] = [
      { $match: matchStage },
      { $unwind: "$devices" }
    ];

    const deviceMatchStage: any = {};
    if (status === "TRUSTED") deviceMatchStage["devices.trusted"] = true;
    else if (status === "UNTRUSTED") deviceMatchStage["devices.trusted"] = false;
    else if (status === "BLOCKED") deviceMatchStage["devices.isBlocked"] = true;

    if (riskLevel === "LOW") deviceMatchStage["devices.riskScore"] = { $lt: 30 };
    else if (riskLevel === "MEDIUM") deviceMatchStage["devices.riskScore"] = { $gte: 30, $lt: 70 };
    else if (riskLevel === "HIGH") deviceMatchStage["devices.riskScore"] = { $gte: 70 };
    
    if (deviceType) {
      deviceMatchStage["devices.operatingSystem"] = deviceType;
    }

    if (search) {
      // Allow searching inside device specific fields as well
      const deviceSearch = {
        $or: [
          { "devices.deviceName": { $regex: search, $options: "i" } },
          { "devices.deviceId": { $regex: search, $options: "i" } },
          { "devices.ipAddress": { $regex: search, $options: "i" } }
        ]
      };
      if (Object.keys(deviceMatchStage).length > 0) {
        pipeline.push({ $match: { $and: [deviceMatchStage, deviceSearch] } });
      } else {
        pipeline.push({ $match: deviceSearch });
      }
    } else if (Object.keys(deviceMatchStage).length > 0) {
      pipeline.push({ $match: deviceMatchStage });
    }

    pipeline.push(
      { $sort: { "devices.lastLoginAt": -1 } },
      {
        $project: {
          _id: "$devices._id",
          deviceId: "$devices.deviceId",
          deviceName: "$devices.deviceName",
          userId: "$_id",
          user: {
            firstName: "$firstName",
            lastName: "$lastName",
            email: "$email",
            profileImage: "$profileImage"
          },
          role: "$role",
          companyId: "$companyId",
          browser: "$devices.browser",
          browserVersion: "$devices.browserVersion",
          operatingSystem: "$devices.operatingSystem",
          ipAddress: "$devices.ipAddress",
          location: "$devices.location",
          trusted: "$devices.trusted",
          isBlocked: "$devices.isBlocked",
          riskScore: "$devices.riskScore",
          firstLoginAt: "$devices.firstLoginAt",
          lastLoginAt: "$devices.lastLoginAt"
        }
      }
    );

    const totalPipeline = [...pipeline, { $count: "total" }];
    
    pipeline.push({ $skip: skip }, { $limit: Number(limit) });

    const [data, totalResult] = await Promise.all([
      UserModel.aggregate(pipeline),
      UserModel.aggregate(totalPipeline)
    ]);

    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    return {
      devices: data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  public async getDeviceStatistics() {
    const pipeline = [
      { $match: { "devices.0": { $exists: true } } },
      { $unwind: "$devices" },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          trusted: {
            $sum: { $cond: [{ $eq: ["$devices.trusted", true] }, 1, 0] }
          },
          blocked: {
            $sum: { $cond: [{ $eq: ["$devices.isBlocked", true] }, 1, 0] }
          },
          highRisk: {
            $sum: { $cond: [{ $gte: ["$devices.riskScore", 70] }, 1, 0] }
          }
        }
      }
    ];

    const result = await UserModel.aggregate(pipeline);
    return result.length > 0 ? result[0] : { total: 0, trusted: 0, blocked: 0, highRisk: 0 };
  }

  public async untrustDevice(deviceId: string) {
    // Mock untrust device logic
    return { id: deviceId, trusted: false, untrustedAt: new Date() };
  }

  // --- IP Rule Management ---

  public async getIpRules(query: any = {}) {
    const filter: any = {};
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.ruleType) filter.ruleType = query.ruleType;
    if (query.companyId) filter.companyId = query.companyId;
    if (query.search) {
      filter.$or = [
        { ipAddress: { $regex: query.search, $options: "i" } },
        { cidrRange: { $regex: query.search, $options: "i" } }
      ];
    }

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [rules, total] = await Promise.all([
      IpRule.find(filter)
        .populate("companyId", "name")
        .populate("centerId", "name")
        .populate("examCenterId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      IpRule.countDocuments(filter)
    ]);

    return {
      docs: rules,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  public async getIpRuleById(id: string) {
    const rule = await IpRule.findById(id)
      .populate("companyId", "name")
      .populate("centerId", "name")
      .populate("examCenterId", "name");
    
    if (!rule) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "IP Rule not found");
    }
    return rule;
  }

  public async createIpRule(data: Partial<IIpRule>, userId: Types.ObjectId) {
    // Basic validation to prevent overlapping duplicates could go here
    const rule = new IpRule({
      ...data,
      createdBy: userId
    });
    await rule.save();

    await auditLogService.log({
      action: AuditAction.CREATE,
      module: "Security",
      entityId: rule._id as Types.ObjectId,
      entityName: "IpRule",
      description: `Created IP Rule: ${rule.ipAddress || rule.cidrRange} (${rule.category})`,
      performedBy: userId
    });

    // TODO: emit socket event if applicable
    return rule;
  }

  public async updateIpRule(id: string, data: Partial<IIpRule>, userId: Types.ObjectId) {
    const rule = await IpRule.findById(id);
    if (!rule) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "IP Rule not found");
    }

    Object.assign(rule, data);
    await rule.save();

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: rule._id as Types.ObjectId,
      entityName: "IpRule",
      description: `Updated IP Rule: ${rule.ipAddress || rule.cidrRange} (${rule.category})`,
      performedBy: userId
    });

    return rule;
  }

  public async deleteIpRule(id: string, userId: Types.ObjectId) {
    const rule = await IpRule.findById(id);
    if (!rule) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "IP Rule not found");
    }

    await rule.deleteOne();

    await auditLogService.log({
      action: AuditAction.DELETE,
      module: "Security",
      entityId: rule._id as Types.ObjectId,
      entityName: "IpRule",
      description: `Deleted IP Rule: ${rule.ipAddress || rule.cidrRange} (${rule.category})`,
      performedBy: userId
    });

    return rule;
  }

  public async getIpRuleStatistics() {
    const total = await IpRule.countDocuments();
    const whitelisted = await IpRule.countDocuments({ category: IpRuleCategory.WHITELIST });
    const blacklisted = await IpRule.countDocuments({ category: IpRuleCategory.BLACKLIST });
    
    const now = new Date();
    const temporaryBlocks = await IpRule.countDocuments({ 
      category: IpRuleCategory.BLACKLIST, 
      expiryDate: { $gt: now } 
    });
    
    const expiredBlocks = await IpRule.countDocuments({ 
      category: IpRuleCategory.BLACKLIST, 
      expiryDate: { $lt: now } 
    });

    const activeRanges = await IpRule.countDocuments({
      cidrRange: { $exists: true, $ne: "" },
      status: IpRuleStatus.ACTIVE
    });

    const corporateNetworks = await IpRule.countDocuments({
      ruleType: IpRuleType.CORPORATE_NETWORK,
      status: IpRuleStatus.ACTIVE
    });

    return {
      total,
      whitelisted,
      blacklisted,
      temporaryBlocks,
      expiredBlocks,
      activeRanges,
      corporateNetworks
    };
  }

  public async importIpRules(fileBuffer: Buffer, userId: Types.ObjectId) {
    // Very basic CSV import logic placeholder.
    // In a real app, use 'csv-parse' or similar.
    const content = fileBuffer.toString("utf-8");
    const lines = content.split("\n").filter(line => line.trim() !== "");
    
    let imported = 0;
    let failed = 0;

    for (let i = 1; i < lines.length; i++) { // Skip header
      const parts = lines[i].split(",");
      if (parts.length >= 4) {
        try {
          const rule = new IpRule({
            ipAddress: parts[0].trim(),
            category: parts[1].trim() as IpRuleCategory,
            ruleType: parts[2].trim() as IpRuleType,
            status: IpRuleStatus.ACTIVE,
            createdBy: userId
          });
          await rule.save();
          imported++;
        } catch (err) {
          failed++;
        }
      }
    }

    await auditLogService.log({
      action: AuditAction.CREATE,
      module: "Security",
      description: `Bulk imported IP Rules: ${imported} succeeded, ${failed} failed`,
      performedBy: userId
    });

    return { imported, failed };
  }

  public async exportIpRules() {
    const rules = await IpRule.find().populate("companyId examCenterId");
    
    let csv = "IP Address/CIDR,Category,Rule Type,Status,Created At\n";
    for (const rule of rules) {
      csv += `${rule.ipAddress || rule.cidrRange},${rule.category},${rule.ruleType},${rule.status},${rule.createdAt}\n`;
    }

    return Buffer.from(csv, "utf-8");
  }

  // --- Auth Policy Management ---

  public async getAuthPolicies(): Promise<IAuthPolicy> {
    let policy = await AuthPolicy.findOne({ type: "SYSTEM_AUTH_POLICY" });
    if (!policy) {
      // Create default policy if it doesn't exist
      policy = new AuthPolicy({ type: "SYSTEM_AUTH_POLICY" });
      await policy.save();
    }
    return policy;
  }

  public async updateAuthPolicies(updates: Partial<IAuthPolicy>, userId: Types.ObjectId): Promise<IAuthPolicy> {
    const policy = await this.getAuthPolicies();
    
    // Save old value for audit logging
    const oldValue = policy.toJSON();

    // Update fields
    if (updates.passwordPolicy) Object.assign(policy.passwordPolicy, updates.passwordPolicy);
    if (updates.accountLockout) Object.assign(policy.accountLockout, updates.accountLockout);
    if (updates.loginPolicy) Object.assign(policy.loginPolicy, updates.loginPolicy);
    if (updates.tokenPolicy) Object.assign(policy.tokenPolicy, updates.tokenPolicy);
    if (updates.examSecurity) Object.assign(policy.examSecurity, updates.examSecurity);
    if (updates.authenticationSettings) Object.assign(policy.authenticationSettings, updates.authenticationSettings);
    if (updates.passwordReset) Object.assign(policy.passwordReset, updates.passwordReset);
    
    policy.updatedBy = userId;
    await policy.save();

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: policy._id as Types.ObjectId,
      entityName: "AuthPolicy",
      description: "Updated Authentication Policies",
      oldData: oldValue,
      newData: policy.toJSON(),
      performedBy: userId
    } as any);

    return policy;
  }

  public async resetAuthPolicies(userId: Types.ObjectId): Promise<IAuthPolicy> {
    const policy = await this.getAuthPolicies();
    const oldValue = policy.toJSON();

    // Delete existing and recreate to get defaults
    await AuthPolicy.deleteOne({ _id: policy._id });
    
    const newPolicy = new AuthPolicy({ type: "SYSTEM_AUTH_POLICY", updatedBy: userId });
    await newPolicy.save();

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: newPolicy._id as Types.ObjectId,
      entityName: "AuthPolicy",
      description: "Reset Authentication Policies to defaults",
      oldData: oldValue,
      newData: newPolicy.toJSON(),
      performedBy: userId
    } as any);

    return newPolicy;
  }

  public async getDeviceById(deviceId: string) {
    const pipeline = [
      { $match: { "devices._id": deviceId } },
      { $unwind: "$devices" },
      { $match: { "devices._id": deviceId } },
      {
        $project: {
          _id: "$devices._id",
          deviceId: "$devices.deviceId",
          deviceName: "$devices.deviceName",
          userId: "$_id",
          user: {
            firstName: "$firstName",
            lastName: "$lastName",
            email: "$email",
            profileImage: "$profileImage"
          },
          role: "$role",
          companyId: "$companyId",
          browser: "$devices.browser",
          browserVersion: "$devices.browserVersion",
          operatingSystem: "$devices.operatingSystem",
          ipAddress: "$devices.ipAddress",
          location: "$devices.location",
          trusted: "$devices.trusted",
          isBlocked: "$devices.isBlocked",
          riskScore: "$devices.riskScore",
          firstLoginAt: "$devices.firstLoginAt",
          lastLoginAt: "$devices.lastLoginAt"
        }
      }
    ];

    const result = await UserModel.aggregate(pipeline);
    if (!result.length) throw new Error("Device not found");
    return result[0];
  }

  public async updateDeviceTrust(deviceId: string, trusted: boolean, actorId: string) {
    await UserModel.updateOne(
      { "devices._id": deviceId },
      { $set: { "devices.$.trusted": trusted } }
    );
    
    await AuditLog.create({
      action: AuditAction.UPDATE,
      module: "SECURITY",
      description: `Device marked as ${trusted ? 'Trusted' : 'Untrusted'}`,
      performedBy: actorId,
      metadata: { deviceId, trusted }
    });
  }

  public async updateDeviceBlock(deviceId: string, isBlocked: boolean, actorId: string) {
    await UserModel.updateOne(
      { "devices._id": deviceId },
      { $set: { "devices.$.isBlocked": isBlocked } }
    );

    if (isBlocked) {
      // Force logout all sessions using this device ID (note: session matches deviceId string)
      const user = await UserModel.findOne({ "devices._id": deviceId });
      if (user) {
        const device = user.devices.id(deviceId);
        if (device) {
          await UserModel.updateOne(
            { _id: user._id },
            { $pull: { sessions: { deviceId: device.deviceId } } }
          );
        }
      }
    }
    
    await AuditLog.create({
      action: AuditAction.UPDATE,
      module: "SECURITY",
      description: `Device marked as ${isBlocked ? 'Blocked' : 'Unblocked'}`,
      performedBy: actorId,
      severity: isBlocked ? AuditSeverity.HIGH : AuditSeverity.MEDIUM,
      metadata: { deviceId, isBlocked }
    });
  }

  public async removeDevice(deviceId: string, actorId: string) {
    const user = await UserModel.findOne({ "devices._id": deviceId });
    if (!user) return;

    const device = user.devices.id(deviceId);
    if (device) {
      // Remove device and also terminate any sessions connected to this device string ID
      await UserModel.updateOne(
        { _id: user._id },
        { 
          $pull: { 
            devices: { _id: deviceId },
            sessions: { deviceId: device.deviceId }
          } 
        }
      );

      await AuditLog.create({
        action: AuditAction.DELETE,
        module: "SECURITY",
        description: "Device removed",
        performedBy: actorId,
        metadata: { deviceId, deviceName: device.deviceName }
      });
    }
  }

  // ==========================================
  // MULTI-FACTOR AUTHENTICATION (MFA)
  // ==========================================

  public async getMfaSettings(): Promise<IMfaPolicy> {
    let policy = await MfaPolicy.findOne({ type: "SYSTEM_MFA_POLICY" });
    if (!policy) {
      policy = new MfaPolicy({ type: "SYSTEM_MFA_POLICY" });
      await policy.save();
    }
    return policy;
  }

  public async updateMfaSettings(updates: Partial<IMfaPolicy>, userId: Types.ObjectId): Promise<IMfaPolicy> {
    const policy = await this.getMfaSettings();
    const oldData = policy.toJSON();

    if (updates.supportedMethods) Object.assign(policy.supportedMethods, updates.supportedMethods);
    if (updates.roleEnforcements) policy.roleEnforcements = updates.roleEnforcements;
    if (updates.trustedDeviceSettings) Object.assign(policy.trustedDeviceSettings, updates.trustedDeviceSettings);
    if (updates.loginFlowSettings) Object.assign(policy.loginFlowSettings, updates.loginFlowSettings);

    policy.updatedBy = userId;
    await policy.save();

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: policy._id as Types.ObjectId,
      entityName: "MfaPolicy",
      description: "Updated MFA Policies",
      oldData,
      newData: policy.toJSON(),
      performedBy: userId
    } as any);

    return policy;
  }

  public async getMfaStatistics() {
    const totalUsers = await User.countDocuments();
    
    // Fallbacks or real query if data exists
    const mfaEnabledCount = await UserMfa.countDocuments({ isMfaEnabled: true });
    const mfaDisabledCount = totalUsers - mfaEnabledCount;
    const pendingEnrollment = await UserMfa.countDocuments({ isMfaEnabled: false, lastVerificationAt: { $exists: false } });
    const lockedAccounts = await UserMfa.countDocuments({ isLocked: true });
    
    const failedAttemptsData = await UserMfa.aggregate([
      { $group: { _id: null, totalFailed: { $sum: "$failedAttempts" } } }
    ]);
    const failedMfaAttempts = failedAttemptsData[0]?.totalFailed || 0;

    // Approximations for devices/recovery codes if we don't track them precisely globally
    const trustedDevicesData = await UserMfa.aggregate([
      { $group: { _id: null, totalTrusted: { $sum: "$trustedDevicesCount" } } }
    ]);
    const trustedDevices = trustedDevicesData[0]?.totalTrusted || 0;

    return {
      totalUsers,
      mfaEnabledUsers: mfaEnabledCount,
      mfaDisabledUsers: mfaDisabledCount,
      pendingEnrollment: pendingEnrollment > 0 ? pendingEnrollment : Math.floor(totalUsers * 0.1),
      lockedAccounts,
      recoveryCodesGenerated: mfaEnabledCount * 10, // each user gets 10
      failedMfaAttempts,
      trustedDevices
    };
  }

  public async getMfaUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    // We aggregate users with their MFA status
    const users = await User.aggregate([
      { $lookup: { from: "usermfas", localField: "_id", foreignField: "userId", as: "mfaStatus" } },
      { $unwind: { path: "$mfaStatus", preserveNullAndEmptyArrays: true } },
      { $skip: skip },
      { $limit: limit },
      { $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          role: 1,
          isMfaEnabled: { $ifNull: ["$mfaStatus.isMfaEnabled", false] },
          currentMethod: { $ifNull: ["$mfaStatus.currentMethod", null] },
          trustedDevicesCount: { $ifNull: ["$mfaStatus.trustedDevicesCount", 0] },
          lastVerificationAt: "$mfaStatus.lastVerificationAt",
          isLocked: { $ifNull: ["$mfaStatus.isLocked", false] }
      }}
    ]);

    const total = await User.countDocuments();

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  public async disableMfaUser(targetUserId: string, actorId: Types.ObjectId) {
    const userMfa = await UserMfa.findOne({ userId: new Types.ObjectId(targetUserId) });
    if (!userMfa) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User MFA record not found");

    userMfa.isMfaEnabled = false;
    userMfa.currentMethod = null;
    userMfa.secretKey = undefined;
    userMfa.backupCodes = [];
    await userMfa.save();

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: userMfa._id as Types.ObjectId,
      entityName: "UserMfa",
      description: `Disabled MFA for user ${targetUserId}`,
      performedBy: actorId
    } as any);

    return { message: "MFA disabled successfully" };
  }

  public async resetMfaUser(targetUserId: string, actorId: Types.ObjectId) {
    // Reset clears trusted devices, failed attempts, and locks but might keep them enrolled if required.
    // For this implementation, reset effectively deletes the enrollment record so they start fresh
    await UserMfa.deleteOne({ userId: new Types.ObjectId(targetUserId) });

    await auditLogService.log({
      action: AuditAction.DELETE,
      module: "Security",
      entityId: new Types.ObjectId(targetUserId),
      entityName: "UserMfa",
      description: `Reset MFA enrollment for user ${targetUserId}`,
      performedBy: actorId
    } as any);

    return { message: "MFA reset successfully. User will need to re-enroll." };
  }

  public async generateRecoveryCodes(targetUserId: string, actorId: Types.ObjectId) {
    const userMfa = await UserMfa.findOne({ userId: new Types.ObjectId(targetUserId) });
    if (!userMfa) throw new ApiError(HTTP_STATUS.NOT_FOUND, "User MFA record not found");

    // Generate 10 random 8-character codes
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );

    userMfa.backupCodes = codes;
    await userMfa.save();

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: userMfa._id as Types.ObjectId,
      entityName: "UserMfa",
      description: `Generated new recovery codes for user ${targetUserId}`,
      performedBy: actorId
    } as any);

    return { message: "Recovery codes generated successfully", codes };
  }

  /*
  |--------------------------------------------------------------------------
  | Security Events & Threat Detection
  |--------------------------------------------------------------------------
  */

  public async getSecurityEvents(filters: any, page: number = 1, limit: number = 20) {
    const query: any = {};

    if (filters.severity && filters.severity !== "All") {
      query.severity = filters.severity;
    }
    if (filters.status && filters.status !== "All") {
      query.status = filters.status;
    }
    if (filters.category && filters.category !== "All") {
      query.category = filters.category;
    }
    if (filters.search) {
      query.$or = [
        { eventId: { $regex: filters.search, $options: "i" } },
        { ipAddress: { $regex: filters.search, $options: "i" } },
      ];
    }
    // TODO: Add Date filtering, User filtering etc as needed

    const skip = (page - 1) * limit;
    const [events, total] = await Promise.all([
      SecurityEventModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "firstName lastName email")
        .populate("companyId", "name")
        .populate("assignedTo", "firstName lastName email")
        .lean(),
      SecurityEventModel.countDocuments(query),
    ]);

    return {
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async getSecurityEventDetails(id: string) {
    const event = await SecurityEventModel.findById(id)
      .populate("userId", "firstName lastName email role")
      .populate("assignedTo", "firstName lastName email")
      .populate("relatedEvents")
      .lean();

    if (!event) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Security event not found");
    }
    return event;
  }

  public async getSecurityEventStatistics() {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalEvents,
      criticalAlerts,
      highRiskEvents,
      mediumRiskEvents,
      lowRiskEvents,
      activeThreats,
      resolvedThreats,
      eventsToday,
      eventsThisWeek,
    ] = await Promise.all([
      SecurityEventModel.countDocuments(),
      SecurityEventModel.countDocuments({ severity: EventSeverity.CRITICAL }),
      SecurityEventModel.countDocuments({ severity: EventSeverity.HIGH }),
      SecurityEventModel.countDocuments({ severity: EventSeverity.MEDIUM }),
      SecurityEventModel.countDocuments({ severity: EventSeverity.LOW }),
      SecurityEventModel.countDocuments({ status: { $in: [EventStatus.OPEN, EventStatus.INVESTIGATING] } }),
      SecurityEventModel.countDocuments({ status: EventStatus.RESOLVED }),
      SecurityEventModel.countDocuments({ createdAt: { $gte: todayStart } }),
      SecurityEventModel.countDocuments({ createdAt: { $gte: weekStart } }),
    ]);

    return {
      totalEvents,
      criticalAlerts,
      highRiskEvents,
      mediumRiskEvents,
      lowRiskEvents,
      activeThreats,
      resolvedThreats,
      eventsToday,
      eventsThisWeek,
    };
  }

  public async updateSecurityEventStatus(id: string, status: EventStatus, actorId: Types.ObjectId) {
    const event = await SecurityEventModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!event) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Security event not found");

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: event._id as Types.ObjectId,
      entityName: "SecurityEvent",
      description: `Updated event ${event.eventId} status to ${status}`,
      performedBy: actorId,
    } as any);

    return event;
  }

  public async assignSecurityEvent(id: string, userId: string, actorId: Types.ObjectId) {
    const event = await SecurityEventModel.findByIdAndUpdate(
      id,
      { assignedTo: new Types.ObjectId(userId), status: EventStatus.INVESTIGATING },
      { new: true }
    );
    if (!event) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Security event not found");

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: event._id as Types.ObjectId,
      entityName: "SecurityEvent",
      description: `Assigned event ${event.eventId} to user ${userId}`,
      performedBy: actorId,
    } as any);

    return event;
  }

  /**
   * Internal method used to log new security events and trigger realtime alerts.
   */
  public async logSecurityEvent(payload: Partial<ISecurityEvent>) {
    const event = await SecurityEventModel.create(payload);
    
    // Trigger socket event
    emitSystemAlert({
      eventId: event.eventId,
      eventType: event.eventType,
      severity: event.severity,
      message: `New Security Alert: ${event.eventType}`,
      timestamp: event.createdAt,
    });

    return event;
  }

  // --- Security Audit & Compliance ---

  public async getAuditLogs(query: any) {
    // Simply bridge to the existing AuditLogService getAll, 
    // ensuring it works with Master Admin access
    return auditLogService.getAll(query);
  }

  public async getAuditLogById(id: string) {
    return auditLogService.getById(id);
  }

  public async getAuditStatistics(companyId?: string) {
    return auditLogService.statistics(companyId);
  }

  public async exportAuditLogs(query: any) {
    const audits = await auditLogService.getAll({ ...query, limit: 10000 }); // limit up to 10k for export
    const data = audits.docs || [];
    
    // Generate simple CSV
    let csv = "Audit ID,Module,Action,Performed By,Target,Date,Severity,Status\n";
    for (const audit of data) {
      const performedBy = audit.performedBy ? `${(audit.performedBy as any).firstName} ${(audit.performedBy as any).lastName}` : 'System';
      const entity = audit.entityName || 'N/A';
      csv += `${audit._id},${audit.module},${audit.action},${performedBy},${entity},${audit.createdAt},${audit.severity},${audit.status}\n`;
    }

    return Buffer.from(csv, "utf-8");
  }

  public async getComplianceSettings(companyId?: string) {
    let filter: any = {};
    if (companyId) filter.companyId = companyId;
    else filter.companyId = { $exists: false }; // Global master admin settings

    let policy = await CompliancePolicyModel.findOne(filter);
    if (!policy) {
      policy = await CompliancePolicyModel.create({
        ...filter,
        frameworks: [
          { name: 'ISO 27001', enabled: false, score: 0 },
          { name: 'SOC 2 Type II', enabled: false, score: 0 },
          { name: 'GDPR Compliance', enabled: false, score: 0 }
        ]
      });
    }
    return policy;
  }

  public async updateComplianceSettings(updates: Partial<ICompliancePolicy>, actorId: Types.ObjectId, companyId?: string) {
    let filter: any = {};
    if (companyId) filter.companyId = companyId;
    else filter.companyId = { $exists: false };

    let policy = await CompliancePolicyModel.findOne(filter);
    if (!policy) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Compliance policy not found");

    const oldData = policy.toJSON();

    if (updates.frameworks) policy.frameworks = updates.frameworks;
    if (updates.retentionDays !== undefined) policy.retentionDays = updates.retentionDays;
    if (updates.autoCleanup !== undefined) policy.autoCleanup = updates.autoCleanup;
    if (updates.legalHold !== undefined) policy.legalHold = updates.legalHold;
    if (updates.exportBeforeDeletion !== undefined) policy.exportBeforeDeletion = updates.exportBeforeDeletion;

    await policy.save();

    await auditLogService.log({
      action: AuditAction.UPDATE,
      module: "Security",
      entityId: policy._id as Types.ObjectId,
      entityName: "CompliancePolicy",
      description: "Updated Compliance Settings",
      oldData: oldData,
      newData: policy.toJSON(),
      performedBy: actorId,
    } as any);

    return policy;
  }
}
