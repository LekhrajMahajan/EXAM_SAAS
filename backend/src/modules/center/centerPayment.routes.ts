import express from "express";
import { requireAuth, requireRoles } from "../../core/middlewares/auth.middleware";
import { Roles } from "../auth/auth.types";
import { getCompanyCenterPayments, verifyCenterPayment } from "./centerPayment.controller";

const router = express.Router();

router.use(requireAuth);
router.use(requireRoles([Roles.COMPANY_ADMIN]));

router.get("/", getCompanyCenterPayments);
router.post("/verify", verifyCenterPayment);

export default router;
