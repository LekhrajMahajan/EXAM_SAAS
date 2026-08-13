import { Router } from "express";

import {
  createRole,
  getRoles,
  getRoleById,
  updateRole,
  deleteRole,
  restoreRole,
  updateRoleStatus,
  assignPermissions,
  getRoleStatistics,
  cloneRole,
  getSystemRoles,
  getCustomRoles,
  getCompanyRoles,
} from "./role.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createRoleSchema,
  updateRoleSchema,
  updateRoleStatusSchema,
  assignPermissionsSchema,
} from "./role.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getRoleStatistics,
);

/*
|--------------------------------------------------------------------------
| Phase 4.2: Dynamic Role Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/system",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getSystemRoles,
);

router.get(
  "/custom",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getCustomRoles,
);

router.get(
  "/company/:companyId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getCompanyRoles,
);

/*
|--------------------------------------------------------------------------
| Create Role
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(createRoleSchema),
  createRole,
);

/*
|--------------------------------------------------------------------------
| Clone Role
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/clone",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  cloneRole,
);

/*
|--------------------------------------------------------------------------
| Get All Roles
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getRoles,
);

/*
|--------------------------------------------------------------------------
| Get Role By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  getRoleById,
);

/*
|--------------------------------------------------------------------------
| Update Role
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(updateRoleSchema),
  updateRole,
);

/*
|--------------------------------------------------------------------------
| Assign Permissions
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(assignPermissionsSchema),
  assignPermissions,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  validate(updateRoleStatusSchema),
  updateRoleStatus,
);

/*
|--------------------------------------------------------------------------
| Restore Role
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  restoreRole,
);

/*
|--------------------------------------------------------------------------
| Delete Role
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN),
  deleteRole,
);

export default router;
