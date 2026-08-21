import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Edit, Eye, Power, Trash2 } from "lucide-react";
import { StaffStatusBadge } from "./StaffStatusBadge";
import type { Staff } from "../types/staff.types";

interface StaffTableProps {
  staffList: Staff[];
  onView?: (staff: Staff) => void;
  onEdit?: (staff: Staff) => void;
  onToggleStatus?: (staff: Staff) => void;
  onDelete?: (staff: Staff) => void;
  variant?: 'default' | 'paper-setter';
}

export const StaffTable = ({ staffList, onView, onEdit, onToggleStatus, onDelete, variant = 'default' }: StaffTableProps) => {
  return (
    <div className="rounded-md border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              {variant !== 'paper-setter' && <TableHead>Role</TableHead>}
              <TableHead>Email ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffList.map((staff) => {
              const staffId = staff.id || staff._id;
              return (
              <TableRow key={staffId}>
                <TableCell>
                  <div className="font-medium text-primary">
                    {staff.firstName} {staff.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">{staff.employeeCode}</div>
                </TableCell>
                {variant !== 'paper-setter' && (
                  <TableCell>
                    <div className="font-medium">{staff.role}</div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="text-sm font-medium">{staff.email}</div>
                </TableCell>
                <TableCell>
                  <StaffStatusBadge status={staff.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(staff.lastLogin || staff.joiningDate).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="text-[#4A5D23] hover:text-[#4A5D23] hover:bg-[#4A5D23]/10 transition-colors" onClick={() => onView?.(staff)} title="View Profile">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-[#4A5D23] hover:text-[#4A5D23] hover:bg-[#4A5D23]/10 transition-colors" onClick={() => onEdit?.(staff)} title="Edit Details">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onToggleStatus?.(staff)} 
                      title={staff.status.toUpperCase() === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      className={staff.status.toUpperCase() === 'ACTIVE' ? 'text-[#94d82d] hover:text-[#82c91e] hover:bg-[#94d82d]/10 transition-colors' : 'text-slate-400 transition-colors'}
                    >
                      <Power className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-[#4A5D23] hover:text-[#4A5D23] hover:bg-[#4A5D23]/10 transition-colors" onClick={() => onDelete?.(staff)} title="Delete Employee">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              );
            })}
            {staffList.length === 0 && (
              <TableRow>
                <TableCell colSpan={variant === 'paper-setter' ? 6 : 7} className="h-24 text-center">
                  No staff members found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
