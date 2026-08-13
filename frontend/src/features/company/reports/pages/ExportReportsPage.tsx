import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { DownloadCloud, Settings } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function ExportReportsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Export Center" 
        description="Configure and trigger bulk data exports across all modules." 
      />

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
           <CardTitle className="text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-indigo-500" /> Export Configuration</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
           <p className="text-slate-500 mb-6">Select the modules you wish to include in your comprehensive data export.</p>
           
           <div className="space-y-4">
             <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
               <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded border-slate-300" defaultChecked />
               <div>
                 <span className="block font-bold text-slate-900">Exam Definitions & Setup</span>
                 <span className="block text-sm text-slate-500">Includes question banks, rubrics, and configurations.</span>
               </div>
             </label>
             <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
               <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded border-slate-300" defaultChecked />
               <div>
                 <span className="block font-bold text-slate-900">Candidate Directory</span>
                 <span className="block text-sm text-slate-500">Includes profiles, application data, and demographics.</span>
               </div>
             </label>
             <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
               <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded border-slate-300" defaultChecked />
               <div>
                 <span className="block font-bold text-slate-900">Results & Merit Records</span>
                 <span className="block text-sm text-slate-500">Raw scores, normalized ranks, and category cutoffs.</span>
               </div>
             </label>
           </div>
           
           <div className="mt-8 flex justify-end">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                 <DownloadCloud className="w-5 h-5 mr-2" />
                 Initiate Bulk Export (ZIP)
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
