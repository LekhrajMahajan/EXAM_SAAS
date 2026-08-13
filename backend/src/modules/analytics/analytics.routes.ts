import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";
import { UserRole } from "../../constants/roles";

import {
  getOverview,
  getCandidateAnalytics,
  getExamAnalytics,
  getResultAnalytics,
  getAttendanceAnalytics,
  getQuestionAnalytics,
  getCompanyAnalytics,
  getBranchAnalytics,
  getCenterAnalytics,
  getEmployeeAnalytics,
  getNotificationAnalytics,
  getQueueAnalytics,
  getSystemAnalytics,
  getDashboardAnalytics,
  getChartAnalytics,
  getAssignmentAnalytics,
  getFinanceAnalytics,
  getLiveAnalytics,
  getTrustAnalytics,
  getHeatmapAnalytics,
  searchAnalytics,
  exportAnalytics,
  getPersonalization,
  savePersonalization,
  scheduleReport,
} from "./analytics.controller";

import {
  overviewAnalyticsSchema,
  candidateAnalyticsSchema,
  examAnalyticsSchema,
  resultAnalyticsSchema,
  attendanceAnalyticsSchema,
  questionAnalyticsSchema,
  companyAnalyticsSchema,
  branchAnalyticsSchema,
  centerAnalyticsSchema,
  employeeAnalyticsSchema,
  notificationAnalyticsSchema,
  queueAnalyticsSchema,
  systemAnalyticsSchema,
  dashboardAnalyticsSchema,
  chartAnalyticsSchema,
  assignmentAnalyticsSchema,
  financeAnalyticsSchema,
  liveAnalyticsSchema,
  trustAnalyticsSchema,
  heatmapAnalyticsSchema,
  searchAnalyticsSchema,
  exportAnalyticsSchema,
  personalizationSchema,
  scheduledReportSchema,
} from "./analytics.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Overview
|--------------------------------------------------------------------------
*/
router.get(
  "/overview",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(overviewAnalyticsSchema),
  getOverview,
);

/*
|--------------------------------------------------------------------------
| Candidate
|--------------------------------------------------------------------------
*/
router.get(
  "/candidates",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(candidateAnalyticsSchema),
  getCandidateAnalytics,
);

/*
|--------------------------------------------------------------------------
| Exam
|--------------------------------------------------------------------------
*/
router.get(
  "/exams",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(examAnalyticsSchema),
  getExamAnalytics,
);

/*
|--------------------------------------------------------------------------
| Result
|--------------------------------------------------------------------------
*/
router.get(
  "/results",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(resultAnalyticsSchema),
  getResultAnalytics,
);

/*
|--------------------------------------------------------------------------
| Attendance
|--------------------------------------------------------------------------
*/
router.get(
  "/attendance",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(attendanceAnalyticsSchema),
  getAttendanceAnalytics,
);

/*
|--------------------------------------------------------------------------
| Question
|--------------------------------------------------------------------------
*/
router.get(
  "/questions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validateRequest(questionAnalyticsSchema),
  getQuestionAnalytics,
);

/*
|--------------------------------------------------------------------------
| Company
|--------------------------------------------------------------------------
*/
router.get(
  "/companies",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validateRequest(companyAnalyticsSchema),
  getCompanyAnalytics,
);

/*
|--------------------------------------------------------------------------
| Branch
|--------------------------------------------------------------------------
*/
router.get(
  "/branches",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validateRequest(branchAnalyticsSchema),
  getBranchAnalytics,
);

/*
|--------------------------------------------------------------------------
| Center
|--------------------------------------------------------------------------
*/
router.get(
  "/centers",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validateRequest(centerAnalyticsSchema),
  getCenterAnalytics,
);

/*
|--------------------------------------------------------------------------
| Employee
|--------------------------------------------------------------------------
*/
router.get(
  "/employees",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validateRequest(employeeAnalyticsSchema),
  getEmployeeAnalytics,
);

/*
|--------------------------------------------------------------------------
| Staff Assignments
|--------------------------------------------------------------------------
*/
router.get(
  "/assignments",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(assignmentAnalyticsSchema),
  getAssignmentAnalytics,
);

/*
|--------------------------------------------------------------------------
| Finance & Revenue
|--------------------------------------------------------------------------
*/
router.get(
  "/finance",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validateRequest(financeAnalyticsSchema),
  getFinanceAnalytics,
);

/*
|--------------------------------------------------------------------------
| Live Monitoring
|--------------------------------------------------------------------------
*/
router.get(
  "/live",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(liveAnalyticsSchema),
  getLiveAnalytics,
);

/*
|--------------------------------------------------------------------------
| Trust Score
|--------------------------------------------------------------------------
*/
router.get(
  "/trust-scores",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(trustAnalyticsSchema),
  getTrustAnalytics,
);

/*
|--------------------------------------------------------------------------
| Heatmap Engine
|--------------------------------------------------------------------------
*/
router.get(
  "/heatmaps",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(heatmapAnalyticsSchema),
  getHeatmapAnalytics,
);

/*
|--------------------------------------------------------------------------
| Global Analytics Search
|--------------------------------------------------------------------------
*/
router.get(
  "/search",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(searchAnalyticsSchema),
  searchAnalytics,
);

/*
|--------------------------------------------------------------------------
| Export & Reports
|--------------------------------------------------------------------------
*/
router.post(
  "/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(exportAnalyticsSchema),
  exportAnalytics,
);

router.post(
  "/schedule",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validateRequest(scheduledReportSchema),
  scheduleReport,
);

/*
|--------------------------------------------------------------------------
| Dashboard Personalization
|--------------------------------------------------------------------------
*/
router.get(
  "/personalization",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  getPersonalization,
);

router.post(
  "/personalization",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(personalizationSchema),
  savePersonalization,
);

/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/
router.get(
  "/notifications",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validateRequest(notificationAnalyticsSchema),
  getNotificationAnalytics,
);

/*
|--------------------------------------------------------------------------
| Queue
|--------------------------------------------------------------------------
*/
router.get(
  "/queue",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validateRequest(queueAnalyticsSchema),
  getQueueAnalytics,
);

/*
|--------------------------------------------------------------------------
| System
|--------------------------------------------------------------------------
*/
router.get(
  "/system",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validateRequest(systemAnalyticsSchema),
  getSystemAnalytics,
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
router.get(
  "/dashboard",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(dashboardAnalyticsSchema),
  getDashboardAnalytics,
);

/*
|--------------------------------------------------------------------------
| Charts
|--------------------------------------------------------------------------
*/
router.get(
  "/charts",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  validateRequest(chartAnalyticsSchema),
  getChartAnalytics,
);

export default router;
