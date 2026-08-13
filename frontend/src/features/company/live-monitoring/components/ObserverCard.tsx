import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { LiveObserver } from '../types';
import { ConnectionBadge } from './ConnectionBadge';
import { MapPin, Users, FileWarning } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/utils/cn';

interface ObserverCardProps {
  observer: LiveObserver;
}

export function ObserverCard({ observer }: ObserverCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base text-slate-900">{observer.name}</CardTitle>
        <ConnectionBadge status={observer.status} showIcon={false} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Assigned Center</p>
              <p className="font-medium text-slate-900">{observer.assignedCenter}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="font-medium text-slate-900">{observer.assignedCandidatesCount}</span> Candidates Assigned
          </div>
          <div className="flex items-center gap-2">
            <FileWarning className={cn("w-4 h-4", observer.incidentReportsCount > 0 ? "text-amber-500" : "text-slate-400")} />
            <span className={cn("font-medium", observer.incidentReportsCount > 0 ? "text-amber-700" : "text-slate-900")}>
               {observer.incidentReportsCount} Incident Reports
            </span>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex gap-2">
          <Button variant="outline" size="sm" className="w-full text-xs h-8">View Logs</Button>
          <Button variant="outline" size="sm" className="w-full text-xs h-8">Message</Button>
        </div>
      </CardContent>
    </Card>
  );
}
