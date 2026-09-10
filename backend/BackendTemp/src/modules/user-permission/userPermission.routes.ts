import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";
import userPermissionController from "./userPermission.controller";

const router = Router({ mergeParams: true });

/*
|--------------------------------------------------------------------------
| User Permission Override Routes (/api/v1/users/:id/permissions & /api/v1/users/:id/effective-permissions)
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN),
  userPermissionController.getPermissions
);

router.post(
  "/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN),
  userPermissionController.assignPermissions
);

router.patch(
  "/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN),
  userPermissionController.updatePermissions
);

router.delete(
  "/:id/permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN),
  userPermissionController.revokePermissions
);

router.get(
  "/:id/effective-permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN),
  userPermissionController.getEffectivePermissions
);

export default router;
