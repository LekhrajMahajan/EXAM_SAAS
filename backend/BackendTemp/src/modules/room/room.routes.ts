import { Router } from "express";

import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
  restoreRoom,
  getRoomStatistics,
} from "./room.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createRoomSchema,
  updateRoomSchema,
  updateRoomStatusSchema,
} from "./room.validation";

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
  ),
  getRoomStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Room
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  validate(createRoomSchema),
  createRoom,
);

/*
|--------------------------------------------------------------------------
| Get All Rooms
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.CENTER_MANAGER,
  ),
  getRooms,
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
  ),
  getRoomById,
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
    UserRole.CENTER_MANAGER,
  ),
  validate(updateRoomSchema),
  updateRoom,
);

/*
|--------------------------------------------------------------------------
| Update Room Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
  ),
  validate(updateRoomStatusSchema),
  updateRoomStatus,
);

/*
|--------------------------------------------------------------------------
| Restore Room
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreRoom,
);

/*
|--------------------------------------------------------------------------
| Delete Room
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteRoom,
);

export default router;
