import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export const StaffFilters = ({ 
  hideRoleFilter,
  hideDepartmentFilter,
  hideBranchFilter,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search staff..."
}: { 
  hideRoleFilter?: boolean;
  hideDepartmentFilter?: boolean;
  hideBranchFilter?: boolean;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-slate-900/50 p-4 rounded-md border border-slate-800">
      <div className="flex flex-1 items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            className="pl-8"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        
        {!hideRoleFilter && (
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="manager">Center Manager</SelectItem>
              <SelectItem value="invigilator">Invigilator</SelectItem>
              <SelectItem value="technical">Technical Manager</SelectItem>
            </SelectContent>
          </Select>
        )}

        {!hideDepartmentFilter && (
          <Select>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="ops">Operations</SelectItem>
              <SelectItem value="exam">Examination</SelectItem>
              <SelectItem value="it">IT Support</SelectItem>
            </SelectContent>
          </Select>
        )}

        {!hideBranchFilter && (
          <Select>
            <SelectTrigger className="w-[150px] hidden md:flex">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="mumbai">Mumbai Central</SelectItem>
              <SelectItem value="pune">Pune Hub</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        <Select>
          <SelectTrigger className="w-[130px] hidden lg:flex">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full sm:w-auto shrink-0">
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Advanced
      </Button>
    </div>
  );
};
