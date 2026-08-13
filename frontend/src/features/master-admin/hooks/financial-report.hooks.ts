import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { FinancialListParams } from '../api/financial-report.api';
import { financialReportApi } from "../api/financial-report.api";
import { toast } from "react-hot-toast";

export const useFinancialSummary = () => {
  return useQuery({
    queryKey: ["financial-report-summary"],
    queryFn: financialReportApi.getSummary,
  });
};

export const useFinancialList = (params: FinancialListParams) => {
  return useQuery({
    queryKey: ["financial-report-list", params],
    queryFn: () => financialReportApi.getList(params),
  });
};

export const useExportFinancialData = () => {
  return useMutation({
    mutationFn: (params: FinancialListParams) => financialReportApi.exportData(params),
    onSuccess: (csvContent) => {
      if (!csvContent || csvContent.trim() === "" || csvContent.includes("No financial records found")) {
        toast.error("No data to export");
        return;
      }
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `financial_report_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Financial report exported successfully");
    },
    onError: (error: Error | any) => {
      console.error("Export Error:", error);
      toast.error(error?.response?.data?.message || "Failed to export report");
    },
  });
};

export const useGenerateFinancialReport = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: FinancialListParams) => financialReportApi.generateReport(params),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const filename = `Financial_Report_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Financial report downloaded successfully");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: Error | any) => {
      console.error("Generate Report Error:", error);
      toast.error(error?.response?.data?.message || "Failed to generate report");
    },
  });
};
