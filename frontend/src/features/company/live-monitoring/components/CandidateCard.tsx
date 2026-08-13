import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { LiveCandidate } from '../types';
import { User, Camera, Mic, MonitorSmartphone, Clock } from 'lucide-react';
import { ConnectionBadge } from './ConnectionBadge';
import { WarningBadge } from './WarningBadge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/utils/cn';

interface CandidateCardProps {
  candidate: LiveCandidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  
  const getStatusColor = (status: boolean) => status ? "text-emerald-500" : "text-red-500";

  return (
    <Card className={cn(
      "border-slate-200 shadow-sm hover:shadow-md transition-all",
      candidate.status === 'Disconnected' && "border-red-200 bg-red-50/20"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <ConnectionBadge status={candidate.connectionStatus} />
          <WarningBadge count={candidate.warningCount} />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200">
            {candidate.photoUrl ? (
              <img src={candidate.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 truncate" title={candidate.name}>{candidate.name}</h4>
            <p className="text-xs text-slate-500 font-mono">{candidate.applicationNumber}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-500">Center:</span>
            <span className="font-medium truncate ml-2" title={candidate.center}>{candidate.center}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Room/Seat:</span>
            <span className="font-medium">{candidate.room} / S-{candidate.seatNumber}</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 py-3 border-t border-slate-100">
           <div className="flex flex-col items-center justify-center" title="Camera Status">
             <Camera className={cn("w-4 h-4", getStatusColor(candidate.cameraStatus))} />
           </div>
           <div className="flex flex-col items-center justify-center" title="Microphone Status">
             <Mic className={cn("w-4 h-4", getStatusColor(candidate.microphoneStatus))} />
           </div>
           <div className="flex flex-col items-center justify-center" title="Fullscreen Status">
             <MonitorSmartphone className={cn("w-4 h-4", getStatusColor(candidate.fullscreenStatus))} />
           </div>
           <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-2">
             <div className="flex items-center text-xs font-mono font-medium text-slate-700" title="Elapsed Time">
               <Clock className="w-3 h-3 mr-1 text-slate-400" />
               {candidate.elapsedTime.substring(0, 5)}
             </div>
           </div>
        </div>
        
        <div className="mt-2 pt-3 border-t border-slate-100 flex gap-2">
          <Button variant="outline" size="sm" className="w-full text-xs h-8">View Stream</Button>
          <Button variant="outline" size="sm" className="w-full text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50">Pause Exam</Button>
        </div>
      </CardContent>
    </Card>
  );
}
