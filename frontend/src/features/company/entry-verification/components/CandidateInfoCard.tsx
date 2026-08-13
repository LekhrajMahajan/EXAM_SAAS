import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { VerificationRecord } from '../types';
import { User, FileText, MapPin, CalendarClock } from 'lucide-react';
import { VerificationStatusBadge } from './VerificationStatusBadge';

interface CandidateInfoCardProps {
  candidate: VerificationRecord | null;
}

export function CandidateInfoCard({ candidate }: CandidateInfoCardProps) {
  if (!candidate) {
    return (
      <Card className="border-slate-200 shadow-sm h-full border-dashed bg-slate-50 flex items-center justify-center min-h-[300px]">
        <div className="text-center text-slate-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Scan or search to view candidate details</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm h-full overflow-hidden">
      <div className="bg-slate-900 h-16 w-full relative">
        <div className="absolute -bottom-10 left-6">
          <div className="w-24 h-24 bg-white rounded-md border-4 border-white shadow-sm flex items-center justify-center text-slate-300 overflow-hidden">
             {candidate.photoUrl ? (
               <img src={candidate.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
             ) : (
               <User className="w-12 h-12" />
             )}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <VerificationStatusBadge status={candidate.status} />
        </div>
      </div>
      
      <CardContent className="pt-14 pb-6 px-6">
        <h3 className="text-xl font-bold text-slate-900">{candidate.candidateName}</h3>
        <p className="text-slate-500 text-sm font-medium">{candidate.applicationNumber}</p>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-md">
              <FileText className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Exam</p>
              <p className="text-sm font-medium text-slate-900">{candidate.examName}</p>
              <p className="text-xs text-slate-500">{candidate.shiftId}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-md">
              <MapPin className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Location</p>
              <p className="text-sm font-medium text-slate-900">{candidate.centerId}</p>
              <p className="text-xs text-slate-500">Room {candidate.roomId} • Seat {candidate.seatNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-slate-100 p-2 rounded-md">
              <CalendarClock className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Schedule</p>
              <p className="text-sm font-medium text-slate-900">Reporting Time: {candidate.reportingTime}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
           <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Signature</p>
           <div className="w-full h-12 bg-slate-50 border border-slate-200 rounded flex items-center justify-center text-slate-300">
             {candidate.signatureUrl ? (
               <img src={candidate.signatureUrl} alt="Signature" className="h-full object-contain" />
             ) : (
               <span className="text-xs">No signature preview</span>
             )}
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
