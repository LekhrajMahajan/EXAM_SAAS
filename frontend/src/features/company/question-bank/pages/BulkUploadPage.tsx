import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { UploadCloud } from 'lucide-react';

export function BulkUploadPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Bulk Upload Questions" 
        description="Upload questions using CSV or Excel formats." 
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>Download our template, fill it out, and upload it here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center text-center bg-gray-50">
            <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium">Click to upload or drag and drop</h3>
            <p className="text-sm text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            <Button className="mt-4" variant="outline">Browse Files</Button>
          </div>
          
          <div className="flex justify-between items-center bg-blue-50 p-4 rounded-md">
            <div>
              <p className="font-medium text-blue-800">Need a template?</p>
              <p className="text-sm text-blue-600">Download our sample CSV file to see the required format.</p>
            </div>
            <Button variant="secondary">Download Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
