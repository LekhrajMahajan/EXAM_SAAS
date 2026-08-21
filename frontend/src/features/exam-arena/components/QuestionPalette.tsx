import React from 'react';
import { cn } from '@/utils/cn';
import type { ExamQuestion, QuestionStatus } from '../types';

interface QuestionPaletteProps {
  questions: ExamQuestion[];
  currentQuestionId: string;
  onQuestionSelect: (id: string) => void;
}

export function QuestionPalette({ questions, currentQuestionId, onQuestionSelect }: QuestionPaletteProps) {
  
  const getStatusColor = (status: QuestionStatus) => {
    switch(status) {
      case 'Answered': return 'bg-emerald-500 text-white border-emerald-600';
      case 'Not Answered': return 'bg-red-500 text-white border-red-600';
      case 'Marked for Review': return 'bg-amber-500 text-white border-amber-600';
      case 'Not Visited': default: return 'bg-white text-slate-600 border-slate-300';
    }
  };

  return (
    <div className="w-full bg-white flex flex-col h-full rounded-md shadow-sm overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-4 gap-2">
          {questions.map((q) => {
            const isCurrent = q.id === currentQuestionId;
            return (
              <button
                key={q.id}
                onClick={() => onQuestionSelect(q.id)}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded text-sm font-medium border shadow-sm transition-transform hover:scale-105",
                  getStatusColor(q.status),
                  isCurrent && "ring-2 ring-primary ring-offset-2"
                )}
              >
                {((q as any).displayNumber) || q.questionNumber}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 border-t border-border bg-card text-xs space-y-2">
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-emerald-500 border border-emerald-600"></div>
            <span className="text-muted-foreground">Answered</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-red-500 border border-red-600"></div>
            <span className="text-muted-foreground">Not Answered</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-background border border-border"></div>
            <span className="text-muted-foreground">Not Visited</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm bg-amber-500 border border-amber-600"></div>
            <span className="text-muted-foreground">Marked for Review</span>
         </div>
      </div>
    </div>
  );
}
