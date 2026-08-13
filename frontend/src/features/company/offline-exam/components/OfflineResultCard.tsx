import React from 'react';
import type { OfflineResult } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { CheckCircle2, XCircle, UserX, Shield } from 'lucide-react';

function ResultBadge({ result }: { result: OfflineResult['result'] }) {
  const map = {
    Pass: { cls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
    Fail: { cls: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3" /> },
    Absent: { cls: 'bg-slate-100 text-slate-500 border-slate-200', icon: <UserX className="w-3 h-3" /> },
    Withheld: { cls: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Shield className="w-3 h-3" /> },
  };
  const { cls, icon } = map[result];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${cls}`}>
      {icon} {result}
    </span>
  );
}

export function OfflineResultCard({ result }: { result: OfflineResult }) {
  const pct = result.percentage;
  const barColor = pct >= 60 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <Card className="border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="font-bold text-slate-900">{result.candidateName}</div>
            <div className="font-mono text-xs text-indigo-600 mt-0.5">{result.rollNumber}</div>
          </div>
          <ResultBadge result={result.result} />
        </div>

        <div className="text-xs text-slate-500 mb-4">{result.subject}</div>

        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="text-2xl font-bold text-slate-900">{result.marksObtained}</div>
            <div className="text-xs text-slate-400">/ {result.maxMarks} marks</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-slate-900">{result.percentage.toFixed(1)}%</div>
            <div className="text-xs font-bold text-slate-500">Grade: {result.grade}</div>
          </div>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(result.percentage, 100)}%` }}></div>
        </div>
      </CardContent>
    </Card>
  );
}
