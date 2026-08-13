import api from "@/services/api";

export interface CandidateSummaryData {
  totalCandidates: number;
  activeCandidates: number;
  pendingVerification: number;
  rejectedCandidates: number;
  admitCardsGenerated: number;
  appeared: number;
  absent: number;
  registrationTrend: { date: string; count: number }[];
}

export interface CandidateListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

export interface CandidateListItem {
  id: string;
  candidateCode: string;
  fullName: string;
  email: string;
  mobile: string;
  status: string;
  biometricVerified: boolean;
  exam: string;
  company: string;
  center: string;
  createdAt: string;
}

export interface CandidateListResponse {
  data: CandidateListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const candidateReportApi = {
  getSummary: async (): Promise<CandidateSummaryData> => {
    const response = await api.get("/reports/candidates/summary");
    return response.data.data;
  },

  getList: async (params?: CandidateListParams): Promise<CandidateListResponse> => {
    const response = await api.get("/reports/candidates/list", { params });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  exportData: async (params?: CandidateListParams): Promise<any[] | string> => {
    const response = await api.get("/reports/candidates/export", {
      params,
    });
    return response.data.data;
  },

  generateReport: async (params?: Record<string, any>): Promise<any> => {
    const response = await api.post("/reports/candidate", params, {
      responseType: "blob",
    });
    return response.data;
  },
};
