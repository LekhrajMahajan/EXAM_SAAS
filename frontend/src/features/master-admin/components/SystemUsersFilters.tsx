import React, { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/shared/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";
import { useCompanies } from "../hooks/company.hooks";
import { useBranches } from "../hooks/branch.hooks";
import { useRoles } from "../hooks/role.hooks";

const EMPLOYEE_STATUSES = ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'LOCKED', 'TERMINATED'];

interface SystemUsersFiltersProps {
  filters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export const SystemUsersFilters: React.FC<SystemUsersFiltersProps> = ({ filters, onFilterChange }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | undefined>((filters.companyId as string) || undefined);

  const { data: companiesResponse } = useCompanies({ page: 1, limit: 100 });
  const { data: branchesResponse } = useBranches(selectedCompanyId ? { page: 1, limit: 100, companyId: selectedCompanyId } : { page: 1, limit: 100 });
  const { data: rolesResponse } = useRoles({ page: 1, limit: 100, isSystem: false });

  const [searchValue, setSearchValue] = useState<string>((filters.search as string) || "");
  const debouncedSearch = useDebounce(searchValue, 500);

  const [departmentValue, setDepartmentValue] = useState<string>((filters.department as string) || "");
  const debouncedDepartment = useDebounce(departmentValue, 500);

  // Sync external filter changes (e.g. Clear Filters) to local state
  useEffect(() => {
    if (filters.search === undefined) {
      setTimeout(() => setSearchValue(""), 0);
    }
    if (filters.department === undefined) {
      setTimeout(() => setDepartmentValue(""), 0);
    }
  }, [filters.search, filters.department]);

  // Sync debounced search with parent filters
  useEffect(() => {
    if (debouncedSearch !== (filters.search || "")) {
      onFilterChange({ ...filters, search: debouncedSearch || undefined });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Sync debounced department with parent filters
  useEffect(() => {
    if (debouncedDepartment !== (filters.department || "")) {
      onFilterChange({ ...filters, department: debouncedDepartment || undefined });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDepartment]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleCompanyChange = (value: string) => {
    const val = value === "all" ? undefined : value;
    setSelectedCompanyId(val);
    // Also reset branch when company changes
    onFilterChange({ ...filters, companyId: val, branchId: undefined });
  };

  const handleBranchChange = (value: string) => {
    onFilterChange({ ...filters, branchId: value === "all" ? undefined : value });
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === "all" ? undefined : value });
  };

  const handleRoleChange = (value: string) => {
    onFilterChange({ ...filters, role: value === "all" ? undefined : value });
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDepartmentValue(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, date: e.target.value || undefined });
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search by name, email, employee ID..."
            className="pl-9"
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select 
            value={selectedCompanyId || "all"} 
            onValueChange={handleCompanyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companiesResponse?.data?.map((company: any) => (
                <SelectItem key={company._id} value={company._id}>
                  {company.companyName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-[200px]">
          <Select 
            value={(filters.branchId as string) || "all"} 
            onValueChange={handleBranchChange}
            disabled={!selectedCompanyId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {(Array.isArray(branchesResponse?.data) ? branchesResponse.data : ((branchesResponse?.data as any)?.data || [])).map((branch: any) => (
                <SelectItem key={branch._id} value={branch._id}>
                  {branch.branchName || branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Filter by Department..."
            value={departmentValue}
            onChange={handleDepartmentChange}
          />
        </div>
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
              {EMPLOYEE_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select 
            value={(filters.role as string) || "all"} 
            onValueChange={handleRoleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {rolesResponse?.data?.map((role: any) => (
                <SelectItem key={role._id} value={role.name}>
                  {role.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center">
          <Input 
            type="date" 
            value={(filters.date as string) || ""} 
            onChange={handleDateChange} 
            className="w-[150px] dark:[color-scheme:dark]"
            title="Filter by Created Date"
          />
        </div>
      </div>
    </div>
  );
};
