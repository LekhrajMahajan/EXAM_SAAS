import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MasterAdminStatCard as StatCard } from "../components/cards/MasterAdminStatCard";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { useCompanies, useApprovalStatistics } from "../hooks/company.hooks";
import type { TableColumn } from "@/shared/types";
import type { Company } from "../types/company.types";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search, CheckCircle, Clock, FileCheck, XSquare, AlertCircle, Eye } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export const CompanyApprovalPage = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  const [currentTab, setCurrentTab] = useState<string>(location.state?.defaultTab || "PENDING");
  


  const { data: stats } = useApprovalStatistics();

  const { data: companiesResponse, isLoading, isError } = useCompanies({
    page: pageIndex + 1,
    limit: pageSize,
    search: search || undefined,
    approvalStatus: currentTab,
    paymentStatus: "PENDING",
  });



  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPageIndex(0);
  };



  const columns: TableColumn<Company>[] = [
    {
      id: "companyName",
      header: "Company",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-slate-100 border flex items-center justify-center shrink-0 font-medium">
            {row.companyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/master-admin/company-approvals/${row._id}`)}>
              {row.companyName}
            </div>
            <div className="text-xs text-slate-500">{row.companyCode}</div>
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contact",
      cell: ({ row }) => (
        <div>
          <div className="text-sm font-medium">{row.ownerName}</div>
          <div className="text-xs text-slate-500">{row.email}</div>
          <div className="text-xs text-slate-500">{row.phone}</div>
        </div>
      ),
    },
    {
      id: "subscriptionPlan",
      header: "Plan Request",
      cell: ({ row }) => {
        const isPending = row.paymentStatus === "PENDING" || row.paymentStatus !== "SUCCESS";
        return (
          <Badge variant="outline" className={isPending ? "bg-orange-100 text-orange-700 border-none font-medium" : row.subscriptionPlan === "ENTERPRISE" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-700"}>
            {isPending ? "PENDING" : (row.subscriptionPlan || "FREE")}
          </Badge>
        );
      },
    },
    {
      id: "submittedAt",
      header: "Submitted",
      cell: ({ row }) => <span className="text-sm text-slate-600">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        let color = "bg-slate-100 text-slate-700";
        if (row.approvalStatus === "PENDING") color = "bg-orange-100 text-orange-700";
        if (row.approvalStatus === "UNDER_REVIEW") color = "bg-blue-100 text-blue-700";
        if (row.approvalStatus === "APPROVED") color = "bg-green-100 text-green-700";
        if (row.approvalStatus === "REJECTED") color = "bg-red-100 text-red-700";
        
        return <Badge variant="outline" className={`${color} border-none`}>{row.approvalStatus || "PENDING"}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" title="View Details" onClick={() => navigate(`/master-admin/company-approvals/${row._id}`)}>
            <Eye className="w-4 h-4 text-primary" />
          </Button>
          {/* Quick approve/reject removed to enforce document preview inside details page */}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Company Approvals</h1>
        <p className="text-muted-foreground mt-2">
          Review, verify, and approve new company registrations.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Approvals"
          value={stats?.data?.pending || 0}
          icon={Clock}
          accent="amber"
        />
        <StatCard
          title="Under Review"
          value={stats?.data?.underReview || 0}
          icon={FileCheck}
          accent="slate"
        />
        <StatCard
          title="Approved Today"
          value={stats?.data?.approvedToday || 0}
          icon={CheckCircle}
          accent="green"
        />
        <StatCard
          title="Rejected Today"
          value={stats?.data?.rejectedToday || 0}
          icon={XSquare}
          accent="red"
        />
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="p-6 pb-4 border-b border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Tabs value={currentTab} onValueChange={(v) => { setCurrentTab(v); setPageIndex(0); }} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="UNDER_REVIEW">Under Review</TabsTrigger>
                <TabsTrigger value="APPROVED">Approved</TabsTrigger>
                <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search by name or code..." 
                  className="pl-9 bg-muted border-border"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="p-6 pt-4">
          {isError ? (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg flex flex-col items-center">
              <AlertCircle className="w-10 h-10 mb-2 opacity-50" />
              Failed to load companies. Please try again.
            </div>
          ) : isLoading && !companiesResponse ? (
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded w-full"></div>
              <div className="h-12 bg-muted/50 animate-pulse rounded w-full"></div>
              <div className="h-12 bg-muted/50 animate-pulse rounded w-full"></div>
            </div>
          ) : (
            <>
              {(!companiesResponse?.data || companiesResponse.data.length === 0) ? (
                <div className="p-12 text-center text-muted-foreground bg-muted/30 rounded-lg border border-border border-dashed flex flex-col items-center">
                  <FileCheck className="w-12 h-12 mb-3 text-muted-foreground/50" />
                  <p className="text-lg font-medium text-foreground">No records found</p>
                  <p className="text-sm">There are no companies in {currentTab.toLowerCase().replace('_', ' ')} status.</p>
                </div>
              ) : (
                <GenericDataTable 
                  columns={columns} 
                  data={companiesResponse.data} 
                  keyExtractor={(item) => item._id} 
                />
              )}
              
              {companiesResponse?.pagination && companiesResponse.pagination.total > 0 && (
                <div className="mt-4">
                  <GenericPagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={companiesResponse.pagination.total}
                    onPageChange={setPageIndex}
                    onPageSizeChange={(size) => {
                      setPageSize(size);
                      setPageIndex(0);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
