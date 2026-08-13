import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RefreshCw, Download, Edit, Eye, Shield, Trash2, ShieldCheck, Copy, CheckCircle2, XCircle } from "lucide-react";
import type { TableColumn } from "@/shared/types";
import { useConfirm } from "@/providers/ConfirmProvider";
import { useRoles, useDeleteRole, useUpdateRoleStatus, useRoleStatistics, useCloneRole } from "../hooks/role.hooks";
import type { Role, RoleStatus } from "../types/role.types";
import { RoleFilters } from "../components/RoleFilters";
import { GenericEmptyState } from "@/shared/components/empty-state/EmptyStateComponents";

const STATUS_VARIANT: Record<RoleStatus, "default" | "secondary" | "destructive" | "outline"> = {
  ACTIVE: "default",
  INACTIVE: "secondary",
};

export const RoleListPage = () => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  
  const confirm = useConfirm();

  const { data: rolesResponse, isLoading, isError, refetch } = useRoles({
    page: pageIndex + 1,
    limit: pageSize,
    ...filters,
  });

  const { data: statsResponse } = useRoleStatistics();
  const { mutate: deleteRole } = useDeleteRole();
  const { mutate: updateStatus } = useUpdateRoleStatus();
  const { mutate: cloneRole } = useCloneRole();

  const stats = statsResponse?.data;

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setPageIndex(0);
  }, []);

  const handleRefresh = () => {
    refetch();
  };

  const handleExportCSV = () => {
    if (!rolesResponse?.data || rolesResponse.data.length === 0) return;
    
    const headers = ["Role Name", "Display Name", "Description", "System Role", "Status", "Created Date", "Permissions Count"];
    const rows = rolesResponse.data.map(role => [
      role.name,
      role.displayName,
      role.description || "",
      role.isSystem ? "Yes" : "No",
      role.status,
      new Date(role.createdAt).toLocaleDateString(),
      role.permissions?.length || 0
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "roles_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystem) {
      // Should ideally use a toast to notify, but confirm will do for now
      await confirm(`Cannot delete system role: ${role.displayName}`);
      return;
    }
    if (await confirm(`Are you sure you want to delete the role ${role.displayName}?`)) {
      deleteRole(role._id);
    }
  };

  const handleClone = async (role: Role) => {
    const timestamp = Date.now().toString().slice(-4);
    const cloneName = `${role.name}_COPY_${timestamp}`;
    const cloneCode = `${role.roleCode || role.name.toUpperCase()}_COPY_${timestamp}`;
    if (await confirm(`Are you sure you want to duplicate role ${role.displayName}?`)) {
      cloneRole({
        id: role._id,
        payload: {
          name: cloneName,
          displayName: `${role.displayName} (Copy)`,
          roleCode: cloneCode,
          description: `Cloned from ${role.displayName}`,
        },
      });
    }
  };

  const handleStatusToggle = async (role: Role) => {
    if (role.isSystem) {
      await confirm(`Cannot change status of system role: ${role.displayName}`);
      return;
    }
    const newStatus = role.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (await confirm(`Set ${role.displayName} to ${newStatus}?`)) {
      updateStatus({ id: role._id, status: newStatus });
    }
  };

  const columns: TableColumn<Role>[] = [
    {
      id: "name",
      header: "Role Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg flex items-center justify-center border" 
            style={{ 
              backgroundColor: row.color ? `${row.color}15` : '#3b82f615',
              borderColor: row.color ? `${row.color}30` : '#3b82f630'
            }}
          >
            <Shield className="w-4 h-4" style={{ color: row.color || '#3b82f6' }} />
          </div>
          <div>
            <div className="font-medium text-slate-900 flex items-center gap-2">
              <span>{row.name}</span>
              {row.roleType && row.roleType !== "CUSTOM" && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-semibold uppercase tracking-wider border-primary/20 bg-primary/5 text-primary">
                  {row.roleType}
                </Badge>
              )}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <span>{row.displayName}</span>
              <span className="text-slate-300">•</span>
              <span className="font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                {row.category || "CUSTOM"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">
                Lvl {row.hierarchyLevel ?? 0}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-slate-600 line-clamp-1 max-w-[200px]">
          {row.description || "—"}
        </span>
      ),
    },
    {
      id: "isSystem",
      header: "System Role",
      cell: ({ row }) => (
        row.isSystem ? (
          <Badge variant="secondary" className="flex w-fit items-center gap-1 bg-slate-100 text-slate-700">
            <ShieldCheck className="w-3 h-3" /> Yes
          </Badge>
        ) : (
          <span className="text-slate-500 text-sm">No</span>
        )
      ),
    },
    {
      id: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded-md text-slate-600">
          {row.permissions?.length || 0}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.status] || "default"}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Created Date",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(row.createdAt))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" title="View Details" onClick={() => navigate(`/master-admin/roles/${row._id}`)}>
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          <Button variant="ghost" size="icon" title="Edit Role" onClick={() => navigate(`/master-admin/roles/${row._id}/edit`)}>
            <Edit className="w-4 h-4 text-slate-500" />
          </Button>
          <Button variant="ghost" size="icon" title="Duplicate" onClick={() => handleClone(row)}>
            <Copy className="w-4 h-4 text-slate-500" />
          </Button>
          {!row.isSystem && (
            <>
              <Button
                variant="ghost"
                size="icon"
                title={row.status === "ACTIVE" ? "Deactivate" : "Activate"}
                onClick={() => handleStatusToggle(row)}
              >
                {row.status === 'ACTIVE' ? (
                  <XCircle className="w-4 h-4 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Delete Role"
                onClick={() => handleDelete(row)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Roles & Permissions</h1>
          <p className="text-slate-500 mt-2">
            Manage system roles and access controls.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCSV} disabled={!rolesResponse?.data?.length}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total Roles", value: stats?.total ?? "—" },
          { label: "Active", value: stats?.active ?? "—" },
          { label: "Inactive", value: stats?.inactive ?? "—" },
          { label: "System Roles", value: stats?.systemRoles ?? "—" },
          { label: "Custom Roles", value: stats?.customRoles ?? "—" },
        ].map((stat) => (
          <Card key={stat.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-sm font-medium text-slate-500 mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <RoleFilters filters={filters} onFilterChange={handleFilterChange} />
          
          {isError ? (
            <GenericEmptyState 
              icon="alert" 
              title="Failed to Load Roles" 
              description="There was a problem loading the roles. Please try again." 
              actionLabel="Retry"
              onAction={handleRefresh}
            />
          ) : isLoading && !rolesResponse ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : (
            <>
              {(!rolesResponse?.data || rolesResponse.data.length === 0) && (
                <GenericEmptyState 
                  icon={Object.keys(filters).length > 0 ? "search" : "shield"} 
                  title="No Roles Found" 
                  description={Object.keys(filters).length > 0 
                    ? "No roles match your current filter criteria." 
                    : "There are no roles in the system yet."} 
                  actionLabel={Object.keys(filters).length > 0 ? "Clear Filters" : undefined}
                  onAction={Object.keys(filters).length > 0 ? () => setFilters({}) : undefined}
                />
              )}
              {rolesResponse?.data && rolesResponse.data.length > 0 && (
                <div className="overflow-x-auto rounded-md border border-slate-200">
                  <GenericDataTable
                    columns={columns}
                    data={rolesResponse.data}
                    keyExtractor={(item) => item._id}
                  />
                </div>
              )}
              {rolesResponse?.pagination && rolesResponse.pagination.total > 0 && (
                <div className="mt-6">
                  <GenericPagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={rolesResponse.pagination.total}
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
