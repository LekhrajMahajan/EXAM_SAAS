import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { GitCommit, Lock, Unlock } from 'lucide-react';
import type { PaperApproval } from '../types';

interface VersionCardProps {
  approval: PaperApproval;
  isLocked?: boolean;
}

export const VersionCard: React.FC<VersionCardProps> = ({ approval, isLocked = false }) => {
  return (
    <Card className="bg-slate-50 border-slate-200 shadow-sm">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-md">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Current Version</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-lg font-bold text-slate-800">{approval.version}</span>
              <Badge variant="outline" className="bg-white text-slate-600 border-slate-300">
                Latest Draft
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs font-medium text-slate-500 mb-2">Paper Status</p>
          {isLocked ? (
            <div className="flex items-center text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-sm font-medium">
              <Lock className="w-4 h-4 mr-1.5" />
              Locked
            </div>
          ) : (
            <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 text-sm font-medium">
              <Unlock className="w-4 h-4 mr-1.5" />
              Unlocked
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
