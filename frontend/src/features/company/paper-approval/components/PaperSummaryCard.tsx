import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import type { PaperApproval } from '../types';
import { ApprovalStatusBadge } from './ApprovalStatusBadge';
import { Calendar, User, BookOpen, Layers } from 'lucide-react';

interface PaperSummaryCardProps {
  approval: PaperApproval;
}

export const PaperSummaryCard: React.FC<PaperSummaryCardProps> = ({ approval }) => {
  return (
    <Card className="overflow-hidden shadow-sm border-slate-200">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-slate-800">{approval.paperName}</h2>
            <Badge variant="outline" className="bg-white font-mono">{approval.version}</Badge>
          </div>
          <p className="text-sm text-slate-500 font-medium">Code: <span className="font-mono text-slate-700">{approval.paperCode}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">Review: {approval.reviewStatus}</Badge>
          <ApprovalStatusBadge status={approval.approvalStatus} />
        </div>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Subject</p>
              <p className="font-medium text-slate-800">{approval.subject}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-indigo-500 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Approver</p>
              <p className="font-medium text-slate-800">{approval.approver || 'Unassigned'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Priority</p>
              <Badge variant="outline" className={
                approval.priority === 'Critical' ? 'border-red-200 text-red-700 bg-red-50' : 
                approval.priority === 'High' ? 'border-amber-200 text-amber-700 bg-amber-50' : ''
              }>
                {approval.priority}
              </Badge>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Created Date</p>
              <p className="font-medium text-slate-800">{new Date(approval.createdDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
