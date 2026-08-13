import { Router } from "express";

import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  updateCandidateStatus,
  assignSeat,
  removeSeat,
  verifyCandidate,
  generateHallTicket,
  deleteCandidate,
  restoreCandidate,
  getCandidateStatistics,
} from "./candidate.controller";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { checkUsageLimit } from "../../middleware/checkUsageLimit";
import Candidate from "./candidate.model";

import { UserRole } from "../../constants/roles";

import {
  createCandidateSchema,
  updateCandidateSchema,
  updateCandidateStatusSchema,
  assignSeatSchema,
  verificationSchema,
  hallTicketSchema,
} from "./candidate.validation";

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
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  getCandidateStatistics,
);

/*
|--------------------------------------------------------------------------
| Create Candidate
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  validate(createCandidateSchema),
  checkUsageLimit('maxCandidates', Candidate),
  createCandidate,
);

/*
|--------------------------------------------------------------------------
| Get All Candidates
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.OBSERVER,
  ),
  getCandidates,
);

/*
|--------------------------------------------------------------------------
| Get Candidate By Id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.OBSERVER,
  ),
  getCandidateById,
);

/*
|--------------------------------------------------------------------------
| Get Candidate Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/profile",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
    UserRole.OBSERVER,
    UserRole.CANDIDATE,
  ),
  getCandidateById,
);

/*
|--------------------------------------------------------------------------
| Update Candidate
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  validate(updateCandidateSchema),
  updateCandidate,
);

/*
|--------------------------------------------------------------------------
| Update Candidate Status
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
  ),
  validate(updateCandidateStatusSchema),
  updateCandidateStatus,
);

/*
|--------------------------------------------------------------------------
| Assign Seat
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/assign-seat",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  validate(assignSeatSchema),
  assignSeat,
);

/*
|--------------------------------------------------------------------------
| Remove Seat
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/remove-seat",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  removeSeat,
);

/*
|--------------------------------------------------------------------------
| Verify Candidate
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/verify",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.BIOMETRIC_VERIFIER,
  ),
  validate(verificationSchema),
  verifyCandidate,
);

/*
|--------------------------------------------------------------------------
| Generate Hall Ticket
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/generate-hallticket",
  authenticate,
  authorize(UserRole.MASTER_ADMIN,
    UserRole.COMPANY_ADMIN,
    UserRole.BRANCH_MANAGER,
    UserRole.CENTER_MANAGER,
    UserRole.EXAM_MANAGER,
  ),
  validate(hallTicketSchema),
  generateHallTicket,
);

/*
|--------------------------------------------------------------------------
| Restore Candidate
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id/restore",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  restoreCandidate,
);

/*
|--------------------------------------------------------------------------
| Delete Candidate
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.MASTER_ADMIN),
  deleteCandidate,
);

export default router;
