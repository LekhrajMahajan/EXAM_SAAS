import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { UploadCloud, FileSpreadsheet } from 'lucide-react';

export function ImportAssignmentPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Import Assignments" 
        description="Upload a CSV or Excel file to bulk map candidates to specific seats." 
      />
      
      <Card className="border-slate-200 shadow-sm border-dashed">
        <CardContent className="p-12 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
            <UploadCloud className="w-8 h-8 text-slate-500" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-slate-900">Drag & Drop file here</h3>
            <p className="text-sm text-slate-500 mt-2">
              Supported formats: .csv, .xlsx. Ensure your file matches the required template format for successful imports.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline">Browse Files</Button>
            <Button variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
