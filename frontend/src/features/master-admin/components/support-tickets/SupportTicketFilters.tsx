import React from "react";
import { Input } from "@/shared/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

interface SupportTicketFiltersProps {
  filters: {
    search?: string;
    priority?: string;
    status?: string;
    category?: string;
  };
  setFilters: (filters: any) => void;
}

export const SupportTicketFilters = ({ filters, setFilters }: SupportTicketFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by ID, subject..."
          className="pl-9"
          value={filters.search || ""}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>
      
      <Select
        value={filters.status || "all"}
        onValueChange={(v) => setFilters({ ...filters, status: v === "all" ? undefined : v })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="OPEN">Open</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="RESOLVED">Resolved</SelectItem>
          <SelectItem value="CLOSED">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.priority || "all"}
        onValueChange={(v) => setFilters({ ...filters, priority: v === "all" ? undefined : v })}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priorities</SelectItem>
          <SelectItem value="LOW">Low</SelectItem>
          <SelectItem value="MEDIUM">Medium</SelectItem>
          <SelectItem value="HIGH">High</SelectItem>
          <SelectItem value="CRITICAL">Critical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
