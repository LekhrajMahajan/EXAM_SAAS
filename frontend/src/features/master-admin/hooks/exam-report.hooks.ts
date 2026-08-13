import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examReportApi } from "../api/exam-report.api";
import type { ExamListParams } from "../api/exam-report.api";
import { toast } from "react-hot-toast";

export const useExamSummary = () => {
  return useQuery({
    queryKey: ["exam-report-summary"],
    queryFn: examReportApi.getSummary,
  });
};

export const useExamList = (params: ExamListParams) => {
  return useQuery({
    queryKey: ["exam-report-list", params],
    queryFn: () => examReportApi.getList(params),
  });
};

export const useExportExamData = () => {
  return useMutation({
    mutationFn: (params: ExamListParams) => examReportApi.exportData(params),
    onSuccess: (result) => {
      if (!result || !result.length) {
        toast.error("No data to export");
        return;
      }
      const rows = result;
      const headers = Object.keys(rows[0]);
      const csvContent = [
        headers.join(","),
        ...rows.map(row =>
          headers.map(h => `"${String(row[h as keyof typeof row] ?? "").replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `exam_report_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Exam report exported successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to export report");
    },
  });
};

export const useGenerateExamReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params?: ExamListParams) => examReportApi.generateReport(params),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const filename = `Exam_Report_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Exam report downloaded successfully");
    },
    onError: (error: any) => {
      console.error("Generate Error:", error);
      toast.error(error?.response?.data?.message || "Failed to generate report");
    },
  });
};
