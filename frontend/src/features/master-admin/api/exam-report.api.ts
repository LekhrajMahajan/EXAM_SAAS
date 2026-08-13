import api from "@/services/api";

export interface ExamSummaryData {
  totalExams: number;
  scheduledExams: number;
  runningExams: number;
  completedExams: number;
  cancelledExams: number;
  totalExamSessions: number;
  totalShifts: number;
  totalExamCenters: number;
  completionTrend: { date: string; count: number }[];
}

export interface ExamListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  companyId?: string;
  branchId?: string;
  centerId?: string;
}

export interface ExamListItem {
  id: string;
  examCode: string;
  examTitle: string;
  subject: string;
  paper: string;
  session: string;
  shift: string;
  examCenter: string;
  company: string;
  branch: string;
  candidatesAssigned: number;
  candidatesAppeared: number;
  candidatesAbsent: number;
  status: string;
  startTime: string;
  endTime: string;
  duration: number;
  examDate: string;
}

export interface ExamListResponse {
  data: ExamListItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const examReportApi = {
  getSummary: async (): Promise<ExamSummaryData> => {
    const response = await api.get("/reports/exams/summary");
    return response.data.data;
  },

  getList: async (params?: ExamListParams): Promise<ExamListResponse> => {
    const response = await api.get("/reports/exams/list", { params });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  exportData: async (params?: ExamListParams): Promise<any[]> => {
    const response = await api.get("/reports/exams/export", {
      params,
    });
    return response.data.data;
  },

  generateReport: async (params?: ExamListParams): Promise<Blob> => {
    const response = await api.post("/reports/exam", params, {
      responseType: "blob",
    });
    return response.data;
  },
};
