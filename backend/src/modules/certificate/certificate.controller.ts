import { Request, Response } from "express";
import httpStatus from "http-status";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import certificateService from "./certificate.service";

/*
|--------------------------------------------------------------------------
| Create Certificate
|--------------------------------------------------------------------------
*/

export const createCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.create(req.body);

    sendResponse(res, httpStatus.CREATED, {
      success: true,

      message: "Certificate created successfully.",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Generate Certificate
|--------------------------------------------------------------------------
*/

export const generateCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.generate(
      req.params.id as string,

      req.user!.userId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificate generated successfully.",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Issue Certificate
|--------------------------------------------------------------------------
*/

export const issueCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.issue(req.params.id as string);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificate issued successfully.",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Verify Certificate
|--------------------------------------------------------------------------
*/

export const verifyCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.verify(
      req.params.verificationCode as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificate verified successfully",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Download Certificate
|--------------------------------------------------------------------------
*/

export const downloadCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.download(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificate downloaded successfully",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Revoke Certificate
|--------------------------------------------------------------------------
*/

export const revokeCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const { certificateId, reason, remarks } = req.body;
    const finalRemarks = reason || remarks || "Revoked";
    
    const certificate = await certificateService.revoke(
      certificateId,
      req.user!.userId as string,
      finalRemarks
    );

    sendResponse(res, httpStatus.OK, {
      success: true,
      message: "Certificate revoked successfully",
      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Certificate By Id
|--------------------------------------------------------------------------
*/

export const getCertificateById = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.getById(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificate fetched successfully.",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Certificate By Result
|--------------------------------------------------------------------------
*/

export const getCertificateByResult = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.getByResult(
      req.params.resultId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificate fetched successfully.",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get Candidate Certificates
|--------------------------------------------------------------------------
*/

export const getCandidateCertificates = asyncHandler(
  async (req: Request, res: Response) => {
    const certificates = await certificateService.getByCandidate(
      req.params.candidateId as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Candidate certificates fetched successfully.",

      data: certificates,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All Certificates
|--------------------------------------------------------------------------
*/

export const getCertificates = asyncHandler(
  async (req: Request, res: Response) => {
    const certificates = await certificateService.getAll(req.query);

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificates fetched successfully.",

      data: certificates,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const dashboard = asyncHandler(async (req: Request, res: Response) => {
  const dash = await certificateService.dashboard(
    req.query.examId as string,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,
    message: "Certificate dashboard fetched successfully.",
    data: dash,
  });
});

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const statistics = asyncHandler(async (req: Request, res: Response) => {
  const statistics = await certificateService.statistics(
    req.query.examId as string,
  );

  sendResponse(res, httpStatus.OK, {
    success: true,

    message: "Certificate statistics fetched successfully.",

    data: statistics,
  });
});

/*
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const softDeleteCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.delete(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificate deleted successfully.",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreCertificate = asyncHandler(
  async (req: Request, res: Response) => {
    const certificate = await certificateService.restore(
      req.params.id as string,
    );

    sendResponse(res, httpStatus.OK, {
      success: true,

      message: "Certificate restored successfully.",

      data: certificate,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Bulk Generate Certificates
|--------------------------------------------------------------------------
*/

export const bulkGenerateCertificates = asyncHandler(
    async (req: Request, res: Response) => {
        const { examId } = req.body;
        const generatedBy = req.user!.userId as string;

        const result = await certificateService.bulkGenerate(examId, generatedBy);

        return res.status(httpStatus.OK).json({
            success: true,
            message: "Certificates generated successfully.",
            data: result,
        });
    }
);
