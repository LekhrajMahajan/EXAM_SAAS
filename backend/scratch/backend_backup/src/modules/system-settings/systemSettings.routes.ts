import { Router } from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createSetting,
  getSettingById,
  getSettingByKey,
  getSettings,
  getSettingsByCategory,
  updateSetting,
  deleteSetting,
  resetCategory,
  getPublicSettings,
  importSettings,
  updateGeneralSettings,
  updateCategorySettings,
  getOrganizationSettings,
  updateOrganizationSettings,
} from "./systemSettings.controller";


import {
  createSettingSchema,
  updateSettingSchema,
  settingIdSchema,
  settingKeySchema,
  resetSettingsSchema,
  bulkUpdateGeneralSettingsSchema,
} from "./systemSettings.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Settings
|--------------------------------------------------------------------------
*/

router.get(
  "/public",

  getPublicSettings,
);

/*
|--------------------------------------------------------------------------
| General Settings
|--------------------------------------------------------------------------
*/

router.patch(
  "/general",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(bulkUpdateGeneralSettingsSchema),

  updateGeneralSettings,
);

/*
|--------------------------------------------------------------------------
| Organization Settings
|--------------------------------------------------------------------------
*/

router.get(
  "/organization",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getOrganizationSettings
);

router.patch(
  "/organization",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  updateOrganizationSettings
);

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getSettings,
);

router.get(
  "/key/:key",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(settingKeySchema),

  getSettingByKey,
);

router.get(
  "/category/:category",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getSettingsByCategory,
);

router.patch(
  "/category/:category",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  updateCategorySettings,
);

router.get(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(settingIdSchema),

  getSettingById,
);

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

router.post(
  "/",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(createSettingSchema),

  createSetting,
);

/*
|--------------------------------------------------------------------------
| Import / Export
|--------------------------------------------------------------------------
*/

router.post(
  "/import",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  importSettings,
);

router.post(
  "/reset",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(resetSettingsSchema),

  resetCategory,
);

/*
|--------------------------------------------------------------------------
| Update / Delete
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(updateSettingSchema),

  updateSetting,
);

router.delete(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(settingIdSchema),

  deleteSetting,
);

export default router;
