import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { MeritRecord } from '../types';
import { Calendar, User, Trophy, MapPin } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

interface MeritCardProps {
  record: MeritRecord;
}

export function MeritCard({ record }: MeritCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              {record.candidateName}
            </h4>
            <p className="text-sm text-slate-500 font-mono mt-1">{record.applicationNumber}</p>
          </div>
          <div className="text-right">
             <div className="text-xs font-bold uppercase text-amber-600 tracking-wider mb-0.5">Overall Rank</div>
             <div className="text-2xl font-extrabold text-slate-900">#{record.ranks.overallRank}</div>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-600 mb-6">
          <div className="flex items-start gap-2">
            <Trophy className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">Score: {record.marksObtained} ({record.percentage}%)</p>
              <p className="text-xs text-slate-500">Category: <span className="font-semibold text-slate-700">{record.category}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-xs">{record.city}, {record.state}</span>
          </div>
          {record.publishedAt && (
             <div className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-slate-400" />
               <span className="text-xs">Published: {record.publishedAt}</span>
             </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="w-full text-sm" asChild>
            <Link to={`/company/merit/${record.id}`}>Details</Link>
          </Button>
          <Button variant="outline" className="w-full text-sm text-amber-600 border-amber-200 hover:bg-amber-50" asChild>
            <Link to={`/company/merit/${record.id}/preview`}>Preview</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
