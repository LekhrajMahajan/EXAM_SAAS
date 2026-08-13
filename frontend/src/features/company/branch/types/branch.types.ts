export interface Branch {
  _id: string;
  companyId?: string;
  branchCode: string;
  branchName: string;
  branchType?: string;
  examCenterCode?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  managerName?: string;
  totalLabs?: number;
  totalSystems?: number;
  facilities?: string[];
  status: "ACTIVE" | "INACTIVE";
  setupStatus?: "DRAFT" | "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED" | string;
  setupCurrentStep?: number;
  readinessScore?: number;
  adminReviewRemarks?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BranchListResponse {
  data: Branch[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BranchQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  state?: string;
  status?: "ACTIVE" | "INACTIVE";
}
