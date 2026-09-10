import { Router } from "express";

import {
  createExamShift,
  getExamShifts,
  getExamShiftById,
  getExamShiftsByExam,
  updateExamShift,
  updateExamShiftStatus,
  deleteExamShift,
  restoreExamShift,
  getExamShiftStatistics,
} from "./examShift.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createExamShiftSchema,
  updateExamShiftSchema,
  updateExamShiftStatusSchema,
} from "./examShift.validation";

const router = Router();

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
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getExamShiftStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Shift
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(createExamShiftSchema),
  createExamShift,
);

/*
|--------------------------------------------------------------------------
| Get All Shifts
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getExamShifts,
);

/*
|--------------------------------------------------------------------------
| Get Shifts By Exam
|--------------------------------------------------------------------------
*/

router.get(
  "/exam/:examId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getExamShiftsByExam,
);

/*
|--------------------------------------------------------------------------
| Get Shift By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getExamShiftById,
);

/*
|--------------------------------------------------------------------------
| Update Shift
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updateExamShiftSchema),
  updateExamShift,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
  ),
  validate(updateExamShiftStatusSchema),
  updateExamShiftStatus,
);

/*
|--------------------------------------------------------------------------
| Restore Shift
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreExamShift,
);

/*
|--------------------------------------------------------------------------
| Delete Shift
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteExamShift,
);

export default router;
