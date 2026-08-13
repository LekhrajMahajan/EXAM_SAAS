import React, { useState, useEffect } from "react";
import { Input } from "@/shared/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";
import { InvoiceStatus, PaymentStatus } from "../../types/invoice.types";

interface InvoiceFiltersProps {
  filters: Record<string, unknown>;
  onFilterChange: (filters: Record<string, unknown>) => void;
}

export const InvoiceFilters: React.FC<InvoiceFiltersProps> = ({ filters, onFilterChange }) => {
  const [localSearch, setLocalSearch] = useState((filters.search as string) || "");
  const [localCompany, setLocalCompany] = useState((filters.company as string) || "");

  useEffect(() => {
    const currentSearch = (filters.search as string) || "";
    const currentCompany = (filters.company as string) || "";
    
    if (localSearch === currentSearch && localCompany === currentCompany) {
      return;
    }

    const timer = setTimeout(() => {
      onFilterChange({ 
        ...filters, 
        search: localSearch || undefined, 
        company: localCompany || undefined 
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, [localSearch, localCompany, filters, onFilterChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const handleStatusChange = (value: string) => {
    onFilterChange({ ...filters, status: value === "all" ? undefined : value });
  };

  const handlePaymentStatusChange = (value: string) => {
    onFilterChange({ ...filters, paymentStatus: value === "all" ? undefined : value });
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalCompany(e.target.value);
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
            placeholder="Search by invoice number..."
            className="pl-9"
            value={localSearch}
            onChange={handleSearchChange}
          />
        </div>
        <div className="relative flex-1">
          <Input
            placeholder="Filter by company..."
            value={localCompany}
            onChange={handleCompanyChange}
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
              <SelectValue placeholder="Invoice Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Invoice Statuses</SelectItem>
              {Object.values(InvoiceStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-[200px]">
          <Select 
            value={(filters.paymentStatus as string) || "all"} 
            onValueChange={handlePaymentStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Statuses</SelectItem>
              {Object.values(PaymentStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="date" 
            value={(filters.date as string) || ""} 
            onChange={handleDateChange} 
            className="w-[200px] dark:[color-scheme:dark] dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:opacity-90"
          />
        </div>
      </div>
    </div>
  );
};
