import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Database, Filter } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export function BulkAssignmentPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Bulk Assignment" 
        description="Allocate candidates in bulk based on exam and center criteria." 
      />
      
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            Bulk Target Criteria
          </CardTitle>
          <CardDescription>Select the criteria to define which candidates will be auto-assigned.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Target Exam</Label>
              <Select defaultValue="ex1">
                <SelectTrigger><SelectValue placeholder="Select Exam" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ex1">EX-2026-SPRING</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Center</Label>
              <Select defaultValue="c1">
                <SelectTrigger><SelectValue placeholder="Select Center" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="c1">CTR-NY-01</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-6 text-center space-y-4">
            <Database className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="max-w-md mx-auto">
              <h4 className="text-sm font-medium text-slate-900">Run Auto-Allocation</h4>
              <p className="text-sm text-slate-500 mt-1">
                The system will automatically assign all unassigned eligible candidates for the selected exam to the target center based on available capacity.
              </p>
            </div>
            <Button size="lg" className="mt-4">Start Bulk Allocation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
