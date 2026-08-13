import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface DifficultyDistributionProps {
  blueprint?: {
    easyQuestions: number;
    mediumQuestions: number;
    hardQuestions: number;
  };
}

export const DifficultyDistribution: React.FC<DifficultyDistributionProps> = ({ blueprint }) => {
  const total = blueprint 
    ? blueprint.easyQuestions + blueprint.mediumQuestions + blueprint.hardQuestions 
    : 0;

  const getPercentage = (val: number) => total > 0 ? Math.round((val / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Difficulty Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">No data available</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Easy ({blueprint?.easyQuestions})</span>
                <span className="font-medium">{getPercentage(blueprint?.easyQuestions || 0)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-success rounded-full h-2" style={{ width: `${getPercentage(blueprint?.easyQuestions || 0)}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Medium ({blueprint?.mediumQuestions})</span>
                <span className="font-medium">{getPercentage(blueprint?.mediumQuestions || 0)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-warning rounded-full h-2" style={{ width: `${getPercentage(blueprint?.mediumQuestions || 0)}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Hard ({blueprint?.hardQuestions})</span>
                <span className="font-medium">{getPercentage(blueprint?.hardQuestions || 0)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-destructive rounded-full h-2" style={{ width: `${getPercentage(blueprint?.hardQuestions || 0)}%` }} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
