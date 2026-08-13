import { Router } from "express";

import {
  createSeatAllocation,
  getSeatAllocations,
  getSeatAllocationById,
  getSeatAllocationsByRoom,
  updateSeatAllocation,
  updateSeatAllocationStatus,
  deleteSeatAllocation,
  restoreSeatAllocation,
  getSeatAllocationStatistics,
  generateSeatAllocations,
} from "./seatAllocation.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createSeatAllocationSchema,
  updateSeatAllocationSchema,
  updateSeatAllocationStatusSchema,
  generateSeatAllocationSchema,
} from "./seatAllocation.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.post(
  "/generate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(generateSeatAllocationSchema),
  generateSeatAllocations,
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
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getSeatAllocationStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Seat Allocation
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(createSeatAllocationSchema),
  createSeatAllocation,
);

/*
|--------------------------------------------------------------------------
| Get All Seat Allocations
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
  getSeatAllocations,
);

/*
|--------------------------------------------------------------------------
| Get Seat Allocations By Room
|--------------------------------------------------------------------------
*/

router.get(
  "/room/:examRoomId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  getSeatAllocationsByRoom,
);

/*
|--------------------------------------------------------------------------
| Get Seat Allocation By Id
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
  getSeatAllocationById,
);

/*
|--------------------------------------------------------------------------
| Update Seat Allocation
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  validate(updateSeatAllocationSchema),
  updateSeatAllocation,
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
  validate(updateSeatAllocationStatusSchema),
  updateSeatAllocationStatus,
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
  restoreSeatAllocation,
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
  deleteSeatAllocation,
);

export default router;
