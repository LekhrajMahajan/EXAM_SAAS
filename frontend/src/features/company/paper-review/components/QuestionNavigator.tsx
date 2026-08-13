import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';


interface QuestionNavigatorProps {
  questions: { id: string; type: string }[];
  activeQuestionId: string;
  onSelect: (id: string) => void;
}

export const QuestionNavigator: React.FC<QuestionNavigatorProps> = ({ questions, activeQuestionId, onSelect }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-sm font-semibold">Questions ({questions.length})</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="h-[calc(100vh-250px)] overflow-y-auto">
          <div className="p-4 space-y-2">
            {questions.map((q, index) => (
              <Button
                key={q.id}
                variant={activeQuestionId === q.id ? 'default' : 'outline'}
                className="w-full justify-start font-normal"
                onClick={() => onSelect(q.id)}
              >
                <div className="flex justify-between w-full">
                  <span>Q{index + 1}</span>
                  <span className="text-xs opacity-70">{q.type}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
