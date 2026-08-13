import { Router } from "express";

import {
  createAdmitCard,
  bulkGenerateAdmitCards,
  getAdmitCards,
  getAdmitCardById,
  getAdmitCardByCandidate,
  getAdmitCardsByExam,
  downloadAdmitCard,
  printAdmitCard,
  verifyAdmitCard,
  updateAdmitCard,
  updateAdmitCardStatus,
  deleteAdmitCard,
  restoreAdmitCard,
  getAdmitCardStatistics,
  generateAdmitCards,
  regenerateAdmitCard,
} from "./admitCard.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import {
  createAdmitCardSchema,
  bulkGenerateAdmitCardsSchema,
  updateAdmitCardSchema,
  updateAdmitCardStatusSchema,
  verifyAdmitCardSchema,
} from "./admitCard.validation";

import { UserRole } from "../../constants/roles";

const router = Router();

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

router.get(
  "/statistics",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
  ),
  getAdmitCardStatistics,
);

/*
|--------------------------------------------------------------------------
| Create
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  validate(createAdmitCardSchema),
  createAdmitCard,
);

/*
|--------------------------------------------------------------------------
| Bulk Generate
|--------------------------------------------------------------------------
*/

router.post(
  "/bulk",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  validate(bulkGenerateAdmitCardsSchema),
  bulkGenerateAdmitCards,
);

/*
|--------------------------------------------------------------------------
| Generate
|--------------------------------------------------------------------------
*/

router.post(
  "/generate",
  // authenticate,
  // authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  generateAdmitCards,
);

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

router.post("/verify", verifyAdmitCard);

/*
|--------------------------------------------------------------------------
| Download
|--------------------------------------------------------------------------
*/

router.get("/download/:id", downloadAdmitCard);

/*
|--------------------------------------------------------------------------
| Regenerate
|--------------------------------------------------------------------------
*/

router.patch("/regenerate/:id", regenerateAdmitCard);

/*
|--------------------------------------------------------------------------
| Print
|--------------------------------------------------------------------------
*/

router.post("/:id/print", authenticate, printAdmitCard);

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.EXAM_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  getAdmitCards,
);

/*
|--------------------------------------------------------------------------
| Get By Candidate
|--------------------------------------------------------------------------
*/

router.get("/candidate/:candidateId", authenticate, getAdmitCardByCandidate);

/*
|--------------------------------------------------------------------------
| Get By Exam
|--------------------------------------------------------------------------
*/

router.get(
  "/exam/:examId",
  authenticate,
  authorize(UserRole.MASTER_ADMIN, UserRole.EXAM_MANAGER),
  getAdmitCardsByExam,
);

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

router.get("/:id", authenticate, getAdmitCardById);

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(updateAdmitCardSchema),
  updateAdmitCard,
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  validate(updateAdmitCardStatusSchema),
  updateAdmitCardStatus,
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreAdmitCard,
);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteAdmitCard,
);

export default router;
