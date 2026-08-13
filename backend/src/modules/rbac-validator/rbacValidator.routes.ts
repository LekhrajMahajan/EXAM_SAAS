import { Router } from "express";
import { runValidation, getValidationReport } from "./rbacValidator.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

const router = Router();

/*
|--------------------------------------------------------------------------
| Enterprise RBAC Validation & E2E Diagnostic Routes
|--------------------------------------------------------------------------
*/
router.post(
  "/run",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN, "SECURITY_ADMIN"),
  runValidation
);

router.get(
  "/report",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.ADMIN, "SECURITY_ADMIN"),
  getValidationReport
);

export default router;
