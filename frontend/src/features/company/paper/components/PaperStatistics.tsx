import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { FileText, Edit3, Clock, CheckCircle, XCircle } from 'lucide-react';

export const PaperStatistics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Papers</CardTitle>
          <FileText className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">120</div>
          <p className="text-xs text-slate-500">+4 this month</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Draft Papers</CardTitle>
          <Edit3 className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <p className="text-xs text-slate-500">Currently being edited</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          <Clock className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">8</div>
          <p className="text-xs text-slate-500">Requires approval</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <CheckCircle className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">92</div>
          <p className="text-xs text-slate-500">Ready for use</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <XCircle className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">5</div>
          <p className="text-xs text-slate-500">Needs revision</p>
        </CardContent>
      </Card>
    </div>
  );
};
