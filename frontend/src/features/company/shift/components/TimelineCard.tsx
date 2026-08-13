import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Clock, Key, FileText, CheckCircle2 } from 'lucide-react';
import type { ShiftSchedule } from '../types';

interface TimelineCardProps {
  schedule: ShiftSchedule;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({ schedule }) => {
  const events = [
    {
      time: schedule.reportingTime,
      title: 'Reporting Time',
      description: 'Candidates begin arriving at the center.',
      icon: <Clock className="w-4 h-4 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      time: schedule.gateClosingTime,
      title: 'Gate Closing',
      description: 'Entry restricted. Late entry rules apply.',
      icon: <Key className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200',
    },
    {
      time: schedule.examStartTime,
      title: 'Exam Starts',
      description: 'Examination commences.',
      icon: <FileText className="w-4 h-4 text-green-600" />,
      color: 'bg-green-50 border-green-200',
    },
    {
      time: schedule.examEndTime,
      title: 'Exam Ends',
      description: 'Examination concludes. Dispersal begins.',
      icon: <CheckCircle2 className="w-4 h-4 text-slate-600" />,
      color: 'bg-slate-50 border-slate-200',
    },
  ];

  return (
    <Card className="shadow-sm border-slate-200 h-full">
      <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          Shift Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-200 before:to-transparent">
          {events.map((event, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-6 last:mb-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                {event.icon}
              </div>
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-lg border shadow-sm ${event.color}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800">{event.title}</span>
                  <time className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                    {event.time}
                  </time>
                </div>
                <div className="text-sm text-slate-600">
                  {event.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
