import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { MeritRecord } from '../types';
import { Medal, Star } from 'lucide-react';

interface MeritCardProps {
  merit: MeritRecord;
}

export function MeritCard({ merit }: MeritCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
      <CardContent className="p-6">
        <h4 className="text-lg font-bold text-slate-900 mb-6">{merit.examName}</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
            <Medal className="w-8 h-8 text-amber-500 mb-2" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Overall Rank</p>
            <p className="text-3xl font-black text-slate-900 mt-1">#{merit.overallRank}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <Medal className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Category Rank</p>
            <p className="text-3xl font-black text-slate-900 mt-1">#{merit.categoryRank}</p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
            <Star className="w-8 h-8 text-indigo-500 mb-2 fill-indigo-100" />
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Percentile</p>
            <p className="text-3xl font-black text-indigo-700 mt-1">{merit.percentile}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
