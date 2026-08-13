import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useConfirm } from "@/providers/ConfirmProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search, Trash2, RotateCcw, ShieldCheck, Plus, Eye, Edit3, Lock, Filter } from "lucide-react";
import type { TableColumn } from "@/shared/types";

import { usePermissions, useDeletePermission, useUpdatePermissionStatus, usePermissionStatistics } from "../hooks/permission.hooks";
import type { Permission } from "../types/permission.types";
import { GROUPS_LIST, CATEGORIES_LIST } from "../types/permission.types";
import { PermissionModal } from "../components/permissions/PermissionModal";

const ACTION_COLOR: Record<string, string> = {
  CREATE: "bg-green-100 text-green-700 border-green-200",
  READ: "bg-blue-100 text-blue-700 border-blue-200",
  VIEW: "bg-blue-100 text-blue-700 border-blue-200",
  UPDATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  ASSIGN: "bg-purple-100 text-purple-700 border-purple-200",
  APPROVE: "bg-teal-100 text-teal-700 border-teal-200",
  MANAGE: "bg-orange-100 text-orange-700 border-orange-200",
  IMPORT: "bg-indigo-100 text-indigo-700 border-indigo-200",
  EXPORT: "bg-cyan-100 text-cyan-700 border-cyan-200",
  GENERATE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DOWNLOAD: "bg-cyan-100 text-cyan-700 border-cyan-200",
  VERIFY: "bg-violet-100 text-violet-700 border-violet-200",
  PUBLISH: "bg-amber-100 text-amber-700 border-amber-200",
};

