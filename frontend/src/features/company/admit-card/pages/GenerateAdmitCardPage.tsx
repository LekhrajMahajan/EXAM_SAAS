import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Printer, Settings2, Users } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group';
import { Input } from '@/shared/components/ui/input';
import { useNavigate } from 'react-router-dom';

export function GenerateAdmitCardPage() {
  const [scope, setScope] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      navigate('/company/admit-cards');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader 
        title="Generate Admit Cards" 
        description="Configure and generate admit cards for assigned candidates." 
      />
      
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-600" />
            Generation Parameters
          </CardTitle>
          <CardDescription>Select the exam and the candidates you wish to generate cards for.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Select Exam</Label>
              <Select defaultValue="ex1">
                <SelectTrigger><SelectValue placeholder="Select Exam" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ex1">EX-2026-SPRING</SelectItem>
                  <SelectItem value="ex2">EX-2026-SUMMER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Shift (Optional)</Label>
              <Select defaultValue="all">
                <SelectTrigger><SelectValue placeholder="All Shifts" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="s1">Morning Shift</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium text-slate-900">Target Audience</Label>
            <RadioGroup value={scope} onValueChange={setScope} className="space-y-3">
              <div className="flex items-center space-x-2 border border-slate-200 p-4 rounded-md bg-white">
                <RadioGroupItem value="all" id="scope-all" />
                <Label htmlFor="scope-all" className="flex-1 cursor-pointer">
                  <span className="block font-medium">All Eligible Candidates</span>
                  <span className="block text-sm text-slate-500 font-normal mt-0.5">Generate for all candidates who have been assigned a room/seat but don't have an admit card yet.</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border border-slate-200 p-4 rounded-md bg-white">
                <RadioGroupItem value="single" id="scope-single" />
                <Label htmlFor="scope-single" className="flex-1 cursor-pointer">
                  <span className="block font-medium">Single Candidate</span>
                  <span className="block text-sm text-slate-500 font-normal mt-0.5">Generate or regenerate a card for a specific candidate.</span>
                </Label>
              </div>
            </RadioGroup>

            {scope === 'single' && (
              <div className="ml-8 mt-2 space-y-2">
                <Label>Application Number</Label>
                <Input placeholder="Enter Application Number (e.g. APP-2026-001)" className="max-w-md" />
              </div>
            )}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-6 text-center space-y-4">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <div className="max-w-md mx-auto">
              <h4 className="text-sm font-medium text-slate-900">Ready to Generate</h4>
              <p className="text-sm text-slate-500 mt-1">
                Click below to start generating the PDFs and updating the database.
              </p>
            </div>
            <Button size="lg" className="mt-4" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <><Printer className="w-4 h-4 mr-2" /> Start Generation</>
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
