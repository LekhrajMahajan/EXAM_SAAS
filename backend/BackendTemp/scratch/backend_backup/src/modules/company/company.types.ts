import { HydratedDocument, Types } from "mongoose";

export interface ICompany {
  companyCode: string;

  companyName: string;

  legalName?: string;

  companyType?: string;

  ownerName: string;

  email: string;

  phone: string;

  alternatePhone?: string;

  website?: string;


  registrationDocument?: string;
  mouDocument?: string;
  panCardDocument?: string;
  gstDocument?: string;
  aadharCardDocument?: string;
  msmeCertificateDocument?: string;
  paymentStatus?: "PENDING" | "SUCCESS" | "FAILED";

  address?: string;


  city?: string;

  state?: string;

  country?: string;

  pincode?: string;

  gstNumber?: string;

  panNumber?: string;

  registrationNumber?: string;

  subscriptionPlan?: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";

  planId?: string | Types.ObjectId;
  subscriptionId?: string | Types.ObjectId;
  subscriptionStartDate?: Date;

  subscriptionEndDate?: Date;



  maxCenters?: number;

  maxEmployees?: number;

  maxCandidates?: number;

  status: boolean;

  approvalStatus?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  
  verificationStatus?: "PENDING" | "VERIFIED" | "FAILED";
  
  reviewerId?: Types.ObjectId | null;
  
  rejectionReason?: string;
  
  rejectionRemarks?: string;
  
  onboardingCompleted?: boolean;

  submittedAt?: Date;
  
  approvedAt?: Date;
  
  rejectedAt?: Date;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

export type CompanyDocument = HydratedDocument<ICompany>;
