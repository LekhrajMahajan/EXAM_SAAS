import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/report-advanced.api";
import { toast } from "react-hot-toast";

const QUERY_KEYS = {
  TEMPLATES: "report-templates",
  SCHEDULES: "report-schedules",
  EXECUTIONS: "report-executions",
};

// --- TEMPLATES ---
export const useReportTemplates = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEMPLATES, params],
    queryFn: () => api.getReportTemplates(params),
  });
};

export const useReportTemplate = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEMPLATES, id],
    queryFn: () => api.getReportTemplateById(id),
    enabled: !!id,
  });
};

export const useCreateReportTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createReportTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      toast.success("Template created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create template");
    },
  });
};

export const useUpdateReportTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateReportTemplate(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES, variables.id] });
      toast.success("Template updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update template");
    },
  });
};

export const useDeleteReportTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteReportTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      toast.success("Template deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete template");
    },
  });
};

export const useToggleReportTemplatePublish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.toggleReportTemplatePublish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEMPLATES] });
      toast.success("Template status toggled");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to toggle template status");
    },
  });
};

// --- SCHEDULES ---
export const useScheduledReports = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHEDULES, params],
    queryFn: () => api.getScheduledReports(params),
  });
};

export const useScheduledReport = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SCHEDULES, id],
    queryFn: () => api.getScheduledReportById(id),
    enabled: !!id,
  });
};

export const useCreateScheduledReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createScheduledReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SCHEDULES] });
      toast.success("Schedule created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create schedule");
    },
  });
};

export const useUpdateScheduledReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => api.updateScheduledReport(id, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SCHEDULES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SCHEDULES, variables.id] });
      toast.success("Schedule updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update schedule");
    },
  });
};

export const useDeleteScheduledReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteScheduledReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SCHEDULES] });
      toast.success("Schedule deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete schedule");
    },
  });
};

export const useToggleScheduledReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.toggleScheduledReportStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SCHEDULES] });
      toast.success("Schedule status toggled");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to toggle schedule status");
    },
  });
};

export const useRunScheduledReportNow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.runScheduledReportNow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXECUTIONS] });
      toast.success("Schedule execution started");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to run schedule");
    },
  });
};

// --- EXECUTIONS ---
export const useReportExecutions = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXECUTIONS, params],
    queryFn: () => api.getReportExecutions(params),
    refetchInterval: 5000, // Refetch every 5s to see updates
  });
};
