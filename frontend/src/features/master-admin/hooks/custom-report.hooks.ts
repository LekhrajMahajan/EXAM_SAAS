import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  getCustomReports,
  getCustomReportById,
  createCustomReport,
  updateCustomReport,
  deleteCustomReport,
  executeCustomReport,
  previewCustomReport,
  cloneCustomReport,
  getCustomReportMetadata
} from "../api/custom-report.api";

export const useCustomReports = (params?: any) => {
  return useQuery({
    queryKey: ["custom-reports", params],
    queryFn: () => getCustomReports(params),
  });
};

export const useCustomReportById = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["custom-report", id],
    queryFn: () => getCustomReportById(id),
    enabled: !!id && enabled,
  });
};

export const useCustomReportMetadata = () => {
  return useQuery({
    queryKey: ["custom-report-metadata"],
    queryFn: () => getCustomReportMetadata(),
  });
};

export const useCreateCustomReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomReport,
    onSuccess: () => {
      toast.success("Report created successfully");
      queryClient.invalidateQueries({ queryKey: ["custom-reports"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create report");
    },
  });
};

export const useUpdateCustomReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomReport,
    onSuccess: (data, variables) => {
      toast.success("Report updated successfully");
      queryClient.invalidateQueries({ queryKey: ["custom-reports"] });
      queryClient.invalidateQueries({ queryKey: ["custom-report", variables.id] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update report");
    },
  });
};

export const useDeleteCustomReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomReport,
    onSuccess: () => {
      toast.success("Report deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["custom-reports"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete report");
    },
  });
};

export const usePreviewCustomReport = () => {
  return useMutation({
    mutationFn: previewCustomReport,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to generate preview");
    },
  });
};

export const useExecuteCustomReport = () => {
  return useMutation({
    mutationFn: ({ id, params }: { id: string; params?: any }) => executeCustomReport(id, params),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to execute report");
    },
  });
};

export const useCloneCustomReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cloneCustomReport,
    onSuccess: () => {
      toast.success("Report cloned successfully");
      queryClient.invalidateQueries({ queryKey: ["custom-reports"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to clone report");
    },
  });
};
