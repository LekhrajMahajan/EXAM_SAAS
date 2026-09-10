import { Router } from "express";

import {
  createExamCenter,
  getExamCenters,
  getExamCenterById,
  getExamCentersByShift,
  getExamCentersByExam,
  updateExamCenter,
  updateExamCenterStatus,
  deleteExamCenter,
  restoreExamCenter,
  getExamCenterStatistics,
  mapExamCenters,
} from "./examCenter.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createExamCenterSchema,
  updateExamCenterSchema,
  updateExamCenterStatusSchema,
  mapExamCentersSchema,
} from "./examCenter.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Map Exam Centers
|--------------------------------------------------------------------------
*/

router.post(
  "/map",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(mapExamCentersSchema),
  mapExamCenters,
);

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
  getExamCenterStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Exam Center
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(createExamCenterSchema),
  createExamCenter,
);

/*
|--------------------------------------------------------------------------
| Get All Exam Centers
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
  getExamCenters,
);

/*
|--------------------------------------------------------------------------
| Get Centers By Shift
|--------------------------------------------------------------------------
*/

router.get(
  "/shift/:shiftId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getExamCentersByShift,
);

/*
|--------------------------------------------------------------------------
| Get Centers By Exam
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
  getExamCentersByExam,
);

/*
|--------------------------------------------------------------------------
| Get Exam Center By Id
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
  getExamCenterById,
);

/*
|--------------------------------------------------------------------------
| Update Exam Center
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updateExamCenterSchema),
  updateExamCenter,
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
  validate(updateExamCenterStatusSchema),
  updateExamCenterStatus,
);

/*
|--------------------------------------------------------------------------
| Restore Exam Center
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreExamCenter,
);

/*
|--------------------------------------------------------------------------
| Delete Exam Center
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteExamCenter,
);

export default router;
