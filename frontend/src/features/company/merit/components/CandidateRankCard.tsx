import React from 'react';
import type { MeritRecord } from '../types';
import { RankCard } from './RankCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { User, MapPin } from 'lucide-react';

interface CandidateRankCardProps {
  record: MeritRecord;
}

export function CandidateRankCard({ record }: CandidateRankCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col sm:flex-row items-center gap-6">
         <div className="w-20 h-20 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
           <User className="w-10 h-10 text-slate-400" />
         </div>
         <div className="text-center sm:text-left flex-1">
           <h3 className="font-bold text-slate-900 text-xl">{record.candidateName}</h3>
           <p className="text-sm text-slate-500 font-mono mt-1">App No: {record.applicationNumber}</p>
           <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
             <span className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-700">{record.category}</span>
             <span className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-1">
               <MapPin className="w-3 h-3" /> {record.city}, {record.state}
             </span>
           </div>
         </div>
         <div className="text-center sm:text-right bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[120px]">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Score</p>
            <p className="text-2xl font-black text-slate-900">{record.marksObtained}</p>
            <p className="text-xs font-medium text-emerald-600 mt-1">{record.percentage}%</p>
         </div>
      </div>
      <CardContent className="p-6 bg-slate-50/50">
         <h4 className="font-semibold text-slate-900 mb-4">Rankings Breakdown</h4>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <RankCard label="Overall Rank" rank={record.ranks.overallRank} type="overall" />
            <RankCard label="Category Rank" rank={record.ranks.categoryRank} type="category" />
            <RankCard label="State Rank" rank={record.ranks.stateRank} type="state" />
            <RankCard label="City Rank" rank={record.ranks.cityRank} type="city" />
         </div>
      </CardContent>
    </Card>
  );
}
