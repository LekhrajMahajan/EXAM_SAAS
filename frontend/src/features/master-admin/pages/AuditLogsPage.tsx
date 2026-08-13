import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import type { TableColumn } from "@/shared/types";
import { useAuditLogs } from "../hooks/audit-log.hooks";
import type { AuditLog, AuditSeverity, AuditStatus } from "../types/audit-log.types";

const SEVERITY_VARIANT: Record<AuditSeverity, "default" | "secondary" | "destructive" | "outline"> = {
  LOW: "secondary",
  MEDIUM: "default",
  HIGH: "outline",
  CRITICAL: "destructive",
};

const STATUS_VARIANT: Record<AuditStatus, "default" | "destructive"> = {
  SUCCESS: "default",
  FAILED: "destructive",
};

export const AuditLogsPage = ({ isTab = false }: { isTab?: boolean }) => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);

  const { data: auditLogsResponse, isLoading, isError } = useAuditLogs({
    page: pageIndex + 1,
    limit: pageSize,
    search: search || undefined,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPageIndex(0);
  };

  const columns: TableColumn<AuditLog>[] = [
    {
      id: "action",
      header: "Action",
      accessorKey: "action",
      cell: ({ row }) => <span className="font-semibold">{row.action}</span>,
    },
    {
      id: "module",
      header: "Module",
      accessorKey: "module",
      cell: ({ row }) => <span className="text-slate-600">{row.module}</span>,
    },
    {
      id: "description",
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => <span className="text-sm">{row.description}</span>,
    },
    {
      id: "severity",
      header: "Severity",
      accessorKey: "severity",
      cell: ({ row }) => (
        <Badge variant={SEVERITY_VARIANT[row.severity] ?? "outline"}>
          {row.severity}
        </Badge>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.status] ?? "outline"}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: "createdAt",
      header: "Timestamp",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500">
          {new Intl.DateTimeFormat("en-US", {
            month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric"
          }).format(new Date(row.createdAt))}
        </span>
      ),
    },
  ];

  return (
    <div className={isTab ? "space-y-6" : "space-y-6 p-6 pb-24 max-w-[1600px] mx-auto"}>
      {!isTab && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground mt-2">
              View system-wide audit logs and actions.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Audit Logs Overview</CardTitle>
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-9 bg-slate-50"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary">Search</Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          {isError ? (
            <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg">
              Failed to load audit logs. Please try again.
            </div>
          ) : isLoading && !auditLogsResponse ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <>
              {(!auditLogsResponse?.data || auditLogsResponse.data.length === 0) && (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed">
                  No audit logs found.
                </div>
              )}
              {auditLogsResponse?.data && auditLogsResponse.data.length > 0 && (
                <GenericDataTable
                  columns={columns}
                  data={auditLogsResponse.data}
                  keyExtractor={(item) => item._id}
                />
              )}
              {auditLogsResponse?.pagination && auditLogsResponse.pagination.total > 0 && (
                <GenericPagination
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  totalCount={auditLogsResponse.pagination.total}
                  onPageChange={setPageIndex}
                  onPageSizeChange={(size) => { setPageSize(size); setPageIndex(0); }}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
