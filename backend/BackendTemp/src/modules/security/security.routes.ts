// Dummy comment
import { Router } from "express";
import { SecurityController } from "./security.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();
const securityController = new SecurityController();

router.use(authenticate);
// Ensure only Master Admin can access these routes
router.use(authorize(UserRole.MASTER_ADMIN));

router.get("/dashboard", securityController.getDashboard);
router.get("/statistics", securityController.getStatistics);
router.get("/alerts", securityController.getAlerts);
router.get("/login-analytics", securityController.getLoginAnalytics);
router.get("/recent-activities", securityController.getRecentActivities);

router.get("/sessions", securityController.getSessions);
router.get("/sessions/statistics", securityController.getSessionStatistics);
router.get("/sessions/:id", securityController.getSessionById);
router.delete("/sessions/:id", securityController.terminateSession);
router.post("/sessions/logout-all", securityController.logoutAllSessions);
router.post("/sessions/revoke-refresh", securityController.revokeRefreshToken);

router.get("/devices", securityController.getDevices);
router.get("/devices/statistics", securityController.getDeviceStatistics);
router.get("/devices/:id", securityController.getDeviceById);
router.patch("/devices/:id/trust", securityController.trustDevice);
router.patch("/devices/:id/untrust", securityController.untrustDevice);
router.patch("/devices/:id/block", securityController.blockDevice);
router.patch("/devices/:id/unblock", securityController.unblockDevice);
router.delete("/devices/:id", securityController.removeDevice);

// --- IP Rule Management ---
router.get("/ip-rules/statistics", securityController.getIpRuleStatistics);
router.post("/ip-rules/import", upload.single("file"), securityController.importIpRules);
router.get("/ip-rules/export", securityController.exportIpRules);
router.get("/ip-rules", securityController.getIpRules);
router.get("/ip-rules/:id", securityController.getIpRuleById);
router.post("/ip-rules", securityController.createIpRule);
router.patch("/ip-rules/:id", securityController.updateIpRule);
router.delete("/ip-rules/:id", securityController.deleteIpRule);

// --- Auth Policies ---
router.get(
  "/auth-policies",
  authorize(UserRole.MASTER_ADMIN),
  securityController.getAuthPolicies
);
router.patch(
  "/auth-policies",
  authorize(UserRole.MASTER_ADMIN),
  securityController.updateAuthPolicies
);
router.post(
  "/auth-policies/reset",
  authorize(UserRole.MASTER_ADMIN),
  securityController.resetAuthPolicies
);

// --- Multi-Factor Authentication (MFA) ---
router.get(
  "/mfa/settings",
  authorize(UserRole.MASTER_ADMIN),
  securityController.getMfaSettings
);
router.patch(
  "/mfa/settings",
  authorize(UserRole.MASTER_ADMIN),
  securityController.updateMfaSettings
);
router.get(
  "/mfa/statistics",
  authorize(UserRole.MASTER_ADMIN),
  securityController.getMfaStatistics
);
router.get(
  "/mfa/users",
  authorize(UserRole.MASTER_ADMIN),
  securityController.getMfaUsers
);
router.patch(
  "/mfa/users/:id",
  authorize(UserRole.MASTER_ADMIN),
  securityController.disableMfaUser
);
router.post(
  "/mfa/users/:id/reset",
  authorize(UserRole.MASTER_ADMIN),
  securityController.resetMfaUser
);
router.post(
  "/mfa/users/:id/recovery-codes",
  authorize(UserRole.MASTER_ADMIN),
  securityController.generateRecoveryCodes
);

// --- Threat Detection & Security Events ---
router.get(
  "/events",
  securityController.getSecurityEvents
);
router.get(
  "/events/statistics",
  securityController.getSecurityEventStatistics
);
router.get(
  "/events/:id",
  securityController.getSecurityEventDetails
);
router.patch(
  "/events/:id",
  securityController.updateSecurityEventStatus
);
router.post(
  "/events/:id/assign",
  securityController.assignSecurityEvent
);

// --- Audit Logs & Compliance ---
router.get(
  "/audit/export",
  securityController.exportAuditLogs
);
router.get(
  "/audit/statistics",
  securityController.getAuditStatistics
);
router.get(
  "/audit/:id",
  securityController.getAuditLogDetails
);
router.get(
  "/audit",
  securityController.getAuditLogs
);

router.get(
  "/compliance/settings",
  securityController.getComplianceSettings
);
router.patch(
  "/compliance/settings",
  securityController.updateComplianceSettings
);

export default router;
