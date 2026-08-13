import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Search, Filter, Shuffle } from 'lucide-react';
import type { PaperQuestion } from '../types';
import { DUMMY_QUESTIONS } from '../utils/placeholder';

export const QuestionSelector: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Question Selection</CardTitle>
              <CardDescription>Select questions manually or let the system auto-generate based on your blueprint.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
              <Button><Shuffle className="w-4 h-4 mr-2" /> Auto Select</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input placeholder="Search questions..." className="pl-9" />
            </div>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">MCQ</SelectItem>
                <SelectItem value="msq">MSQ</SelectItem>
                <SelectItem value="tf">True/False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md divide-y max-h-[400px] overflow-y-auto">
            {DUMMY_QUESTIONS.map((q) => (
              <div key={q.id} className="p-4 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                <input type="checkbox" className="mt-1" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{q.text}</div>
                  <div className="flex gap-3 text-xs text-slate-500 mt-2">
                    <span className="bg-slate-100 px-2 py-1 rounded">{q.type}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded">{q.difficulty}</span>
                    <span>{q.marks} Marks</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">
            <div>Selected Questions: <strong className="text-primary">0 / 50</strong></div>
            <div>Total Marks: <strong className="text-primary">0 / 100</strong></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
