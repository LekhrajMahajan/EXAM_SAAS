import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { SubjectStatusBadge } from './SubjectStatusBadge';
import { Clock, HelpCircle, Target } from 'lucide-react';
import type { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
}

export function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">{subject.code}</div>
            <CardTitle className="text-lg leading-tight">{subject.name}</CardTitle>
          </div>
          <SubjectStatusBadge status={subject.status} />
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 flex-1">
        <p className="text-sm text-gray-500 mb-6 line-clamp-2" title={subject.description}>
          {subject.description}
        </p>

        <div className="grid grid-cols-3 gap-2 text-sm text-center">
          <div className="bg-gray-50 p-2 rounded-md border flex flex-col items-center justify-center">
            <Clock className="w-4 h-4 text-blue-500 mb-1" />
            <span className="font-semibold">{subject.durationMinutes}</span>
            <span className="text-[10px] text-gray-500 uppercase">Mins</span>
          </div>
          <div className="bg-gray-50 p-2 rounded-md border flex flex-col items-center justify-center">
            <HelpCircle className="w-4 h-4 text-orange-500 mb-1" />
            <span className="font-semibold">{subject.totalQuestions}</span>
            <span className="text-[10px] text-gray-500 uppercase">Qs</span>
          </div>
          <div className="bg-gray-50 p-2 rounded-md border flex flex-col items-center justify-center">
            <Target className="w-4 h-4 text-green-500 mb-1" />
            <span className="font-semibold">{subject.passingMarks}</span>
            <span className="text-[10px] text-gray-500 uppercase">Pass</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 border-t p-3 flex justify-between text-xs text-gray-500">
        <div className="font-medium">{subject.category}</div>
        <div>{subject.language}</div>
      </CardFooter>
    </Card>
  );
}
