import { Router } from "express";

import {
  createShift,
  getShifts,
  getShiftById,
  updateShift,
  updateShiftStatus,
  deleteShift,
} from "./shift.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createShiftSchema,
  updateShiftSchema,
  updateShiftStatusSchema,
  shiftIdSchema,
  shiftQuerySchema,
} from "./shift.validation";

const router = Router();

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
    UserRole.CENTER_MANAGER,
  ),
  validate(createShiftSchema),
  createShift,
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
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  validate(shiftQuerySchema),
  getShifts,
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
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  validate(shiftIdSchema),
  getShiftById,
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
    UserRole.CENTER_MANAGER,
  ),
  validate(shiftIdSchema),
  validate(updateShiftSchema),
  updateShift,
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
    UserRole.CENTER_MANAGER,
  ),
  validate(shiftIdSchema),
  validate(updateShiftStatusSchema),
  updateShiftStatus,
);

/*
|--------------------------------------------------------------------------
| Delete Shift
|--------------------------------------------------------------------------
*/
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  validate(shiftIdSchema),
  deleteShift,
);

export default router;
