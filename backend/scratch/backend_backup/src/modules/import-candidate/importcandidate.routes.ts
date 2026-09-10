import { Router } from "express";
import multer from "multer";
import { authenticate } from "../../middleware/authenticate";
import { uploadCandidateExcel, getImportedCandidates, updateImportedCandidate, deleteImportedCandidate, getUnassignedCandidates, assignCandidatesToLab, getLabAllocations, sendToCenter, sendToCompanyAdmin } from "./importcandidate.controller";
import { ImportCandidate } from "./importcandidate.model";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/debug-fetch", async (req, res) => {
  try {
    const data = await ImportCandidate.find().sort({_id: -1}).limit(5).lean();
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
});

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
