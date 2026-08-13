import { Router } from "express";

import {
  createPermission,
  getPermissions,
  searchPermissions,
  getPermissionsByGroup,
  getPermissionsByModule,
  getPermissionById,
  updatePermission,
  updatePermissionStatus,
  deletePermission,
  restorePermission,
  getPermissionStatistics,
} from "./permission.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createPermissionSchema,
  updatePermissionSchema,
  updatePermissionStatusSchema,
  permissionQuerySchema,
  permissionGroupSchema,
  permissionModuleSchema,
} from "./permission.validation";
import { getPermissionMatrix } from "../role-permission/rolePermission.controller";

const router = Router();

/*
|--------------------------------------------------------------------------
| Matrix (Enterprise 2D View)
|--------------------------------------------------------------------------
*/

router.get(
  "/matrix",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getPermissionMatrix,
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getPermissionStatistics,
);

/*
|--------------------------------------------------------------------------
| Dedicated Search Endpoint
|--------------------------------------------------------------------------
*/

router.get(
  "/search",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(permissionQuerySchema),
  searchPermissions,
);

/*
|--------------------------------------------------------------------------
| Get Permissions By Group
|--------------------------------------------------------------------------
*/

router.get(
  "/group/:group",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(permissionGroupSchema),
  getPermissionsByGroup,
);

/*
|--------------------------------------------------------------------------
| Get Permissions By Module
|--------------------------------------------------------------------------
*/

router.get(
  "/module/:module",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(permissionModuleSchema),
  getPermissionsByModule,
);

/*
|--------------------------------------------------------------------------
| Create Permission
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(createPermissionSchema),
  createPermission,
);

/*
|--------------------------------------------------------------------------
| Get All Permissions
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getPermissions,
);

/*
|--------------------------------------------------------------------------
| Get Permission By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  getPermissionById,
);

/*
|--------------------------------------------------------------------------
| Update Permission
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(updatePermissionSchema),
  updatePermission,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(updatePermissionStatusSchema),
  updatePermissionStatus,
);

/*
|--------------------------------------------------------------------------
| Restore Permission
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restorePermission,
);

/*
|--------------------------------------------------------------------------
| Delete Permission
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deletePermission,
);

export default router;
