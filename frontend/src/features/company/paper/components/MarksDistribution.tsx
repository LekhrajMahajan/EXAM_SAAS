import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface MarksDistributionProps {
  blueprint?: {
    mcqCount: number;
    msqCount: number;
    tfCount: number;
    descriptiveCount: number;
  };
}

export const MarksDistribution: React.FC<MarksDistributionProps> = ({ blueprint }) => {
  const total = blueprint 
    ? blueprint.mcqCount + blueprint.msqCount + blueprint.tfCount + blueprint.descriptiveCount 
    : 0;

  const getPercentage = (val: number) => total > 0 ? Math.round((val / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Marks / Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="text-sm text-slate-500 text-center py-6">No data available</div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>MCQ ({blueprint?.mcqCount})</span>
                <span className="font-medium">{getPercentage(blueprint?.mcqCount || 0)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-primary rounded-full h-2" style={{ width: `${getPercentage(blueprint?.mcqCount || 0)}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>MSQ ({blueprint?.msqCount})</span>
                <span className="font-medium">{getPercentage(blueprint?.msqCount || 0)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 rounded-full h-2" style={{ width: `${getPercentage(blueprint?.msqCount || 0)}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>True/False ({blueprint?.tfCount})</span>
                <span className="font-medium">{getPercentage(blueprint?.tfCount || 0)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-green-500 rounded-full h-2" style={{ width: `${getPercentage(blueprint?.tfCount || 0)}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Descriptive ({blueprint?.descriptiveCount})</span>
                <span className="font-medium">{getPercentage(blueprint?.descriptiveCount || 0)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-purple-500 rounded-full h-2" style={{ width: `${getPercentage(blueprint?.descriptiveCount || 0)}%` }} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
