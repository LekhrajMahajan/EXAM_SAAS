import { Router } from "express";
import {
  getAssignments,
  createOrUpdateAssignment,
  deleteAssignment,
} from "./centerAssignExamStaff.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getAssignments
);

router.post(
  "/",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  createOrUpdateAssignment
);

router.delete(
  "/:id",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  deleteAssignment
);

export default router;
