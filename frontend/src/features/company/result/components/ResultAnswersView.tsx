import React from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';

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
  subjectName?: string;
}

interface ResultDetailsProps {
  answers: AnswerDetails[];
}

export function ResultAnswersView({ answers }: ResultDetailsProps) {
  // Group answers by subjectName
  // Group answers by subjectName, but deduplicate by questionId first
  const groupedAnswers = React.useMemo(() => {
    if (!answers) return {};

    // Deduplicate answers by questionId
    const uniqueAnswersMap = new Map<string, AnswerDetails>();
    answers.forEach((answer, index) => {
      // If a questionId is missing, use index fallback
      const key = answer.questionId || `unknown-${index}`;
      if (!uniqueAnswersMap.has(key)) {
        uniqueAnswersMap.set(key, answer);
      }
    });

    const uniqueAnswers = Array.from(uniqueAnswersMap.values());

    return uniqueAnswers.reduce((acc, answer) => {
      const subject = answer.subjectName || "Other Questions";
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(answer);
      return acc;
    }, {} as Record<string, AnswerDetails[]>);
  }, [answers]);

  const subjects = Object.keys(groupedAnswers);

  if (!answers || answers.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 bg-transparent border border-slate-800/50 rounded-lg">
        No answers found for this candidate.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={subjects} className="w-full space-y-4">
        {subjects.map((subject, sIndex) => (
          <AccordionItem key={subject} value={subject} className="border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-[#16191F] px-4 shadow-sm">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3 text-lg font-bold text-slate-800 dark:text-white">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                {subject} <span className="text-sm font-medium text-slate-500 ml-2">({groupedAnswers[subject].length} Questions)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-6">
              <div className="space-y-4">
                {groupedAnswers[subject].map((answer, index) => (
                  <Card key={answer.questionId || index} className={`border-l-4 shadow-sm ${answer.isCorrect ? 'border-l-primary' : (answer.isAnswered ? 'border-l-rose-500' : 'border-l-slate-300')}`}>
                    <CardHeader className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-sm font-medium shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <div 
                            className="text-sm font-medium text-slate-800 dark:text-slate-200 prose prose-sm max-w-none dark:prose-invert" 
                            dangerouslySetInnerHTML={{ __html: answer.questionText || 'Unknown Question' }} 
                          />
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <span className={`text-sm font-bold ${answer.isCorrect ? 'text-primary' : (answer.isAnswered ? 'text-rose-600' : 'text-slate-500')}`}>
                            {answer.isCorrect ? `+${answer.marks}` : (answer.isAnswered ? `-${answer.negativeMarks}` : '0')}
                          </span>
                          {answer.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
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
                        <div className={`rounded p-3 border ${
                          answer.isAnswered && !answer.isCorrect 
                            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                            : answer.isCorrect
                              ? 'bg-[#2D3E2C] border-[#2D3E2C]'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50'
                        }`}>
                          <span className={`text-xs font-medium uppercase tracking-wider block mb-1 ${
                            answer.isCorrect ? 'text-[#E4FD97]/70' : 'text-slate-500 dark:text-slate-400'
                          }`}>Candidate&apos;s Answer</span>
                          <span className={`text-sm font-medium ${
                            answer.isAnswered 
                              ? (answer.isCorrect ? 'text-[#E4FD97]' : 'text-rose-700 dark:text-rose-400') 
                              : 'text-slate-500'
                          }`}>
                            {answer.isAnswered ? answer.selectedAnswer || 'Selected empty answer' : 'Not Attempted'}
                          </span>
                        </div>
                        <div className="bg-[#2D3E2C] rounded p-3 border border-[#2D3E2C]">
                          <span className="text-xs text-[#E4FD97]/70 font-medium uppercase tracking-wider block mb-1">Correct Answer</span>
                          <span className="text-sm font-medium text-[#E4FD97]">
                            {answer.correctAnswer}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
