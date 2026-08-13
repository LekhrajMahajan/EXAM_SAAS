import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  createCertificate,
  generateCertificate,
  issueCertificate,
  verifyCertificate,
  downloadCertificate,
  revokeCertificate,
  getCertificateById,
  getCertificateByResult,
  getCandidateCertificates,
  getCertificates,
  dashboard,
  statistics,
  softDeleteCertificate,
  restoreCertificate,
  bulkGenerateCertificates,
} from "./certificate.controller";

import {
  createCertificateSchema,
  certificateIdSchema,
  generateCertificateSchema,
  issueCertificateSchema,
  revokeCertificateSchema,
  restoreCertificateSchema,
  deleteCertificateSchema,
  verifyCertificateSchema,
  downloadCertificateSchema,
  certificateQuerySchema,
  dashboardSchema,
  statisticsSchema,
  resultCertificateSchema,
  candidateCertificateSchema,
} from "./certificate.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Verification
|--------------------------------------------------------------------------
*/

router.get(
  "/verify/:verificationCode",

  validate(verifyCertificateSchema),

  verifyCertificate,
);

/*
|--------------------------------------------------------------------------
| Analytics
|--------------------------------------------------------------------------
*/

router.get(
  "/dashboard",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(dashboardSchema),

  dashboard,
);

router.get(
  "/statistics",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(statisticsSchema),

  statistics,
);

/*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
*/

router.get(
  "/result/:resultId",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(resultCertificateSchema),

  getCertificateByResult,
);

router.get(
  "/candidate/:candidateId",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,

    UserRole.CANDIDATE,
  ),

  validate(candidateCertificateSchema),

  getCandidateCertificates,
);

/*
|--------------------------------------------------------------------------
| Certificate Workflow
|--------------------------------------------------------------------------
*/

router.post(
  "/generate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  bulkGenerateCertificates,
);

router.post(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(createCertificateSchema),

  createCertificate,
);

router.patch(
  "/:id/generate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(generateCertificateSchema),

  generateCertificate,
);

router.patch(
  "/:id/issue",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validate(issueCertificateSchema),

  issueCertificate,
);

router.post(
  "/revoke",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validate(revokeCertificateSchema),

  revokeCertificate,
);

/*
|--------------------------------------------------------------------------
| Download
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/download",

  authenticate,

  authorize(
    UserRole.CANDIDATE,

    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(downloadCertificateSchema),

  downloadCertificate,
);

/*
|--------------------------------------------------------------------------
| CRUD
|--------------------------------------------------------------------------
*/

router.get(
  "/",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(certificateQuerySchema),

  getCertificates,
);

router.get(
  "/:id",

  authenticate,

  authorize(
    UserRole.CANDIDATE,

    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validate(certificateIdSchema),

  getCertificateById,
);

router.delete(
  "/:id",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validate(deleteCertificateSchema),

  softDeleteCertificate,
);

router.patch(
  "/:id/restore",

  authenticate,

  authorize(UserRole.MASTER_ADMIN),

  validate(restoreCertificateSchema),

  restoreCertificate,
);

export default router;
