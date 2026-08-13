import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { UserRole } from "../../constants/roles";
import {
  getCustomReports,
  getCustomReportById,
  createCustomReport,
  updateCustomReport,
  deleteCustomReport,
  executeCustomReport,
  previewCustomReport,
  cloneCustomReport,
  getCustomReportMetadata
} from "./custom-report.controller";

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.MASTER_ADMIN, UserRole.COMPANY_ADMIN));

router.get("/metadata", getCustomReportMetadata);
router.post("/preview", previewCustomReport);

router.route("/")
  .get(getCustomReports)
  .post(createCustomReport);

router.route("/:id")
  .get(getCustomReportById)
  .patch(updateCustomReport)
  .delete(deleteCustomReport);

router.post("/:id/execute", executeCustomReport);
router.post("/:id/clone", cloneCustomReport);

export default router;
