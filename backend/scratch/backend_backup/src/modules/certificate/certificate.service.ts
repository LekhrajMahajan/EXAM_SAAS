import mongoose, { ClientSession } from "mongoose";
import crypto from "crypto";

import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import resultService from "../result/result.service";
import { resultApprovalService } from "../approval";

import certificateRepository, {
    CertificateQuery,
} from "./certificate.repository";

import {
    ICertificate,
    CertificateStatus,
    CertificateType,
    VerificationStatus,
} from "./certificate.types";

import { BaseService } from "../../common/base.service";

class CertificateService extends BaseService<ICertificate> {
    constructor() {
        super(certificateRepository, "Certificate");
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Certificate
    |--------------------------------------------------------------------------
    */

    private async validateCertificate(
        certificateId: string
    ) {

        return super.getById(certificateId, [
            "candidateId",
            "resultId",
            "approvalId",
            "examId",
            "paperId",
            "subjectId"
        ]);

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Result
    |--------------------------------------------------------------------------
    */

    private async validateResult(
        resultId: string
    ) {

        return resultService.getById(resultId);

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Approval
    |--------------------------------------------------------------------------
    */

    private async validateApproval(
        approvalId: string
    ) {

        return resultApprovalService.getById(
            approvalId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Generate Certificate Number
    |--------------------------------------------------------------------------
    */

    private generateCertificateNumber(): string {

        const year =
            new Date().getFullYear();

        const random =
            crypto
                .randomBytes(4)
                .toString("hex")
                .toUpperCase();

        return `CERT-${year}-${random}`;

    }

    /*
    |--------------------------------------------------------------------------
    | Generate Verification Code
    |--------------------------------------------------------------------------
    */

    private generateVerificationCode(): string {

        return crypto
            .randomBytes(16)
            .toString("hex")
            .toUpperCase();

    }

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */

    async create(
        payload: Partial<ICertificate>
    ) {

        const result = await this.validateResult(
            payload.resultId!.toString()
        );

        const approvalId = payload.approvalId || payload.resultId;
        await this.validateApproval(
            approvalId!.toString()
        );

        const exists =
            await certificateRepository.findByResult(
                payload.resultId!.toString()
            );

        if (exists) {

            throw new ApiError(

                HTTP_STATUS.CONFLICT,

                "Certificate already exists."

            );

        }

        const certificateNumber =
            this.generateCertificateNumber();

        const verificationCode =
            this.generateVerificationCode();

        const verificationUrl =
            `${process.env.FRONTEND_URL}/certificate/verify/${verificationCode}`;

        const certificate = await super.create({
            ...payload,
            approvalId,
            candidateAssignmentId: payload.candidateAssignmentId || result.candidateAssignmentId,
            attendanceId: payload.attendanceId || result.attendanceId,
            submissionId: payload.submissionId || result.submissionId,
            paperId: payload.paperId || result.paperId,
            subjectId: payload.subjectId || result.subjectId,
            companyId: payload.companyId || result.companyId,
            examCenterId: payload.examCenterId || result.examCenterId,
            certificateNumber,
            verificationCode,
            verificationUrl,
            certificateStatus: CertificateStatus.PENDING,
            verificationStatus: VerificationStatus.VERIFIED,
        });

        return certificate;

    }

    /*
    |--------------------------------------------------------------------------
    | Get By Result
    |--------------------------------------------------------------------------
    */

    async getByResult(
        resultId: string
    ) {

        return certificateRepository.findByResult(
            resultId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Get By Candidate
    |--------------------------------------------------------------------------
    */

    async getByCandidate(
        candidateId: string
    ) {

        return certificateRepository.findByCandidate(
            candidateId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Get All
    |--------------------------------------------------------------------------
    */

    async getAll(
        query: CertificateQuery
    ) {

        const result = await super.getAll(
            query
        );
        return {
            certificates: result.data,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };

    }

    /*
    |--------------------------------------------------------------------------
    | Generate Certificate
    |--------------------------------------------------------------------------
    */

    async generate(

        certificateId: string,

        generatedBy: string

    ) {

        const certificate =
            await this.validateCertificate(
                certificateId
            );

        if (

            certificate.certificateStatus ===
            CertificateStatus.GENERATED

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Certificate already generated."

            );

        }

        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Generate PDF
        | Upload to Storage
        | Generate QR Code
        |
        */

        const certificateUrl =
            `/certificates/${certificate.certificateNumber}.pdf`;

        const qrCodeUrl =
            `/certificates/qr/${certificate.verificationCode}.png`;

        return certificateRepository.update(

            certificateId,

            {

                certificateUrl,

                qrCodeUrl,

                generatedAt:
                    new Date(),

                generatedBy:
                    new mongoose.Types.ObjectId(generatedBy),

                certificateStatus:
                    CertificateStatus.GENERATED,

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Issue Certificate
    |--------------------------------------------------------------------------
    */

    async issue(
        certificateId: string
    ) {

        const certificate =
            await this.validateCertificate(
                certificateId
            );

        if (

            certificate.certificateStatus !==
            CertificateStatus.GENERATED

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Generate certificate first."

            );

        }

        return certificateRepository.update(

            certificateId,

            {

                certificateStatus:
                    CertificateStatus.ISSUED,

                issuedAt:
                    new Date(),

            }

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Verify Certificate
    |--------------------------------------------------------------------------
    */

    async verify(
        verificationCode: string
    ) {

        const certificate =
            await certificateRepository.findByVerificationCode(
                verificationCode
            );

        if (!certificate) {

            throw new ApiError(

                HTTP_STATUS.NOT_FOUND,

                "Certificate not found."

            );

        }

        if (

            certificate.certificateStatus ===
            CertificateStatus.REVOKED

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Certificate has been revoked."

            );

        }

        if (

            certificate.expiryDate &&

            certificate.expiryDate < new Date()

        ) {

            return certificateRepository.update(

                certificate._id.toString(),

                {

                    certificateStatus:
                        CertificateStatus.EXPIRED,

                    verificationStatus:
                        VerificationStatus.EXPIRED,

                }

            );

        }

        const verifiedAt = new Date();

        await certificateRepository.update(
            certificate._id.toString(),
            {
                verifiedAt,
                verificationStatus: VerificationStatus.VERIFIED,
            }
        );

        const candidate = certificate.candidateId as any;
        const exam = certificate.examId as any;
        const result = certificate.resultId as any;

        const getGrade = (percentage: number) => {
            if (percentage >= 90) return "A+";
            if (percentage >= 80) return "A";
            if (percentage >= 70) return "B+";
            if (percentage >= 60) return "B";
            if (percentage >= 50) return "C";
            return "F";
        };

        return {
            certificateId: certificate._id,
            certificateNumber: certificate.certificateNumber,
            verificationCode: certificate.verificationCode,
            candidate: {
                name: candidate?.fullName || "N/A",
                enrollmentNo: candidate?.enrollmentNo || "N/A",
            },
            exam: {
                examName: exam?.examTitle || "N/A",
                examDate: exam?.examDate ? new Date(exam.examDate).toISOString().split("T")[0] : "N/A",
            },
            result: {
                percentage: result?.percentage || 0,
                grade: getGrade(result?.percentage || 0),
                rank: result?.rank || null,
                status: result?.passStatus || "FAILED",
            },
            issuedOn: certificate.issuedAt || certificate.createdAt,
            status: "VALID",
            verifiedAt: verifiedAt.toISOString(),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Download Certificate
    |--------------------------------------------------------------------------
    */

    async download(certificateId: string) {
        const certificate = await this.validateCertificate(certificateId);

        if (
            certificate.certificateStatus !== CertificateStatus.ISSUED &&
            certificate.certificateStatus !== CertificateStatus.GENERATED &&
            certificate.certificateStatus !== CertificateStatus.PENDING
        ) {
            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Certificate has not been issued, generated or pending."
            );
        }

        return {
            certificateId: certificate._id,
            certificateNumber: certificate.certificateNumber,
            downloadUrl: certificate.certificateUrl,
            downloadCount: 1,
            downloadedAt: new Date().toISOString(),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | Revoke Certificate
    |--------------------------------------------------------------------------
    */

    async revoke(

        certificateId: string,

        revokedBy: string,

        remarks: string

    ) {

        const certificate =
            await this.validateCertificate(
                certificateId
            );

        if (

            certificate.certificateStatus ===
            CertificateStatus.REVOKED

        ) {

            throw new ApiError(

                HTTP_STATUS.BAD_REQUEST,

                "Certificate has already been revoked."

            );

        }

        const revokedAt = new Date();
        await certificateRepository.update(
            certificateId,
            {
                certificateStatus: CertificateStatus.REVOKED,
                revokedBy: new mongoose.Types.ObjectId(revokedBy),
                revokedAt,
                remarks,
            }
        );

        return {
            _id: certificate._id,
            certificateNumber: certificate.certificateNumber,
            status: "REVOKED",
            reason: remarks,
            revokedBy,
            revokedAt: revokedAt.toISOString()
        };

    }

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    async dashboard(
        examId?: string
    ) {

        const [

            total,

            generated,

            issued,

            revoked,

        ] = await Promise.all([

            super.count(
                examId ? { examId } : {}
            ),

            certificateRepository.countGenerated(
                examId
            ),

            certificateRepository.countIssued(
                examId
            ),

            certificateRepository.countRevoked(
                examId
            ),

        ]);

        return {

            total,

            generated,

            issued,

            revoked,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    async statistics(
        examId?: string
    ) {

        const dashboard =
            await this.dashboard(
                examId
            );

        const generationRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        (dashboard.generated /

                            dashboard.total) * 100

                    ).toFixed(2)

                );

        const issueRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        (dashboard.issued /

                            dashboard.total) * 100

                    ).toFixed(2)

                );

        const revokeRate =

            dashboard.total === 0

                ? 0

                : Number(

                    (

                        (dashboard.revoked /

                            dashboard.total) * 100

                    ).toFixed(2)

                );

        return {

            ...dashboard,

            generationRate,

            issueRate,

            revokeRate,

        };

    }

    /*
    |--------------------------------------------------------------------------
    | Permanent Delete
    |--------------------------------------------------------------------------
    */

    async permanentDelete(
        certificateId: string
    ) {

        await this.validateCertificate(
            certificateId
        );

        return certificateRepository.permanentDelete(
            certificateId
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Bulk Generate
    |--------------------------------------------------------------------------
    */

    async bulkGenerate(examId: string, generatedBy: string) {

        const pendingCertificates = await certificateRepository.findAll({
            examId,
            certificateStatus: CertificateStatus.PENDING,
        });

        const items = pendingCertificates.data ?? [];

        let generatedCount = 0;
        let failedCount = 0;
        const startTime = Date.now();

        for (const cert of items) {
            try {
                await this.generate((cert as any)._id.toString(), generatedBy);
                generatedCount++;
            } catch {
                failedCount++;
            }
        }

        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);

        return {
            generatedCertificates: generatedCount,
            failedCertificates: failedCount,
            generationTime: `${elapsedSeconds} seconds`,
        };

    }

}

export default new CertificateService();
