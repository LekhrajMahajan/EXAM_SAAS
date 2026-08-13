import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { DUMMY_SETTINGS_STATS, DUMMY_RECENT_UPDATES } from '../utils/placeholder';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

export function SettingsDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings Overview" 
        description="High-level view of your system configuration, pending changes, and recent updates." 
      />
      
      <StatisticsGrid stats={DUMMY_SETTINGS_STATS} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
         <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3">
               <CardTitle className="text-base flex items-center gap-2"><History className="w-4 h-4 text-indigo-500" /> Recent Configuration Changes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <ul className="divide-y divide-slate-100">
                  {DUMMY_RECENT_UPDATES.map(update => (
                    <li key={update.id} className="p-4 hover:bg-slate-50 transition-colors">
                       <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{update.setting}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Modified by {update.changedBy}</p>
                          </div>
                          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">{update.timestamp}</span>
                       </div>
                    </li>
                  ))}
               </ul>
            </CardContent>
         </Card>

         <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50 to-white">
            <CardContent className="p-6 flex flex-col justify-center h-full">
               <h3 className="text-lg font-bold text-slate-900 mb-2">Need to rotate keys or update policies?</h3>
               <p className="text-sm text-slate-600 mb-6">Access all your advanced configurations, including API keys, feature flags, and integrations from the sidebar navigation.</p>
               
               <div className="grid grid-cols-2 gap-3 mt-auto">
                 <Button variant="outline" asChild className="bg-white border-slate-200 justify-start">
                    <Link to="/company/system-settings/security">Security Policies <ArrowRight className="w-4 h-4 ml-auto" /></Link>
                 </Button>
                 <Button variant="outline" asChild className="bg-white border-slate-200 justify-start">
                    <Link to="/company/system-settings/integrations">Integrations <ArrowRight className="w-4 h-4 ml-auto" /></Link>
                 </Button>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
