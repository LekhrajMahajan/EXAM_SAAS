import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { FileQuestion, CheckCircle2, Clock, XCircle, FileEdit } from 'lucide-react';

interface QuestionStatisticsProps {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  draft: number;
}

export function QuestionStatistics({ total, approved, pending, rejected, draft }: QuestionStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Questions</p>
            <h3 className="text-2xl font-bold mt-1">{total}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
            <FileQuestion size={20} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Approved</p>
            <h3 className="text-2xl font-bold mt-1">{approved}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-full">
            <CheckCircle2 size={20} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
            <h3 className="text-2xl font-bold mt-1">{pending}</h3>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-full">
            <Clock size={20} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Rejected</p>
            <h3 className="text-2xl font-bold mt-1">{rejected}</h3>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-full">
            <XCircle size={20} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Draft</p>
            <h3 className="text-2xl font-bold mt-1">{draft}</h3>
          </div>
          <div className="p-3 bg-gray-50 text-gray-600 rounded-full">
            <FileEdit size={20} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
