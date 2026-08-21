import { useState } from "react";
import { StaffHeader } from "../components/StaffHeader";
import { StaffFilters } from "../components/StaffFilters";
import { StaffTable } from "../components/StaffTable";
import { StaffViewDialog } from "../components/StaffViewDialog";
import { StaffEditDialog } from "../components/StaffEditDialog";
import { Button } from "@/shared/components/ui/button";
import { Plus, Download, RefreshCw, Loader2, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { useStaffList } from "../hooks/staff.hooks";
import { staffApi } from "../api/staff.api";
import type { Staff } from "../types/staff.types";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import { toast } from "@/hooks/use-toast";

export const StaffListPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isExporting, setIsExporting] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [viewedStaff, setViewedStaff] = useState<Staff | null>(null);
  const [editedStaff, setEditedStaff] = useState<Staff | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: response, isLoading, refetch } = useStaffList({ page, limit, excludeRole: 'PAPER_SETTER' });
  const rawData = response?.data;
  let staffList: Staff[] = Array.isArray(rawData) ? rawData : rawData?.data || [];
  
  // Client-side fallback filter just in case the API does not support excludeRole yet
  staffList = staffList.filter(s => s.role !== 'PAPER_SETTER');

  // Role filter implementation
  if (roleFilter !== "all") {
    staffList = staffList.filter(s => 
      s.role.toLowerCase().replace(/_/g, ' ') === roleFilter.toLowerCase().replace(/_/g, ' ')
    );
  }

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
    setStaffToDelete(staff);
  };

  const confirmDelete = async () => {
    if (!staffToDelete) return;
    
    setIsDeleting(true);
    try {
      const staffId = staffToDelete.id || staffToDelete._id;
      if (!staffId) return;
      await staffApi.delete(staffId);
      toast({ title: 'Employee Deleted', description: 'Employee has been removed successfully.', variant: 'success' });
      refetch();
    } catch (err) {
      toast({ title: 'Delete Failed', description: 'Could not delete employee.', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setStaffToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <StaffHeader
        title="Employee & Staff Management"
        description="Manage your employees, roles, permissions, and shift assignments."
        actions={
          <>
            <Button variant="outline" size="sm" className="hidden md:flex bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors" onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Link to="/company/staff/create">
              <Button size="sm" className="bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors font-semibold">
                <Plus className="h-4 w-4 mr-2" />
                Add Roles
              </Button>
            </Link>
          </>
        }
      />

      <StaffFilters 
        roleFilter={roleFilter}
        onRoleChange={setRoleFilter}
      />
      
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

      <Dialog open={!!staffToDelete} onOpenChange={(open) => !open && setStaffToDelete(null)}>
        <DialogContent className="sm:max-w-md border border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-[#0F172A] dark:text-slate-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
              <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400 pt-3 text-base">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-medium">{staffToDelete?.firstName} {staffToDelete?.lastName}</strong>? This will permanently remove their access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStaffToDelete(null)}
              disabled={isDeleting}
              className="bg-transparent border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#1f2b1e]"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isDeleting ? "Deleting..." : "Delete Employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};


