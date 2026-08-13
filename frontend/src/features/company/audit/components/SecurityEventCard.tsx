import React from 'react';
import type { SecurityEvent } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ShieldAlert, AlertOctagon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function SecurityEventCard({ event }: { event: SecurityEvent }) {
  const isCritical = event.severity === 'Critical';

  return (
    <Card className={`border-l-4 ${isCritical ? 'border-l-red-600 bg-red-50/30' : 'border-l-orange-500 bg-orange-50/30'} border-t-slate-200 border-r-slate-200 border-b-slate-200 shadow-sm`}>
       <CardContent className="p-5">
          <div className="flex items-start gap-4">
             <div className={`p-3 rounded-full ${isCritical ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                {isCritical ? <AlertOctagon className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
             </div>
             <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                   <h3 className="font-bold text-slate-900">{event.type}</h3>
                   <span className="text-xs font-mono text-slate-500">{event.timestamp}</span>
                </div>
                <p className="text-sm text-slate-700 mb-3">{event.description}</p>
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600 mb-4 bg-white p-3 rounded border border-slate-200">
                   <div><span className="text-slate-400">User:</span> {event.user}</div>
                   <div><span className="text-slate-400">IP:</span> <span className="font-mono">{event.ipAddress}</span></div>
                   <div><span className="text-slate-400">Status:</span> <span className={event.status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}>{event.status}</span></div>
                </div>

                <div className="flex justify-end gap-2">
                   <Button variant="outline" size="sm" className="bg-white">View Logs</Button>
                   {event.status !== 'Resolved' && (
                     <Button size="sm" variant={isCritical ? 'destructive' : 'default'} className={!isCritical ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}>
                        Take Action
                     </Button>
                   )}
                </div>
             </div>
          </div>
       </CardContent>
    </Card>
  );
}
