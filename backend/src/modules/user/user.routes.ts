import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  getProfile,
  updateProfile,
  changePassword,
  updateProfileImage,
  getSessions,
  removeSession,
  getDevices,
  trustDevice,
  removeDevice,
  updatePreferences,
  getDashboard,
} from "./user.controller";

import {
  updateProfileSchema,
  changePasswordSchema,
  updateProfileImageSchema,
  updatePreferenceSchema,
  deviceIdSchema,
  sessionIdSchema,
} from "./user.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/profile",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.OBSERVER,
    UserRole.CANDIDATE,
  ),

  getProfile,
);

router.patch(
  "/profile",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.OBSERVER,
    UserRole.CANDIDATE,
  ),

  validateRequest(updateProfileSchema),

  updateProfile,
);

/*
|--------------------------------------------------------------------------
| Password
|--------------------------------------------------------------------------
*/

router.patch(
  "/change-password",

  authenticate,

  validateRequest(changePasswordSchema),

  changePassword,
);

/*
|--------------------------------------------------------------------------
| Profile Image
|--------------------------------------------------------------------------
*/

router.patch(
  "/profile-image",

  authenticate,

  validateRequest(updateProfileImageSchema),

  updateProfileImage,
);

/*
|--------------------------------------------------------------------------
| Sessions
|--------------------------------------------------------------------------
*/

router.get(
  "/sessions",

  authenticate,

  getSessions,
);

router.delete(
  "/sessions/:id",

  authenticate,

  validateRequest(sessionIdSchema),

  removeSession,
);

/*
|--------------------------------------------------------------------------
| Devices
|--------------------------------------------------------------------------
*/

router.get(
  "/devices",

  authenticate,

  getDevices,
);

router.patch(
  "/devices/:id/trust",

  authenticate,

  validateRequest(deviceIdSchema),

  trustDevice,
);

router.delete(
  "/devices/:id",

  authenticate,

  validateRequest(deviceIdSchema),

  removeDevice,
);

/*
|--------------------------------------------------------------------------
| Preferences
|--------------------------------------------------------------------------
*/

router.patch(
  "/preferences",

  authenticate,

  validateRequest(updatePreferenceSchema),

  updatePreferences,
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

import userPermissionRoutes from "../user-permission/userPermission.routes";

router.get(
  "/dashboard",

  authenticate,

  getDashboard,
);

/*
|--------------------------------------------------------------------------
| Enterprise User Permission Overrides
|--------------------------------------------------------------------------
*/
router.use("/", userPermissionRoutes);

export default router;
