import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Laptop, PlayCircle } from 'lucide-react';

export function MockTestPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="Mock Tests" 
        description="Familiarize yourself with the exam interface before the real test." 
      />

      <Card className="border-slate-200 shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Laptop className="w-5 h-5 text-indigo-600" />
            General Instructions Mock Test
          </CardTitle>
          <CardDescription>
            This mock test does not affect your final score. It is designed to help you understand the navigation, question types, and interface of the actual exam.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg mb-6 text-sm text-slate-700">
            <ul className="list-disc pl-5 space-y-2">
              <li>Duration: 15 Minutes</li>
              <li>Questions: 10 Objective Type</li>
              <li>Requires stable internet connection</li>
            </ul>
          </div>
          <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700">
            <PlayCircle className="w-4 h-4 mr-2" />
            Start Mock Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
