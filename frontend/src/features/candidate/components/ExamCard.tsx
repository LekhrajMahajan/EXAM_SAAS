import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { ExamScheduleRecord } from '../types';
import { Calendar, Clock, MapPin, Map } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ExamCardProps {
  schedule: ExamScheduleRecord;
}

export function ExamCard({ schedule }: ExamCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-indigo-600 h-2 w-full" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-slate-900">{schedule.examName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="text-sm font-medium text-slate-900">{schedule.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Reporting Time</p>
                <p className="text-sm font-medium text-slate-900">{schedule.time}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Center Name</p>
                <p className="text-sm font-medium text-slate-900">{schedule.center}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Map className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Room / Seat</p>
                <p className="text-sm font-medium text-slate-900">{schedule.room} / S-{schedule.seatNumber}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="outline" size="sm">Get Directions</Button>
        </div>
      </CardContent>
    </Card>
  );
}
