import express from "express";
import helmet from "helmet";
import path from "path";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/notFound";
import { requestLogger } from "./middleware/requestLogger";
import authRoutes from "./modules/auth/auth.routes";
import companyRoutes from "./modules/company/company.routes";
import employeeRoutes from "./modules/employee/employee.routes";
import roleRoutes from "./modules/role/role.routes";
import permissionRoutes from "./modules/permission/permission.routes";
import rolePermissionRoutes from "./modules/role-permission/rolePermission.routes";
import userRoutes from "./modules/user/user.routes";
import branchRoutes from "./modules/branch/branch.routes";
import centerRoutes from "./modules/center/center.routes";
import roomRoutes from "./modules/room/room.routes";
import seatRoutes from "./modules/seat/seat.routes";
import candidateRoutes from "./modules/candidate/candidate.routes";
import importCandidateRoutes from "./modules/import-candidate/importcandidate.routes";
import subjectRoutes from "./modules/subject/subject.routes";
import chapterRoutes from "./modules/chapter/chapter.routes";
import topicRoutes from "./modules/topic/topic.routes";
import questionRoutes from "./modules/question-bank/question.routes";
import paperRoutes from "./modules/paper/paper.routes";
import paperQuestionRoutes from "./modules/paper-question/paperQuestion.routes";
import examRoutes from "./modules/exam/exam.routes";
import candidateExamRoutes from "./modules/candidate-exam/candidateExam.routes";
import {
  paperApprovalRoutes,
  examApprovalRoutes,
  questionApprovalRoutes,
  resultApprovalRoutes,
} from "./modules/approval";
import examShiftRoutes from "./modules/exam-shift/examShift.routes";
import shiftRoutes from "./modules/shift/shift.routes";
import examCenterRoutes from "./modules/exam-center/examCenter.routes";
import examRoomRoutes from "./modules/exam-room/examRoom.routes";
import seatAllocationRoutes from "./modules/seat-allocation/seatAllocation.routes";
import admitCardRoutes from "./modules/admit-card/admitCard.routes";
import attendanceRoutes from "./modules/attendance/attendance.routes";
import faceVerificationRoutes from "./modules/face-verification/faceVerification.routes";
import examSubmissionRoutes from "./modules/exam-submission/examSubmission.routes";
import candidateAnswerRoutes from "./modules/candidate-answer/candidateAnswer.routes";
import liveMonitoringRoutes from "./modules/live-monitoring/liveMonitoring.routes";
import activityLogRoutes from "./modules/activity-log/activityLog.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import auditLogRoutes from "./modules/audit-log/auditLog.routes";
import biometricVerificationRoutes from "./modules/biometric-verification/biometricVerification.routes";
import certificateRoutes from "./modules/certificate/certificate.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import emailRoutes from "./modules/email/email.routes";
import fileStorageRoutes from "./modules/file-storage/fileStorage.routes";
import healthRoutes from "./modules/health/health.routes";
import importExportRoutes from "./modules/import-export/importExport.routes";
import meritListRoutes from "./modules/merit-list/meritList.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import pdfRoutes from "./modules/pdf/pdf.routes";
import pushNotificationRoutes from "./modules/push-notification/pushNotification.routes";
import qrRoutes from "./modules/qr/qr.routes";
import questionHistoryRoutes from "./modules/question-history/questionHistory.routes";
import queueRoutes from "./modules/queue/queue.routes";
import reportRoutes from "./modules/report/report.routes";
import resultRoutes from "./modules/result/result.routes";
import schedulerRoutes from "./modules/scheduler/scheduler.routes";
import searchRoutes from "./modules/search/search.routes";
import smsRoutes from "./modules/sms/sms.routes";
import systemSettingsRoutes from "./modules/system-settings/systemSettings.routes";
import websocketRoutes from "./modules/websocket/websocket.routes";
import webhookRoutes from "./modules/webhook/webhook.routes";
import geoMonitoringRoutes from "./modules/geo-monitoring/geoMonitoring.routes";
import trustScoreRoutes from "./modules/trust-score/trustScore.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import planRoutes from "./modules/plan/plan.routes";
import subscriptionRoutes from "./modules/subscription/subscription.routes";
import invoiceRoutes from "./modules/invoice/invoice.routes";
import securityRoutes from "./modules/security/security.routes";
import supportTicketRoutes from "./modules/support-ticket/supportTicket.routes";
import onboardingRoutes from "./modules/onboarding/onboarding.routes";
import sidebarRoutes from "./modules/sidebar/sidebar.routes";
import organizationSeederRoutes from "./modules/organization-seeder/organizationSeeder.routes";
import rbacValidatorRoutes from "./modules/rbac-validator/rbacValidator.routes";
import staffAssignmentRoutes from "./modules/staff-assignment/staffAssignment.routes";
import centerSystemNetworkRoutes from "./modules/center-system-network/centerSystemNetwork.routes";
import centerAssignExamStaffRoutes from "./modules/center-assign-exam-staff/centerAssignExamStaff.routes";
import centerAssignCandidateAttendanceRoutes from "./modules/center-assign-candidate-attendance/centerAssignCandidateAttendance.routes";
import centerPaymentsRoutes from "./modules/center-payments/centerPayments.routes";
import importCenterAssignExamRoutes from "./modules/import-center-assign-exam/importCenterAssignExam.routes";
import entryCheckerRoutes from "./modules/entry-checker/entryChecker.routes";

