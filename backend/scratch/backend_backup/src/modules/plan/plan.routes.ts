import { Router } from "express";
import { authorize } from "../../middleware/authorize";
import { authenticate } from "../../middleware/authenticate";
import { UserRole } from "../../constants/roles";
import { validate } from "../../middleware/validate";
import { createPlanSchema, updatePlanSchema, queryPlanSchema } from "./plan.validation";
import {
  createPlan,
  updatePlan,
  clonePlan,
  archivePlan,
  togglePlanStatus,
  getPlan,
  getAllPlans,
  deletePlan,
} from "./plan.controller";

const router = Router();

// Anyone can view plans (public catalog & company admin subscription selection)
router.get("/", validate(queryPlanSchema), getAllPlans);
router.get("/:id", getPlan);

// Only Master Admin can create, modify, or delete plans
router.use(authenticate);
router.use(authorize(UserRole.MASTER_ADMIN));

router.post("/", validate(createPlanSchema), createPlan);
router.put("/:id", validate(updatePlanSchema), updatePlan);

router.post("/:id/clone", clonePlan);
router.post("/:id/archive", archivePlan);
router.post("/:id/status", togglePlanStatus);

router.delete("/:id", deletePlan);

export default router;
