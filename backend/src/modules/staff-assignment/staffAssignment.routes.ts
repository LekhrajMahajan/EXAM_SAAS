import { Router } from "express";
import {
  createAssignment,
  autoAssign,
  bulkAssign,
  getDashboard,
  getCalendar,
  getConflicts,
  getWorkload,
  exportAssignments,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  approveAssignment,
  publishAssignment,
  cancelAssignment,
  replaceAssignment,
  acceptDuty,
  rejectDuty,
  deleteAssignment,
} from "./staffAssignment.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { UserRole } from "../../constants/roles";
import {
  createAssignmentSchema,
  autoAssignmentSchema,
  bulkAssignmentSchema,
  replaceAssignmentSchema,
  statusUpdateSchema,
} from "./staffAssignment.validation";

const router = Router();

// Apply authentication to all assignment endpoints
router.use(authenticate);

/*
|--------------------------------------------------------------------------
| Dashboards, Calendar & Analytics Reports (GET)
|--------------------------------------------------------------------------
*/
router.get("/dashboard", getDashboard);
router.get("/calendar", getCalendar);
router.get("/conflicts", getConflicts);
router.get("/workload", getWorkload);
router.get("/export", exportAssignments);

/*
|--------------------------------------------------------------------------
| Auto & Bulk Operations (POST)
|--------------------------------------------------------------------------
*/
router.post(
  "/auto",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER),
  validate(autoAssignmentSchema),
  autoAssign,
);

router.post(
  "/bulk",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER),
  validate(bulkAssignmentSchema),
  bulkAssign,
);

router.post(
  "/create",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  validate(createAssignmentSchema),
  createAssignment,
);

router.post(
  "/",
  authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER, UserRole.CENTER_MANAGER),
  validate(createAssignmentSchema),
  createAssignment,
);

/*
|--------------------------------------------------------------------------
| Status Transitions & Workflow Actions (PATCH)
|--------------------------------------------------------------------------
*/
router.patch("/update", updateAssignment);
router.patch("/approve", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER), approveAssignment);
router.patch("/publish", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER), publishAssignment);
router.patch("/cancel", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER), cancelAssignment);
router.patch("/replace", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER), validate(replaceAssignmentSchema), replaceAssignment);
router.patch("/accept", acceptDuty);
router.patch("/reject", validate(statusUpdateSchema), rejectDuty);

// Dynamic ID-based workflow action routes for frontend flexibility
router.patch("/:id/approve", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER), approveAssignment);
router.patch("/:id/publish", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER), publishAssignment);
router.patch("/:id/cancel", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER), cancelAssignment);
router.patch("/:id/replace", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER, UserRole.BRANCH_MANAGER), replaceAssignment);
router.patch("/:id/accept", acceptDuty);
router.patch("/:id/reject", rejectDuty);
router.patch("/:id", updateAssignment);

/*
|--------------------------------------------------------------------------
| Standard CRUD Queries
|--------------------------------------------------------------------------
*/
router.get("/", getAssignments);
router.get("/:id", getAssignmentById);
router.delete("/:id", authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN, UserRole.EXAM_MANAGER), deleteAssignment);

export default router;
