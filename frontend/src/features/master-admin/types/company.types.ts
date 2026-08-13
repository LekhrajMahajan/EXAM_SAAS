export interface Company {
  _id: string;
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
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  maxBranches?: number;
  maxCenters?: number;
  maxEmployees?: number;
  maxCandidates?: number;
  status: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  approvalStatus?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  verificationStatus?: "PENDING" | "VERIFIED" | "FAILED";
  reviewerId?: string | null;
  rejectionReason?: string;
  rejectionRemarks?: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CompanyAuditLog {
  _id: string;
  companyId: string;
  action: "SUBMITTED" | "REVIEW_STARTED" | "REVIEW_COMPLETED" | "APPROVED" | "REJECTED" | "DOCUMENT_VIEWED" | "REVIEWER_ASSIGNED";
  performedBy: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStatistics {
  pending: number;
  underReview: number;
  approvedToday: number;
  rejectedToday: number;
  expiredRequests: number;
  avgApprovalTime: string;
}

export interface CompanyStatistics {
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  starterPlan: number;
  professionalPlan: number;
  enterprisePlan: number;
}
