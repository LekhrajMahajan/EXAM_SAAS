import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard';
import { Card, CardContent } from "@/shared/components/ui/card";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RefreshCw, Download, Eye, Shield, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import type { TableColumn } from "@/shared/types";
import { useEmployees, useEmployeeStatistics } from "../hooks/employee.hooks";
import type { Employee, EmployeeStatus } from "../types/employee.types";
import { SystemUsersFilters } from "../components/SystemUsersFilters";
import { GenericEmptyState } from "@/shared/components/empty-state/EmptyStateComponents";

const STATUS_VARIANT: Record<EmployeeStatus, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
  SUSPENDED: "destructive",
  LOCKED: "destructive",
  TERMINATED: "outline",
};

export const SystemUsersPage = ({ isTab = false }: { isTab?: boolean }) => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  

  


  const { data: employeesResponse, isLoading, isError, refetch } = useEmployees({
    page: pageIndex + 1,
    limit: pageSize,
    ...filters,
  });

  const { data: statsResponse, refetch: refetchStats } = useEmployeeStatistics();


  const stats = statsResponse?.data;

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setPageIndex(0); // reset to first page on filter change
  }, []);

  const handleRefresh = () => {
    refetch();
    refetchStats();
  };

  const handleExportCSV = () => {
    if (!employeesResponse?.data || employeesResponse.data.length === 0) return;
    
    const headers = ["Employee ID", "Name", "Email", "Mobile", "Role", "Department", "Status", "Joined"];
    const escapeCsv = (str: string) => `"${String(str).replace(/"/g, '""')}"`;
    const rows = employeesResponse.data.map(emp => [
      escapeCsv(emp.employeeCode),
      escapeCsv(`${emp.firstName} ${emp.lastName}`),
      escapeCsv(emp.email),
      escapeCsv(emp.phone),
      escapeCsv(emp.role),
      escapeCsv(emp.department),
      escapeCsv(emp.status),
      escapeCsv(new Date(emp.createdAt).toLocaleDateString())
    ]);
    
    const csvContent = [headers.map(escapeCsv).join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "system_users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const columns: TableColumn<Employee>[] = [
    {
      id: "avatar",
      header: "",
      accessorKey: "_id",
      cell: ({ row }) => {
        const firstName = row.firstName || (row.userId as any)?.firstName || "";
        const lastName = row.lastName || (row.userId as any)?.lastName || "";
        return (
          <Avatar className="w-10 h-10 border">
            <AvatarImage src={(row.userId as any)?.profileImage || row.profileImage} alt={firstName} />
            <AvatarFallback className="bg-slate-100 text-slate-600 font-semibold">
              {firstName?.[0] || ""}{lastName?.[0] || ""}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      id: "employeeCode",
      header: "Employee ID",
      accessorKey: "employeeCode",
      cell: ({ row }) => <span className="font-mono text-sm font-medium text-slate-700 dark:text-foreground">{row.employeeCode}</span>,
    },
    {
      id: "name",
      header: "Full Name",
      accessorKey: "firstName",
      cell: ({ row }) => {
        const firstName = row.firstName || (row.userId as any)?.firstName || "";
        const lastName = row.lastName || (row.userId as any)?.lastName || "";
        return (
          <div>
            <div className="font-semibold text-slate-900">{firstName} {lastName}</div>
          </div>
        );
      },
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => <span className="text-sm text-slate-500">{row.email || (row.userId as any)?.email}</span>,
    },
    {
      id: "phone",
      header: "Mobile",
      accessorKey: "phone",
      cell: ({ row }) => <span className="text-slate-600 dark:text-foreground">{row.phone || (row.userId as any)?.phone}</span>,
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => (
        <Badge variant="outline" className="flex items-center gap-1 w-fit bg-slate-50 text-slate-700 border-slate-200">
          <Shield className="w-3 h-3 text-slate-400" />
          {row.role || (row.userId as any)?.role || "N/A"}
        </Badge>
      ),
    },
    {
      id: "company",
      header: "Company",
      accessorKey: "companyId",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700 dark:text-foreground">
          {(row.companyId as any)?.companyName || "N/A"}
        </span>
      ),
    },
    {
      id: "branch",
      header: "Branch",
      accessorKey: "department", // Using department since we don't have branch
      cell: () => <span className="text-slate-400 text-sm italic">N/A</span>,
    },
    {
      id: "department",
      header: "Department",
      accessorKey: "department",
      cell: ({ row }) => <span className="text-slate-600 dark:text-foreground">{row.department}</span>,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        if (row.status === "ACTIVE") {
          return (
            <Badge className="bg-[#E4FD97] text-[#2D3E2C] border-0 hover:bg-[#E4FD97]/90">
              {row.status}
            </Badge>
          );
        }
        return (
          <Badge variant={STATUS_VARIANT[row.status] ?? "outline"}>
            {row.status}
          </Badge>
        );
      },
    },
    {
      id: "lastLogin",
      header: "Last Login",
      accessorKey: "_id",
      cell: ({ row }) => {
        const lastLogin = (row.userId as any)?.lastLoginAt;
        const isValidDate = lastLogin && !isNaN(new Date(lastLogin).getTime());
        return (
          <span className="text-sm text-slate-500">
            {isValidDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(lastLogin)) : "Never"}
          </span>
        );
      },
    },
    {
      id: "createdAt",
      header: "Created Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const isValidDate = row.createdAt && !isNaN(new Date(row.createdAt).getTime());
        return (
          <span className="text-sm text-slate-500">
            {isValidDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(row.createdAt)) : "—"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon" title="View Details" onClick={() => navigate(`/master-admin/access-management/users/${row._id}`)} className="hover:bg-[#2D3E2C]/10 icon-bright-btn">
              <Eye className="w-4 h-4 text-[#2D3E2C] icon-bright" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className={isTab ? "space-y-6" : "space-y-6 p-6 pb-24 max-w-[1600px] mx-auto"}>
      {!isTab && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Users</h1>
            <p className="text-slate-500 mt-2">
              Manage all platform users, roles, and access controls.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary qa-button">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportCSV} disabled={!employeesResponse?.data?.length} className="border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary qa-button">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      )}

      {isTab && (
        <div className="flex justify-end items-center gap-2 mb-4">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading} className="border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary qa-button">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={!employeesResponse?.data?.length} className="border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary qa-button">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.total ?? "—"}
          icon={Users}
          accent="slate"
        />
        <StatCard
          title="Active"
          value={stats?.active ?? "—"}
          icon={CheckCircle}
          accent="green"
        />
        <StatCard
          title="Inactive"
          value={stats?.inactive ?? "—"}
          icon={Clock}
          accent="amber"
        />
        <StatCard
          title="Suspended"
          value={stats?.suspended ?? "—"}
          icon={XCircle}
          accent="red"
        />
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <SystemUsersFilters filters={filters} onFilterChange={handleFilterChange} />
          
          {isError ? (
            <GenericEmptyState 
              icon="alert" 
              title="Failed to Load Users" 
              description="There was a problem loading the system users. Please try again." 
              actionLabel="Retry"
              onAction={handleRefresh}
            />
          ) : isLoading && !employeesResponse ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : (
            <>
              {(!employeesResponse?.data || employeesResponse.data.length === 0) && (
                <GenericEmptyState 
                  icon={Object.keys(filters).length > 0 ? "search" : "inbox"} 
                  title="No Users Found" 
                  description={Object.keys(filters).length > 0 
                    ? "No users match your current filter criteria." 
                    : "There are no users in the system yet."} 
                  actionLabel={Object.keys(filters).length > 0 ? "Clear Filters" : undefined}
                  onAction={Object.keys(filters).length > 0 ? () => setFilters({}) : undefined}
                />
              )}
              {employeesResponse?.data && employeesResponse.data.length > 0 && (
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <GenericDataTable
                    columns={columns}
                    data={employeesResponse.data}
                    keyExtractor={(item) => item._id}
                  />
                </div>
              )}
              {employeesResponse?.pagination && employeesResponse.pagination.total > 0 && (
                <div className="mt-6">
                  <GenericPagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={employeesResponse.pagination.total}
                    onPageChange={setPageIndex}
                    onPageSizeChange={(size) => { setPageSize(size); setPageIndex(0); }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>


    </div>
  );
};
