import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  generateReport,
  generateCandidateReport,
  generateExamReport,
  generateResultReport,
  generateAttendanceReport,
  generateBiometricReport,
  generateLiveMonitoringReport,
  generateCustomReport,
  getReportById,
  getReports,
  getDashboard,
  getStatistics,
  getRecent,
  getCategories,
  updateReportStatus,
  deleteReport,
  toggleFavorite,
  incrementDownload,
  getUserReportSummary,
  getUsersList,
  getUserLoginHistory,
  getUserRolesReport,
  getUsersExport,
  getCandidateSummary,
  getCandidateList,
  getCandidateExport,
  getExamSummary,
  getExamList,
  getExamExport,
  getAttendanceSummary,
  getAttendanceList,
  getAttendanceExport,
  getResultSummary,
  getResultList,
  getResultExport,
  getFinancialSummary,
  getFinancialList,
  getFinancialExport,
  generateFinancialReport,
  generateSecurityReport,
  getSecurityStatistics,
  getSecurityReportsList,
  exportSecurityReports,
  generateUserReport,
  generateMasterReport,
} from "./report.controller";

import {
  generateReportSchema,
  candidateReportSchema,
  examReportSchema,
  resultReportSchema,
  attendanceReportSchema,
  biometricReportSchema,
  liveMonitoringReportSchema,
  customReportSchema,
  reportIdSchema,
  dashboardSchema,
} from "./report.validation";

import customReportRoutes from "./custom-report.routes";
import * as templateController from "./report-template.controller";
import * as scheduleController from "./report-schedule.controller";

const router = Router();

// Mount custom reports
router.use("/custom", customReportRoutes);

// Template Routes
router.get("/templates", authenticate, authorize(UserRole.MASTER_ADMIN), templateController.getTemplates);
router.get("/templates/:id", authenticate, authorize(UserRole.MASTER_ADMIN), templateController.getTemplateById);
router.post("/templates", authenticate, authorize(UserRole.MASTER_ADMIN), templateController.createTemplate);
router.patch("/templates/:id", authenticate, authorize(UserRole.MASTER_ADMIN), templateController.updateTemplate);
router.delete("/templates/:id", authenticate, authorize(UserRole.MASTER_ADMIN), templateController.deleteTemplate);
router.patch("/templates/:id/publish", authenticate, authorize(UserRole.MASTER_ADMIN), templateController.togglePublishStatus);

// Schedule Routes
router.get("/schedules", authenticate, authorize(UserRole.MASTER_ADMIN), scheduleController.getSchedules);
router.get("/schedules/:id", authenticate, authorize(UserRole.MASTER_ADMIN), scheduleController.getScheduleById);
router.post("/schedules", authenticate, authorize(UserRole.MASTER_ADMIN), scheduleController.createSchedule);
router.patch("/schedules/:id", authenticate, authorize(UserRole.MASTER_ADMIN), scheduleController.updateSchedule);
router.delete("/schedules/:id", authenticate, authorize(UserRole.MASTER_ADMIN), scheduleController.deleteSchedule);
router.patch("/schedules/:id/toggle", authenticate, authorize(UserRole.MASTER_ADMIN), scheduleController.toggleScheduleStatus);
router.post("/schedules/:id/run", authenticate, authorize(UserRole.MASTER_ADMIN), scheduleController.runScheduleNow);

// Executions
router.get("/executions", authenticate, authorize(UserRole.MASTER_ADMIN), scheduleController.getExecutions);

/*
|--------------------------------------------------------------------------
| Generate Reports
|--------------------------------------------------------------------------
*/

router.post(
  "/master",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  generateMasterReport,
);

router.post(
  "/generate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  // validateRequest(generateReportSchema),

  generateReport,
);

router.post(
  "/candidate",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  generateCandidateReport,
);

router.post(
  "/exam",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  generateExamReport,
);

router.post(
  "/result",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  generateResultReport,
);

router.post(
  "/attendance",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER),
  generateAttendanceReport,
);

router.post(
  "/users/generate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  generateUserReport,
);

router.post(
  "/biometric",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(biometricReportSchema),

  generateBiometricReport,
);

router.post(
  "/live-monitoring",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(liveMonitoringReportSchema),

  generateLiveMonitoringReport,
);



router.post(
  "/custom",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(customReportSchema),

  generateCustomReport,
);

/*
|--------------------------------------------------------------------------
| Report Management
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  getReports,
);

router.get(
  "/dashboard",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(dashboardSchema),

  getDashboard,
);

router.get(
  "/statistics",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  getStatistics,
);

router.get(
  "/recent",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  getRecent,
);

router.get(
  "/categories",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  getCategories,
);

router.get(
  "/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(reportIdSchema),

  getReportById,
);

router.patch(
  "/:id/status",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(reportIdSchema),

  updateReportStatus,
);

router.delete(
  "/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(reportIdSchema),

  deleteReport,
);

router.post(
  "/:id/favorite",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(reportIdSchema),

  toggleFavorite,
);

router.post(
  "/:id/download",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(reportIdSchema),

  incrementDownload,
);

/*
|--------------------------------------------------------------------------
| User & Access Reports
|--------------------------------------------------------------------------
*/

router.get(
  "/users/summary",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getUserReportSummary,
);

router.get(
  "/users/list",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getUsersList,
);

router.get(
  "/users/login-history",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getUserLoginHistory,
);

router.get(
  "/users/roles",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getUserRolesReport,
);

router.get(
  "/users/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getUsersExport,
);

/*
|--------------------------------------------------------------------------
| Candidate Reports
|--------------------------------------------------------------------------
*/

router.get(
  "/candidates/summary",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getCandidateSummary,
);

router.get(
  "/candidates/list",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getCandidateList,
);

router.get(
  "/candidates/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getCandidateExport,
);

/*
|--------------------------------------------------------------------------
| Exam Reports
|--------------------------------------------------------------------------
*/

router.get(
  "/exams/summary",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getExamSummary,
);

router.get(
  "/exams/list",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getExamList,
);

router.get(
  "/exams/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getExamExport,
);

/*
|--------------------------------------------------------------------------
| Attendance Reports
|--------------------------------------------------------------------------
*/

router.get(
  "/attendance/summary",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getAttendanceSummary,
);

router.get(
  "/attendance/list",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getAttendanceList,
);

router.get(
  "/attendance/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getAttendanceExport,
);

/*
|--------------------------------------------------------------------------
| Result Reports
|--------------------------------------------------------------------------
*/

router.get(
  "/results/summary",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getResultSummary,
);

router.get(
  "/results/list",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getResultList,
);

router.get(
  "/results/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getResultExport,
);

/*
|--------------------------------------------------------------------------
| Financial Reports
|--------------------------------------------------------------------------
*/

router.post(
  "/financial/generate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  generateFinancialReport,
);


router.get(
  "/financial/summary",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getFinancialSummary,
);

router.get(
  "/financial/list",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getFinancialList,
);

router.get(
  "/financial/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getFinancialExport,
);
/*
|--------------------------------------------------------------------------
| Security Reports
|--------------------------------------------------------------------------
*/

router.post(
  "/security/generate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  generateSecurityReport,
);

router.get(
  "/security/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getSecurityStatistics,
);

router.get(
  "/security/list",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getSecurityReportsList,
);

router.get(
  "/security/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  exportSecurityReports,
);

export default router;
