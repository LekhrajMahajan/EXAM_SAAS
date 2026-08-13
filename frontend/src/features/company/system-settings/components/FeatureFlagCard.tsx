import React from 'react';
import type { FeatureFlag } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface FeatureFlagCardProps {
  flag: FeatureFlag;
}

export function FeatureFlagCard({ flag }: FeatureFlagCardProps) {
  const isEnabled = flag.status === 'Enabled' || flag.status === 'Beta';
  
  return (
    <Card className="border-slate-200 shadow-sm relative overflow-hidden">
       {flag.status === 'Beta' && (
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl uppercase tracking-wider">
             Beta
          </div>
       )}
       <CardContent className="p-5 flex items-start gap-4">
          <div className="pt-1">
             <label className="relative inline-flex items-center cursor-pointer">
               <input type="checkbox" className="sr-only peer" defaultChecked={isEnabled} />
               <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
             </label>
          </div>
          <div className="flex-1">
             <h4 className="font-bold text-slate-900">{flag.name}</h4>
             <p className="text-sm text-slate-500 mt-1">{flag.description}</p>
             {flag.requiresRestart && (
                <p className="text-xs text-amber-600 mt-2 flex items-center font-medium bg-amber-50 w-fit px-2 py-1 rounded border border-amber-200">
                  <AlertCircle className="w-3 h-3 mr-1" /> Requires system restart to take effect
                </p>
             )}
          </div>
       </CardContent>
    </Card>
  );
}
