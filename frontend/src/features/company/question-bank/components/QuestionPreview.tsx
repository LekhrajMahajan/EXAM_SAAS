import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { Question } from '../types';

interface QuestionPreviewProps {
  question: Question;
  showExplanation?: boolean;
}

export function QuestionPreview({ question, showExplanation = false }: QuestionPreviewProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardHeader className="bg-gray-50 border-b pb-4">
        <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
          <div>Question Type: {question.questionType}</div>
          <div className="flex gap-4">
            <span className="text-green-600">+{question.marks} Marks</span>
            <span className="text-red-500">-{question.negativeMarks} Marks</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8 space-y-8">
        
        {/* Question Text */}
        <div className="text-lg text-gray-900 leading-relaxed">
          <span className="font-semibold mr-2">Q.</span>
          <span dangerouslySetInnerHTML={{ __html: question.questionText }} />
        </div>

        {/* Options */}
        <div className="pl-6">
          {question.questionType === 'Single Choice (MCQ)' || question.questionType === 'True / False' ? (
            <RadioGroup className="space-y-4">
              {question.options.map((opt, i) => (
                <div key={opt.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={opt.id} id={`preview-opt-${opt.id}`} />
                  <Label htmlFor={`preview-opt-${opt.id}`} className="text-base font-normal cursor-pointer flex gap-2">
                    <span className="font-medium text-gray-500">{String.fromCharCode(65 + i)}.</span>
                    <span>{opt.text}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : question.questionType === 'Multiple Choice (MSQ)' ? (
            <div className="space-y-4">
              {question.options.map((opt, i) => (
                <div key={opt.id} className="flex items-center space-x-3">
                  <Checkbox id={`preview-opt-${opt.id}`} />
                  <Label htmlFor={`preview-opt-${opt.id}`} className="text-base font-normal cursor-pointer flex gap-2">
                    <span className="font-medium text-gray-500">{String.fromCharCode(65 + i)}.</span>
                    <span>{opt.text}</span>
                  </Label>
                </div>
              ))}
            </div>
          ) : question.questionType === 'Fill in the Blank' || question.questionType === 'Numerical' ? (
            <div className="max-w-md">
              <Input placeholder="Type your answer here..." className="border-gray-300" />
            </div>
          ) : (
            <div className="w-full">
              <textarea 
                className="w-full min-h-[150px] p-3 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your descriptive answer here..."
              ></textarea>
            </div>
          )}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-md">
            <h4 className="font-semibold text-green-800 mb-2">Explanation / Correct Answer</h4>
            <div className="text-sm text-green-900" dangerouslySetInnerHTML={{ __html: question.explanation || 'No explanation provided.' }} />
          </div>
        )}

      </CardContent>
    </Card>
  );
}
