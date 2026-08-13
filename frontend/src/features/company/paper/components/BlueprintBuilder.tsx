import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/components/ui/button';
import { MarksDistribution } from './MarksDistribution';
import { DifficultyDistribution } from './DifficultyDistribution';

export const BlueprintBuilder: React.FC = () => {
  const dummyBlueprint = {
    easyQuestions: 10,
    mediumQuestions: 20,
    hardQuestions: 5,
    mcqCount: 20,
    msqCount: 5,
    tfCount: 5,
    descriptiveCount: 5
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exam Blueprint</CardTitle>
          <CardDescription>Define the structure of the exam by specifying the distribution of questions based on difficulty and type.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-4 text-slate-700">Difficulty Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="w-24">Easy</Label>
                    <Input type="number" defaultValue={10} className="w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-24">Medium</Label>
                    <Input type="number" defaultValue={20} className="w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-24">Hard</Label>
                    <Input type="number" defaultValue={5} className="w-24" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4 text-slate-700">Question Type Distribution</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="w-24">MCQ</Label>
                    <Input type="number" defaultValue={20} className="w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-24">MSQ</Label>
                    <Input type="number" defaultValue={5} className="w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-24">True/False</Label>
                    <Input type="number" defaultValue={5} className="w-24" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Label className="w-24">Descriptive</Label>
                    <Input type="number" defaultValue={5} className="w-24" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <DifficultyDistribution blueprint={dummyBlueprint} />
              <MarksDistribution blueprint={dummyBlueprint} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline">Reset</Button>
        <Button>Save Blueprint</Button>
      </div>
    </div>
  );
};
