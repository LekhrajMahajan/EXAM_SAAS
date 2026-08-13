import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import smsService from "./sms.service";

/*
|--------------------------------------------------------------------------
| Send SMS
|--------------------------------------------------------------------------
*/

export const sendSms = asyncHandler(async (req: Request, res: Response) => {
  const result = await smsService.send(req.body);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "SMS sent successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Send Bulk SMS
|--------------------------------------------------------------------------
*/

export const sendBulkSms = asyncHandler(async (req: Request, res: Response) => {
  const result = await smsService.sendBulk({
    ...req.body,
    phone: req.body.phones,
  });

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Bulk SMS sent successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Send OTP SMS
|--------------------------------------------------------------------------
*/

export const sendOtpSms = asyncHandler(async (req: Request, res: Response) => {
  const result = await smsService.sendOtp(
    req.body.phone,

    req.body.otp,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "OTP SMS sent successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Send Welcome SMS
|--------------------------------------------------------------------------
*/

export const sendWelcomeSms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await smsService.sendWelcome(req.body.phone);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Welcome SMS sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Password Reset SMS
|--------------------------------------------------------------------------
*/

export const sendPasswordResetSms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await smsService.sendPasswordReset(
      req.body.phone,

      req.body.resetLink,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Password reset SMS sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Account Verification SMS
|--------------------------------------------------------------------------
*/

export const sendAccountVerificationSms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await smsService.sendAccountVerification(req.body.phone);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Account verification SMS sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Exam Schedule SMS
|--------------------------------------------------------------------------
*/

export const sendExamScheduleSms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await smsService.sendExamSchedule(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Exam schedule SMS sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Admit Card SMS
|--------------------------------------------------------------------------
*/

export const sendAdmitCardSms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await smsService.sendAdmitCard(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Admit card SMS sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Result SMS
|--------------------------------------------------------------------------
*/

export const sendResultSms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await smsService.sendResult(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Result SMS sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Certificate SMS
|--------------------------------------------------------------------------
*/

export const sendCertificateSms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await smsService.sendCertificate(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Certificate SMS sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Custom SMS
|--------------------------------------------------------------------------
*/

export const sendCustomSms = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await smsService.sendCustom(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Custom SMS sent successfully.",
      data: result,
    });
  },
);
