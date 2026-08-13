import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import type { Shift } from '../types';
import { Badge } from '@/shared/components/ui/badge';

interface ShiftCalendarProps {
  shifts: Shift[];
}

export const ShiftCalendar: React.FC<ShiftCalendarProps> = ({ shifts }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 sm:h-32 border border-slate-100 bg-slate-50/50 p-1"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayShifts = shifts.filter(s => s.schedule.date === dateStr);

    days.push(
      <div key={`day-${i}`} className="h-24 sm:h-32 border border-slate-200 p-1 overflow-y-auto hover:bg-slate-50 transition-colors">
        <div className="font-medium text-xs sm:text-sm text-slate-500 mb-1">{i}</div>
        <div className="space-y-1">
          {dayShifts.map(shift => (
            <div 
              key={shift.id} 
              className="text-[10px] sm:text-xs p-1 rounded bg-blue-50 text-blue-700 border border-blue-200 truncate cursor-pointer hover:bg-blue-100"
              title={`${shift.general.name} (${shift.schedule.examStartTime} - ${shift.schedule.examEndTime})`}
            >
              <div className="font-semibold truncate">{shift.general.code}</div>
              <div className="truncate hidden sm:block">{shift.schedule.examStartTime}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-indigo-600" />
          Shift Calendar
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="font-medium text-slate-800">
            {monthNames[month]} {year}
          </div>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-b bg-slate-50">
          {daysOfWeek.map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white">
          {days}
        </div>
      </CardContent>
    </Card>
  );
};
