import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Activity } from 'lucide-react';

export function ActivityCard() {
  return (
    <Card className="border-slate-200 shadow-sm bg-indigo-600 text-white overflow-hidden relative">
       {/* Background Decoration */}
       <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-2xl"></div>
       <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h3 className="font-bold text-lg text-indigo-50">Active Users Today</h3>
                <p className="text-3xl font-black mt-1">1,248</p>
             </div>
             <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Activity className="w-6 h-6 text-white" />
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-indigo-500/50">
             <div>
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider mb-1">Peak Concurrency</p>
                <p className="text-lg font-bold">450</p>
             </div>
             <div>
                <p className="text-xs text-indigo-200 font-medium uppercase tracking-wider mb-1">Avg Session</p>
                <p className="text-lg font-bold">42m</p>
             </div>
          </div>
       </CardContent>
    </Card>
  );
}
