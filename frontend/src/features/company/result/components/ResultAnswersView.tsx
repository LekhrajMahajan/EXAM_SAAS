import React from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface AnswerDetails {
  questionId: string;
  questionText: string;
  questionType: string;
  isAnswered: boolean;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marks: number;
  negativeMarks: number;
}

interface ResultDetailsProps {
  answers: AnswerDetails[];
}

export function ResultAnswersView({ answers }: ResultDetailsProps) {
  if (!answers || answers.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-transparent border border-slate-800/50 rounded-lg">
        No answers found for this candidate.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {answers.map((answer, index) => (
        <Card key={answer.questionId || index} className={`border-l-4 ${answer.isCorrect ? 'border-l-emerald-500' : (answer.isAnswered ? 'border-l-rose-500' : 'border-l-slate-300')}`}>
          <CardHeader className="py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-sm font-medium shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div 
                  className="text-sm font-medium text-slate-200 prose prose-sm max-w-none prose-invert" 
                  dangerouslySetInnerHTML={{ __html: answer.questionText || 'Unknown Question' }} 
                />
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <span className={`text-sm font-bold ${answer.isCorrect ? 'text-emerald-600' : (answer.isAnswered ? 'text-rose-600' : 'text-slate-500')}`}>
                  {answer.isCorrect ? `+${answer.marks}` : (answer.isAnswered ? `-${answer.negativeMarks}` : '0')}
                </span>
                {answer.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : answer.isAnswered ? (
                  <XCircle className="w-5 h-5 text-rose-500" />
                ) : (
                  <HelpCircle className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-0 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-9">
              <div className="bg-slate-800/50 rounded p-3 border border-slate-700/50">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-1">Candidate&apos;s Answer</span>
                <span className={`text-sm font-medium ${answer.isAnswered ? (answer.isCorrect ? 'text-emerald-400' : 'text-rose-400') : 'text-slate-500'}`}>
                  {answer.isAnswered ? answer.selectedAnswer || 'Selected empty answer' : 'Not Attempted'}
                </span>
              </div>
              <div className="bg-emerald-950/30 rounded p-3 border border-emerald-900/50">
                <span className="text-xs text-emerald-500 font-medium uppercase tracking-wider block mb-1">Correct Answer</span>
                <span className="text-sm font-medium text-emerald-400">
                  {answer.correctAnswer}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
