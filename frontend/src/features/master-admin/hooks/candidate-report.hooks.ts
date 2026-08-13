import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { candidateReportApi } from "../api/candidate-report.api";
import type { CandidateListParams } from "../api/candidate-report.api";
import { toast } from "react-hot-toast";

export const useCandidateSummary = () => {
  return useQuery({
    queryKey: ["candidate-report-summary"],
    queryFn: candidateReportApi.getSummary,
  });
};

export const useCandidateList = (params: CandidateListParams) => {
  return useQuery({
    queryKey: ["candidate-report-list", params],
    queryFn: () => candidateReportApi.getList(params),
  });
};

export const useExportCandidateData = () => {
  return useMutation({
    mutationFn: (params: CandidateListParams) => candidateReportApi.exportData(params),
    onSuccess: (result) => {
      console.log("Export Success:", result);
      if (!result || !result.length) {
        toast.error("No data to export");
        return;
      }
      let csvContent = "";
      if (typeof result === "string") {
        csvContent = result;
      } else {
        const rows = result;
        const headers = Object.keys(rows[0]);
        csvContent = [
          headers.join(","),
          ...rows.map((row: any) =>
            headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(",")
          ),
        ].join("\n");
      }
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `candidate_report_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Candidate report exported successfully");
    },
    onError: (error: any) => {
      console.error("Export Error:", error);
      toast.error(error?.response?.data?.message || "Failed to export report");
    },
  });
};

export const useGenerateCandidateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidateReportApi.generateReport,
    onSuccess: (data) => {
      console.log("Generate Success");
      
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Candidate_Report_YYYY_MM_DD_HH_mm.pdf
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const filename = `Candidate_Report_${now.getFullYear()}_${pad(now.getMonth() + 1)}_${pad(now.getDate())}_${pad(now.getHours())}_${pad(now.getMinutes())}.pdf`;
      
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      
      toast.success("Candidate report downloaded successfully");
    },
    onError: (error: any) => {
      console.error("Generate Error:", error);
      toast.error(error?.response?.data?.message || "Failed to generate report");
    },
  });
};
