import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SubjectBreakdown {
  subjectId: string;
  subjectName: string;
  totalQuestions?: number;
  questionsAttempted: number;
  unansweredQuestions?: number;
  correctAnswers: number;
  wrongAnswers: number;
  marksObtained: number;
  maxMarks: number;
  sectionalCutoff?: number | null;
  sectionalStatus?: "QUALIFIED" | "NOT_QUALIFIED" | "NOT_APPLICABLE";
}

interface PartBreakdown {
  partName: string;
  subjectIds: string[];
  totalMarks: number;
  marksObtained: number;
  cutoffValue?: number;
  passedPartCutoff?: boolean;
}

interface ResultBreakdownViewProps {
  subjectWiseBreakdown: SubjectBreakdown[];
  partWiseBreakdown: PartBreakdown[];
  sectionalCutoffApplied: boolean;
  partWiseCutoffApplied: boolean;
}

export function ResultBreakdownView({
  subjectWiseBreakdown,
  partWiseBreakdown,
  sectionalCutoffApplied,
  partWiseCutoffApplied,
}: ResultBreakdownViewProps) {
  if (!subjectWiseBreakdown || subjectWiseBreakdown.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Subject-Wise Breakdown */}
      <Card className="bg-white dark:bg-[#16191F] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Subject-wise Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Subject</TableHead>
                  <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Questions</TableHead>
                  <TableHead className="text-center font-semibold text-emerald-600 dark:text-emerald-400">Correct</TableHead>
                  <TableHead className="text-center font-semibold text-rose-600 dark:text-rose-400">Wrong</TableHead>
                  <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Not Attempted</TableHead>
                  <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Score</TableHead>
                  {sectionalCutoffApplied && (
                    <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Target Cutoff</TableHead>
                  )}
                  {sectionalCutoffApplied && (
                    <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjectWiseBreakdown.map((sub, idx) => (
                  <TableRow key={sub.subjectId || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                      {sub.subjectName}
                    </TableCell>
                    <TableCell className="text-center text-slate-600 dark:text-slate-400">
                      {sub.totalQuestions || 0}
                    </TableCell>
                    <TableCell className="text-center font-medium text-emerald-600 dark:text-emerald-400">
                      {sub.correctAnswers || 0}
                    </TableCell>
                    <TableCell className="text-center font-medium text-rose-600 dark:text-rose-400">
                      {sub.wrongAnswers || 0}
                    </TableCell>
                    <TableCell className="text-center font-medium text-slate-600 dark:text-slate-400">
                      {sub.unansweredQuestions || 0}
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-800 dark:text-slate-200">
                      {typeof sub.marksObtained === 'number' && sub.marksObtained % 1 !== 0 
                        ? sub.marksObtained.toFixed(2) 
                        : sub.marksObtained}
                      <span className="text-slate-400 text-xs font-normal ml-1">/ {sub.maxMarks}</span>
                    </TableCell>
                    {sectionalCutoffApplied && (
                      <TableCell className="text-center font-medium text-slate-700 dark:text-slate-300">
                        {sub.sectionalCutoff ?? "-"}
                      </TableCell>
                    )}
                    {sectionalCutoffApplied && (
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {sub.sectionalStatus === "QUALIFIED" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : sub.sectionalStatus === "NOT_QUALIFIED" ? (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          ) : null}
                          <span className={`text-xs font-semibold ${
                            sub.sectionalStatus === "QUALIFIED" ? 'text-emerald-600' : 
                            sub.sectionalStatus === "NOT_QUALIFIED" ? 'text-rose-600' : 'text-slate-500'
                          }`}>
                            {sub.sectionalStatus === "QUALIFIED" ? 'Pass' : 
                             sub.sectionalStatus === "NOT_QUALIFIED" ? 'Fail' : 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Part-Wise Breakdown (if applicable) */}
      {partWiseCutoffApplied && partWiseBreakdown && partWiseBreakdown.length > 0 && (
        <Card className="bg-white dark:bg-[#16191F] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">
              Part-wise Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Part</TableHead>
                    <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Total Score</TableHead>
                    <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Part Cutoff</TableHead>
                    <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partWiseBreakdown.map((part, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        {part.partName}
                      </TableCell>
                      <TableCell className="text-center font-bold text-slate-800 dark:text-slate-200">
                         {typeof part.marksObtained === 'number' && part.marksObtained % 1 !== 0 
                            ? part.marksObtained.toFixed(2) 
                            : part.marksObtained}
                         <span className="text-slate-400 text-xs font-normal ml-1">/ {part.totalMarks}</span>
                      </TableCell>
                      <TableCell className="text-center text-slate-600 dark:text-slate-400">
                        {part.cutoffValue ?? 'N/A'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {part.passedPartCutoff ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-500" />
                          )}
                          <span className={`text-xs font-semibold ${part.passedPartCutoff ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {part.passedPartCutoff ? 'Passed' : 'Failed'}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
