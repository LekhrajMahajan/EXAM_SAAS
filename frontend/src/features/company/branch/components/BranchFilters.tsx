import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface BranchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  state: string;
  onStateChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  onReset: () => void;
  statesList: string[];
  citiesList: string[];
}

export const BranchFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  state,
  onStateChange,
  city,
  onCityChange,
  onReset,
  statesList,
  citiesList,
}: BranchFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, code or location..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-10 rounded-lg shadow-xs"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[130px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-10 rounded-lg">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={state} onValueChange={onStateChange}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-10 rounded-lg">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {statesList.map((st) => (
              <SelectItem key={st} value={st.toLowerCase()}>
                {st}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={city} onValueChange={onCityChange}>
          <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-10 rounded-lg">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {citiesList.map((ct) => (
              <SelectItem key={ct} value={ct.toLowerCase()}>
                {ct}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(search || status !== "all" || state !== "all" || city !== "all") && (
          <Button variant="ghost" size="sm" onClick={onReset} title="Reset Filters" className="h-10 text-muted-foreground hover:text-foreground">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
