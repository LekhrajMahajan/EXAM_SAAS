import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  uploadFile,
  bulkUpload,
  getFileById,
  downloadFile,
  previewFile,
  getFiles,
  dashboard,
  statistics,
  softDeleteFile,
  restoreFile,
  updateFile,
  getReports,
} from "./fileStorage.controller";

import {
  uploadFileSchema,
  bulkUploadSchema,
  fileStorageIdSchema,
  downloadFileSchema,
  previewFileSchema,
  fileStorageQuerySchema,
  dashboardSchema,
  statisticsSchema,
  deleteFileSchema,
  restoreFileSchema,
} from "./fileStorage.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(dashboardSchema),

  dashboard,
);

router.get(
  "/statistics",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(statisticsSchema),

  statistics,
);

/*
|--------------------------------------------------------------------------
| Upload
|--------------------------------------------------------------------------
*/

router.post(
  "/upload",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.PAPER_SETTER,
    UserRole.CENTER_MANAGER
  ),

  validateRequest(uploadFileSchema),

  uploadFile,
);

router.post(
  "/bulk-upload",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.PAPER_SETTER,
    UserRole.CENTER_MANAGER
  ),

  validateRequest(bulkUploadSchema),

  bulkUpload,
);

/*
|--------------------------------------------------------------------------
| File Actions
|--------------------------------------------------------------------------
*/

router.get(
  "/download/:id",

  authenticate,

  validateRequest(downloadFileSchema),

  downloadFile,
);

router.get(
  "/preview/:id",

  authenticate,

  validateRequest(previewFileSchema),

  previewFile,
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(fileStorageQuerySchema),

  getFiles,
);

router.get("/reports", getReports);

router.get(
  "/:id",

  authenticate,

  validateRequest(fileStorageIdSchema),

  getFileById,
);

router.delete(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(deleteFileSchema),

  softDeleteFile,
);

router.patch(
  "/:id/restore",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validateRequest(restoreFileSchema),

  restoreFile,
);

router.patch("/:id", updateFile);

export default router;
