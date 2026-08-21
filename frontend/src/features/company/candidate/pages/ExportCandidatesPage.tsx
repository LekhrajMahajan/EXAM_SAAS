import { useState, useEffect } from "react";
import { CandidateHeader } from "../components/CandidateHeader";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Download, FileJson, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CandidateFilters } from "../components/CandidateFilters";
import { useCandidateImportStore } from "@/stores/candidate/candidateImport.store";

export const ExportCandidatesPage = () => {
  const { importedCandidates, fetchImportedCandidates } = useCandidateImportStore();

  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("all");
  const [shiftFilter, setShiftFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchImportedCandidates();
  }, [fetchImportedCandidates]);

  const uniqueExams = Array.from(new Set(importedCandidates.map(c => c.examName).filter(Boolean))) as string[];
  const uniqueShifts = Array.from(new Set(importedCandidates.map(c => c.shift).filter(Boolean))) as string[];

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/company/candidates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <CandidateHeader
          title="Export Candidates"
          description="Filter and download candidate data in various formats."
        />
      </div>

      <div className="bg-slate-50 p-4 rounded-md border">
        <h3 className="text-sm font-semibold mb-3">1. Select Data Filters</h3>
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
      </div>

      <h3 className="text-sm font-semibold pt-2">2. Choose Export Format</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-md">
                <FileSpreadsheet className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <CardTitle>Excel / CSV</CardTitle>
                <CardDescription>Best for spreadsheets and analysis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:border-primary transition-colors">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-100 rounded-md">
                <FileJson className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <CardTitle>JSON Format</CardTitle>
                <CardDescription>Best for system integrations</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-amber-600 hover:bg-amber-700">
              <Download className="h-4 w-4 mr-2" />
              Download JSON
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
