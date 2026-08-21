import { Router } from "express";

import {
  createExamRoom,
  getExamRooms,
  getExamRoomById,
  getExamRoomsByCenter,
  getExamRoomsByShift,
  updateExamRoom,
  updateExamRoomStatus,
  deleteExamRoom,
  restoreExamRoom,
  getExamRoomStatistics,
} from "./examRoom.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createExamRoomSchema,
  updateExamRoomSchema,
  updateExamRoomStatusSchema,
} from "./examRoom.validation";

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
  getExamRoomStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Exam Room
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(createExamRoomSchema),
  createExamRoom,
);

/*
|--------------------------------------------------------------------------
| Get All Exam Rooms
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
  getExamRooms,
);

/*
|--------------------------------------------------------------------------
| Get Rooms By Exam Center
|--------------------------------------------------------------------------
*/

router.get(
  "/center/:centerId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getExamRoomsByCenter,
);

/*
|--------------------------------------------------------------------------
| Get Rooms By Shift
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
  getExamRoomsByShift,
);

/*
|--------------------------------------------------------------------------
| Get Room By Id
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
  getExamRoomById,
);

/*
|--------------------------------------------------------------------------
| Update Room
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updateExamRoomSchema),
  updateExamRoom,
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
  validate(updateExamRoomStatusSchema),
  updateExamRoomStatus,
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreExamRoom,
);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteExamRoom,
);

export default router;