const app = express();

// Trust the reverse proxy (Render load balancer) to ensure correct IP resolution
app.set("trust proxy", 1);

app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  }),
);

app.use(compression());

app.use(morgan("dev"));

app.use("/api/v1/webhooks", webhookRoutes);

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(cookieParser());

app.use(requestLogger);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/permissions", permissionRoutes);
app.use("/api/v1", rolePermissionRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/branches", branchRoutes);
app.use("/api/v1/centers", centerRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/seats", seatRoutes);
app.use("/api/v1/candidates", candidateRoutes);
app.use("/api/v1/import-candidate", importCandidateRoutes);
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/chapters", chapterRoutes);
app.use("/api/v1/topics", topicRoutes);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/question-approval", questionApprovalRoutes);
app.use("/api/v1/papers", paperRoutes);
app.use("/api/v1/paper-questions", paperQuestionRoutes);
app.use("/api/v1/paper-approval", paperApprovalRoutes);
app.use("/api/v1/exams", examRoutes);
app.use("/api/v1/exam-approval", examApprovalRoutes);
app.use("/api/v1/result-approval", resultApprovalRoutes);
app.use("/api/v1/exam-shifts", examShiftRoutes);
app.use("/api/v1/shifts", shiftRoutes);
app.use("/api/v1/exam-centers", examCenterRoutes);
app.use("/api/v1/exam-rooms", examRoomRoutes);
app.use("/api/v1/seat-allocations", seatAllocationRoutes);
app.use("/api/v1/candidate-exam", candidateExamRoutes);
app.use("/api/v1/admit-cards", admitCardRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/entry-checker", entryCheckerRoutes);
app.use("/api/v1/face-verification", faceVerificationRoutes);
app.use("/api/v1/exam-submissions", examSubmissionRoutes);
app.use("/api/v1/candidate-answers", candidateAnswerRoutes);
app.use("/api/v1/live-monitoring", liveMonitoringRoutes);
app.use("/api/v1/activity-logs", activityLogRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/audit-logs", auditLogRoutes);
app.use("/api/v1/biometric-verification", biometricVerificationRoutes);
app.use("/api/v1/certificates", certificateRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/email", emailRoutes);
app.use("/api/v1/emails", emailRoutes);
app.use("/api/v1/files", fileStorageRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/import-export", importExportRoutes);
app.use("/api/v1/merit-lists", meritListRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/pdf", pdfRoutes);
app.use("/api/v1/push-notifications", pushNotificationRoutes);
app.use("/api/v1/qr", qrRoutes);
app.use("/api/v1/question-history", questionHistoryRoutes);
app.use("/api/v1/queue", queueRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/results", resultRoutes);
app.use("/api/v1/scheduler", schedulerRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/sms", smsRoutes);
app.use("/api/v1/system-settings", systemSettingsRoutes);
app.use("/api/v1/websocket", websocketRoutes);
app.use("/api/v1/geo-monitoring", geoMonitoringRoutes);
app.use("/api/v1/trust-scores", trustScoreRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/plans", planRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/security", securityRoutes);
app.use("/api/v1/support-tickets", supportTicketRoutes);
app.use("/api/v1/onboarding", onboardingRoutes);
app.use("/api/v1/sidebar", sidebarRoutes);
app.use("/api/v1/system", organizationSeederRoutes);
app.use("/system", organizationSeederRoutes);
app.use("/api/v1/company", organizationSeederRoutes);
app.use("/company", organizationSeederRoutes);
app.use("/api/v1/companies", organizationSeederRoutes);
app.use("/companies", organizationSeederRoutes);
app.use("/api/v1/rbac-validator", rbacValidatorRoutes);
app.use("/rbac-validator", rbacValidatorRoutes);
app.use("/api/v1/assignments", staffAssignmentRoutes);
app.use("/api/v1/center-system-network", centerSystemNetworkRoutes);
app.use("/api/v1/center-assign-exam-staff", centerAssignExamStaffRoutes);
app.use(
  "/api/v1/center-assign-candidate-attendance",
  centerAssignCandidateAttendanceRoutes
);
app.use("/api/v1/center-payments", centerPaymentsRoutes);
app.use("/api/v1/import-center-assign-exam", importCenterAssignExamRoutes);
app.use("/api/v1/entry-checker", entryCheckerRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Exam SaaS Backend Running",
  });
});

app.get("/test", (_req, res) => {
  res.send("Server Working");
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
