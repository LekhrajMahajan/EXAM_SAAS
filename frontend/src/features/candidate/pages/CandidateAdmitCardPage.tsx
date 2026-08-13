import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_ADMIT_CARDS } from '../utils/placeholder';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, Printer, Ticket } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export function CandidateAdmitCardPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Admit Card" 
        description="Download and print your exam admit cards." 
      />

      <div className="space-y-6">
        {DUMMY_ADMIT_CARDS.map((card) => (
          <Card key={card.id} className="border-slate-200 shadow-sm overflow-hidden">
             <div className="bg-indigo-600 h-2 w-full" />
             <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
               <div>
                 <CardTitle className="text-lg flex items-center gap-2">
                   <Ticket className="w-5 h-5 text-indigo-600" />
                   {card.examName}
                 </CardTitle>
                 <p className="text-sm text-slate-500 mt-1">Application No: <span className="font-medium text-slate-900">{card.applicationNumber}</span></p>
               </div>
               <StatusBadge status={card.status} />
             </CardHeader>
             <CardContent className="p-6">
               <div className="flex flex-col md:flex-row gap-8">
                 <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-sm font-medium text-slate-500">Date</p>
                         <p className="text-base font-semibold text-slate-900 mt-1">{card.date}</p>
                       </div>
                       <div>
                         <p className="text-sm font-medium text-slate-500">Reporting Time</p>
                         <p className="text-base font-semibold text-slate-900 mt-1">{card.time}</p>
                       </div>
                    </div>
                    <div>
                       <p className="text-sm font-medium text-slate-500">Test Center</p>
                       <p className="text-base font-semibold text-slate-900 mt-1">{card.center}</p>
                    </div>
                 </div>
                 
                 <div className="w-full md:w-64 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                    {card.status === 'Available' ? (
                      <>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </>
                    ) : (
                      <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                         <p className="text-sm text-slate-500">Admit card will be available 7 days before the exam.</p>
                      </div>
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
