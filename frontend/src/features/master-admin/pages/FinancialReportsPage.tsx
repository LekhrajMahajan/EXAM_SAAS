import React, { useState } from "react";
import {
  Banknote,
  TrendingUp,
  Clock,
  XCircle,
  FileText,
  Download,
  Filter,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { LineChart, DoughnutChart } from "@/shared/components/charts/charts";
import { useFinancialSummary, useFinancialList, useExportFinancialData, useGenerateFinancialReport } from "../hooks/financial-report.hooks";
import { useRecentReports } from "../hooks/report.hooks";
import type { FinancialListItem } from "../api/financial-report.api";
import type { TableColumn } from "@/shared/types";
import { formatCurrency } from "@/utils/currency";
import { useTheme } from "@/providers/ThemeProvider";

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }: { title: string; value: string | number; icon: React.ElementType; colorClass: string; subtitle?: string }) => (
  <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <CardContent className="p-6 flex items-center gap-4">
      <div className={`p-3 rounded-full ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </p>
        <p className="text-2xl font-bold text-primary">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </CardContent>
  </Card>
);

export const FinancialReportsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: summary, refetch: refetchSummary } = useFinancialSummary();
  const { data: listData, isLoading: isListLoading } = useFinancialList({
    page,
    limit,
    search: debouncedSearch,
  });
  const { mutate: exportData, isPending: isExporting } = useExportFinancialData();
  const { mutate: generateReport, isPending: isGenerating } = useGenerateFinancialReport();

  const { data: recentReports, isLoading: recentLoading } = useRecentReports({ limit: 10 });
  const financialReports = recentReports?.data?.filter((r: any) => r.reportType === 'FINANCIAL').slice(0, 5) || [];

  const handleExport = () => {
    exportData({ search: debouncedSearch });
  };

  const handleGenerateReport = () => {
    generateReport({ search: debouncedSearch });
  };

  const columns: TableColumn<FinancialListItem>[] = [
    { id: "invoiceNumber", header: "Invoice Number", accessorKey: "invoiceNumber" },
    { id: "company", header: "Company", accessorKey: "company" },
    { id: "plan", header: "Subscription Plan", accessorKey: "plan" },
    { 
      id: "amount", 
      header: "Amount", 
      accessorKey: "amount",
      cell: ({ row }: { row: FinancialListItem }) => formatCurrency(row.amount || 0, row.currency || "INR")
    },
    {
      id: "status",
      header: "Invoice Status",
      accessorKey: "status",
      cell: ({ row }: { row: FinancialListItem }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "PAID"
              ? "bg-primary text-primary-foreground"
              : row.status === "OVERDUE"
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      id: "paymentStatus",
      header: "Payment Status",
      accessorKey: "paymentStatus",
      cell: ({ row }: { row: FinancialListItem }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.paymentStatus === "SUCCESS" || row.paymentStatus === "COMPLETED"
              ? "bg-primary text-primary-foreground"
              : row.paymentStatus === "FAILED"
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {row.paymentStatus || "PENDING"}
        </span>
      ),
    },
    {
      id: "issueDate",
      header: "Issue Date",
      accessorKey: "issueDate",
      cell: ({ row }: { row: FinancialListItem }) => {
        if (!row.issueDate) return "N/A";
        const date = new Date(row.issueDate);
        return new Intl.DateTimeFormat("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }).format(date);
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Financial Reports
          </h1>
          <p className="text-slate-500 mt-2">
            Comprehensive reporting and analytics for revenue, payments, and invoices.
          </p>
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
            {isExporting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Download className='w-4 h-4' />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button
            variant='outline'
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className='w-4 h-4 animate-spin' /> : <FileText className='w-4 h-4' />}
            {isGenerating ? 'Generating...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue || 0, "INR")}
          icon={Banknote}
          colorClass="bg-secondary text-primary"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(summary?.monthlyRevenue || 0, "INR")}
          icon={TrendingUp}
          colorClass="bg-secondary text-primary"
        />
        <StatCard
          title="Outstanding Amount"
          value={formatCurrency(summary?.outstandingAmount || 0, "INR")}
          icon={Clock}
          colorClass="bg-secondary text-primary"
        />
        <StatCard
          title="Refund Amount"
          value={formatCurrency(summary?.refundAmount || 0, "INR")}
          icon={XCircle}
          colorClass="bg-secondary text-primary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Revenue Trend (Last 30 Days)
            </h3>
            <div className="h-[300px]">
              <LineChart
                data={{
                  labels: summary?.revenueTrend?.map((t: { date: string }) => {
                    const d = new Date(t.date);
                    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(d);
                  }) || [],
                  datasets: [
                    {
                      label: "Revenue",
                      data: summary?.revenueTrend?.map((t: { count: number }) => t.count) || [],
                      borderColor: isDark ? "#E4FD97" : "#2D3E2C",
                      backgroundColor: isDark ? "rgba(228, 253, 151, 0.1)" : "rgba(45, 62, 44, 0.1)",
                      fill: true,
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Invoice Distribution
            </h3>
            <div className="h-[300px] flex items-center justify-center">
              <DoughnutChart
                data={{
                  labels: ["Paid", "Unpaid"],
                  datasets: [
                    {
                      data: [
                        summary?.paidInvoices || 0,
                        summary?.unpaidInvoices || 0,
                      ],
                      backgroundColor: ["#2D3E2C", "#e2e8f0"],
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-semibold text-foreground">
              Detailed Financial Report
            </h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice or currency..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background border-border text-foreground"
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0 border-primary/30 text-primary">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isListLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : !listData?.data || listData.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/50 rounded-lg border border-dashed border-border">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                No Financial Reports Found
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                No invoices or payments match your search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div>
              <GenericDataTable<FinancialListItem>
                columns={columns}
                data={listData?.data || []}
                keyExtractor={(item: FinancialListItem) => item.id || item.invoiceNumber || ""}
              />
              {listData?.pagination && listData.pagination.total > 0 && (
                <div className="mt-4 border-t pt-4">
                  <GenericPagination
                    pageIndex={page - 1}
                    pageSize={limit}
                    totalCount={listData.pagination.total}
                    onPageChange={(p) => setPage(p + 1)}
                    onPageSizeChange={(s) => {
                      setLimit(s);
                      setPage(1);
                    }}
                  />
                </div>
              )}
            </div>
          )}
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
                {financialReports.map((report: any) => (
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
                {!financialReports.length && (
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
