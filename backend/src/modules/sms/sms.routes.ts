import { Router } from "express";

import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate as validateRequest } from "../../middleware/validate";

import { UserRole } from "../../constants/roles";

import {
  sendSms,
  sendBulkSms,
  sendOtpSms,
  sendWelcomeSms,
  sendPasswordResetSms,
  sendAccountVerificationSms,
  sendExamScheduleSms,
  sendAdmitCardSms,
  sendResultSms,
  sendCertificateSms,
  sendCustomSms,
} from "./sms.controller";

import {
  sendSmsSchema,
  sendBulkSmsSchema,
  sendOtpSmsSchema,
  sendAdmitCardSmsSchema,
  sendResultSmsSchema,
  sendCertificateSmsSchema,
  sendCustomSmsSchema,
} from "./sms.validation";

const router = Router();

/*
|--------------------------------------------------------------------------
| General SMS
|--------------------------------------------------------------------------
*/

router.post(
  "/send",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(sendSmsSchema),

  sendSms,
);

router.post(
  "/send-bulk",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(sendBulkSmsSchema),

  sendBulkSms,
);

router.post(
  "/send-custom",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  validateRequest(sendCustomSmsSchema),

  sendCustomSms,
);

/*
|--------------------------------------------------------------------------
| Authentication SMS
|--------------------------------------------------------------------------
*/

router.post(
  "/send-otp",

  validateRequest(sendOtpSmsSchema),

  sendOtpSms,
);

router.post(
  "/send-welcome",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  sendWelcomeSms,
);

router.post(
  "/send-password-reset",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  sendPasswordResetSms,
);

router.post(
  "/send-account-verification",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,
  ),

  sendAccountVerificationSms,
);

/*
|--------------------------------------------------------------------------
| Exam SMS
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

  validateRequest(sendSmsSchema),

  sendExamScheduleSms,
);

router.post(
  "/send-admit-card",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendAdmitCardSmsSchema),

  sendAdmitCardSms,
);

router.post(
  "/send-result",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendResultSmsSchema),

  sendResultSms,
);

router.post(
  "/send-certificate",

  authenticate,

  authorize(
    UserRole.MASTER_ADMIN,

    UserRole.COMPANY_ADMIN,

    UserRole.EXAM_MANAGER,
  ),

  validateRequest(sendCertificateSmsSchema),

  sendCertificateSms,
);

export default router;
