import { Router } from "express";
import {
  reseedSystem,
  initializeCompany,
  getInitializationStatus,
  rebuildSidebar,
  rebuildPermissions,
} from "./organizationSeeder.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

const router = Router();

/*
|--------------------------------------------------------------------------
| System Reseed Routes (Master Admin Only)
|--------------------------------------------------------------------------
*/
router.post(
  "/reseed",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.ADMIN),
  reseedSystem
);

/*
|--------------------------------------------------------------------------
| Tenant Organization Initialization & Rebuild Routes
|--------------------------------------------------------------------------
*/
router.post(
  "/:id/initialize",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN),
  initializeCompany
);

router.get(
  "/:id/initialization-status",
  authenticate,
  getInitializationStatus
);

router.post(
  "/:id/rebuild-sidebar",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN),
  rebuildSidebar
);

router.post(
  "/:id/rebuild-permissions",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN),
  rebuildPermissions
);

export default router;
