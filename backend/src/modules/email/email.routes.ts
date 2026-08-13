import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  sendEmail,
  sendBulkEmail,
  sendOtp,
  sendWelcomeEmail,
  sendPasswordReset,
  sendAccountVerification,
  sendExamSchedule,
  sendAdmitCard,
  sendResult,
  sendCertificate,
  sendCustomEmail,
} from "./email.controller";

import {
  sendEmailSchema,
  sendBulkEmailSchema,
  sendOtpSchema,
  sendAdmitCardSchema,
  sendResultSchema,
  sendCertificateSchema,
  sendCustomEmailSchema,
} from "./email.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| General Email
|--------------------------------------------------------------------------
*/

router.post(
  "/send",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.BRANCH_MANAGER,

    UserRole.CENTER_MANAGER,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendEmailSchema),

  sendEmail,
);

router.post(
  "/send-bulk",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.BRANCH_MANAGER,

    UserRole.CENTER_MANAGER,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendBulkEmailSchema),

  sendBulkEmail,
);

router.post(
  "/send-custom",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.BRANCH_MANAGER,

    UserRole.CENTER_MANAGER,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendCustomEmailSchema),

  sendCustomEmail,
);

router.post(
  "/send-staff-id",

  validateRequest(sendCustomEmailSchema),

  sendCustomEmail,
);

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.post(
  "/send-otp",

  validateRequest(sendOtpSchema),

  sendOtp,
);

router.post(
  "/send-welcome",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  sendWelcomeEmail,
);

router.post(
  "/send-password-reset",

  sendPasswordReset,
);

router.post(
  "/send-account-verification",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  sendAccountVerification,
);

/*
|--------------------------------------------------------------------------
| Exam Emails
|--------------------------------------------------------------------------
*/

router.post(
  "/send-exam-schedule",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendEmailSchema),

  sendExamSchedule,
);

router.post(
  "/send-admit-card",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendAdmitCardSchema),

  sendAdmitCard,
);

router.post(
  "/send-result",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendResultSchema),

  sendResult,
);

router.post(
  "/send-certificate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendCertificateSchema),

  sendCertificate,
);

export default router;
