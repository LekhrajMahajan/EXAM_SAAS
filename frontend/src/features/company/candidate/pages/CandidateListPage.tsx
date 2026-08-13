import React, { useEffect } from "react";
import { CandidateHeader } from "../components/CandidateHeader";
import { CandidateFilters } from "../components/CandidateFilters";
import { CandidateTable } from "../components/CandidateTable";
import { Button } from "@/shared/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { useCandidateImportStore } from "@/stores/candidate/candidateImport.store";

export const CandidateListPage = () => {
  const { importedCandidates, isLoading, fetchImportedCandidates } = useCandidateImportStore();

  useEffect(() => {
    fetchImportedCandidates();
  }, [fetchImportedCandidates]);

  return (
    <div className="space-y-6 p-6">
      <CandidateHeader
        title="Candidate Management"
        description="View, filter, and manage registered candidates and their applications."
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
          </>
        }
      />

      <CandidateFilters />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48 border rounded-md bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <CandidateTable candidates={importedCandidates} />
          <div className="flex items-center justify-between px-2 py-4 border-t bg-card rounded-b-md">
            <div className="text-sm text-muted-foreground">
              Showing 1 to {importedCandidates.length} of {importedCandidates.length} entries
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
