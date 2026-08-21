import { Router } from "express";
import multer from "multer";
import { authenticate } from "../../middleware/authenticate";
import { uploadCandidateExcel, getImportedCandidates, updateImportedCandidate, deleteImportedCandidate, getUnassignedCandidates, assignCandidatesToLab, getLabAllocations, sendToCenter, sendToCompanyAdmin } from "./importcandidate.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  authenticate,
  upload.single('file'),
  uploadCandidateExcel
);

router.get(
  "/",
  authenticate,
  getImportedCandidates
);

router.post(
  "/send-to-center",
  authenticate,
  sendToCenter
);

router.post(
  "/send-to-admin",
  authenticate,
  sendToCompanyAdmin
);

router.get(
  "/unassigned/:examId",
  authenticate,
  getUnassignedCandidates
);

router.post(
  "/assign-lab",
  authenticate,
  assignCandidatesToLab
);

router.get(
  "/allocations/:examId",
  authenticate,
  getLabAllocations
);

router.patch(
  "/:id",
  authenticate,
  updateImportedCandidate
);

router.delete(
  "/:id",
  authenticate,
  deleteImportedCandidate
);

export default router;
