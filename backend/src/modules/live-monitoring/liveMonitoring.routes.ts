import { Router } from "express";

import * as liveMonitoringController from "./liveMonitoring.controller";
import * as liveMonitoringValidation from "./liveMonitoring.validation";

import { validate } from "../../middleware/validate";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

const router = Router();

// Dashboard & Analytics routes
router.get(
  "/observer-dashboard/:examId",
  authenticate,
  authorize(UserRole.OBSERVER, UserRole.MASTER_ADMIN, UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER),
  validate(liveMonitoringValidation.liveMonitoringDashboardSchema),
  liveMonitoringController.observerDashboard
);

router.get(
  "/command-center-dashboard/:examId",
  authenticate,
  authorize(UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.MASTER_ADMIN, UserRole.MASTER_ADMIN),
  validate(liveMonitoringValidation.liveMonitoringDashboardSchema),
  liveMonitoringController.commandCenterDashboard
);

router.get(
  "/report/:examId",
  authenticate,
  authorize(UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.MASTER_ADMIN, UserRole.MASTER_ADMIN),
  validate(liveMonitoringValidation.liveMonitoringDashboardSchema),
  liveMonitoringController.monitoringReport
);

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER),
  validate(liveMonitoringValidation.liveMonitoringStatisticsSchema),
  liveMonitoringController.statistics
);

// Session routes
router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  validate(liveMonitoringValidation.liveMonitoringQuerySchema),
  liveMonitoringController.getLiveMonitoringSessions
);

router.post(
  "/",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.createLiveMonitoringSchema),
  liveMonitoringController.createLiveMonitoring
);

router.post(
  "/events",
  authenticate,
  validate(liveMonitoringValidation.recordEventSchema),
  liveMonitoringController.recordEvent
);

router.get(
  "/device-monitoring",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.deviceMonitoring
);

router.post(
  "/force-submit",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.forceSubmit
);

// Also accept GET since the user was testing with GET
router.get(
  "/force-submit",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.forceSubmit
);

router.post(
  "/force-logout",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.forceLogout
);

router.post(
  "/broadcast-announcement",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.broadcastAnnouncement
);

router.get(
  "/broadcast-announcement",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.broadcastAnnouncement
);

router.post(
  "/emergency-stop",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.emergencyStop
);

router.get(
  "/emergency-stop",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.emergencyStop
);

router.get(
  "/analytics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  liveMonitoringController.liveAnalytics
);

router.get("/dashboard", liveMonitoringController.mockDashboard);
router.get("/active-candidates", liveMonitoringController.mockActiveCandidates);
router.get("/candidate-status/:candidateId", liveMonitoringController.mockCandidateStatus);
router.get("/candidate-details/:candidateId", liveMonitoringController.mockCandidateDetails);
router.get("/webcam-snapshot/:candidateId", liveMonitoringController.mockWebcamSnapshot);
router.get("/face-verification-logs/:candidateId", liveMonitoringController.mockFaceVerificationLogs);
router.get("/live-violations", liveMonitoringController.mockLiveViolations);
router.get("/heartbeat-monitor", liveMonitoringController.mockHeartbeatMonitor);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.OBSERVER),
  validate(liveMonitoringValidation.liveMonitoringIdSchema),
  liveMonitoringController.getLiveMonitoringById
);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER),
  validate(liveMonitoringValidation.updateLiveMonitoringSchema),
  liveMonitoringController.updateLiveMonitoring
);

// Status updates
router.post(
  "/:id/heartbeat",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.heartbeatSchema),
  liveMonitoringController.heartbeat
);

router.patch(
  "/:id/camera",
  authenticate,
  authorize(UserRole.CANDIDATE, UserRole.OBSERVER, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.AI_PROCTOR),
  validate(liveMonitoringValidation.updateCameraSchema),
  liveMonitoringController.updateCameraStatus
);

router.patch(
  "/:id/microphone",
  authenticate,
  authorize(UserRole.CANDIDATE, UserRole.OBSERVER, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.AI_PROCTOR),
  validate(liveMonitoringValidation.updateMicrophoneSchema),
  liveMonitoringController.updateMicrophoneStatus
);

router.patch(
  "/:id/browser",
  authenticate,
  authorize(UserRole.CANDIDATE, UserRole.OBSERVER, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.AI_PROCTOR),
  validate(liveMonitoringValidation.updateBrowserSchema),
  liveMonitoringController.updateBrowserStatus
);

router.patch(
  "/:id/connection",
  authenticate,
  authorize(UserRole.CANDIDATE, UserRole.OBSERVER, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER),
  validate(liveMonitoringValidation.updateConnectionSchema),
  liveMonitoringController.updateConnectionStatus
);

router.patch(
  "/:id/fullscreen",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.updateFullscreenSchema),
  liveMonitoringController.updateFullscreenStatus
);

router.patch(
  "/:id/risk",
  authenticate,
  authorize(UserRole.AI_PROCTOR, UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER),
  validate(liveMonitoringValidation.updateRiskSchema),
  liveMonitoringController.updateLiveMonitoring
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.TECHNICAL_MANAGER, UserRole.EXAM_MANAGER, UserRole.MASTER_ADMIN, UserRole.MASTER_ADMIN, UserRole.OBSERVER),
  validate(liveMonitoringValidation.updateMonitoringStatusSchema),
  liveMonitoringController.updateLiveMonitoring
);

// Specific counters/violations
router.post(
  "/:id/tab-switch",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.liveMonitoringIdSchema),
  liveMonitoringController.tabSwitch
);

router.post(
  "/:id/fullscreen-exit",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.liveMonitoringIdSchema),
  liveMonitoringController.fullscreenExit
);

router.post(
  "/:id/copy-paste",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.liveMonitoringIdSchema),
  liveMonitoringController.copyPaste
);

router.post(
  "/:id/devtools",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.liveMonitoringIdSchema),
  liveMonitoringController.devToolsOpened
);

router.post(
  "/:id/network-disconnect",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.liveMonitoringIdSchema),
  liveMonitoringController.networkDisconnected
);

router.post(
  "/:id/network-reconnect",
  authenticate,
  authorize(UserRole.CANDIDATE),
  validate(liveMonitoringValidation.liveMonitoringIdSchema),
  liveMonitoringController.networkReconnected
);

export default router;

