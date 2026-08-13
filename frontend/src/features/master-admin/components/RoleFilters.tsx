import React from "react";
import { Input } from "@/shared/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";

const ROLE_STATUSES = ['ACTIVE', 'INACTIVE'];

interface RoleFiltersProps {
  filters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export const RoleFilters: React.FC<RoleFiltersProps> = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === "all" ? undefined : value });
  };



  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by role name, code, or description..."
            className="pl-9"
            value={(filters.search as string) || ""}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-[200px]">
          <Select 
            value={(filters.status as string) || "all"} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ROLE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
