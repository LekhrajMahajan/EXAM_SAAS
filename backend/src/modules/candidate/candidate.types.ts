import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Candidate Status
|--------------------------------------------------------------------------
*/

export enum CandidateStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  VERIFIED = "VERIFIED",

  BLOCKED = "BLOCKED",

  DISQUALIFIED = "DISQUALIFIED",
}

/*
|--------------------------------------------------------------------------
| Gender
|--------------------------------------------------------------------------
*/

export enum Gender {
  MALE = "MALE",

  FEMALE = "FEMALE",

  OTHER = "OTHER",
}

/*
|--------------------------------------------------------------------------
| Category
|--------------------------------------------------------------------------
*/

export enum Category {
  GENERAL = "GENERAL",

  OBC = "OBC",

  SC = "SC",

  ST = "ST",

  EWS = "EWS",

  OTHER = "OTHER",
}

/*
|--------------------------------------------------------------------------
| Candidate Interface
|--------------------------------------------------------------------------
*/

export interface ICandidate {
  companyId: Types.ObjectId;

  branchId: Types.ObjectId;

  centerId: Types.ObjectId;

  seatId?: Types.ObjectId | null;

  examId?: Types.ObjectId | null;

  candidateCode: string;

  applicationNo: string;

  enrollmentNo: string;

  firstName: string;

  middleName?: string;

  lastName: string;

  fullName: string;

  email: string;

  mobile: string;

  alternateMobile?: string;

  gender: Gender;

  dob: Date;

  category: Category;

  bloodGroup?: string;

  photo?: string;

  signature?: string;

  aadharNumber?: string;

  governmentId?: string;

  address: string;

  city: string;

  state: string;

  country: string;

  postalCode: string;

  qualification: string;

  college: string;

  course: string;

  year: number;

  biometricVerified: boolean;

  faceVerified: boolean;

  emailVerified: boolean;

  mobileVerified: boolean;

  hallTicketGenerated: boolean;

  status: CandidateStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;

  // Authentication Fields
  password?: string;
  devices?: any[];
  sessions?: any[];
  loginHistory?: any[];
  
  lastLogin?: Date;
  passwordChangedAt?: Date;
  loginAttempts?: number;
  lockoutUntil?: Date | null;
  refreshToken?: string | null;
  isLoginEnabled?: boolean;

  comparePassword(password: string): Promise<boolean>;
}

/*
|--------------------------------------------------------------------------
| Candidate Document
|--------------------------------------------------------------------------
*/

export type CandidateDocument = HydratedDocument<ICandidate>;
