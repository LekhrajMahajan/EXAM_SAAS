import { Router } from "express";

import {
  searchCandidateForEntry,
  verifyCandidateEntry,
  getMyAssignments,
} from "./entryChecker.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";

const router = Router();

router.get(
  "/search-candidate/:applicationNo",
  authenticate,
  authorize(UserRole.ENTRY_CHECKER, UserRole.CENTER_MANAGER),
  searchCandidateForEntry,
);

router.post(
  "/verify-candidate",
  authenticate,
  authorize(UserRole.ENTRY_CHECKER, UserRole.CENTER_MANAGER),
  verifyCandidateEntry,
);

router.get(
  "/my-assignments",
  authenticate,
  authorize(UserRole.ENTRY_CHECKER, UserRole.CENTER_MANAGER),
  getMyAssignments,
);

export default router;
