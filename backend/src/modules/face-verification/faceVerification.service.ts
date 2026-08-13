import mongoose, { ClientSession } from "mongoose";

import faceVerificationRepository from "./faceVerification.repository";
import attendanceRepository from "../attendance/attendance.repository";
import biometricVerificationRepository from "../biometric-verification/biometricVerification.repository";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import {
    IFaceVerification,
    FaceVerificationStatus,
    FaceLivenessStatus,
    SpoofDetectionStatus,
} from "./faceVerification.types";

import {
    VerificationStatus,
} from "../attendance/attendance.types";

class FaceVerificationService {

    /*
    |--------------------------------------------------------------------------
    | Validate Attendance
    |--------------------------------------------------------------------------
    */
    private async validateAttendance(attendanceId: string) {
        const attendance = await attendanceRepository.findById(attendanceId);
        if (!attendance) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Attendance not found.");
        }
        return attendance;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Biometric Verification
    |--------------------------------------------------------------------------
    */
    private async validateBiometric(biometricVerificationId: string) {
        const biometric = await biometricVerificationRepository.findById(biometricVerificationId);
        if (!biometric) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Biometric verification not found.");
        }
        return biometric;
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Verification Check
    |--------------------------------------------------------------------------
    */
    private async checkDuplicate(attendanceId: string) {
        const verification = await faceVerificationRepository.findByAttendance(attendanceId);
        if (verification) {
            throw new ApiError(HTTP_STATUS.CONFLICT, "Face verification already exists.");
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Device
    |--------------------------------------------------------------------------
    */
    private validateDevice(deviceId: string, cameraId: string) {
        if (!deviceId) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Device ID is required.");
        }
        if (!cameraId) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Camera ID is required.");
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Geo
    |--------------------------------------------------------------------------
    */
    private validateGeo(latitude: number, longitude: number) {
        if (latitude < -90 || latitude > 90) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid latitude.");
        }
        if (longitude < -180 || longitude > 180) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Invalid longitude.");
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Create Face Verification
    |--------------------------------------------------------------------------
    */
    async create(payload: Partial<IFaceVerification>) {
        await this.validateAttendance(payload.attendanceId!.toString());
        await this.validateBiometric(payload.biometricVerificationId!.toString());
        await this.checkDuplicate(payload.attendanceId!.toString());
        this.validateDevice(payload.deviceId!, payload.cameraId!);
        this.validateGeo(payload.latitude!, payload.longitude!);

        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            const verification = await faceVerificationRepository.create(
                {
                    ...payload,
                    verificationStatus: FaceVerificationStatus.PENDING,
                    livenessStatus: FaceLivenessStatus.PENDING,
                    spoofDetection: SpoofDetectionStatus.UNKNOWN,
                    retryCount: 0,
                    maxRetryLimit: 3,
                    confidenceScore: 0,
                    faceDistance: 1,
                },
                session
            );

            await attendanceRepository.updateVerification(
                payload.attendanceId!.toString(),
                {
                    faceVerification: VerificationStatus.PENDING,
                },
                session
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
    | Calculate Euclidean Distance
    |--------------------------------------------------------------------------
    */
    private calculateDistance(registered: number[], captured: number[]) {
        let sum = 0;
        for (let i = 0; i < registered.length; i++) {
            sum += Math.pow(registered[i] - captured[i], 2);
        }
        return Math.sqrt(sum);
    }

    /*
    |--------------------------------------------------------------------------
    | Calculate Confidence Score
    |--------------------------------------------------------------------------
    */
    private confidenceScore(distance: number) {
        const score = Math.max(0, (1 - distance) * 100);
        return Number(score.toFixed(2));
    }

    /*
    |--------------------------------------------------------------------------
    | AI Face Matching
    |--------------------------------------------------------------------------
    */
    async verifyFace(verificationId: string, embedding: number[]) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Verification not found.");
        }
        const distance = this.calculateDistance(verification.registeredEmbedding, embedding);
        const confidence = this.confidenceScore(distance);
        const verified = confidence >= 85;

        return faceVerificationRepository.update(
            verificationId,
            {
                capturedEmbedding: embedding,
                faceDistance: distance,
                confidenceScore: confidence,
                verificationStatus: verified ? FaceVerificationStatus.VERIFIED : FaceVerificationStatus.FAILED,
                verifiedAt: new Date(),
            }
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Liveness Detection
    |--------------------------------------------------------------------------
    */
    async verifyLiveness(verificationId: string, passed: boolean) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        return faceVerificationRepository.updateLiveness(
            verificationId,
            passed ? FaceLivenessStatus.PASSED : FaceLivenessStatus.FAILED
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Spoof Detection
    |--------------------------------------------------------------------------
    */
    async verifySpoof(verificationId: string, spoofDetected: boolean) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        return faceVerificationRepository.updateSpoofDetection(
            verificationId,
            spoofDetected ? SpoofDetectionStatus.SPOOF : SpoofDetectionStatus.CLEAN
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Retry Verification
    |--------------------------------------------------------------------------
    */
    async retryVerification(verificationId: string) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        if (verification.retryCount >= verification.maxRetryLimit) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Maximum retry limit exceeded.");
        }
        return faceVerificationRepository.increaseRetry(verificationId);
    }

    /*
    |--------------------------------------------------------------------------
    | Fraud Detection
    |--------------------------------------------------------------------------
    */
    async fraudDetection(verificationId: string) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        const suspicious =
            verification.retryCount >= 3 ||
            verification.confidenceScore < 60 ||
            verification.livenessStatus === FaceLivenessStatus.FAILED ||
            verification.spoofDetection === SpoofDetectionStatus.SPOOF;

        return {
            suspicious,
            retryCount: verification.retryCount,
            confidenceScore: verification.confidenceScore,
            liveness: verification.livenessStatus,
            spoof: verification.spoofDetection,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Complete Verification
    |--------------------------------------------------------------------------
    */
    async completeVerification(verificationId: string) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        const verified =
            verification.verificationStatus === FaceVerificationStatus.VERIFIED &&
            verification.livenessStatus === FaceLivenessStatus.PASSED &&
            verification.spoofDetection === SpoofDetectionStatus.CLEAN;

        if (!verified) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Face verification is incomplete.");
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await attendanceRepository.updateVerification(
                verification.attendanceId.toString(),
                {
                    faceVerification: VerificationStatus.SUCCESS,
                },
                session
            );
            await session.commitTransaction();
            session.endSession();
            return {
                success: true,
                message: "Face verification completed successfully.",
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Face Verification Summary
    |--------------------------------------------------------------------------
    */
    async verificationSummary(verificationId: string) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        return {
            verificationStatus: verification.verificationStatus,
            confidenceScore: verification.confidenceScore,
            faceDistance: verification.faceDistance,
            livenessStatus: verification.livenessStatus,
            spoofDetection: verification.spoofDetection,
            retryCount: verification.retryCount,
            verifiedAt: verification.verifiedAt,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Create Face Verification
    |--------------------------------------------------------------------------
    */
    async bulkCreate(payload: Partial<IFaceVerification>[]) {
        const session = await mongoose.startSession();
        session.startTransaction();

        const successful: IFaceVerification[] = [];
        const failed: any[] = [];

        try {
            for (const item of payload) {
                try {
                    await this.validateAttendance(item.attendanceId!.toString());
                    await this.validateBiometric(item.biometricVerificationId!.toString());
                    await this.checkDuplicate(item.attendanceId!.toString());
                    this.validateDevice(item.deviceId!, item.cameraId!);
                    this.validateGeo(item.latitude!, item.longitude!);

                    const verification = await faceVerificationRepository.create(
                        {
                            ...item,
                            verificationStatus: FaceVerificationStatus.PENDING,
                            livenessStatus: FaceLivenessStatus.PENDING,
                            spoofDetection: SpoofDetectionStatus.UNKNOWN,
                            retryCount: 0,
                            maxRetryLimit: 3,
                            confidenceScore: 0,
                            faceDistance: 1,
                        },
                        session
                    );
                    successful.push(verification as any);
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
    async getAll(query: any) {
        return faceVerificationRepository.findAll(query);
    }

    /*
    |--------------------------------------------------------------------------
    | Get By Id
    |--------------------------------------------------------------------------
    */
    async getById(id: string) {
        const verification = await faceVerificationRepository.findById(id);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        return verification;
    }

    /*
    |--------------------------------------------------------------------------
    | Get By Candidate
    |--------------------------------------------------------------------------
    */
    async getByCandidate(candidateId: string) {
        return faceVerificationRepository.findByCandidate(candidateId);
    }

    /*
    |--------------------------------------------------------------------------
    | Get By Exam
    |--------------------------------------------------------------------------
    */
    async getByExam(examId: string) {
        return faceVerificationRepository.findByExam(examId);
    }

    /*
    |--------------------------------------------------------------------------
    | Live Dashboard
    |--------------------------------------------------------------------------
    */
    async dashboard(examId: string) {
        const [total, verified, failed, pending, rejected] = await Promise.all([
            faceVerificationRepository.count(examId),
            faceVerificationRepository.countByStatus(FaceVerificationStatus.VERIFIED, examId),
            faceVerificationRepository.countByStatus(FaceVerificationStatus.FAILED, examId),
            faceVerificationRepository.countByStatus(FaceVerificationStatus.PENDING, examId),
            faceVerificationRepository.countByStatus(FaceVerificationStatus.REJECTED, examId),
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
    | Live Monitoring Feed
    |--------------------------------------------------------------------------
    */
    async liveFeed(examId: string) {
        return faceVerificationRepository.findAll({
            examId,
            page: 1,
            limit: 500,
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Candidate Verification History
    |--------------------------------------------------------------------------
    */
    async candidateHistory(candidateId: string) {
        return faceVerificationRepository.findByCandidate(candidateId);
    }

    /*
    |--------------------------------------------------------------------------
    | Face Verification Statistics
    |--------------------------------------------------------------------------
    */
    async statistics(examId?: string) {
        const total = await faceVerificationRepository.count(examId);
        const verified = await faceVerificationRepository.countByStatus(FaceVerificationStatus.VERIFIED, examId);
        const failed = await faceVerificationRepository.countByStatus(FaceVerificationStatus.FAILED, examId);
        const pending = await faceVerificationRepository.countByStatus(FaceVerificationStatus.PENDING, examId);
        const rejected = await faceVerificationRepository.countByStatus(FaceVerificationStatus.REJECTED, examId);
        const bypassed = await faceVerificationRepository.countByStatus(FaceVerificationStatus.BYPASSED, examId);
        return {
            total,
            verified,
            failed,
            pending,
            rejected,
            bypassed,
            verificationRate: total === 0 ? 0 : Number(((verified / total) * 100).toFixed(2)),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Center Analytics
    |--------------------------------------------------------------------------
    */
    async centerAnalytics(examCenterId: string) {
        return (faceVerificationRepository as any).aggregateByCenter?.(examCenterId);
    }

    /*
    |--------------------------------------------------------------------------
    | Confidence Analytics
    |--------------------------------------------------------------------------
    */
    async confidenceAnalytics(examId: string) {
        return (faceVerificationRepository as any).confidenceAnalytics?.(examId);
    }

    /*
    |--------------------------------------------------------------------------
    | Device Analytics
    |--------------------------------------------------------------------------
    */
    async deviceAnalytics(examId: string) {
        return (faceVerificationRepository as any).deviceAnalytics?.(examId);
    }

    /*
    |--------------------------------------------------------------------------
    | Camera Analytics
    |--------------------------------------------------------------------------
    */
    async cameraAnalytics(examId: string) {
        return (faceVerificationRepository as any).cameraAnalytics?.(examId);
    }

    /*
    |--------------------------------------------------------------------------
    | Geo Analytics
    |--------------------------------------------------------------------------
    */
    async geoAnalytics(examId: string) {
        return (faceVerificationRepository as any).geoAnalytics?.(examId);
    }

    /*
    |--------------------------------------------------------------------------
    | Liveness Analytics
    |--------------------------------------------------------------------------
    */
    async livenessAnalytics(examId: string) {
        return (faceVerificationRepository as any).livenessAnalytics?.(examId);
    }

    /*
    |--------------------------------------------------------------------------
    | Spoof Analytics
    |--------------------------------------------------------------------------
    */
    async spoofAnalytics(examId: string) {
        return (faceVerificationRepository as any).spoofAnalytics?.(examId);
    }

    /*
    |--------------------------------------------------------------------------
    | Fraud Analytics
    |--------------------------------------------------------------------------
    */
    async fraudAnalytics(examId: string) {
        const [spoof, liveness, confidence] = await Promise.all([
            this.spoofAnalytics(examId),
            this.livenessAnalytics(examId),
            this.confidenceAnalytics(examId),
        ]);
        return {
            spoof,
            liveness,
            confidence,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Face Verification Report
    |--------------------------------------------------------------------------
    */
    async verificationReport(examId: string) {
        const [statistics, confidence, devices, cameras, geo, spoof, liveness] = await Promise.all([
            this.statistics(examId),
            this.confidenceAnalytics(examId),
            this.deviceAnalytics(examId),
            this.cameraAnalytics(examId),
            this.geoAnalytics(examId),
            this.spoofAnalytics(examId),
            this.livenessAnalytics(examId),
        ]);
        return {
            statistics,
            confidence,
            devices,
            cameras,
            geo,
            spoof,
            liveness,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Update Face Verification
    |--------------------------------------------------------------------------
    */
    async update(id: string, payload: Partial<IFaceVerification>) {
        const verification = await faceVerificationRepository.findById(id);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        return faceVerificationRepository.update(id, payload);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Verification Status
    |--------------------------------------------------------------------------
    */
    async updateStatus(id: string, status: FaceVerificationStatus) {
        const verification = await faceVerificationRepository.findById(id);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        return faceVerificationRepository.updateStatus(id, status);
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Face Verification
    |--------------------------------------------------------------------------
    */
    async delete(id: string) {
        const verification = await faceVerificationRepository.findById(id);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await attendanceRepository.updateVerification(
                verification.attendanceId.toString(),
                {
                    faceVerification: VerificationStatus.PENDING,
                },
                session
            );
            const deleted = await faceVerificationRepository.softDelete(id, session);
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
    | Restore Face Verification
    |--------------------------------------------------------------------------
    */
    async restore(id: string) {
        const verification = await faceVerificationRepository.findDeletedById(id);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const restored = await faceVerificationRepository.restore(id, session);
            await attendanceRepository.updateVerification(
                verification.attendanceId.toString(),
                {
                    faceVerification: VerificationStatus.SUCCESS,
                },
                session
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
        return faceVerificationRepository.findByAttendance(attendanceId);
    }

    async getByAttendance(attendanceId: string) {
        return faceVerificationRepository.findByAttendance(attendanceId);
    }

    async isVerified(attendanceId: string) {
        const verification = await faceVerificationRepository.findByAttendance(attendanceId);
        if (!verification) {
            return false;
        }
        return (
            verification.verificationStatus === FaceVerificationStatus.VERIFIED &&
            verification.livenessStatus === FaceLivenessStatus.PASSED &&
            verification.spoofDetection === SpoofDetectionStatus.CLEAN
        );
    }

    async remainingRetries(verificationId: string) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        return {
            retryCount: verification.retryCount,
            remaining: verification.maxRetryLimit - verification.retryCount,
        };
    }

    async resetVerification(verificationId: string) {
        const verification = await faceVerificationRepository.findById(verificationId);
        if (!verification) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Face verification not found.");
        }
        return faceVerificationRepository.update(
            verificationId,
            {
                verificationStatus: FaceVerificationStatus.PENDING,
                livenessStatus: FaceLivenessStatus.PENDING,
                spoofDetection: SpoofDetectionStatus.UNKNOWN,
                confidenceScore: 0,
                faceDistance: 1,
                capturedEmbedding: [],
                retryCount: 0,
                verifiedAt: null,
            } as Partial<IFaceVerification>
        );
    }
}

export default new FaceVerificationService();
