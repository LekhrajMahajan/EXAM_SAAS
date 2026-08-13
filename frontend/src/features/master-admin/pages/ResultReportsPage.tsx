import React, { useState } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  Star,
  Download,
  Search,
  Award,
  BarChart,
  ClipboardList,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { useResultSummary, useResultList, useResultExport, useGenerateResultReport } from "../hooks/result-report.hooks";
import { useRecentReports } from "../hooks/report.hooks";
import type { TableColumn } from "@/shared/types";

interface ResultReportRow {
  candidateId: string;
  registrationNo: string;
  candidateName: string;
  exam: string;
  subject: string;
  paper: string;
  session: string;
  shift: string;
  examCenter: string;
  company: string;
  branch: string;
  marksObtained: number;
  maximumMarks: number;
  percentage: number;
  grade: string;
  rank: string | number;
  resultStatus: string;
  meritStatus: string;
  approvalStatus: string;
  publishedDate: string | Date;
  id?: string;
}

import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard'

export const ResultReportsPage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: summary, refetch: refetchSummary } = useResultSummary();
  const { data: listData } = useResultList({
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch,
  });
  
  const { mutate: exportData, isPending: isExporting } = useResultExport();
  const { mutate: generateReport, isPending: isGenerating } = useGenerateResultReport();
  const { data: recentReports, isLoading: recentLoading } = useRecentReports({ limit: 10 });
  const resultReports = recentReports?.data?.filter((r: any) => r.reportType === 'RESULT').slice(0, 5) || [];

  const handleExport = () => {
    exportData({ search: debouncedSearch }, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (response: any) => {
        const csvString = response.data || response;
        const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Result_Report.csv";
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  const columns: TableColumn<ResultReportRow>[] = [
    { id: "candidateId", header: "Candidate ID", accessorKey: "candidateId" as keyof ResultReportRow },
    { id: "candidateName", header: "Name", accessorKey: "candidateName" as keyof ResultReportRow },
    { id: "exam", header: "Exam", accessorKey: "exam" as keyof ResultReportRow },
    { id: "examCenter", header: "Center", accessorKey: "examCenter" as keyof ResultReportRow },
    { id: "marksObtained", header: "Marks", accessorKey: "marksObtained" as keyof ResultReportRow },
    { 
      id: "percentage", 
      header: "Percentage", 
      accessorKey: "percentage" as keyof ResultReportRow,
      cell: ({ row }) => `${Number(row.percentage).toFixed(2)}%`
    },
    { 
      id: "grade", 
      header: "Grade", 
      accessorKey: "grade" as keyof ResultReportRow,
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
          row.grade === 'A+' || row.grade === 'A' ? 'bg-primary text-primary-foreground border-primary' :
          row.grade === 'B' || row.grade === 'C' ? 'bg-secondary text-secondary-foreground border-secondary' :
          row.grade === 'D' ? 'bg-muted text-muted-foreground border-border' :
          'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {String(row.grade)}
        </span>
      )
    },
    { id: "rank", header: "Rank", accessorKey: "rank" as keyof ResultReportRow },
    { 
      id: "resultStatus", 
      header: "Result Status", 
      accessorKey: "resultStatus" as keyof ResultReportRow,
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          row.resultStatus === 'APPROVED' || row.resultStatus === 'PUBLISHED' || row.resultStatus === 'EVALUATED' ? 'bg-primary text-primary-foreground border-primary' :
          row.resultStatus === 'REJECTED' ? 'bg-destructive/10 text-destructive border-destructive/20' :
          'bg-muted text-muted-foreground border-border'
        }`}>
          {String(row.resultStatus).replace("_", " ")}
        </span>
      )
    },
    { 
      id: "approvalStatus", 
      header: "Approval", 
      accessorKey: "approvalStatus" as keyof ResultReportRow,
      cell: ({ row }) => {
        const approval = String(row.approvalStatus || 'Pending');
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            approval.toUpperCase() === 'APPROVED' || approval.toUpperCase() === 'VERIFIED' ? 'bg-primary text-primary-foreground border-primary' :
            approval.toUpperCase() === 'REJECTED' ? 'bg-destructive/10 text-destructive border-destructive/20' :
            'bg-muted text-muted-foreground border-border'
          }`}>
            {approval}
          </span>
        )
      }
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Result & Merit Reports</h2>
          <p className="text-sm text-slate-500">View and manage exam results, merits, and performance analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant='outline'
            onClick={() => refetchSummary()}
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
          >
            <RefreshCw className='w-4 h-4' />
            Refresh
          </Button>
          <Button
            variant='outline'
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
          <Button
            variant='outline'
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
            onClick={() => generateReport({ search: debouncedSearch })}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            {isGenerating ? "Generating..." : "Export Report"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Results"
          value={summary?.totalResults || 0}
          icon={ClipboardList}
          accent="slate"
        />
        <StatCard
          title="Passed Candidates"
          value={summary?.passCandidates || 0}
          icon={CheckCircle}
          accent="green"
        />
        <StatCard
          title="Failed Candidates"
          value={summary?.failCandidates || 0}
          icon={XCircle}
          accent="red"
        />
        <StatCard
          title="Merit Lists Generated"
          value={summary?.meritListsGenerated || 0}
          icon={Award}
          accent="lime"
        />
        <StatCard
          title="Published Results"
          value={summary?.publishedResults || 0}
          icon={FileText}
          accent="slate"
        />
        <StatCard
          title="Pending Approval"
          value={summary?.pendingApproval || 0}
          icon={Star}
          accent="amber"
        />
        <StatCard
          title="Approved Results"
          value={summary?.approvedResults || 0}
          icon={CheckCircle}
          accent="green"
        />
        <StatCard
          title="Overall Pass %"
          value={`${summary?.overallPassPercentage || 0}%`}
          icon={BarChart}
          accent="slate"
        />
      </div>



      {/* Main Content */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">Result Records</h3>
            <div className="flex gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidate or exam..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background border-border text-foreground"
                />
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <GenericDataTable
              columns={columns as TableColumn<any>[]}
              data={listData?.data || []}
              keyExtractor={(item) => item.candidateId}
            />
          </div>

          <div className="mt-4">
            <GenericPagination
              pageIndex={pageIndex}
              pageSize={pageSize}
              totalCount={listData?.pagination?.total || 0}
              onPageChange={setPageIndex}
              onPageSizeChange={setPageSize}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Downloaded Reports */}
      <div className="grid grid-cols-1">
        <Card className='border-slate-200'>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Downloaded Reports</h3>
            {recentLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {resultReports.map((report: any) => (
                  <div key={report._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{report.reportName}</p>
                      </div>
                    </div>
                    <div className='text-xs text-slate-500 text-right'>
                      {new Date(report.createdAt).toLocaleDateString()}{' '}
                      {new Date(report.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
                {!resultReports.length && (
                  <p className="text-sm text-slate-500 text-center py-4">No recent reports found.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
