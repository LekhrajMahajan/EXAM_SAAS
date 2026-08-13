import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { ResultRecord } from '../types';
import { StatusBadge } from './StatusBadge';
import { Trophy } from 'lucide-react';

interface ResultCardProps {
  result: ResultRecord;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-0">
         <div className="flex flex-col md:flex-row">
            <div className="bg-slate-50 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col justify-center items-center text-center">
              <Trophy className={`w-12 h-12 mb-3 ${result.status === 'Pass' ? 'text-emerald-500' : 'text-slate-400'}`} />
              <h3 className="text-lg font-bold text-slate-900 mb-1">Score</h3>
              <div className="text-4xl font-black text-indigo-700">
                {result.marksObtained} <span className="text-lg text-slate-500 font-medium">/ {result.totalMarks}</span>
              </div>
              <div className="mt-4">
                <StatusBadge status={result.status} />
              </div>
            </div>
            
            <div className="p-6 md:w-2/3">
               <h4 className="text-lg font-bold text-slate-900">{result.examName}</h4>
               <p className="text-sm text-slate-500 mt-1">Declared on {result.declaredDate}</p>
               
               <div className="mt-6 space-y-4">
                 <div>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="font-medium text-slate-700">Percentage</span>
                     <span className="font-bold text-slate-900">{result.percentage}%</span>
                   </div>
                   <div className="w-full bg-slate-100 rounded-full h-2.5">
                     <div 
                       className={`h-2.5 rounded-full ${result.status === 'Pass' ? 'bg-emerald-500' : 'bg-red-500'}`} 
                       style={{ width: `${result.percentage}%` }}
                     />
                   </div>
                 </div>
               </div>
            </div>
         </div>
      </CardContent>
    </Card>
  );
}
