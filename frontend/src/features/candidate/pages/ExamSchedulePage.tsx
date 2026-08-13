import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_EXAM_SCHEDULES } from '../utils/placeholder';
import { ExamCard } from '../components/ExamCard';

export function ExamSchedulePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Exam Schedule" 
        description="View your upcoming examination dates and center details." 
      />

      <div className="grid gap-6">
        {DUMMY_EXAM_SCHEDULES.map((schedule) => (
          <ExamCard key={schedule.id} schedule={schedule} />
        ))}
      </div>
    </div>
  );
}
