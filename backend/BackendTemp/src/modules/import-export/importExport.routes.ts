import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  importData,
  exportData,
  validateImport,
  getHistory,
  getHistoryById,
  downloadExport,
  cancelJob,
  deleteHistory,
  generateTemplate,
} from "./importExport.controller";

import {
  importSchema,
  exportSchema,
  validateImportSchema,
  importHistorySchema,
  historyIdSchema,
  downloadSchema,
  cancelImportSchema,
} from "./importExport.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Import
|--------------------------------------------------------------------------
*/

router.post(
  "/import",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(importSchema),

  importData,
);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

router.post(
  "/export",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(exportSchema),

  exportData,
);

/*
|--------------------------------------------------------------------------
| Validate Import
|--------------------------------------------------------------------------
*/

router.post(
  "/validate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(validateImportSchema),

  validateImport,
);

/*
|--------------------------------------------------------------------------
| History
|--------------------------------------------------------------------------
*/

router.get(
  "/history",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(importHistorySchema),

  getHistory,
);

router.get(
  "/history/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(historyIdSchema),

  getHistoryById,
);

router.delete(
  "/history/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(historyIdSchema),

  deleteHistory,
);

/*
|--------------------------------------------------------------------------
| Download Export
|--------------------------------------------------------------------------
*/

router.get(
  "/download/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(downloadSchema),

  downloadExport,
);

/*
|--------------------------------------------------------------------------
| Cancel Job
|--------------------------------------------------------------------------
*/

router.post(
  "/cancel/:id",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(cancelImportSchema),

  cancelJob,
);

/*
|--------------------------------------------------------------------------
| Templates
|--------------------------------------------------------------------------
*/

router.get(
  "/templates/:type",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  generateTemplate,
);

export default router;
