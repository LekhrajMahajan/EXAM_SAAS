import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_APPLICATIONS } from '../utils/placeholder';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '@/shared/components/ui/button';
import { FileText, Download } from 'lucide-react';

export function ApplicationStatusPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Application Status" 
          description="Track the status of your submitted applications." 
        />
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Start New Application
        </Button>
      </div>

      <div className="space-y-4">
        {DUMMY_APPLICATIONS.map((application) => (
          <Card key={application.id} className="border-slate-200 shadow-sm">
             <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 bg-slate-50">
               <div>
                 <CardTitle className="text-lg">{application.examName}</CardTitle>
                 <p className="text-sm text-slate-500 mt-1">Application No: <span className="font-medium text-slate-900">{application.applicationNumber}</span></p>
               </div>
               <StatusBadge status={application.status} />
             </CardHeader>
             <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                   <div>
                     <p className="text-sm font-medium text-slate-500">Category</p>
                     <p className="text-base font-semibold text-slate-900 mt-1">{application.category}</p>
                   </div>
                   <div>
                     <p className="text-sm font-medium text-slate-500">Submitted On</p>
                     <p className="text-base font-semibold text-slate-900 mt-1">{application.submittedDate}</p>
                   </div>
                   <div className="flex items-center sm:justify-end gap-3">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        View Form
                      </Button>
                      {application.status === 'Approved' && (
                        <Button variant="ghost" size="icon" className="text-indigo-600">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                   </div>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
