import { Request, Response } from "express";

import biometricVerificationService from "./biometricVerification.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";
import { BiometricType, BiometricVerificationStatus, LivenessStatus } from "./biometricVerification.types";

/*
|--------------------------------------------------------------------------
| Create Verification
|--------------------------------------------------------------------------
*/

export const createBiometricVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Biometric verification created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Fingerprint Verification
|--------------------------------------------------------------------------
*/

export const verifyFingerprint = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.verifyFingerprint(
      req.params.id as string,
      req.body.score,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Fingerprint verified successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Iris Verification
|--------------------------------------------------------------------------
*/

export const verifyIris = asyncHandler(async (req: Request, res: Response) => {
  const result = await biometricVerificationService.verifyIris(
    req.params.id as string,
    req.body.score,
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Iris verified successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Face Verification
|--------------------------------------------------------------------------
*/

export const verifyFace = asyncHandler(async (req: Request, res: Response) => {
  const result = await biometricVerificationService.verifyFace(
    req.params.id as string,
    req.body.score,
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Face verified successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Liveness Verification
|--------------------------------------------------------------------------
*/

export const verifyLiveness = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.verifyLiveness(
      req.params.id as string,
      req.body.passed,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Liveness verification completed.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Multi Factor Verification
|--------------------------------------------------------------------------
*/

export const verifyMultiFactor = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.multiFactorVerification(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Multi-factor verification completed.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Retry Verification
|--------------------------------------------------------------------------
*/

export const retryVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.retryVerification(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Retry initiated successfully.",
      data: result,
    });
  },
);

import { Types } from "mongoose";
import BiometricVerification from "./biometricVerification.model";

export const verifyBiometricMock = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      await BiometricVerification.findOneAndUpdate(
        {
          examId: req.body.examId ? new Types.ObjectId(req.body.examId) : new Types.ObjectId(),
          candidateId: req.body.candidateId ? new Types.ObjectId(req.body.candidateId) : new Types.ObjectId()
        },
        {
          $set: {
            attendanceId: new Types.ObjectId(),
            admitCardId: new Types.ObjectId(),
            candidateAssignmentId: new Types.ObjectId(),
            examCenterId: new Types.ObjectId(),
            biometricType: BiometricType.FINGERPRINT,
            verificationStatus: BiometricVerificationStatus.VERIFIED,
            livenessStatus: LivenessStatus.PASSED,
            fingerprintScore: 98.71,
            retryCount: 0,
            maxRetryLimit: 3,
            deviceId: req.body.deviceId || "BIO-DEVICE-001",
            scannerId: req.body.deviceSerialNumber || "MANTRA-MFS100",
            ipAddress: req.body.ipAddress || "103.45.112.100",
            latitude: req.body.latitude || 23.0225,
            longitude: req.body.longitude || 72.5714
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("CREATE ERROR in verifyBiometricMock:", err);
    }

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Biometric verification completed successfully",
      data: {
        verificationId: "68a070112233445566778899",
        verificationStatus: "VERIFIED",
        matchScore: 98.71,
        verificationMethod: req.body.verificationMethod || "FINGERPRINT"
      }
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export const getBiometricVerifications = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.getAll(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Biometric verifications fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get By Id
|--------------------------------------------------------------------------
*/

export const getBiometricVerificationById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.getById(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Biometric verification fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get By Candidate
|--------------------------------------------------------------------------
*/

export const getBiometricVerificationByCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.getByCandidate(
      req.params.candidateId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate biometric verification fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get By Exam
|--------------------------------------------------------------------------
*/

export const getBiometricVerificationByExam = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.getByExam(
      req.params.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam biometric verifications fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const biometricDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.dashboard(
      req.params.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Biometric dashboard loaded successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const biometricStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.statistics(
      req.query.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Statistics loaded successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Verification Report
|--------------------------------------------------------------------------
*/

export const biometricReport = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.verificationReport(
      req.params.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Verification report generated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const updateBiometricVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Biometric verification updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateBiometricVerificationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Verification status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteBiometricVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.delete(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Biometric verification deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreBiometricVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await biometricVerificationService.restore(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Biometric verification restored successfully.",
      data: result,
    });
  },
);
