import React, { useState } from "react";
import {
  FileText,
  Download,
  Filter,
  Search,
  IndianRupee,
  TrendingUp,
  CreditCard,
  Briefcase,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { LineChart, DoughnutChart } from "@/shared/components/charts/charts";
import { useFinancialSummary, useFinancialList, useExportFinancialData, useGenerateFinancialReport } from "../../hooks/financial-report.hooks";
import { useRecentReports } from "../../hooks/report.hooks";
import type { FinancialListItem } from "../../api/financial-report.api";
import type { TableColumn } from "@/shared/types";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/providers/theme-context";

const formatCurrency = (amount: number, currency: string = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

import { MasterAdminStatCard as StatCard } from "../../components/cards/MasterAdminStatCard";

export const MAFinancialReportsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const navigate = useNavigate();
  const { data: summary, refetch: refetchSummary } = useFinancialSummary();
  const { data: listData, isLoading: isListLoading } = useFinancialList({
    page,
    limit,
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    paymentStatus: paymentStatus === "ALL" ? undefined : paymentStatus,
  });
  const { mutate: exportData, isPending: isExporting } = useExportFinancialData();
  const { mutate: generateReport, isPending: isGenerating } = useGenerateFinancialReport(() => {
    navigate("/master-admin/reports");
  });

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
            onClick={() => handleExport()}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue || 0)}
          icon={IndianRupee}
          accent="green"
          description="All time revenue"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(summary?.monthlyRevenue || 0)}
          icon={TrendingUp}
          accent="lime"
          description="Current Month Revenue"
        />
        <StatCard
          title="Total Invoices"
          value={summary?.totalInvoices || 0}
          icon={Briefcase}
          accent="slate"
          description="All time invoices"
        />
        <StatCard
          title="Unpaid Invoices"
          value={summary?.unpaidInvoices || 0}
          icon={CreditCard}
          accent="red"
          description="Awaiting payment"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Revenue Trend</h3>
            <div className="h-[300px] w-full">
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
            <h3 className="text-lg font-semibold mb-4 text-foreground">Revenue by Plan</h3>
            <div className="h-[300px] w-full flex items-center justify-center">
              <DoughnutChart
                data={{
                  labels: summary?.revenueByPlan?.map((p: { name: string }) => p.name) || ["No Data"],
                  datasets: [
                    {
                      data: summary?.revenueByPlan?.length 
                        ? summary.revenueByPlan.map((p: { amount: number }) => p.amount)
                        : [1],
                      backgroundColor: [
                        "#2D3E2C",
                        "#4B6B49",
                        "#6A9967",
                        "#88C684",
                        "#A7F4A2",
                        "#e2e8f0"
                      ],
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground">Detailed Financial Report</h3>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  className="pl-9 bg-background border-border text-foreground"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className={status || paymentStatus ? "border-primary text-primary bg-secondary/20" : ""}>
                    <Filter className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Filter Reports</h4>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500">Invoice Status</label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invoice status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Statuses</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          <SelectItem value="SENT">Sent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500">Payment Status</label>
                      <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Statuses</SelectItem>
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="OVERDUE">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setStatus("");
                          setPaymentStatus("");
                        }}
                        className="text-xs text-slate-500 hover:text-slate-800"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {isListLoading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <GenericDataTable<FinancialListItem>
              data={listData?.data || []}
              columns={columns}
              keyExtractor={(item) => item.id}
            />
          )}

          <div className="mt-4 flex justify-end">
            <GenericPagination
              pageIndex={page - 1}
              pageSize={limit}
              totalCount={listData?.pagination?.total || 0}
              onPageChange={(p) => setPage(p + 1)}
              onPageSizeChange={(s) => {
                setLimit(s);
                setPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Downloaded Reports */}
      <div className="grid grid-cols-1 mt-6">
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

export default MAFinancialReportsPage;
