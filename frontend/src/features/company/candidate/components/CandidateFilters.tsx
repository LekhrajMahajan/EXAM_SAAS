import { Input } from "@/shared/components/ui/input";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";


export interface CandidateFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  examFilter: string;
  setExamFilter: (val: string) => void;
  shiftFilter: string;
  setShiftFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  uniqueExams: string[];
  uniqueShifts: string[];
}

export const CandidateFilters = ({
  search, setSearch,
  examFilter, setExamFilter,
  shiftFilter, setShiftFilter,
  statusFilter, setStatusFilter,
  uniqueExams, uniqueShifts
}: CandidateFiltersProps) => {
  const examStatuses = [
    { value: "ACTIVE", label: "Active" },
    { value: "DRAFT", label: "Draft" },
    { value: "EXAM_STARTED", label: "Exam Started" },
    { value: "EXAM_ENDED", label: "Exam Ended" },
    { value: "COMPLETED", label: "Completed" },
    { value: "RESULT_GENERATED", label: "Result Generated" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "INACTIVE", label: "Inactive" }
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-md border">
      <div className="flex flex-1 items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates (App No, Name)..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select value={examFilter} onValueChange={setExamFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Exam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exams</SelectItem>
            {uniqueExams.map(exam => (
              <SelectItem key={exam} value={exam}>{exam}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            {uniqueShifts.map(shift => (
              <SelectItem key={shift} value={shift}>{shift}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] hidden lg:flex">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {examStatuses.map(st => (
              <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
