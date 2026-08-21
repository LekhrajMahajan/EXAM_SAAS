import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export const StaffFilters = ({ 
  hideRoleFilter,
  searchQuery,
  onSearchChange,
  roleFilter,
  onRoleChange,
  searchPlaceholder = "Search staff...",
  extraFilters
}: { 
  hideRoleFilter?: boolean;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  roleFilter?: string;
  onRoleChange?: (val: string) => void;
  searchPlaceholder?: string;
  extraFilters?: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-white dark:bg-slate-900/50 p-4 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
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
        
        {extraFilters}

        {!hideRoleFilter && (
          <Select value={roleFilter || 'all'} onValueChange={onRoleChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="exam_manager">Exam Manager</SelectItem>
              <SelectItem value="biometric_verifier">Biometric Verifier</SelectItem>
              <SelectItem value="observer">Observer</SelectItem>
              <SelectItem value="govt_authority">Govt Authority</SelectItem>
              <SelectItem value="technical_manager">Technical Manager</SelectItem>
              <SelectItem value="state_manager">State Manager</SelectItem>
              <SelectItem value="city_manager">City Manager</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
