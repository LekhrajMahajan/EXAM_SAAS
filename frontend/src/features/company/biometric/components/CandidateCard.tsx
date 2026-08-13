import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { BiometricRecord } from '../types';
import { User, MapPin } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface CandidateCardProps {
  candidate: BiometricRecord | null;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  if (!candidate) {
    return (
      <Card className="border-slate-200 shadow-sm h-full border-dashed bg-slate-50 flex items-center justify-center min-h-[250px]">
        <div className="text-center text-slate-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Candidate info will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden h-full">
       <div className="bg-gradient-to-r from-slate-900 to-indigo-900 h-24 w-full relative">
        <div className="absolute top-4 right-4">
          <StatusBadge status={candidate.status} />
        </div>
       </div>
       <CardContent className="pt-0 relative px-6 pb-6">
          <div className="flex flex-col items-center -mt-12">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center overflow-hidden mb-4">
              {candidate.photoUrl ? (
                <img src={candidate.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 text-center">{candidate.candidateName}</h3>
            <p className="text-slate-500 text-sm font-medium">{candidate.applicationNumber}</p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Exam</span>
              <span className="font-medium text-slate-900">{candidate.examName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Center</span>
              <span className="font-medium text-slate-900">{candidate.centerId}</span>
            </div>
            <div className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-md">
              <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Room/Seat</span>
              <span className="font-bold text-slate-900">{candidate.roomId} / S-{candidate.seatNumber}</span>
            </div>
          </div>
       </CardContent>
    </Card>
  );
}
