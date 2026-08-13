import { Button } from "@/shared/components/ui/button";
import { Plus, Download, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { BranchHeader } from "../components/BranchHeader";
import { BranchFilters } from "../components/BranchFilters";
import { BranchTable } from "../components/BranchTable";
import { useBranches } from "../hooks/branch.hooks";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { toast } from "@/hooks/use-toast";
import type { Branch } from "../types/branch.types";

export const BranchListPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  
  const { data: response, isLoading, isFetching, refetch } = useBranches({
    page,
    limit,
    search: search ? search : undefined,
    status: status !== "all" ? (status.toUpperCase() as "ACTIVE" | "INACTIVE") : undefined,
    state: stateFilter !== "all" ? stateFilter : undefined,
    city: cityFilter !== "all" ? cityFilter : undefined,
  });

  const branches: Branch[] = useMemo(() => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resAny = response as any;
    if (resAny.data?.branches) return resAny.data.branches;
    if (resAny.branches) return resAny.branches;
    return [];
  }, [response]);

  const meta = useMemo(() => {
    if (response?.meta) return response.meta;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resAny = response as any;
    return {
      total: resAny?.data?.total ?? resAny?.total ?? branches.length,
      page: resAny?.data?.page ?? resAny?.page ?? page,
      limit: resAny?.data?.limit ?? resAny?.limit ?? limit,
      totalPages: resAny?.data?.totalPages ?? resAny?.totalPages ?? 1,
    };
  }, [response, branches.length, page, limit]);

  // Extract available states and cities dynamically from the loaded branches
  const statesList = useMemo(() => {
    const set = new Set<string>();
    branches.forEach((b) => b.state && set.add(b.state));
    return Array.from(set);
  }, [branches]);

  const citiesList = useMemo(() => {
    const set = new Set<string>();
    branches.forEach((b) => b.city && set.add(b.city));
    return Array.from(set);
  }, [branches]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setStateFilter("all");
    setCityFilter("all");
    setPage(1);
  };

  const handleExport = () => {
    if (!branches || branches.length === 0) {
      toast({
        title: "No Data",
        description: "No branch records available to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "Branch Code",
      "Branch Name",
      "Type",
      "City",
      "State",
      "Contact Person",
      "Email",
      "Phone",
      "Total Labs",
      "Total Systems",
      "Status",
      "Created Date"
    ];

    const rows = branches.map((b) => {
      const bAny = b as unknown as Record<string, string | undefined>;
      return [
        b.branchCode || "",
        `"${(b.branchName || "").replace(/"/g, '""')}"`,
        b.branchType || "Branch",
        `"${(b.city || "").replace(/"/g, '""')}"`,
        `"${(b.state || "").replace(/"/g, '""')}"`,
        `"${(String(b.managerName || bAny.contactPerson || bAny.headName || "N/A")).replace(/"/g, '""')}"`,
        b.email || bAny.contactEmail || bAny.headEmail || "N/A",
        b.phone || bAny.contactMobile || bAny.headMobile || "N/A",
        b.totalLabs ?? 0,
        b.totalSystems ?? 0,
        b.status || "ACTIVE",
        b.createdAt ? new Date(String(b.createdAt)).toLocaleDateString() : ""
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `branches_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Successfully exported ${branches.length} branches to Excel/CSV.`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 p-6">
      <BranchHeader
        title="Branches"
        description="Manage all your company branches and centers."
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isFetching || isLoading}
              onClick={async () => { 
                await refetch();
                toast({ title: "Success", description: "Branches list refreshed successfully", variant: "success" });
              }}
              className="hidden md:flex border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-all duration-200" 
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin text-emerald-500" : ""}`} />
              {isFetching ? "Refreshing..." : "Refresh"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport}
              className="hidden md:flex border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2 text-blue-500" />
              Export
            </Button>
            <Link to="/company/branches/create">
              <Button size="sm" className="bg-[#2D3E2C] text-white hover:bg-[#2D3E2C]/90 dark:bg-[#E4FD97] dark:text-[#2D3E2C] dark:hover:bg-[#E4FD97]/90 font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </Button>
            </Link>
          </>
        }
      />

      <BranchFilters
        search={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        status={status}
        onStatusChange={(val) => { setStatus(val); setPage(1); }}
        state={stateFilter}
        onStateChange={(val) => { setStateFilter(val); setPage(1); }}
        city={cityFilter}
        onCityChange={(val) => { setCityFilter(val); setPage(1); }}
        onReset={handleResetFilters}
        statesList={statesList}
        citiesList={citiesList}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64 border border-slate-200 dark:border-slate-800 rounded-xl bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <BranchTable branches={branches} />
      )}
      
      {meta && (
        <GenericPagination
          pageIndex={meta.page - 1}
          pageSize={meta.limit}
          totalCount={meta.total}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onPageSizeChange={setLimit}
        />
      )}
    </div>
  );
};
