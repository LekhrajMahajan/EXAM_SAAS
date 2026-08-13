import api from "@/services/api";

export interface ResultSummaryData {
  totalResults: number;
  publishedResults: number;
  pendingApproval: number;
  approvedResults: number;
  passCandidates: number;
  failCandidates: number;
  meritListsGenerated: number;
  overallPassPercentage: number;
}

export interface ResultListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  examId?: string;
}

export const resultReportApi = {
  getSummary: async () => {
    const response = await api.get("/reports/results/summary");
    return response.data;
  },

  getList: async (params: ResultListParams) => {
    const response = await api.get("/reports/results/list", { params });
    return response.data;
  },

  getExportData: async (params?: ResultListParams) => {
    const response = await api.get("/reports/results/export", { params });
    return response.data;
  },

  generateResultReport: async (params?: ResultListParams): Promise<Blob> => {
    const response = await api.post("/reports/result", params, {
      responseType: "blob",
    });
    return response.data;
  },
};
