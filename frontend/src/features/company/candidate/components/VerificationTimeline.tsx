import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { CheckCircle2, Upload, PlayCircle, XCircle, FileClock, CheckSquare } from 'lucide-react';

export type TimelineEvent = {
  id: string;
  type: 'UPLOADED' | 'STARTED' | 'APPROVED' | 'REJECTED' | 'REUPLOAD_REQUESTED' | 'FINAL_APPROVAL';
  title: string;
  description: string;
  date: string;
  user: string;
};

interface VerificationTimelineProps {
  events: TimelineEvent[];
}

export function VerificationTimeline({ events }: VerificationTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'UPLOADED':
        return <Upload className="w-5 h-5 text-blue-500" />;
      case 'STARTED':
        return <PlayCircle className="w-5 h-5 text-indigo-500" />;
      case 'APPROVED':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'REUPLOAD_REQUESTED':
        return <FileClock className="w-5 h-5 text-orange-500" />;
      case 'FINAL_APPROVAL':
        return <CheckSquare className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'UPLOADED': return 'bg-blue-100 border-blue-200';
      case 'STARTED': return 'bg-indigo-100 border-indigo-200';
      case 'APPROVED': return 'bg-green-100 border-green-200';
      case 'REJECTED': return 'bg-red-100 border-red-200';
      case 'REUPLOAD_REQUESTED': return 'bg-orange-100 border-orange-200';
      case 'FINAL_APPROVAL': return 'bg-emerald-100 border-emerald-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
          {events.map((event, index) => (
            <div key={event.id} className="relative pl-8">
              {/* Timeline dot/icon */}
              <div className={`absolute -left-[21px] top-1 rounded-full border-4 border-white ${getEventColor(event.type)} p-1`}>
                {getEventIcon(event.type)}
              </div>
              
              <div className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-sm text-gray-900">{event.title}</h4>
                  <span className="text-xs text-gray-500">{event.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="text-xs font-medium text-gray-500">
                  By {event.user}
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-sm text-gray-500 pl-4">No events found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
