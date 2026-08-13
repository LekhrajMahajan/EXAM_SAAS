import { CandidateHeader } from "../components/CandidateHeader";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const ImportCandidatesPage = () => {
  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/company/candidates">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <CandidateHeader
          title="Import Candidates"
          description="Upload an Excel or CSV file to bulk import candidate data."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            <CardDescription>Select a valid template file.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-300 rounded-md p-10 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer min-h-[300px]">
              <Upload className="h-12 w-12 text-slate-400 mb-4" />
              <p className="text-lg font-medium text-slate-700">Drag & drop your file here</p>
              <p className="text-sm text-slate-500 mt-2">or click to browse from your computer</p>
              <Button className="mt-6" variant="secondary">Browse Files</Button>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button>Start Import</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Download Template</h4>
                <p className="text-xs text-muted-foreground mt-1">Ensure your data matches the required columns.</p>
                <Button variant="link" className="p-0 h-auto text-xs mt-1">Download CSV Template</Button>
              </div>
            </div>
            
            <div className="flex items-start gap-3 mt-4">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Data Rules</h4>
                <ul className="text-xs text-muted-foreground mt-1 list-disc pl-4 space-y-1">
                  <li>Aadhaar must be unique.</li>
                  <li>DOB format: YYYY-MM-DD</li>
                  <li>Maximum 500 records per upload.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
