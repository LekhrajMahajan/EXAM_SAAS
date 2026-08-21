import React, { useState } from 'react';
import { WidgetCard } from './WidgetCard';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import type { Exam } from '@/features/exam-manager/api/exam.api';

interface CalendarCardProps {
  exams?: Exam[];
}

export function CalendarCard({ exams = [] }: CalendarCardProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const examsByDate = exams.reduce((acc, exam) => {
    if (!exam.examDate) return acc;
    const examDate = new Date(exam.examDate);
    if (examDate.getMonth() === currentMonth && examDate.getFullYear() === currentYear) {
      const dateStr = examDate.getDate();
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(exam);
    }
    return acc;
  }, {} as Record<number, Exam[]>);

  const today = new Date();

  return (
    <WidgetCard title="Calendar" action={<CalendarIcon className="w-4 h-4 text-slate-400" />}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 px-2">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handlePrevMonth}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{monthName} {currentYear}</span>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleNextMonth}><ChevronRight className="w-4 h-4" /></Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {days.map(d => <div key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
          {dates.map(d => {
            const isToday = d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            const dayExams = examsByDate[d] || [];
            const hasEvent = dayExams.length > 0;
            
            const dayContent = (
              <button className={`w-full h-full rounded-full flex flex-col items-center justify-center text-xs transition-colors relative
                ${isToday ? 'bg-[#2D3E2C] text-white font-bold shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}
              `}>
                {d}
                {hasEvent && <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-[#2D3E2C]'}`} />}
              </button>
            );

            return (
              <div key={d} className="flex justify-center items-center aspect-square p-1">
                {hasEvent ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        {dayContent}
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-1">
                          {dayExams.map(exam => (
                            <span key={exam._id} className="font-medium text-xs">{exam.examTitle}</span>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  dayContent
                )}
              </div>
            );
          })}
        </div>
      </div>
    </WidgetCard>
  );
}
