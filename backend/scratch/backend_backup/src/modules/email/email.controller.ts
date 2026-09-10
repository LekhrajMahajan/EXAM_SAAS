import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import emailService from "./email.service";

/*
|--------------------------------------------------------------------------
| Send Email
|--------------------------------------------------------------------------
*/

export const sendEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await emailService.send(req.body);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Email sent successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Send Bulk Email
|--------------------------------------------------------------------------
*/

export const sendBulkEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await emailService.sendBulk(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Bulk email sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send OTP
|--------------------------------------------------------------------------
*/

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const result = await emailService.sendOtp(
    req.body.email,

    req.body.otp,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "OTP email sent successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Send Welcome Email
|--------------------------------------------------------------------------
*/

export const sendWelcomeEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await emailService.sendWelcome(req.body.email);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Welcome email sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Password Reset
|--------------------------------------------------------------------------
*/

export const sendPasswordReset = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await emailService.sendPasswordReset(
      req.body.email,

      req.body.resetLink,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Password reset email sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Account Verification
|--------------------------------------------------------------------------
*/

export const sendAccountVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await emailService.sendAccountVerification(req.body.email);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Account verification email sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Exam Schedule
|--------------------------------------------------------------------------
*/

export const sendExamSchedule = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await emailService.sendExamSchedule(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Exam schedule email sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Admit Card
|--------------------------------------------------------------------------
*/

export const sendAdmitCard = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await emailService.sendAdmitCard(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Admit card email sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Result
|--------------------------------------------------------------------------
*/

export const sendResult = asyncHandler(async (req: Request, res: Response) => {
  const result = await emailService.sendResult(req.body);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Result email sent successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Send Certificate
|--------------------------------------------------------------------------
*/

export const sendCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await emailService.sendCertificate(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Certificate email sent successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Send Custom Email
|--------------------------------------------------------------------------
*/

export const sendCustomEmail = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await emailService.sendCustom(req.body);

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Custom email sent successfully.",
      data: result,
    });
  },
);
