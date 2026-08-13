import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";
import { scanIp, getScans } from "./centerSystemNetwork.controller";
import { scanIpSchema } from "./centerSystemNetwork.validation";

const router = Router();

router.post(
  "/scan",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.MASTER_ADMIN),
  validateRequest(scanIpSchema),
  scanIp
);

router.get(
  "/",
  authenticate,
  authorize(UserRole.CENTER_MANAGER, UserRole.MASTER_ADMIN),
  getScans
);

export default router;
