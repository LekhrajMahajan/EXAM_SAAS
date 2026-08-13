
import { PageHeader } from '@/shared/components/layout/page-header';

export function ExamCalendarPage() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Exam Calendar" 
        description="View all scheduled exams and shifts across centers." 
      />
      <div className="mt-6 border rounded-lg p-8 bg-card text-center text-muted-foreground">
        <p>Calendar Component will be integrated here.</p>
      </div>
    </div>
  );
}
