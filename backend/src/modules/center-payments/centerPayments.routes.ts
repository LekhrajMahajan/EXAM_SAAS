import { Router } from "express";
import { getCenterPayments } from "./centerPayments.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const router = Router();

router.use(authenticate);

// Both Company Admin and Center Manager can view payments
router.get("/", authorize("COMPANY_ADMIN", "CENTER_MANAGER", "Center Manager"), getCenterPayments);

export default router;
