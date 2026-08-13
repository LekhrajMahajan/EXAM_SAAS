import api from "@/services/api";

export interface FinancialSummaryData {
  totalRevenue: number;
  outstandingAmount: number;
  refundAmount: number;
  monthlyRevenue: number;
  revenueTrend: { date: string; count: number }[];
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  revenueByPlan?: { name: string; amount: number }[];
}

export interface FinancialListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
}

export interface FinancialListItem {
  id: string;
  invoiceNumber: string;
  company: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  issueDate: string;
  dueDate: string;
}

export interface FinancialListResponse {
  data: FinancialListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const financialReportApi = {
  getSummary: async (): Promise<FinancialSummaryData> => {
    const response = await api.get("/reports/financial/summary");
    return response.data.data;
  },

  getList: async (params?: FinancialListParams): Promise<FinancialListResponse> => {
    const response = await api.get("/reports/financial/list", { params });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  exportData: async (params?: FinancialListParams): Promise<string> => {
    const response = await api.get("/reports/financial/export", {
      params,
    });
    return response.data.data;
  },

  generateReport: async (params?: FinancialListParams): Promise<Blob> => {
    const response = await api.post("/reports/financial/generate", params, {
      responseType: "blob",
    });
    return response.data;
  },
};
