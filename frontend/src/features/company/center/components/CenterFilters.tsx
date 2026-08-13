import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Center } from "../types/center.types";
import { useMemo } from "react";

interface CenterFiltersProps {
  centers?: Center[];
  search?: string;
  onSearchChange?: (val: string) => void;
  centerFilter?: string;
  onCenterFilterChange?: (val: string) => void;
  stateFilter?: string;
  onStateFilterChange?: (val: string) => void;
  statusFilter?: string;
  onStatusFilterChange?: (val: string) => void;
  approvalFilter?: string;
  onApprovalFilterChange?: (val: string) => void;
}

export const CenterFilters = ({
  centers = [],
  search = "",
  onSearchChange,
  centerFilter = "all",
  onCenterFilterChange,
  stateFilter = "all",
  onStateFilterChange,
  statusFilter = "all",
  onStatusFilterChange,
  approvalFilter = "all",
  onApprovalFilterChange,
}: CenterFiltersProps) => {

  const uniqueCenterNames = useMemo(() => {
    const names = centers.map(c => c.centerName).filter(Boolean);
    return Array.from(new Set(names));
  }, [centers]);

  const uniqueStates = useMemo(() => {
    const states = centers.map(c => c.state).filter(Boolean);
    return Array.from(new Set(states));
  }, [centers]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card dark:bg-[#111726]/80 p-4 rounded-xl border border-border dark:border-slate-800/80 shadow-xs backdrop-blur-xs">
      <div className="flex flex-1 items-center gap-3 w-full sm:w-auto flex-wrap">
        <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search Center Code or Name"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9 bg-background dark:bg-[#0A0D14] border-border dark:border-slate-800 text-foreground dark:text-slate-200 placeholder:text-slate-500 rounded-lg h-9 text-sm"
          />
        </div>
        
        <Select value={centerFilter} onValueChange={onCenterFilterChange}>
          <SelectTrigger className="w-[180px] hidden sm:flex bg-background dark:bg-[#0A0D14] border-border dark:border-slate-800 text-foreground dark:text-slate-300 h-9 rounded-lg">
            <SelectValue placeholder="Center Name" />
          </SelectTrigger>
          <SelectContent className="bg-card dark:bg-[#111726] border-border dark:border-slate-800 text-foreground dark:text-slate-200">
            <SelectItem value="all">All Centers</SelectItem>
            {uniqueCenterNames.map((name) => (
              <SelectItem key={name} value={name!}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={stateFilter} onValueChange={onStateFilterChange}>
          <SelectTrigger className="w-[130px] hidden sm:flex bg-background dark:bg-[#0A0D14] border-border dark:border-slate-800 text-foreground dark:text-slate-300 h-9 rounded-lg">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent className="bg-card dark:bg-[#111726] border-border dark:border-slate-800 text-foreground dark:text-slate-200">
            <SelectItem value="all">All States</SelectItem>
            {uniqueStates.map((state) => (
              <SelectItem key={state} value={state!}>{state}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[130px] hidden md:flex bg-background dark:bg-[#0A0D14] border-border dark:border-slate-800 text-foreground dark:text-slate-300 h-9 rounded-lg">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-card dark:bg-[#111726] border-border dark:border-slate-800 text-foreground dark:text-slate-200">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={approvalFilter} onValueChange={onApprovalFilterChange}>
          <SelectTrigger className="w-[140px] hidden lg:flex bg-background dark:bg-[#0A0D14] border-border dark:border-slate-800 text-foreground dark:text-slate-300 h-9 rounded-lg">
            <SelectValue placeholder="Approval" />
          </SelectTrigger>
          <SelectContent className="bg-card dark:bg-[#111726] border-border dark:border-slate-800 text-foreground dark:text-slate-200">
            <SelectItem value="all">All Approvals</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

    </div>
  );
};
