import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  getOverview,
  getDashboardCards,
  getExamStatistics,
  getCandidateStatistics,
  getResultStatistics,
  getAttendanceStatistics,
  getLiveMonitoringStatistics,
  getQuestionBankStatistics,
  getCompanyStatistics,
  getCenterStatistics,
  getEmployeeStatistics,
  getActivityStatistics,
  getQueueStatistics,
  getNotificationStatistics,
  getSystemHealth,
  getDashboardCharts,
  getRoleStats,
} from "./dashboard.controller";

import {
  overviewSchema,
  cardSchema,
  examDashboardSchema,
  candidateDashboardSchema,
  resultDashboardSchema,
  attendanceDashboardSchema,
  liveMonitoringDashboardSchema,
  questionBankDashboardSchema,
  companyDashboardSchema,
  centerDashboardSchema,
  employeeDashboardSchema,
  activityDashboardSchema,
  queueDashboardSchema,
  notificationDashboardSchema,
  systemHealthDashboardSchema,
} from "./dashboard.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Role-Based Dashboard Stats (all authenticated roles)
|--------------------------------------------------------------------------
*/

router.get(
  "/role-stats",
  authenticate,
  getRoleStats,
);

/*
|--------------------------------------------------------------------------
| Overview
|--------------------------------------------------------------------------
*/

router.get(
  "/overview",

  authenticate,

  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),

  validateRequest(overviewSchema),

  getOverview,
);

router.get(
  "/charts",

  authenticate,

  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),

  validateRequest(overviewSchema),

  getDashboardCharts,
);

router.get(
  "/cards",

  authenticate,

  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),

  validateRequest(cardSchema),

  getDashboardCards,
);

/*
|--------------------------------------------------------------------------
| Exam
|--------------------------------------------------------------------------
*/

router.get(
  "/exams",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(examDashboardSchema),

  getExamStatistics,
);

/*
|--------------------------------------------------------------------------
| Candidate
|--------------------------------------------------------------------------
*/

router.get(
  "/candidates",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(candidateDashboardSchema),

  getCandidateStatistics,
);

/*
|--------------------------------------------------------------------------
| Result
|--------------------------------------------------------------------------
*/

router.get(
  "/results",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(resultDashboardSchema),

  getResultStatistics,
);

/*
|--------------------------------------------------------------------------
| Attendance
|--------------------------------------------------------------------------
*/

router.get(
  "/attendance",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(attendanceDashboardSchema),

  getAttendanceStatistics,
);

/*
|--------------------------------------------------------------------------
| Live Monitoring
|--------------------------------------------------------------------------
*/

router.get(
  "/live-monitoring",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(liveMonitoringDashboardSchema),

  getLiveMonitoringStatistics,
);

/*
|--------------------------------------------------------------------------
| Question Bank
|--------------------------------------------------------------------------
*/

router.get(
  "/question-bank",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(questionBankDashboardSchema),

  getQuestionBankStatistics,
);

/*
|--------------------------------------------------------------------------
| Organization
|--------------------------------------------------------------------------
*/

router.get(
  "/companies",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(companyDashboardSchema),

  getCompanyStatistics,
);

router.get(
  "/centers",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(centerDashboardSchema),

  getCenterStatistics,
);

router.get(
  "/employees",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(employeeDashboardSchema),

  getEmployeeStatistics,
);

/*
|--------------------------------------------------------------------------
| Activity
|--------------------------------------------------------------------------
*/

router.get(
  "/activity",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(activityDashboardSchema),

  getActivityStatistics,
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

  validateRequest(queueDashboardSchema),

  getQueueStatistics,
);

/*
|--------------------------------------------------------------------------
| Notification
|--------------------------------------------------------------------------
*/

router.get(
  "/notifications",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(notificationDashboardSchema),

  getNotificationStatistics,
);

/*
|--------------------------------------------------------------------------
| System Health
|--------------------------------------------------------------------------
*/

router.get(
  "/system-health",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(systemHealthDashboardSchema),

  getSystemHealth,
);

export default router;
