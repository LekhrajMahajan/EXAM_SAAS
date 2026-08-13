import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { BarChart3, Users, CheckCircle2, XCircle } from 'lucide-react';

export function ResultSummary() {
  return (
    <Card className="border-slate-200 shadow-sm bg-slate-50">
      <CardContent className="p-6">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Generation Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
             <div className="flex justify-center mb-1"><Users className="w-5 h-5 text-slate-400" /></div>
             <p className="text-xs text-slate-500 font-medium">Total Evaluated</p>
             <p className="text-xl font-bold text-slate-900">1,245</p>
           </div>
           
           <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
             <div className="flex justify-center mb-1"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
             <p className="text-xs text-slate-500 font-medium">Passed</p>
             <p className="text-xl font-bold text-emerald-600">980</p>
           </div>
           
           <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
             <div className="flex justify-center mb-1"><XCircle className="w-5 h-5 text-red-500" /></div>
             <p className="text-xs text-slate-500 font-medium">Failed</p>
             <p className="text-xl font-bold text-red-600">265</p>
           </div>
           
           <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
             <div className="flex justify-center mb-1"><BarChart3 className="w-5 h-5 text-blue-500" /></div>
             <p className="text-xs text-slate-500 font-medium">Pass Rate</p>
             <p className="text-xl font-bold text-blue-600">78.7%</p>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
