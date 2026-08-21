import { useEffect, useState } from "react";
import { CandidateHeader } from "./../components/CandidateHeader";
import { CandidateFilters } from "./../components/CandidateFilters";
import { CandidateTable } from "./../components/CandidateTable";
import { Button } from "@/shared/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { ImportCandidateModalGovt } from "./../components/ImportCandidateModalGovt";
import { useCandidateImportStore } from "@/stores/candidate/candidateImport.store";

export const GovtCandidateImportPage = () => {
  const { importedCandidates, isLoading, fetchImportedCandidates } = useCandidateImportStore();

  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchImportedCandidates();
  }, [fetchImportedCandidates]);

  const uniqueExams = Array.from(new Set(importedCandidates.map(c => c.examName).filter(Boolean))) as string[];
  const uniqueShifts = Array.from(new Set(importedCandidates.map(c => c.shift).filter(Boolean))) as string[];

  const filteredCandidates = importedCandidates.filter((c) => {
    if (search) {
      const q = search.toLowerCase();
      const matches = 
        c.applicationNo?.toLowerCase().includes(q) ||
        c.candidateFullName?.toLowerCase().includes(q) ||
        c.candidateId?.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (examFilter !== "all" && c.examName !== examFilter) return false;
    if (shiftFilter !== "all" && c.shift !== shiftFilter) return false;
    if (statusFilter !== "all") {
      const examStatus = c.examId?.displayStatus || c.examId?.status || "ACTIVE";
      if (examStatus.toUpperCase() !== statusFilter.toUpperCase()) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <CandidateHeader
        title="Candidate Management (Govt Authority)"
        description="View, filter, and import candidates for specific exams."
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="hidden md:flex"
              onClick={() => fetchImportedCandidates()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <ImportCandidateModalGovt onSuccess={() => fetchImportedCandidates()} />
          </>
        }
      />

      <CandidateFilters 
        search={search}
        setSearch={setSearch}
        examFilter={examFilter}
        setExamFilter={setExamFilter}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        uniqueExams={uniqueExams}
        uniqueShifts={uniqueShifts}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48 border rounded-md bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <CandidateTable candidates={filteredCandidates} />
          <div className="flex items-center justify-between px-2 py-4 border-t bg-card rounded-b-md">
            <div className="text-sm text-muted-foreground">
              Showing {filteredCandidates.length > 0 ? 1 : 0} to {filteredCandidates.length} of {filteredCandidates.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
