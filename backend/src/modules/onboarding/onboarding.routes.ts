import { Router } from "express";
import { onboardingController } from "./onboarding.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// Endpoints requiring authentication
router.use(authenticate);

// POST /api/v1/onboarding/complete - Complete the multi-step onboarding wizard
router.post("/complete", (req, res, next) => onboardingController.complete(req, res, next));

// GET /api/v1/onboarding/navigation - Get dynamic menu for the company user
router.get("/navigation", (req, res, next) => onboardingController.getNavigation(req, res, next));

export default router;
