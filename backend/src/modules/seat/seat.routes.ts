import { Router } from "express";

import {
  createSeat,
  generateSeats,
  getSeats,
  getSeatById,
  updateSeat,
  updateSeatStatus,
  blockSeat,
  unblockSeat,
  deleteSeat,
  restoreSeat,
  getSeatStatistics,
} from "./seat.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createSeatSchema,
  updateSeatSchema,
  generateSeatsSchema,
  updateSeatStatusSchema,
  blockSeatSchema,
} from "./seat.validation";

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
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  getSeatStatistics,
);

/*
|--------------------------------------------------------------------------
| Generate Seats
|--------------------------------------------------------------------------
*/

router.post(
  "/generate",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  validate(generateSeatsSchema),
  generateSeats,
);

/*
|--------------------------------------------------------------------------
| Create Seat
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  validate(createSeatSchema),
  createSeat,
);

/*
|--------------------------------------------------------------------------
| Get All Seats
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.OBSERVER,
  ),
  getSeats,
);

/*
|--------------------------------------------------------------------------
| Get Seat By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.OBSERVER,
  ),
  getSeatById,
);

/*
|--------------------------------------------------------------------------
| Update Seat
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  validate(updateSeatSchema),
  updateSeat,
);

/*
|--------------------------------------------------------------------------
| Update Seat Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  validate(updateSeatStatusSchema),
  updateSeatStatus,
);

/*
|--------------------------------------------------------------------------
| Block Seat
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/block",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  validate(blockSeatSchema),
  blockSeat,
);

/*
|--------------------------------------------------------------------------
| Unblock Seat
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/unblock",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  unblockSeat,
);

/*
|--------------------------------------------------------------------------
| Restore Seat
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreSeat,
);

/*
|--------------------------------------------------------------------------
| Delete Seat
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteSeat,
);

export default router;
