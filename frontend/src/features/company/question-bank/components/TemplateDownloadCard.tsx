import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';

export function TemplateDownloadCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-green-200">
        <CardHeader className="bg-green-50 rounded-t-lg pb-4">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="h-6 w-6 text-green-600" />
            <CardTitle className="text-green-800">Excel Template</CardTitle>
          </div>
          <CardDescription className="text-green-700">Recommended for complex data with formatting</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Supports multiple sheets</li>
            <li>Built-in data validation</li>
            <li>Preserves special characters easily</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
            <Download className="mr-2 h-4 w-4" /> Download .xlsx
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50 rounded-t-lg pb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-blue-800">CSV Template</CardTitle>
          </div>
          <CardDescription className="text-blue-700">Best for simple data and broad compatibility</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Lightweight file size</li>
            <li>Compatible with all systems</li>
            <li>Plain text format</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
            <Download className="mr-2 h-4 w-4" /> Download .csv
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
