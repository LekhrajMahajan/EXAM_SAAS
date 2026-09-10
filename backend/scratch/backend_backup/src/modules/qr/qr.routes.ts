import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  generateQr,
  generateCertificateQr,
  generateAdmitCardQr,
  generateResultQr,
  generateEmployeeQr,
  generateCandidateQr,
  generatePaperQr,
  generateExamQr,
  generateCustomQr,
  verifyQr,
} from "./qr.controller";

import {
  generateQrSchema,
  certificateQrSchema,
  admitCardQrSchema,
  resultQrSchema,
  employeeQrSchema,
  candidateQrSchema,
  paperQrSchema,
  examQrSchema,
  verifyQrSchema,
} from "./qr.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| General QR
|--------------------------------------------------------------------------
*/

router.post(
  "/generate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(generateQrSchema),

  generateQr,
);

router.post(
  "/custom",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(generateQrSchema),

  generateCustomQr,
);

/*
|--------------------------------------------------------------------------
| Certificate
|--------------------------------------------------------------------------
*/

router.post(
  "/certificate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(certificateQrSchema),

  generateCertificateQr,
);

/*
|--------------------------------------------------------------------------
| Admit Card
|--------------------------------------------------------------------------
*/

router.post(
  "/admit-card",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(admitCardQrSchema),

  generateAdmitCardQr,
);

/*
|--------------------------------------------------------------------------
| Result
|--------------------------------------------------------------------------
*/

router.post(
  "/result",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(resultQrSchema),

  generateResultQr,
);

/*
|--------------------------------------------------------------------------
| Employee
|--------------------------------------------------------------------------
*/

router.post(
  "/employee",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(employeeQrSchema),

  generateEmployeeQr,
);

/*
|--------------------------------------------------------------------------
| Candidate
|--------------------------------------------------------------------------
*/

router.post(
  "/candidate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(candidateQrSchema),

  generateCandidateQr,
);

/*
|--------------------------------------------------------------------------
| Paper
|--------------------------------------------------------------------------
*/

router.post(
  "/paper",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.PAPER_SETTER,
  ),

  validateRequest(paperQrSchema),

  generatePaperQr,
);

/*
|--------------------------------------------------------------------------
| Exam
|--------------------------------------------------------------------------
*/

router.post(
  "/exam",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(examQrSchema),

  generateExamQr,
);

/*
|--------------------------------------------------------------------------
| Verify
|--------------------------------------------------------------------------
*/

router.post(
  "/verify",

  authenticate,

  validateRequest(verifyQrSchema),

  verifyQr,
);

export default router;
