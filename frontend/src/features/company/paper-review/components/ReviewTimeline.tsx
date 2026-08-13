import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { ReviewHistoryItem } from '../types';
import { CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

interface ReviewTimelineProps {
  history: ReviewHistoryItem[];
}

export const ReviewTimeline: React.FC<ReviewTimelineProps> = ({ history }) => {
  const getIconForAction = (action: string) => {
    switch (action.toLowerCase()) {
      case 'assigned for review':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'review started':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'approved for approval':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'needs changes':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-2 w-2 rounded-full bg-slate-300" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {history.map((item) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                {getIconForAction(item.action)}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded border shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-800">{item.action}</h4>
                  <time className="text-xs font-medium text-slate-500">{item.date}</time>
                </div>
                <div className="text-sm text-slate-600 font-medium mb-2">By {item.reviewerName}</div>
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