export const PermissionsPage = ({ isTab = false }: { isTab?: boolean }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePermission, setActivePermission] = useState<Permission | null>(null);

  const { toast } = useToast();
  const confirm = useConfirm();

  const { data: permissionsResponse, isLoading, isError } = usePermissions({
    page: pageIndex + 1,
    limit: pageSize,
    search: search || undefined,
    group: selectedGroup !== "ALL" ? selectedGroup : undefined,
    category: selectedCategory !== "ALL" ? selectedCategory : undefined,
    status: selectedStatus !== "ALL" ? selectedStatus : undefined,
  });

  const { data: statsResponse } = usePermissionStatistics();
  const { mutateAsync: deletePermission } = useDeletePermission();
  const { mutateAsync: updateStatus } = useUpdatePermissionStatus();

  const stats = statsResponse?.data;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPageIndex(0);
  };

  const handleOpenCreate = () => {
    setActivePermission(null);
    setIsModalOpen(true);
  };

  const handleOpenViewOrEdit = (perm: Permission) => {
    setActivePermission(perm);
    setIsModalOpen(true);
  };

  const handleDelete = async (permission: Permission) => {
    if (permission.isSystem || permission.isSystemPermission) {
      toast({ title: "Action denied", description: "System permissions are immutable and cannot be deleted.", variant: "destructive" });
      return;
    }
    if (await confirm(`Are you sure you want to soft delete permission "${permission.displayName}"?`)) {
      await deletePermission(permission._id);
    }
  };

  const handleStatusToggle = async (permission: Permission) => {
    if (permission.isSystem || permission.isSystemPermission) {
      toast({ title: "Action denied", description: "System permissions status cannot be changed.", variant: "destructive" });
      return;
    }
    const newStatus = permission.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    if (await confirm(`Set permission "${permission.displayName}" to ${newStatus}?`)) {
      await updateStatus({ id: permission._id, status: newStatus });
    }
  };

  const columns: TableColumn<Permission>[] = [
    {
      id: "displayName",
      header: "Permission & Identifier",
      accessorKey: "displayName",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${row.isSystem || row.isSystemPermission ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>
            {row.isSystem || row.isSystemPermission ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-2">
              {row.displayName}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {row.permissionKey || row.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "group",
      header: "Group Area",
      accessorKey: "group",
      cell: ({ row }) => (
        <Badge variant="outline" className="bg-slate-50 font-medium text-slate-700">
          {row.group || row.module}
        </Badge>
      ),
    },
    {
      id: "module",
      header: "Module",
      accessorKey: "module",
      cell: ({ row }) => (
        <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
          {row.module}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-bold font-mono ${ACTION_COLOR[row.action] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
          {row.action}
        </span>
      ),
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-[11px]">
          {row.category || "CORE"}
        </Badge>
      ),
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "isSystem",
      cell: ({ row }) => (
        <Badge variant={row.isSystem || row.isSystemPermission ? "default" : "secondary"} className={row.isSystem || row.isSystemPermission ? "bg-amber-600 text-white hover:bg-amber-700" : ""}>
          {row.isSystem || row.isSystemPermission ? "System Lock" : "Custom"}
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge variant={row.status === "ACTIVE" ? "default" : "destructive"} className={row.status === "ACTIVE" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            title={row.isSystem || row.isSystemPermission ? "View Details" : "Edit Permission"}
            onClick={() => handleOpenViewOrEdit(row)}
            className="hover:bg-blue-50 text-slate-600 hover:text-blue-600"
          >
            {row.isSystem || row.isSystemPermission ? <Eye className="w-4 h-4 text-blue-600" /> : <Edit3 className="w-4 h-4 text-blue-600" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title={row.status === "ACTIVE" ? "Deactivate" : "Activate"}
            onClick={() => handleStatusToggle(row)}
            disabled={row.isSystem || row.isSystemPermission}
            className="hover:bg-amber-50"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Delete Permission"
            onClick={() => handleDelete(row)}
            disabled={row.isSystem || row.isSystemPermission}
            className="hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={isTab ? "space-y-6" : "space-y-6 p-6 pb-24 max-w-[1600px] mx-auto"}>
      {!isTab && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-linear-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-indigo-200 border border-white/15 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Enterprise RBAC Core Registry
            </div>
            <h1 className="text-3xl font-black tracking-tight">Granular Permission Management</h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
              Centralized platform dictionary governing API endpoints, HTTP verbs, and UI access rights across 28 distinct functional groups.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="bg-white text-slate-900 hover:bg-slate-100 font-bold shadow-md shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Add Custom Permission
          </Button>
        </div>
      )}

      {isTab && (
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Platform Permissions Dictionary</h2>
            <p className="text-xs text-muted-foreground">Manage granular RBAC rules across all system features and modules.</p>
          </div>
          <Button onClick={handleOpenCreate} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
            <Plus className="w-4 h-4 mr-1.5" /> Add Permission
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total Permissions", value: stats?.total ?? "—", color: "border-l-4 border-blue-500" },
          { label: "Active Access Rules", value: stats?.active ?? "—", color: "border-l-4 border-emerald-500" },
          { label: "Inactive / Suspended", value: stats?.inactive ?? "—", color: "border-l-4 border-red-500" },
          { label: "Locked System Rules", value: stats?.systemPermissions ?? "—", color: "border-l-4 border-amber-500" },
          { label: "Custom Tenant Rules", value: stats?.customPermissions ?? "—", color: "border-l-4 border-purple-500" },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.color} shadow-sm bg-white`}>
            <CardContent className="p-4">
              <div className="text-2xl font-black text-slate-800">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Pills Filter */}
      <Card className="p-3 bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Filter By Functional Group (28 Areas)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-2">
          <button
            type="button"
            onClick={() => { setSelectedGroup("ALL"); setPageIndex(0); }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedGroup === "ALL" ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
          >
            All Groups
          </button>
          {GROUPS_LIST.map((grp) => (
            <button
              key={grp}
              type="button"
              onClick={() => { setSelectedGroup(grp); setPageIndex(0); }}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${selectedGroup === grp ? "bg-indigo-600 text-white shadow-sm font-bold" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
            >
              {grp}
            </button>
          ))}
        </div>
      </Card>

      {/* Main Table Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-bold">
                {selectedGroup === "ALL" ? "All Platform Permissions" : `Group: ${selectedGroup}`}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {permissionsResponse?.data ? permissionsResponse.data.length : 0} of {permissionsResponse?.pagination?.total ?? 0} permission records
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); setPageIndex(0); }}>
                <SelectTrigger className="w-[140px] h-9 text-xs bg-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {CATEGORIES_LIST.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={(val) => { setSelectedStatus(val); setPageIndex(0); }}>
                <SelectTrigger className="w-[120px] h-9 text-xs bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active Only</SelectItem>
                  <SelectItem value="INACTIVE">Inactive Only</SelectItem>
                </SelectContent>
              </Select>

              <form onSubmit={handleSearch} className="flex items-center gap-1.5 w-full sm:w-auto">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by name, key..."
                    className="pl-9 h-9 text-xs bg-slate-50"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" className="h-9 font-bold">Search</Button>
              </form>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isError ? (
            <div className="p-8 text-center text-red-500 bg-red-50 m-4 rounded-lg font-medium">
              Failed to load permissions from enterprise registry. Please verify server connection and try again.
            </div>
          ) : isLoading && !permissionsResponse ? (
            <div className="space-y-3 p-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              {(!permissionsResponse?.data || permissionsResponse.data.length === 0) && (
                <div className="p-12 text-center text-slate-500 bg-slate-50/50 rounded-lg m-6 border border-dashed border-slate-300">
                  <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <div className="font-bold text-slate-700">No matching permissions found</div>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your group filter, category selection, or search keyword.</p>
                </div>
              )}
              {permissionsResponse?.data && permissionsResponse.data.length > 0 && (
                <div className="overflow-x-auto">
                  <GenericDataTable
                    columns={columns}
                    data={permissionsResponse.data}
                    keyExtractor={(item) => item._id}
                  />
                </div>
              )}
              {permissionsResponse?.pagination && permissionsResponse.pagination.total > 0 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                  <GenericPagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={permissionsResponse.pagination.total}
                    onPageChange={setPageIndex}
                    onPageSizeChange={(size) => { setPageSize(size); setPageIndex(0); }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <PermissionModal
        key={activePermission?._id || (isModalOpen ? "open-new" : "closed")}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        permission={activePermission}
      />
    </div>
  );
};
