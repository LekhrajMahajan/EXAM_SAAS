import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Trophy, Users, CheckCircle2 } from 'lucide-react';

export function PreviewCard() {
  return (
    <Card className="border-slate-200 shadow-md overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
      <CardHeader className="pb-4 pt-8">
        <CardTitle className="text-2xl font-bold text-slate-900 mb-1">Merit List Generation Preview</CardTitle>
        <CardDescription className="text-base text-slate-600">Simulated run based on current parameters.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
             <div className="flex justify-center mb-2"><Users className="w-6 h-6 text-indigo-500" /></div>
             <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Candidates Processed</p>
             <p className="text-2xl font-bold text-slate-900">14,520</p>
           </div>
           
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
             <div className="flex justify-center mb-2"><Trophy className="w-6 h-6 text-amber-500" /></div>
             <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Top Score</p>
             <p className="text-2xl font-bold text-slate-900">298 <span className="text-sm font-normal text-slate-400">/ 300</span></p>
           </div>
           
           <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
             <div className="flex justify-center mb-2"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
             <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Tie-Breakers Applied</p>
             <p className="text-2xl font-bold text-slate-900">412</p>
           </div>
        </div>

        <div>
           <h4 className="font-bold text-slate-900 mb-3">Top 3 Preview</h4>
           <div className="space-y-2">
             {[1, 2, 3].map((rank) => (
                <div key={rank} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                         #{rank}
                      </div>
                      <div>
                         <p className="font-semibold text-slate-900">Candidate Placeholder {rank}</p>
                         <p className="text-xs text-slate-500">General • New York</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-bold text-slate-900">29{8 - rank}</p>
                   </div>
                </div>
             ))}
           </div>
        </div>

      </CardContent>
    </Card>
  );
}
