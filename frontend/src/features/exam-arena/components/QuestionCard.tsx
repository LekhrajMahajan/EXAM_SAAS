import React from 'react';
import type { ExamQuestion } from '../types';
import { OptionGroup } from './OptionGroup';
import { Image as ImageIcon } from 'lucide-react';

interface QuestionCardProps {
  question: ExamQuestion;
  selectedOption?: string;
  onSelect?: (value: string) => void;
}

export function QuestionCard({ question, selectedOption, onSelect }: QuestionCardProps) {
  return (
    <div className="flex flex-col flex-1 space-y-4">
      {/* Question Text */}
      <div className="bg-slate-200 rounded-md p-4 min-h-[80px] flex items-start text-slate-800 text-lg">
        <span className="font-bold mr-3 whitespace-nowrap">Question {question.questionNumber}:</span>
        <span className="font-medium">{question.text || `Question content...`}</span>
      </div>

      {question.imageUrl && (
         <div className="p-4 bg-slate-200 rounded-md flex flex-col items-center justify-center text-slate-500">
           <ImageIcon className="w-12 h-12 mb-2" />
           <span>Image Placeholder</span>
         </div>
      )}

      {/* MCQs Box */}
      <div className="bg-slate-300 rounded-md p-4 flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow-sm mt-2">
           <OptionGroup question={question} selectedOption={selectedOption} onSelect={onSelect} />
        </div>
      </div>
    </div>
  );
}
