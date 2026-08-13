import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { RichTextEditor } from './RichTextEditor';
import { OptionEditor } from './OptionEditor';
import { MOCK_SUBJECTS, MOCK_TOPICS, MOCK_CHAPTERS } from '../utils/mockData';

export function QuestionEditor() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();

  const watchQuestionType = watch('questionType');
  const watchDifficulty = watch('difficulty');
  const watchStatus = watch('status');

  return (
    <div className="space-y-8 pb-10">
      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>Basic categorization and question text.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Subject <span className="text-red-500">*</span></Label>
              <Select value={watch('subject')} onValueChange={(val) => setValue('subject', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {/* @ts-ignore */}
              {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Topic <span className="text-red-500">*</span></Label>
              <Select value={watch('topic')} onValueChange={(val) => setValue('topic', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_TOPICS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
              {/* @ts-ignore */}
              {errors.topic && <p className="text-xs text-red-500">{errors.topic.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Chapter <span className="text-red-500">*</span></Label>
              <Select value={watch('chapter')} onValueChange={(val) => setValue('chapter', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CHAPTERS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              {/* @ts-ignore */}
              {errors.chapter && <p className="text-xs text-red-500">{errors.chapter.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Question Type <span className="text-red-500">*</span></Label>
              <Select value={watchQuestionType} onValueChange={(val) => setValue('questionType', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single Choice (MCQ)">Single Choice (MCQ)</SelectItem>
                  <SelectItem value="Multiple Choice (MSQ)">Multiple Choice (MSQ)</SelectItem>
                  <SelectItem value="True / False">True / False</SelectItem>
                  <SelectItem value="Fill in the Blank">Fill in the Blank</SelectItem>
                  <SelectItem value="Numerical">Numerical</SelectItem>
                  <SelectItem value="Descriptive">Descriptive</SelectItem>
                </SelectContent>
              </Select>
              {/* @ts-ignore */}
              {errors.questionType && <p className="text-xs text-red-500">{errors.questionType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Difficulty <span className="text-red-500">*</span></Label>
              <Select value={watchDifficulty} onValueChange={(val) => setValue('difficulty', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              {/* @ts-ignore */}
              {errors.difficulty && <p className="text-xs text-red-500">{errors.difficulty.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Language <span className="text-red-500">*</span></Label>
              <Input placeholder="e.g. English" {...register('language')} />
              {/* @ts-ignore */}
              {errors.language && <p className="text-xs text-red-500">{errors.language.message}</p>}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <Label>Question Text <span className="text-red-500">*</span></Label>
            <RichTextEditor 
              value={watch('questionText')} 
              onChange={(v) => setValue('questionText', v)} 
              placeholder="Enter your question here..."
            />
            {/* @ts-ignore */}
            {errors.questionText && <p className="text-xs text-red-500">{errors.questionText.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Options & Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>Options & Explanation</CardTitle>
          <CardDescription>Provide answer options, marks, and explanation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <OptionEditor />

          <div className="space-y-2 pt-4 border-t">
            <Label>Explanation / Solution</Label>
            <RichTextEditor 
              value={watch('explanation')} 
              onChange={(v) => setValue('explanation', v)} 
              placeholder="Explain the correct answer..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            <div className="space-y-2">
              <Label>Marks <span className="text-red-500">*</span></Label>
              <Input type="number" min={0} {...register('marks', { valueAsNumber: true })} />
              {/* @ts-ignore */}
              {errors.marks && <p className="text-xs text-red-500">{errors.marks.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Negative Marks</Label>
              <Input type="number" min={0} step="0.01" {...register('negativeMarks', { valueAsNumber: true })} />
              {/* @ts-ignore */}
              {errors.negativeMarks && <p className="text-xs text-red-500">{errors.negativeMarks.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Time Limit (Seconds)</Label>
              <Input type="number" min={0} {...register('timeLimitSeconds', { valueAsNumber: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Metadata & Status</CardTitle>
          <CardDescription>Additional information for question banking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Keywords (comma separated)</Label>
              <Input placeholder="e.g. math, calculus, derivatives" {...register('metadata.keywords')} />
            </div>
            
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input placeholder="e.g. Important, PYQ" {...register('metadata.tags')} />
            </div>

            <div className="space-y-2">
              <Label>Bloom's Taxonomy Level</Label>
              <Select value={watch('metadata.bloomsLevel')} onValueChange={(val) => setValue('metadata.bloomsLevel', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Knowledge">Knowledge (Remember)</SelectItem>
                  <SelectItem value="Comprehension">Comprehension (Understand)</SelectItem>
                  <SelectItem value="Application">Application (Apply)</SelectItem>
                  <SelectItem value="Analysis">Analysis (Analyze)</SelectItem>
                  <SelectItem value="Synthesis">Synthesis (Evaluate)</SelectItem>
                  <SelectItem value="Evaluation">Evaluation (Create)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={watchStatus} onValueChange={(val) => setValue('status', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
