import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { SubjectStatusBadge } from './SubjectStatusBadge';
import type { Subject } from '../types';

interface SubjectDetailsCardProps {
  subject: Subject;
}

export function SubjectDetailsCard({ subject }: SubjectDetailsCardProps) {
  return (
    <Card>
      <CardHeader className="border-b bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-primary mb-1">{subject.code}</div>
            <CardTitle className="text-2xl">{subject.name}</CardTitle>
          </div>
          <SubjectStatusBadge status={subject.status} className="text-sm px-3 py-1" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-gray-900">{subject.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Category</h4>
                <p className="font-medium">{subject.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Language</h4>
                <p className="font-medium">{subject.language}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b">Exam Configuration</h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div className="text-gray-500">Exam Type</div>
              <div className="font-medium text-right">{subject.examType}</div>
              
              <div className="text-gray-500">Duration</div>
              <div className="font-medium text-right">{subject.durationMinutes} Minutes</div>
              
              <div className="text-gray-500">Questions</div>
              <div className="font-medium text-right">{subject.totalQuestions}</div>
              
              <div className="text-gray-500">Marks (Total/Pass)</div>
              <div className="font-medium text-right">{subject.totalMarks} / {subject.passingMarks}</div>
              
              <div className="text-gray-500">Negative Marking</div>
              <div className="font-medium text-right">
                {subject.negativeMarking ? (
                  <span className="text-red-600 font-semibold">Yes (-{subject.negativeMarksPerQuestion})</span>
                ) : (
                  <span className="text-green-600 font-semibold">No</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
