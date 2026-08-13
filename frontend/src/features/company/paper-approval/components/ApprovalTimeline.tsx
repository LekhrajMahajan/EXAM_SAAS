import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { ApprovalHistoryItem } from '../types';
import { CheckCircle2, XCircle, Undo2, Clock, MessageSquareWarning, Lock } from 'lucide-react';

interface ApprovalTimelineProps {
  history: ApprovalHistoryItem[];
}

export const ApprovalTimeline: React.FC<ApprovalTimelineProps> = ({ history }) => {
  const getIconForAction = (action: string) => {
    switch (action) {
      case 'Approved':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Returned for Review':
        return <Undo2 className="w-5 h-5 text-amber-600" />;
      case 'Changes Requested':
        return <MessageSquareWarning className="w-5 h-5 text-blue-600" />;
      case 'Locked':
        return <Lock className="w-5 h-5 text-slate-600" />;
      case 'Approval Started':
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Approved': return 'text-green-700';
      case 'Rejected': return 'text-red-700';
      case 'Returned for Review': return 'text-amber-700';
      case 'Changes Requested': return 'text-blue-700';
      case 'Locked': return 'text-slate-700';
      default: return 'text-slate-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {history.map((item) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                {getIconForAction(item.action)}
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${getActionColor(item.action)}`}>{item.action}</span>
                  <time className="text-xs font-medium text-slate-500">{new Date(item.timestamp).toLocaleString()}</time>
                </div>
                <div className="text-sm text-slate-600 font-medium mb-2">By {item.approverName}</div>
                <div className="text-xs text-slate-400 font-mono mb-2">Version: {item.version}</div>
                {item.remarks && (
                  <p className="text-sm text-slate-500 bg-slate-50 p-3 rounded mt-2 border border-slate-100">
                    &quot;{item.remarks}&quot;
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
