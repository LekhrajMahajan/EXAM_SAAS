import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resultReportApi } from "../api/result-report.api";
import type { ResultListParams } from "../api/result-report.api";
import { toast } from "react-hot-toast";

export function useResultSummary() {
  return useQuery({
    queryKey: ["result-report-summary"],
    queryFn: () => resultReportApi.getSummary(),
  });
}

export function useResultList(params: ResultListParams) {
  return useQuery({
    queryKey: ["result-report-list", params],
    queryFn: () => resultReportApi.getList(params),
  });
}

export function useResultExport() {
  return useMutation({
    mutationFn: (filters: Record<string, unknown>) => resultReportApi.getExportData(filters),
  });
}

export function useGenerateResultReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: ResultListParams) => resultReportApi.generateResultReport(params),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const filename = `Result_Report_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Result report downloaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate report");
    },
  });
}
