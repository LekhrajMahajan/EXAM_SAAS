import { Request, Response } from "express";

import faceVerificationService from "./faceVerification.service";

import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";

import { HTTP_STATUS } from "../../constants/httpStatus";
import { FaceSource, FaceVerificationStatus, FaceLivenessStatus, SpoofDetectionStatus } from "./faceVerification.types";

/*
|--------------------------------------------------------------------------
| Create Face Verification
|--------------------------------------------------------------------------
*/

export const createFaceVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.create(req.body);

    return sendResponse(res, HTTP_STATUS.CREATED, {
      success: true,
      message: "Face verification created successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| AI Face Match
|--------------------------------------------------------------------------
*/

export const verifyFace = asyncHandler(async (req: Request, res: Response) => {
  const result = await faceVerificationService.verifyFace(
    req.params.id as string,
    req.body.embedding,
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Face matched successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Liveness Verification
|--------------------------------------------------------------------------
*/

import { Types } from "mongoose";
import FaceVerification from "./faceVerification.model";

export const verifyFaceMock = asyncHandler(
  async (req: Request, res: Response) => {
    // Force insert a mock document into the database so the frontend can see it
    try {
      await FaceVerification.findOneAndUpdate(
        {
          examId: req.body.examId ? new Types.ObjectId(req.body.examId) : new Types.ObjectId(),
          candidateId: req.body.candidateId ? new Types.ObjectId(req.body.candidateId) : new Types.ObjectId()
        },
        {
          $set: {
            attendanceId: new Types.ObjectId(),
            biometricVerificationId: new Types.ObjectId(),
            admitCardId: new Types.ObjectId(),
            candidateAssignmentId: new Types.ObjectId(),
            examCenterId: new Types.ObjectId(),
            faceSource: FaceSource.LIVE_CAMERA,
            verificationStatus: FaceVerificationStatus.VERIFIED,
            livenessStatus: FaceLivenessStatus.PASSED,
            spoofDetection: SpoofDetectionStatus.CLEAN,
            confidenceScore: 98.42,
            faceDistance: 0.5,
            registeredEmbedding: [],
            capturedEmbedding: [],
            faceImageUrl: req.body.capturedImageUrl || "/uploads/faces/candidate-face.jpg",
            deviceId: req.body.deviceId || "DEVICE-12345",
            cameraId: "CAMERA-123",
            ipAddress: req.body.ipAddress || "103.45.112.100",
            latitude: req.body.latitude || 23.0225,
            longitude: req.body.longitude || 72.5714,
            retryCount: 0,
            maxRetryLimit: 3
          }
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error("CREATE ERROR in verifyFaceMock:", err);
    }

    const result = {
      verificationId: "68a060112233445566778899",
      verificationStatus: "VERIFIED",
      matchScore: 98.42,
      livenessScore: 97.15,
      multipleFacesDetected: false,
    };

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification completed successfully",
      data: result,
    });
  },
);

export const verifyLiveness = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.verifyLiveness(
      req.params.id as string,
      req.body.passed,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Liveness verification completed successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Spoof Detection
|--------------------------------------------------------------------------
*/

export const verifySpoof = asyncHandler(async (req: Request, res: Response) => {
  const result = await faceVerificationService.verifySpoof(
    req.params.id as string,
    req.body.spoofDetected,
  );

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Spoof detection completed successfully.",
    data: result,
  });
});

/*
|--------------------------------------------------------------------------
| Retry Verification
|--------------------------------------------------------------------------
*/

export const retryVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.retryVerification(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Retry initiated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Complete Verification
|--------------------------------------------------------------------------
*/

export const completeVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.completeVerification(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification completed successfully.",
      data: result,
    });
  },
);



/*
|--------------------------------------------------------------------------
| Get All
|--------------------------------------------------------------------------
*/

export const getFaceVerifications = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.getAll(req.query);

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verifications fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get By ID
|--------------------------------------------------------------------------
*/

export const getFaceVerificationById = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.getById(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get By Candidate
|--------------------------------------------------------------------------
*/

export const getFaceVerificationByCandidate = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.getByCandidate(
      req.params.candidateId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Candidate face verifications fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Get By Exam
|--------------------------------------------------------------------------
*/

export const getFaceVerificationByExam = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.getByExam(
      req.params.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Exam face verifications fetched successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

export const faceDashboard = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.dashboard(
      req.params.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification dashboard loaded successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Statistics
|--------------------------------------------------------------------------
*/

export const faceStatistics = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.statistics(
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

export const faceVerificationReport = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.verificationReport(
      req.params.examId as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification report generated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update
|--------------------------------------------------------------------------
*/

export const updateFaceVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.update(
      req.params.id as string,
      req.body,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Update Status
|--------------------------------------------------------------------------
*/

export const updateFaceVerificationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.updateStatus(
      req.params.id as string,
      req.body.status,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification status updated successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export const deleteFaceVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.delete(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification deleted successfully.",
      data: result,
    });
  },
);

/*
|--------------------------------------------------------------------------
| Restore
|--------------------------------------------------------------------------
*/

export const restoreFaceVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await faceVerificationService.restore(
      req.params.id as string,
    );

    return sendResponse(res, HTTP_STATUS.OK, {
      success: true,
      message: "Face verification restored successfully.",
      data: result,
    });
  },
);
