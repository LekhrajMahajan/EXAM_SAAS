import { useState, useMemo } from "react";
import { CenterHeader } from "../components/CenterHeader";
import { CenterFilters } from "../components/CenterFilters";
import { CenterTable } from "../components/CenterTable";
import { Button } from "@/shared/components/ui/button";
import { Plus, Download, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCenters } from "../hooks/center.hooks";
import type { Center } from "../types/center.types";

export const CenterListPage = () => {
  const { data: response, isLoading, refetch, isRefetching } = useCenters();

  const [search, setSearch] = useState("");
  const [centerFilter, setCenterFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");

  const centersList: Center[] = useMemo(() => {
    if (!response?.data) return [];
    if (Array.isArray(response.data)) return response.data;
    const nestedData = (response.data as Record<string, unknown>).data || (response.data as Record<string, unknown>).centers;
    return Array.isArray(nestedData) ? (nestedData as Center[]) : [];
  }, [response]);

  const filteredCenters = useMemo(() => {
    return centersList.filter(c => {
      if (search && !c.centerName?.toLowerCase().includes(search.toLowerCase()) && !c.centerCode?.toLowerCase().includes(search.toLowerCase())) return false;
      if (centerFilter !== 'all' && c.centerName !== centerFilter) return false;
      if (stateFilter !== 'all' && c.state !== stateFilter) return false;
      if (cityFilter !== 'all' && c.city !== cityFilter) return false;
      
      const statusVal = (c.status || ((c as any).setupStatus === 'ACTIVE' ? 'Active' : 'Inactive')).toLowerCase();
      if (statusFilter !== 'all' && statusVal !== statusFilter) return false;
      
      const approvalVal = (c.approvalStatus || ((c as any).setupStatus === 'ACTIVE' ? 'Approved' : 'Pending')).toLowerCase();
      if (approvalFilter !== 'all' && approvalVal !== approvalFilter) return false;
      
      return true;
    });
  }, [centersList, search, centerFilter, stateFilter, cityFilter, statusFilter, approvalFilter]);

  const handleExport = () => {
    if (!filteredCenters || filteredCenters.length === 0) return;
    const headers = 'Center Code,Center Name,Branch,City,State,Rooms,Systems,Status,Approval Status\n';
    const rows = filteredCenters.map(c => {
      const code = c.centerCode || '';
      const name = `"${(c.centerName || '').replace(/"/g, '""')}"`;
      const branchLabel = typeof c.branch === 'object' && c.branch ? ((c.branch as Record<string, unknown>).name || (c.branch as Record<string, unknown>).branchCode) : (c.branch || (c as unknown as Record<string, unknown>).branchName || '');
      const city = c.city || '';
      const state = c.state || '';
      const rooms = c.capacity?.maxRooms ?? (c as unknown as Record<string, unknown>).totalLabs ?? 0;
      const systems = c.capacity?.maxSystems ?? (c as unknown as Record<string, unknown>).totalSystems ?? 0;
      const status = c.status || ((c as unknown as Record<string, unknown>).setupStatus === 'ACTIVE' ? 'Active' : 'Inactive');
      const approval = c.approvalStatus || ((c as unknown as Record<string, unknown>).setupStatus === 'ACTIVE' ? 'Approved' : 'Pending');
      return `${code},${name},${branchLabel},${city},${state},${rooms},${systems},${status},${approval}`;
    }).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Centers_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 p-6">
      <CenterHeader
        title="Centers"
        description="Manage all your company centers, infrastructure, and capacity."
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors" 
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
            >
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isRefetching ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors"
              onClick={handleExport}
              disabled={!centersList || centersList.length === 0}
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Link to="/company/centers/create">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors font-semibold"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Add Center
              </Button>
            </Link>
          </>
        }
      />

      <CenterFilters 
        centers={centersList}
        search={search}
        onSearchChange={setSearch}
        centerFilter={centerFilter}
        onCenterFilterChange={setCenterFilter}
        stateFilter={stateFilter}
        onStateFilterChange={setStateFilter}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        approvalFilter={approvalFilter}
        onApprovalFilterChange={setApprovalFilter}
      />
      
      {isLoading ? (
        <div className="h-48 flex flex-col items-center justify-center bg-card dark:bg-[#111726] border border-border dark:border-slate-800/80 rounded-xl shadow-xs">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-3" />
          <p className="text-sm text-slate-400 font-medium">Loading centers dynamically...</p>
        </div>
      ) : (
        <>
          <CenterTable centers={filteredCenters} />
          
          <div className="flex items-center justify-between px-2 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredCenters.length > 0 ? 1 : 0} to {filteredCenters.length} of {filteredCenters.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
