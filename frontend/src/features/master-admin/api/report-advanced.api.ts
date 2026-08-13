import api from "@/services/api";

// --- TEMPLATES ---
export const getReportTemplates = async (params?: Record<string, any>): Promise<any> => {
  const response = await api.get("/reports/templates", { params });
  return response.data;
};

export const getReportTemplateById = async (id: string): Promise<any> => {
  const response = await api.get(`/reports/templates/${id}`);
  return response.data;
};

export const createReportTemplate = async (data: any): Promise<any> => {
  const response = await api.post("/reports/templates", data);
  return response.data;
};

export const updateReportTemplate = async (id: string, data: any): Promise<any> => {
  const response = await api.patch(`/reports/templates/${id}`, data);
  return response.data;
};

export const deleteReportTemplate = async (id: string): Promise<any> => {
  const response = await api.delete(`/reports/templates/${id}`);
  return response.data;
};

export const toggleReportTemplatePublish = async (id: string): Promise<any> => {
  const response = await api.patch(`/reports/templates/${id}/publish`);
  return response.data;
};

// --- SCHEDULES ---
export const getScheduledReports = async (params?: Record<string, any>): Promise<any> => {
  const response = await api.get("/reports/schedules", { params });
  return response.data;
};

export const getScheduledReportById = async (id: string): Promise<any> => {
  const response = await api.get(`/reports/schedules/${id}`);
  return response.data;
};

export const createScheduledReport = async (data: any): Promise<any> => {
  const response = await api.post("/reports/schedules", data);
  return response.data;
};

export const updateScheduledReport = async (id: string, data: any): Promise<any> => {
  const response = await api.patch(`/reports/schedules/${id}`, data);
  return response.data;
};

export const deleteScheduledReport = async (id: string): Promise<any> => {
  const response = await api.delete(`/reports/schedules/${id}`);
  return response.data;
};

export const toggleScheduledReportStatus = async (id: string): Promise<any> => {
  const response = await api.patch(`/reports/schedules/${id}/toggle`);
  return response.data;
};

export const runScheduledReportNow = async (id: string): Promise<any> => {
  const response = await api.post(`/reports/schedules/${id}/run`);
  return response.data;
};

// --- EXECUTIONS ---
export const getReportExecutions = async (params?: Record<string, any>): Promise<any> => {
  const response = await api.get("/reports/executions", { params });
  return response.data;
};
