import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  generateCertificatePdf,
  generateAdmitCardPdf,
  generateResultPdf,
  generateMeritListPdf,
  generateQuestionPaperPdf,
  generateReportPdf,
  generateCustomPdf,
  downloadPdf,
  previewPdf,
} from "./pdf.controller";

import {
  certificatePdfSchema,
  admitCardPdfSchema,
  resultPdfSchema,
  meritListPdfSchema,
  questionPaperPdfSchema,
  reportPdfSchema,
  generatePdfSchema,
} from "./pdf.validation";

const router = Router();

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

  validateRequest(certificatePdfSchema),

  generateCertificatePdf,
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

  validateRequest(admitCardPdfSchema),

  generateAdmitCardPdf,
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

  validateRequest(resultPdfSchema),

  generateResultPdf,
);

/*
|--------------------------------------------------------------------------
| Merit List
|--------------------------------------------------------------------------
*/

router.post(
  "/merit-list",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(meritListPdfSchema),

  generateMeritListPdf,
);

/*
|--------------------------------------------------------------------------
| Question Paper
|--------------------------------------------------------------------------
*/

router.post(
  "/question-paper",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.PAPER_SETTER,
  ),

  validateRequest(questionPaperPdfSchema),

  generateQuestionPaperPdf,
);

/*
|--------------------------------------------------------------------------
| Report
|--------------------------------------------------------------------------
*/

router.post(
  "/report",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(reportPdfSchema),

  generateReportPdf,
);

/*
|--------------------------------------------------------------------------
| Custom PDF
|--------------------------------------------------------------------------
*/

router.post(
  "/custom",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(generatePdfSchema),

  generateCustomPdf,
);

/*
|--------------------------------------------------------------------------
| Download
|--------------------------------------------------------------------------
*/

router.post(
  "/download",

  authenticate,

  validateRequest(generatePdfSchema),

  downloadPdf,
);

/*
|--------------------------------------------------------------------------
| Preview
|--------------------------------------------------------------------------
*/

router.post(
  "/preview",

  authenticate,

  validateRequest(generatePdfSchema),

  previewPdf,
);

export default router;
