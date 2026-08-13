import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Certificate Status
|--------------------------------------------------------------------------
*/

export enum CertificateStatus {
  PENDING = "PENDING",

  GENERATED = "GENERATED",

  ISSUED = "ISSUED",

  REVOKED = "REVOKED",

  EXPIRED = "EXPIRED",
}

/*
|--------------------------------------------------------------------------
| Certificate Type
|--------------------------------------------------------------------------
*/

export enum CertificateType {
  PARTICIPATION = "PARTICIPATION",

  QUALIFICATION = "QUALIFICATION",

  MERIT = "MERIT",
}

/*
|--------------------------------------------------------------------------
| Verification Status
|--------------------------------------------------------------------------
*/

export enum VerificationStatus {
  VERIFIED = "VERIFIED",

  INVALID = "INVALID",

  EXPIRED = "EXPIRED",
}

/*
|--------------------------------------------------------------------------
| Certificate Interface
|--------------------------------------------------------------------------
*/

export interface ICertificate {
  /*
    |--------------------------------------------------------------------------
    | References
    |--------------------------------------------------------------------------
    */

  resultId: Types.ObjectId;

  approvalId: Types.ObjectId;

  candidateId: Types.ObjectId;

  candidateAssignmentId: Types.ObjectId;

  attendanceId: Types.ObjectId;

  submissionId: Types.ObjectId;

  examId: Types.ObjectId;

  paperId: Types.ObjectId;

  subjectId: Types.ObjectId;

  companyId: Types.ObjectId;

  branchId: Types.ObjectId;

  examCenterId: Types.ObjectId;

  /*
    |--------------------------------------------------------------------------
    | Certificate
    |--------------------------------------------------------------------------
    */

  certificateNumber: string;

  verificationCode: string;

  verificationUrl: string;

  certificateUrl?: string;

  qrCodeUrl?: string;

  certificateType: CertificateType;

  certificateStatus: CertificateStatus;

  /*
    |--------------------------------------------------------------------------
    | Timeline
    |--------------------------------------------------------------------------
    */

  generatedAt?: Date;

  issuedAt?: Date;

  expiryDate?: Date;

  revokedAt?: Date;

  /*
    |--------------------------------------------------------------------------
    | Verification
    |--------------------------------------------------------------------------
    */

  verificationStatus: VerificationStatus;

  verifiedAt?: Date;

  /*
    |--------------------------------------------------------------------------
    | Approval
    |--------------------------------------------------------------------------
    */

  generatedBy?: Types.ObjectId;

  revokedBy?: Types.ObjectId;

  remarks?: string;

  /*
    |--------------------------------------------------------------------------
    | Audit
    |--------------------------------------------------------------------------
    */

  createdBy?: Types.ObjectId;

  updatedBy?: Types.ObjectId;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Certificate Document
|--------------------------------------------------------------------------
*/

export type CertificateDocument = HydratedDocument<ICertificate>;
