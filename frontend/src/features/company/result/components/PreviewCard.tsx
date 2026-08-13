import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import type { CandidateResult } from '../types';
import { User, Target } from 'lucide-react';

interface PreviewCardProps {
  result: CandidateResult;
}

export function PreviewCard({ result }: PreviewCardProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-slate-200 shadow-md overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <CardHeader className="text-center pb-2 pt-8">
          <CardTitle className="text-2xl font-bold text-white mb-1">Candidate Scorecard</CardTitle>
          <CardDescription className="text-base text-slate-400">{result.exam}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          
          <div className="bg-[#1a1f2c] p-4 rounded-lg border border-slate-700/50 mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
             <div className="w-16 h-16 bg-[#0f172a] border border-slate-700/50 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
               <User className="w-8 h-8 text-slate-400" />
             </div>
             <div className="text-center sm:text-left">
               <h3 className="font-bold text-white text-lg">{result.candidateName}</h3>
               <p className="text-sm text-slate-400 font-mono mt-0.5">App No: {result.applicationNumber}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 max-w-sm mx-auto gap-4 mb-8">
             <div className="border border-slate-700/50 rounded-lg p-4 flex flex-col items-center justify-center bg-[#1a1f2c] shadow-sm">
                <Target className="w-6 h-6 text-indigo-500 mb-2" />
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Marks Obtained</p>
                <p className="text-2xl font-bold text-white">{result.marksObtained} <span className="text-base text-slate-500 font-normal">/ {result.totalMarks}</span></p>
             </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
