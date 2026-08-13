import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SecurityListParams } from '../api/security-report.api';
import { securityReportApi } from "../api/security-report.api";
import { toast } from "react-hot-toast";

export const securityReportKeys = {
  all: ["security-reports"] as const,
  summary: () => [...securityReportKeys.all, "summary"] as const,
  list: (params?: SecurityListParams) => [...securityReportKeys.all, "list", params] as const,
};

export const useSecurityStatistics = () => {
  return useQuery({
    queryKey: securityReportKeys.summary(),
    queryFn: () => securityReportApi.getSummary(),
  });
};

export const useSecurityReportsList = (params?: SecurityListParams) => {
  return useQuery({
    queryKey: securityReportKeys.list(params),
    queryFn: () => securityReportApi.getList(params),
  });
};

export const useExportSecurityReports = () => {
  return useMutation({
    mutationFn: (params?: SecurityListParams) =>
      securityReportApi.exportData(params),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Security_Report_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Report exported successfully");
    },
    onError: (error: Error | any) => {
      console.error("Export Error:", error);
      toast.error(error?.response?.data?.message || "Failed to export report");
    },
  });
};

export const useGenerateSecurityReport = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: SecurityListParams) => securityReportApi.generateReport(params),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const filename = `Security_Report_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Security report downloaded successfully");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: Error | any) => {
      console.error("Generate Report Error:", error);
      toast.error(error?.response?.data?.message || "Failed to generate report");
    },
  });
};
