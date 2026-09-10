import mongoose, { ClientSession } from "mongoose";

import biometricVerificationRepository from "./biometricVerification.repository";
import attendanceRepository from "../attendance/attendance.repository";
import admitCardRepository from "../admit-card/admitCard.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import {
  IBiometricVerification,
  BiometricVerificationStatus,
  BiometricType,
  LivenessStatus,
} from "./biometricVerification.types";

import { VerificationStatus } from "../attendance/attendance.types";

class BiometricVerificationService {
  /*
  |--------------------------------------------------------------------------
  | Validate Attendance
  |--------------------------------------------------------------------------
  */

  private async validateAttendance(attendanceId: string) {
    const attendance = await attendanceRepository.findById(attendanceId);

    if (!attendance) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Attendance record not found.");
    }

    return attendance;
  }

  /*
  |--------------------------------------------------------------------------
  | Duplicate Verification Check
  |--------------------------------------------------------------------------
  */

  private async checkDuplicateVerification(attendanceId: string) {
    const verification =
      await biometricVerificationRepository.findByAttendance(attendanceId);

    if (verification) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        "Biometric verification already exists.",
      );
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Device
  |--------------------------------------------------------------------------
  */

  private validateDevice(deviceId: string, scannerId: string) {
    if (!deviceId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Device ID is required.");
    }

    if (!scannerId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Scanner ID is required.");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Geo Location
  |--------------------------------------------------------------------------
  */

  private validateGeoLocation(latitude: number, longitude: number) {
    if (latitude < -90 || latitude > 90) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid latitude.");
    }

    if (longitude < -180 || longitude > 180) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid longitude.");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Create Verification
  |--------------------------------------------------------------------------
  */

  async create(payload: Partial<IBiometricVerification>) {
    const attendance = await this.validateAttendance(
      payload.attendanceId!.toString(),
    );

    await this.checkDuplicateVerification(payload.attendanceId!.toString());

    this.validateDevice(payload.deviceId!, payload.scannerId!);

    this.validateGeoLocation(payload.latitude!, payload.longitude!);

    const session: ClientSession = await mongoose.startSession();

    session.startTransaction();

    try {
      const verification = await biometricVerificationRepository.create(
        {
          ...payload,

          verificationStatus: BiometricVerificationStatus.PENDING,

          livenessStatus: LivenessStatus.PENDING,

          retryCount: 0,

          maxRetryLimit: 3,
        },
        session,
      );

      await attendanceRepository.updateVerification(
        attendance._id.toString(),
        {
          biometricVerification: VerificationStatus.PENDING,
        },
        session,
      );

      await session.commitTransaction();

      session.endSession();

      return verification;
    } catch (error) {
      await session.abortTransaction();

      session.endSession();

      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Fingerprint Verification
  |--------------------------------------------------------------------------
  */

  async verifyFingerprint(verificationId: string, score: number) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification record not found.",
      );
    }

    const passed = score >= 80;

    return biometricVerificationRepository.updateScores(verificationId, {
      fingerprintScore: score,

      overallScore: score,

      verificationStatus: passed
        ? BiometricVerificationStatus.VERIFIED
        : BiometricVerificationStatus.FAILED,

      verifiedAt: new Date(),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Iris Verification
  |--------------------------------------------------------------------------
  */

  async verifyIris(verificationId: string, score: number) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification record not found.",
      );
    }

    const passed = score >= 80;

    return biometricVerificationRepository.updateScores(verificationId, {
      irisScore: score,

      verificationStatus: passed
        ? BiometricVerificationStatus.VERIFIED
        : BiometricVerificationStatus.FAILED,

      verifiedAt: new Date(),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Face Verification
  |--------------------------------------------------------------------------
  */

  async verifyFace(verificationId: string, score: number) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification record not found.",
      );
    }

    const passed = score >= 80;

    return biometricVerificationRepository.updateScores(verificationId, {
      faceScore: score,

      verificationStatus: passed
        ? BiometricVerificationStatus.VERIFIED
        : BiometricVerificationStatus.FAILED,

      verifiedAt: new Date(),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Liveness Detection
  |--------------------------------------------------------------------------
  */

  async verifyLiveness(verificationId: string, passed: boolean) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification record not found.",
      );
    }

    return biometricVerificationRepository.update(verificationId, {
      livenessStatus: passed ? LivenessStatus.PASSED : LivenessStatus.FAILED,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Multi Factor Verification
  |--------------------------------------------------------------------------
  */

  async multiFactorVerification(verificationId: string) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification record not found.",
      );
    }

    const fingerprintPassed = (verification.fingerprintScore ?? 0) >= 80;

    const irisPassed = (verification.irisScore ?? 0) >= 80;

    const facePassed = (verification.faceScore ?? 0) >= 80;

    const livePassed = verification.livenessStatus === LivenessStatus.PASSED;

    if (fingerprintPassed && irisPassed && facePassed && livePassed) {
      return biometricVerificationRepository.update(verificationId, {
        biometricType: BiometricType.MULTI_FACTOR,

        verificationStatus: BiometricVerificationStatus.VERIFIED,

        overallScore:
          ((verification.fingerprintScore ?? 0) +
            (verification.irisScore ?? 0) +
            (verification.faceScore ?? 0)) /
          3,

        verifiedAt: new Date(),
      });
    }

    return biometricVerificationRepository.updateStatus(
      verificationId,

      BiometricVerificationStatus.FAILED,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Retry Verification
  |--------------------------------------------------------------------------
  */

  async retryVerification(verificationId: string) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,

        "Verification record not found.",
      );
    }

    if (verification.retryCount >= verification.maxRetryLimit) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,

        "Maximum retry limit exceeded.",
      );
    }

    return biometricVerificationRepository.increaseRetry(verificationId);
  }

  /*
  |--------------------------------------------------------------------------
  | Fraud Detection
  |--------------------------------------------------------------------------
  */

  async fraudDetection(verificationId: string) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification record not found.",
      );
    }

    const suspicious =
      verification.retryCount >= 3 ||
      verification.livenessStatus === LivenessStatus.FAILED ||
      (verification.overallScore ?? 0) < 50;

    return {
      suspicious,

      retryCount: verification.retryCount,

      liveness: verification.livenessStatus,

      score: verification.overallScore ?? 0,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Attendance Verification
  |--------------------------------------------------------------------------
  */

  async completeVerification(verificationId: string) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification record not found.",
      );
    }

    if (verification.verificationStatus !== BiometricVerificationStatus.VERIFIED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Verification not completed.");
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      await attendanceRepository.updateVerification(
        verification.attendanceId.toString(),

        {
          biometricVerification: VerificationStatus.SUCCESS,
        },

        session,
      );

      await session.commitTransaction();

      session.endSession();

      return {
        success: true,

        message: "Attendance updated successfully.",
      };
    } catch (error) {
      await session.abortTransaction();

      session.endSession();

      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Bulk Verification
  |--------------------------------------------------------------------------
  */

  async bulkCreate(payload: Partial<IBiometricVerification>[]) {
    const session = await mongoose.startSession();

    session.startTransaction();

    const successful: any[] = [];

    const failed: any[] = [];

    try {
      for (const item of payload) {
        try {
          await this.validateAttendance(item.attendanceId!.toString());

          await this.checkDuplicateVerification(item.attendanceId!.toString());

          this.validateDevice(item.deviceId!, item.scannerId!);

          this.validateGeoLocation(item.latitude!, item.longitude!);

          const verification = await biometricVerificationRepository.create(
            {
              ...item,

              verificationStatus: BiometricVerificationStatus.PENDING,

              livenessStatus: LivenessStatus.PENDING,

              retryCount: 0,

              maxRetryLimit: 3,
            },
            session,
          );

          successful.push(verification);
        } catch (error: any) {
          failed.push({
            attendanceId: item.attendanceId,

            message: error.message,
          });
        }
      }

      await session.commitTransaction();

      session.endSession();

      return {
        total: payload.length,

        successful: successful.length,

        failed: failed.length,

        successfulRecords: successful,

        failedRecords: failed,
      };
    } catch (error) {
      await session.abortTransaction();

      session.endSession();

      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Get All
  |--------------------------------------------------------------------------
  */

  async getAll(query: {
    page?: number;

    limit?: number;

    search?: string;

    examId?: string;

    candidateId?: string;

    examCenterId?: string;

    biometricType?: BiometricType;

    verificationStatus?: BiometricVerificationStatus;
  }) {
    return biometricVerificationRepository.findAll(query);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Id
  |--------------------------------------------------------------------------
  */

  async getById(id: string) {
    const verification = await biometricVerificationRepository.findById(id);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Verification record not found.",
      );
    }

    return verification;
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Candidate
  |--------------------------------------------------------------------------
  */

  async getByCandidate(candidateId: string) {
    return biometricVerificationRepository.findByCandidate(candidateId);
  }

  /*
  |--------------------------------------------------------------------------
  | Get By Exam
  |--------------------------------------------------------------------------
  */

  async getByExam(examId: string) {
    return biometricVerificationRepository.findByExam(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

  async dashboard(examId: string) {
    const [total, verified, failed, pending, rejected] = await Promise.all([
      biometricVerificationRepository.count(examId),

      biometricVerificationRepository.countByStatus(
        BiometricVerificationStatus.VERIFIED,
        examId,
      ),

      biometricVerificationRepository.countByStatus(
        BiometricVerificationStatus.FAILED,
        examId,
      ),

      biometricVerificationRepository.countByStatus(
        BiometricVerificationStatus.PENDING,
        examId,
      ),

      biometricVerificationRepository.countByStatus(
        BiometricVerificationStatus.REJECTED,
        examId,
      ),
    ]);

    return {
      total,

      verified,

      failed,

      pending,

      rejected,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Verification Timeline
  |--------------------------------------------------------------------------
  */

  async timeline(examId: string) {
    return biometricVerificationRepository.findAll({
      examId,

      page: 1,

      limit: 500,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Verification Statistics
  |--------------------------------------------------------------------------
  */

  async statistics(examId?: string) {
    const total = await biometricVerificationRepository.count(examId);

    const verified = await biometricVerificationRepository.countByStatus(
      BiometricVerificationStatus.VERIFIED,
      examId,
    );

    const failed = await biometricVerificationRepository.countByStatus(
      BiometricVerificationStatus.FAILED,
      examId,
    );

    const pending = await biometricVerificationRepository.countByStatus(
      BiometricVerificationStatus.PENDING,
      examId,
    );

    const rejected = await biometricVerificationRepository.countByStatus(
      BiometricVerificationStatus.REJECTED,
      examId,
    );

    const bypassed = await biometricVerificationRepository.countByStatus(
      BiometricVerificationStatus.BYPASSED,
      examId,
    );

    return {
      total,

      verified,

      failed,

      pending,

      rejected,

      bypassed,

      verificationRate:
        total === 0 ? 0 : Number(((verified / total) * 100).toFixed(2)),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Center Analytics
  |--------------------------------------------------------------------------
  */

  async centerAnalytics(examCenterId: string) {
    return (biometricVerificationRepository as any).aggregateByCenter(examCenterId);
  }

  /*
  |--------------------------------------------------------------------------
  | Device Analytics
  |--------------------------------------------------------------------------
  */

  async deviceAnalytics(examId: string) {
    return (biometricVerificationRepository as any).deviceAnalytics(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Scanner Analytics
  |--------------------------------------------------------------------------
  */

  async scannerAnalytics(examId: string) {
    return (biometricVerificationRepository as any).scannerAnalytics(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Geo Analytics
  |--------------------------------------------------------------------------
  */

  async geoAnalytics(examId: string) {
    return (biometricVerificationRepository as any).geoAnalytics(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Retry Analytics
  |--------------------------------------------------------------------------
  */

  async retryAnalytics(examId: string) {
    return (biometricVerificationRepository as any).retryAnalytics(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Liveness Analytics
  |--------------------------------------------------------------------------
  */

  async livenessAnalytics(examId: string) {
    return (biometricVerificationRepository as any).livenessAnalytics(examId);
  }

  /*
  |--------------------------------------------------------------------------
  | Fraud Analytics
  |--------------------------------------------------------------------------
  */

  async fraudAnalytics(examId: string) {
    const retries = await this.retryAnalytics(examId);

    const liveness = await this.livenessAnalytics(examId);

    const suspicious = retries.filter((item: any) => item.retryCount >= 3);

    return {
      suspiciousCandidates: suspicious.length,

      retryAnalysis: retries,

      livenessAnalysis: liveness,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Verification Report
  |--------------------------------------------------------------------------
  */

  async verificationReport(examId: string) {
    const [statistics, devices, scanners, geo, retries, liveness] =
      await Promise.all([
        this.statistics(examId),

        this.deviceAnalytics(examId),

        this.scannerAnalytics(examId),

        this.geoAnalytics(examId),

        this.retryAnalytics(examId),

        this.livenessAnalytics(examId),
      ]);

    return {
      statistics,

      devices,

      scanners,

      geo,

      retries,

      liveness,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Update Verification
  |--------------------------------------------------------------------------
  */

  async update(id: string, payload: Partial<IBiometricVerification>) {
    const verification = await biometricVerificationRepository.findById(id);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Biometric verification not found.",
      );
    }

    return biometricVerificationRepository.update(id, payload);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Verification Status
  |--------------------------------------------------------------------------
  */

  async updateStatus(id: string, status: BiometricVerificationStatus) {
    const verification = await biometricVerificationRepository.findById(id);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Biometric verification not found.",
      );
    }

    return biometricVerificationRepository.updateStatus(id, status);
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Verification
  |--------------------------------------------------------------------------
  */

  async delete(id: string) {
    const verification = await biometricVerificationRepository.findById(id);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Biometric verification not found.",
      );
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      await attendanceRepository.updateVerification(
        verification.attendanceId.toString(),

        {
          biometricVerification: VerificationStatus.PENDING,
        },

        session,
      );

      const deleted = await biometricVerificationRepository.softDelete(
        id,
        session,
      );

      await session.commitTransaction();

      session.endSession();

      return deleted;
    } catch (error) {
      await session.abortTransaction();

      session.endSession();

      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Restore Verification
  |--------------------------------------------------------------------------
  */

  async restore(id: string) {
    const verification =
      await biometricVerificationRepository.findDeletedById(id);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Biometric verification not found.",
      );
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const restored = await biometricVerificationRepository.restore(
        id,
        session,
      );

      await attendanceRepository.updateVerification(
        verification.attendanceId.toString(),

        {
          biometricVerification: VerificationStatus.SUCCESS,
        },

        session,
      );

      await session.commitTransaction();

      session.endSession();

      return restored;
    } catch (error) {
      await session.abortTransaction();

      session.endSession();

      throw error;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Enterprise Helper Methods
  |--------------------------------------------------------------------------
  */

  async exists(attendanceId: string) {
    return biometricVerificationRepository.findByAttendance(attendanceId);
  }

  async getByAttendance(attendanceId: string) {
    return biometricVerificationRepository.findByAttendance(attendanceId);
  }

  async isVerified(attendanceId: string) {
    const verification =
      await biometricVerificationRepository.findByAttendance(attendanceId);

    if (!verification) {
      return false;
    }

    return (
      verification.verificationStatus === BiometricVerificationStatus.VERIFIED
    );
  }

  async remainingRetries(verificationId: string) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Biometric verification not found.",
      );
    }

    return {
      retryCount: verification.retryCount,

      remaining: verification.maxRetryLimit - verification.retryCount,
    };
  }

  async resetVerification(verificationId: string) {
    const verification =
      await biometricVerificationRepository.findById(verificationId);

    if (!verification) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        "Biometric verification not found.",
      );
    }

    return biometricVerificationRepository.update(verificationId, {
      verificationStatus: BiometricVerificationStatus.PENDING,

      livenessStatus: LivenessStatus.PENDING,

      fingerprintScore: 0,

      irisScore: 0,

      faceScore: 0,

      overallScore: 0,

      retryCount: 0,

      verifiedAt: null,
    });
  }
}

export default new BiometricVerificationService();
