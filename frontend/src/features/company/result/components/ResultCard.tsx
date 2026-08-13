import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import type { CandidateResult } from '../types';
import { GradeBadge } from './GradeBadge';
import { Calendar, User, FileText, Activity } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';

interface ResultCardProps {
  result: CandidateResult;
}

export function ResultCard({ result }: ResultCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-slate-400" />
              {result.candidateName}
            </h4>
            <p className="text-sm text-slate-500 font-mono mt-1">{result.applicationNumber}</p>
          </div>
          <GradeBadge grade={result.grade} className="text-sm px-3 py-1" />
        </div>

        <div className="space-y-3 text-sm text-slate-600 mb-6">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
            <div>
              <p className="font-medium text-slate-900">{result.exam}</p>
              <p className="text-xs text-slate-500">{result.subject}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-400" />
            <span>Score: <strong className="text-slate-900">{result.marksObtained} / {result.totalMarks}</strong> ({result.percentage}%)</span>
          </div>
          {result.publishedAt && (
             <div className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-slate-400" />
               <span className="text-xs">Published: {result.publishedAt}</span>
             </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="w-full text-sm" asChild>
            <Link to={`/company/results/${result.id}`}>Details</Link>
          </Button>
          <Button variant="outline" className="w-full text-sm text-indigo-600 border-indigo-200 hover:bg-indigo-50" asChild>
            <Link to={`/company/results/${result.id}/preview`}>Preview</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
