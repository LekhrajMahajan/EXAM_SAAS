import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Search, SlidersHorizontal, Upload, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Link } from "react-router-dom";

export const CandidateFilters = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-md border">
      <div className="flex flex-1 items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates (App No, Name, Aadhaar)..."
            className="pl-8"
          />
        </div>
        
        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Exam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exams</SelectItem>
            <SelectItem value="tcs">TCS NQT 2026</SelectItem>
            <SelectItem value="infy">Infosys Certification</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[130px] hidden lg:flex">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced
        </Button>
      </div>
    </div>
  );
};
