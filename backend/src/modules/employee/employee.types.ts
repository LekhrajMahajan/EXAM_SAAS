import { HydratedDocument, Types } from "mongoose";

export enum EmployeeStatus {
  DRAFT = "DRAFT",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  VERIFIED = "VERIFIED",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  INACTIVE = "INACTIVE",
  TRANSFERRED = "TRANSFERRED",
  RESIGNED = "RESIGNED",
  TERMINATED = "TERMINATED",
  ARCHIVED = "ARCHIVED",
  SOFT_DELETED = "SOFT_DELETED",
  RESTORED = "RESTORED",
}

export enum EmployeeVerificationStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export const SUPPORTED_EMPLOYEE_ROLES = [
  "EXAM_MANAGER",
  "PAPER_SETTER",
  "BIOMETRIC_VERIFIER",
  "ENTRY_CHECKER",
  "OBSERVER",
  "GOVT_AUTHORITY",
  "TECHNICAL_MANAGER",
  "INVIGILATOR",
  "AI_PROCTOR",
  "COMMAND_CENTER",
  "COMPANY_ADMIN",
  "STATE_MANAGER",
  "CITY_MANAGER",
] as const;

export interface IEmployeeDocument {
  _id?: Types.ObjectId;
  documentType: string; // e.g. Aadhaar Card, PAN Card, Passport Size Photo, Resume, etc.
  documentUrl: string;
  fileName: string;
  fileSize?: number;
  version: number;
  expiryDate?: Date;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  uploadedAt: Date;
  auditLogs: {
    action: string;
    performedBy: Types.ObjectId | string;
    timestamp: Date;
    remarks?: string;
  }[];
}

export interface IEmployeeBiometric {
  isEnrolled: boolean;
  encryptedEmbedding?: string;
  faceQualityScore?: number;
  lastEnrolledAt?: Date;
  enrollmentHistory: {
    attemptedAt: Date;
    status: string;
    qualityScore?: number;
    remarks?: string;
  }[];
  verificationHistory: {
    verifiedAt: Date;
    status: string;
    matchingScore: number;
    deviceId?: string;
  }[];
}

export interface IEmployeeLifecycleHistory {
  status: EmployeeStatus;
  changedBy?: Types.ObjectId | null;
  reason?: string;
  timestamp: Date;
}

export interface IBankDetails {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  ifscCode?: string;
  branchName?: string;
  accountType?: "SAVINGS" | "CURRENT" | "SALARY";
}

export interface IEmergencyContact {
  name?: string;
  relationship?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
}

export interface IEducation {
  degree?: string;
  institution?: string;
  boardOrUniversity?: string;
  yearOfPassing?: number;
  percentageOrCgpa?: string;
}

export interface IExperience {
  companyName?: string;
  designation?: string;
  startDate?: Date;
  endDate?: Date;
  responsibilities?: string;
}

export interface IEmployee {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  employeeCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  username?: string;
  phone: string;
  alternateMobile?: string;
  branchId?: Types.ObjectId | null;
  centerId?: Types.ObjectId | null;
  department: string;
  designation: string;
  role: string;
  joiningDate: Date;
  dob?: Date;
  gender?: Gender;
  bloodGroup?: string;
  salary?: number;
  reportingManager?: Types.ObjectId | null;
  profileImage?: string;
  digitalSignature?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // Verification & Profile Status
  status: EmployeeStatus;
  verificationStatus: EmployeeVerificationStatus;
  profileCompleted: boolean;
  emailVerified: boolean;
  mobileVerified: boolean;
  aadhaarVerified: boolean;
  rejectionReason?: string;
  correctionNotes?: string;

  // Complex Sub-schemas
  documents: IEmployeeDocument[];
  biometrics?: IEmployeeBiometric;
  bankDetails?: IBankDetails;
  emergencyContact?: IEmergencyContact;
  education: IEducation[];
  experience: IExperience[];
  skills: string[];
  certifications: string[];
  languages: string[];
  lifecycleHistory: IEmployeeLifecycleHistory[];

  // Standard Tracking
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type EmployeeDocument = HydratedDocument<IEmployee>;

