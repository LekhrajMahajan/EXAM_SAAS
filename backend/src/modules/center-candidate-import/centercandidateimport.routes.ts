import { Router } from "express";
import multer from "multer";
import { authenticate } from "../../middleware/authenticate";
import { uploadCandidateExcel, getImportedCandidates, updateImportedCandidate, deleteImportedCandidate } from "./centercandidateimport.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  uploadCandidateExcel
);

router.get(
  "/",
  authenticate,
  getImportedCandidates
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
