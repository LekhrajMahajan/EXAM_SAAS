import { Button } from '@/shared/components/ui/button';
import { ExamTimer } from '../ExamTimer';

interface ExamHeaderProps {
  examName: string;
  candidateName: string;
  rollNumber: string;
  durationSeconds: number;
  onSubmit: () => void;
  onTimeUp?: () => void;
}

export function ExamHeader({
  examName,
  candidateName,
  rollNumber,
  durationSeconds,
  onSubmit,
  onTimeUp
}: ExamHeaderProps) {

  return (
    <header className="h-16 flex-shrink-0 bg-white border-b border-border px-4 md:px-6 flex items-center justify-between text-foreground z-20 shadow-sm">
      <div className="flex-1">
        <div className="inline-flex items-center justify-center px-6 py-2 bg-slate-200 rounded-md">
          <h1 className="text-lg font-bold text-slate-800">{examName}</h1>
        </div>
      </div>
      
      <div className="flex-1 flex justify-center">
        <div className="inline-flex items-center justify-center px-4 py-2 bg-slate-200 rounded-md text-sm font-medium text-slate-700">
          {candidateName} ({rollNumber})
        </div>
      </div>

      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="px-4 py-2 bg-slate-200 rounded-md flex items-center justify-center font-bold text-slate-800">
          <ExamTimer key={durationSeconds} durationSeconds={durationSeconds} onTimeUp={onTimeUp} />
        </div>
        
        <Button 
          variant="outline" 
          onClick={onSubmit} 
          className="font-semibold px-6 bg-slate-200 border-none text-slate-800 hover:bg-slate-300"
        >
          SUBMIT EXAM
        </Button>
      </div>
    </header>
  );
}
