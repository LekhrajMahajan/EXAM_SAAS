import { Router } from "express";

import {
  createAttendance,
  bulkAttendance,
  qrCheckIn,
  verifyQRCode,
  biometricVerification,
  faceVerification,
  manualVerification,
  checkOut,
  getAttendance,
  getAttendanceById,
  getAttendanceByCandidate,
  getAttendanceByExam,
  attendanceDashboard,
  attendanceStatistics,
  attendanceReport,
  mockCheckIn,
  mockCheckOut,
  updateAttendance,
  staffManualOverride,
  staffFaceVerify,
  applyStaffLeave,
  listStaffLeaves,
  approveStaffLeave,
  rejectStaffLeave,
  requestDutySwapHandler,
  listDutySwapsHandler,
  approveDutySwapHandler,
  rejectDutySwapHandler,
  processReplacementHandler,
  getEnterpriseDashboard,
  getEnterpriseRoster,
  getEnterpriseHistory,
  getEnterpriseReports,
  getEnterpriseAnalytics,
} from "./attendance.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import {
  createAttendanceSchema,
  qrCheckInSchema,
  manualAttendanceSchema,
  checkOutSchema,
  attendanceQuerySchema,
  attendanceStatisticsSchema,
} from "./attendance.validation";

import { UserRole } from "../../constants/roles";

const router = Router();

/*
|--------------------------------------------------------------------------
| Phase 5.7 Enterprise Duty, Attendance & Roster Management Routes
|--------------------------------------------------------------------------
*/

router.get("/dashboard", authenticate, getEnterpriseDashboard);
router.get("/roster", authenticate, getEnterpriseRoster);
router.get("/history", authenticate, getEnterpriseHistory);
router.get("/reports", authenticate, getEnterpriseReports);
router.get("/analytics", authenticate, getEnterpriseAnalytics);
router.get("/leave", authenticate, listStaffLeaves);
router.get("/duty-swap", authenticate, listDutySwapsHandler);

router.post("/manual", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER, UserRole.OBSERVER), staffManualOverride);
router.post("/face-verify", authenticate, staffFaceVerify);
router.post("/leave", authenticate, applyStaffLeave);
router.post("/duty-swap", authenticate, requestDutySwapHandler);
router.post("/replacement", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), processReplacementHandler);

router.patch("/approve-leave", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), approveStaffLeave);
router.patch("/approve-leave/:id", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), approveStaffLeave);
router.patch("/reject-leave", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), rejectStaffLeave);
router.patch("/reject-leave/:id", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), rejectStaffLeave);
router.patch("/approve-swap", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), approveDutySwapHandler);
router.patch("/approve-swap/:id", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), approveDutySwapHandler);
router.patch("/reject-swap", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), rejectDutySwapHandler);
router.patch("/reject-swap/:id", authenticate, authorize(UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.CENTER_MANAGER), rejectDutySwapHandler);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  validate(attendanceStatisticsSchema),
  attendanceStatistics,
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard/:examId",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.OBSERVER,
  ),
  attendanceDashboard,
);

/*
|--------------------------------------------------------------------------
| Report
|--------------------------------------------------------------------------
*/

router.get(
  "/report/:examId",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  attendanceReport,
);

/*
|--------------------------------------------------------------------------
| Create Attendance
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  validate(createAttendanceSchema),
  createAttendance,
);

/*
|--------------------------------------------------------------------------
| Bulk Attendance
|--------------------------------------------------------------------------
*/

router.post(
  "/bulk",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  bulkAttendance,
);

/*
|--------------------------------------------------------------------------
| Verify QR
|--------------------------------------------------------------------------
*/

router.post(
  "/verify-qr",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.INVIGILATOR, UserRole.OBSERVER),
  validate(qrCheckInSchema),
  verifyQRCode,
);

/*
|--------------------------------------------------------------------------
| QR Check In
|--------------------------------------------------------------------------
*/

router.post("/check-in", mockCheckIn);

router.post(
  "/:id/check-in",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.INVIGILATOR),
  validate(qrCheckInSchema),
  qrCheckIn,
);

/*
|--------------------------------------------------------------------------
| Biometric Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/biometric",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.CENTER_MANAGER),
  biometricVerification,
);

/*
|--------------------------------------------------------------------------
| Face Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/face",
  authenticate,
  authorize(UserRole.BIOMETRIC_VERIFIER, UserRole.CENTER_MANAGER),
  faceVerification,
);

/*
|--------------------------------------------------------------------------
| Manual Verification
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/manual",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.OBSERVER),
  validate(manualAttendanceSchema),
  manualVerification,
);

/*
|--------------------------------------------------------------------------
| Check Out
|--------------------------------------------------------------------------
*/

router.post("/check-out", mockCheckOut);

router.post(
  "/:id/check-out",
  authenticate,
  authorize(UserRole.INVIGILATOR, UserRole.CENTER_MANAGER),
  validate(checkOutSchema),
  checkOut,
);

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.OBSERVER,
  ),
  validate(attendanceQuerySchema),
  getAttendance,
);

/*
|--------------------------------------------------------------------------
| Get By Candidate
|--------------------------------------------------------------------------
*/

router.get("/candidate/:candidateId", authenticate, getAttendanceByCandidate);

/*
|--------------------------------------------------------------------------
| Get By Exam
|--------------------------------------------------------------------------
*/

router.get(
  "/exam/:examId",
  authenticate,
  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  getAttendanceByExam,
);

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

router.get("/:id", authenticate, getAttendanceById);

/*
|--------------------------------------------------------------------------
| Update By Id
|--------------------------------------------------------------------------
*/

router.patch("/:id", updateAttendance);

export default router;
