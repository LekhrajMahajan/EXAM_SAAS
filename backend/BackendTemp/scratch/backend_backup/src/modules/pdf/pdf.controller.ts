import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import pdfService from "./pdf.service";

/*
|--------------------------------------------------------------------------
| Generate Certificate PDF
|--------------------------------------------------------------------------
*/

export const generateCertificatePdf = asyncHandler(
  async (req: Request, res: Response) => {
    const pdf = await pdfService.generateCertificate(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Certificate PDF generated successfully.",
      data: pdf,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Admit Card PDF
|--------------------------------------------------------------------------
*/

export const generateAdmitCardPdf = asyncHandler(
  async (req: Request, res: Response) => {
    const pdf = await pdfService.generateAdmitCard(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Admit card PDF generated successfully.",
      data: pdf,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Result PDF
|--------------------------------------------------------------------------
*/

export const generateResultPdf = asyncHandler(
  async (req: Request, res: Response) => {
    const pdf = await pdfService.generateResult(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Result PDF generated successfully.",
      data: pdf,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Merit List PDF
|--------------------------------------------------------------------------
*/

export const generateMeritListPdf = asyncHandler(
  async (req: Request, res: Response) => {
    const pdf = await pdfService.generateMeritList(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Merit list PDF generated successfully.",
      data: pdf,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Question Paper PDF
|--------------------------------------------------------------------------
*/

export const generateQuestionPaperPdf = asyncHandler(
  async (req: Request, res: Response) => {
    const pdf = await pdfService.generateQuestionPaper(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Question paper PDF generated successfully.",
      data: pdf,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Report PDF
|--------------------------------------------------------------------------
*/

export const generateReportPdf = asyncHandler(
  async (req: Request, res: Response) => {
    const pdf = await pdfService.generateReport(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Report PDF generated successfully.",
      data: pdf,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Custom PDF
|--------------------------------------------------------------------------
*/

export const generateCustomPdf = asyncHandler(
  async (req: Request, res: Response) => {
    const pdf = await pdfService.generateCustomPdf(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,
      message: "Custom PDF generated successfully.",
      data: pdf,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Download PDF
|--------------------------------------------------------------------------
*/

export const downloadPdf = asyncHandler(async (req: Request, res: Response) => {
  const pdf = await pdfService.download(req.body);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "PDF download information fetched successfully.",
    data: pdf,
  });
});

/*
|--------------------------------------------------------------------------
| Preview PDF
|--------------------------------------------------------------------------
*/

export const previewPdf = asyncHandler(async (req: Request, res: Response) => {
  const pdf = await pdfService.preview(req.body);

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "PDF preview generated successfully.",
    data: pdf,
  });
});
