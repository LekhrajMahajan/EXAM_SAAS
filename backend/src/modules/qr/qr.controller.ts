import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import qrService from "./qr.service";

/*
|--------------------------------------------------------------------------
| Generate QR
|--------------------------------------------------------------------------
*/

export const generateQr = asyncHandler(async (req: Request, res: Response) => {
  const qr = await qrService.generate(req.body);

  sendResponse(res, httpStatus.CREATED, {
    success: true,
    message: "QR code generated successfully.",
    data: qr,
  });
});

/*
|--------------------------------------------------------------------------
| Generate Certificate QR
|--------------------------------------------------------------------------
*/

export const generateCertificateQr = asyncHandler(
  async (req: Request, res: Response) => {
    const qr = await qrService.generateCertificate(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Certificate QR generated successfully.",
      data: qr,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Admit Card QR
|--------------------------------------------------------------------------
*/

export const generateAdmitCardQr = asyncHandler(
  async (req: Request, res: Response) => {
    const qr = await qrService.generateAdmitCard(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Admit card QR generated successfully.",
      data: qr,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Result QR
|--------------------------------------------------------------------------
*/

export const generateResultQr = asyncHandler(
  async (req: Request, res: Response) => {
    const qr = await qrService.generateResult(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Result QR generated successfully.",
      data: qr,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Employee QR
|--------------------------------------------------------------------------
*/

export const generateEmployeeQr = asyncHandler(
  async (req: Request, res: Response) => {
    const qr = await qrService.generateEmployee(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Employee QR generated successfully.",
      data: qr,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Candidate QR
|--------------------------------------------------------------------------
*/

export const generateCandidateQr = asyncHandler(
  async (req: Request, res: Response) => {
    const qr = await qrService.generateCandidate(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Candidate QR generated successfully.",
      data: qr,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Paper QR
|--------------------------------------------------------------------------
*/

export const generatePaperQr = asyncHandler(
  async (req: Request, res: Response) => {
    const qr = await qrService.generatePaper(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Paper QR generated successfully.",
      data: qr,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Exam QR
|--------------------------------------------------------------------------
*/

export const generateExamQr = asyncHandler(
  async (req: Request, res: Response) => {
    const qr = await qrService.generateExam(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Exam QR generated successfully.",
      data: qr,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Custom QR
|--------------------------------------------------------------------------
*/

export const generateCustomQr = asyncHandler(
  async (req: Request, res: Response) => {
    const qr = await qrService.generateCustom(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Custom QR generated successfully.",
      data: qr,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Verify QR
|--------------------------------------------------------------------------
*/

export const verifyQr = asyncHandler(async (req: Request, res: Response) => {
  const result = await qrService.verify(req.body.text as string);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "QR verified successfully.",
    data: result,
  });
});
