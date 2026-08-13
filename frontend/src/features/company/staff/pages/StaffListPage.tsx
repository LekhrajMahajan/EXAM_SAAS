import { useState } from "react";
import { StaffHeader } from "../components/StaffHeader";
import { StaffFilters } from "../components/StaffFilters";
import { StaffTable } from "../components/StaffTable";
import { StaffViewDialog } from "../components/StaffViewDialog";
import { StaffEditDialog } from "../components/StaffEditDialog";
import { Button } from "@/shared/components/ui/button";
import { Plus, Download, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useStaffList } from "../hooks/staff.hooks";
import { staffApi } from "../api/staff.api";
import type { Staff } from "../types/staff.types";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { toast } from "@/hooks/use-toast";

export const StaffListPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [viewedStaff, setViewedStaff] = useState<Staff | null>(null);
  const [editedStaff, setEditedStaff] = useState<Staff | null>(null);

  const { data: response, isLoading, refetch } = useStaffList({ page, limit, excludeRole: 'PAPER_SETTER' });
  const rawData = response?.data;
  let staffList: Staff[] = Array.isArray(rawData) ? rawData : rawData?.data || [];
  
  // Client-side fallback filter just in case the API does not support excludeRole yet
  staffList = staffList.filter(s => s.role !== 'PAPER_SETTER');

  const totalCount = (!Array.isArray(rawData) && rawData?.total) ? rawData.total : staffList.length;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await staffApi.exportStaff({ page: 1, limit: 1000 }, 'xlsx');
      toast({ title: 'Export Initiated', description: 'Employee data export started.', variant: 'success' });
    } catch {
      toast({ title: 'Export Failed', description: 'Could not export employee report.', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleToggleStatus = async (staff: Staff) => {
    try {
      const staffId = staff.id || staff._id;
      if (!staffId) return;
      const newStatus = staff.status.toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await staffApi.updateStatus(staffId, newStatus);
      toast({ title: 'Status Updated', description: `Employee status changed to ${newStatus}.`, variant: 'success' });
      refetch();
    } catch (err) {
      toast({ title: 'Update Failed', description: 'Could not update employee status.', variant: 'destructive' });
    }
  };

  const handleDelete = async (staff: Staff) => {
    if (confirm(`Are you sure you want to delete ${staff.firstName} ${staff.lastName}? This will permanently remove their access.`)) {
      try {
        const staffId = staff.id || staff._id;
        if (!staffId) return;
        await staffApi.delete(staffId);
        toast({ title: 'Employee Deleted', description: 'Employee has been removed successfully.', variant: 'success' });
        refetch();
      } catch (err) {
        toast({ title: 'Delete Failed', description: 'Could not delete employee.', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-6 p-6">
      <StaffHeader
        title="Employee & Staff Management"
        description="Manage your employees, roles, permissions, and shift assignments."
        actions={
          <>
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Link to="/company/staff/create">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Roles
              </Button>
            </Link>
          </>
        }
      />

      <StaffFilters />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64 border rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <StaffTable 
          staffList={staffList} 
          onView={setViewedStaff}
          onEdit={setEditedStaff}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      )}
      
      {totalCount > 0 && (
        <GenericPagination
          pageIndex={page - 1}
          pageSize={limit}
          totalCount={totalCount}
          onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
          onPageSizeChange={setLimit}
        />
      )}

      <StaffViewDialog 
        staff={viewedStaff}
        isOpen={!!viewedStaff}
        onClose={() => setViewedStaff(null)}
      />

      <StaffEditDialog
        staff={editedStaff}
        isOpen={!!editedStaff}
        onClose={() => setEditedStaff(null)}
        onSuccess={() => {
          setEditedStaff(null);
          refetch();
        }}
      />
    </div>
  );
};


