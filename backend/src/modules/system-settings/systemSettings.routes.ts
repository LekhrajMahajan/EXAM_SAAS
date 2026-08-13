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
  getSystemInfo,
  getOrganizationSettings,
  updateOrganizationSettings,
  uploadOrganizationLogo,
  deleteOrganizationLogo,
  testEmailGateway,
  testSmsGateway,
  testStorageGateway,
  switchStorageProvider,
  triggerBackup,
  restoreBackup,
  getBackupHistory,
} from "./systemSettings.controller";

import {
  getConfigurationHistory,
  getConfigurationHistoryById,
  compareConfigurationVersions,
  rollbackConfiguration,
  approveConfiguration,
  exportConfigurationHistory
} from "./configurationHistory.controller";

import {
  getIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegration
} from "./integration.controller";
import {
  createSettingSchema,
  updateSettingSchema,
  settingIdSchema,
  settingKeySchema,
  resetSettingsSchema,
} from "./systemSettings.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Integrations
|--------------------------------------------------------------------------
*/

router.get(
  "/integrations",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getIntegrations
);

router.get(
  "/integrations/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getIntegration
);

router.post(
  "/integrations",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  createIntegration
);

router.patch(
  "/integrations/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  updateIntegration
);

router.delete(
  "/integrations/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteIntegration
);

router.post(
  "/integrations/test/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  testIntegration
);

/*
|--------------------------------------------------------------------------
| Configuration History
|--------------------------------------------------------------------------
*/

router.get(
  "/configuration-history",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getConfigurationHistory
);

router.get(
  "/configuration-history/export",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  exportConfigurationHistory
);

router.post(
  "/configuration-history/compare",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  compareConfigurationVersions
);

router.get(
  "/configuration-history/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getConfigurationHistoryById
);

router.post(
  "/configuration-history/:id/rollback",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  rollbackConfiguration
);

router.post(
  "/configuration-history/:id/approve",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  approveConfiguration
);

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
| System Info
|--------------------------------------------------------------------------
*/

router.get(
  "/system-info",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  getSystemInfo,
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

router.post(
  "/organization/logo/:key",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  upload.single('logo'),
  uploadOrganizationLogo
);

router.delete(
  '/organization/logo',
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteOrganizationLogo
);

router.post(
  '/email-gateway/test',
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  testEmailGateway
);

router.post(
  '/sms-gateway/test',
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  testSmsGateway
);

router.post(
  '/storage-gateway/test',
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  testStorageGateway
);

router.post(
  '/storage-gateway/provider/switch',
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  switchStorageProvider
);

/*
|--------------------------------------------------------------------------
| Backup & Restore
|--------------------------------------------------------------------------
*/

router.post(
  '/backup/trigger',
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  triggerBackup
);

router.post(
  '/backup/restore',
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreBackup
);

router.get(
  '/backup/history',
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getBackupHistory
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
