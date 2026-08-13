import { Router } from "express";
import {
  getAllocatedExams,
  allocateExam,
  removeAllocation,
} from "./centerAssignCandidateAttendance.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  getAllocatedExams
);

router.post(
  "/",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  allocateExam
);

router.delete(
  "/:id",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  removeAllocation
);

export default router;
