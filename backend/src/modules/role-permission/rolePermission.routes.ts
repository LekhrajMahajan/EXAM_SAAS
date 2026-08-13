import { Router } from "express";

import {
  assignPermissions,
  getRolePermissions,
  replacePermissions,
  removePermission,
  clearPermissions,
  patchPermissions,
  getPermissionMatrix,
} from "./rolePermission.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import { z } from "zod";

const router = Router();

/*
|--------------------------------------------------------------------------
| Validation Schema
|--------------------------------------------------------------------------
*/

const permissionIdsSchema = z
  .object({
    permissionIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    permissions: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
  })
  .refine(
    (data) => data.permissionIds !== undefined || data.permissions !== undefined,
    {
      message: "Either permissionIds or permissions must be provided as an array of IDs.",
    },
  );

/*
|--------------------------------------------------------------------------
| Permission Matrix Route
|--------------------------------------------------------------------------
*/

router.get(
  "/permissions/matrix",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getPermissionMatrix,
);

/*
|--------------------------------------------------------------------------
| Assign Permissions (POST)
|--------------------------------------------------------------------------
*/

router.post(
  "/roles/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(permissionIdsSchema),
  assignPermissions,
);

/*
|--------------------------------------------------------------------------
| Patch Permissions (PATCH) - Granular update alias
|--------------------------------------------------------------------------
*/

router.patch(
  "/roles/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(permissionIdsSchema),
  patchPermissions,
);

/*
|--------------------------------------------------------------------------
| Get Role Permissions
|--------------------------------------------------------------------------
*/

router.get(
  "/roles/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getRolePermissions,
);

/*
|--------------------------------------------------------------------------
| Replace Permissions (PUT)
|--------------------------------------------------------------------------
*/

router.put(
  "/roles/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(permissionIdsSchema),
  replacePermissions,
);

/*
|--------------------------------------------------------------------------
| Remove Single Permission
|--------------------------------------------------------------------------
*/

router.delete(
  "/roles/:id/permissions/:permissionId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  removePermission,
);

/*
|--------------------------------------------------------------------------
| Clear All Permissions
|--------------------------------------------------------------------------
*/

router.delete(
  "/roles/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  clearPermissions,
);

export default router;
