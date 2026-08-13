import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { CandidateSelector } from './CandidateSelector';
import { SeatAllocationCard } from './SeatAllocationCard';
import { AssignmentPreview } from './AssignmentPreview';
import { Card, CardContent } from '@/shared/components/ui/card';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 'scope', title: 'Exam Scope' },
  { id: 'candidates', title: 'Candidates' },
  { id: 'allocation', title: 'Room Allocation' },
  { id: 'preview', title: 'Preview & Confirm' },
];

export function AssignmentWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    } else {
      navigate('/company/candidate-assignment');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(curr => curr - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 rounded-full" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors z-10 ${
                  isActive ? 'bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-50' : 
                  isCompleted ? 'bg-indigo-100 text-indigo-700' : 
                  'bg-white border-2 border-slate-200 text-slate-500'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isActive ? 'text-indigo-900' : 
                  isCompleted ? 'text-indigo-700' : 
                  'text-slate-500'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <Card className="border-slate-200 shadow-sm min-h-[400px]">
        <CardContent className="p-6">
          {currentStep === 0 && (
            <div className="space-y-6 max-w-2xl mx-auto py-6">
              <div className="text-center mb-8">
                <h3 className="text-lg font-medium text-slate-900">Select Exam Scope</h3>
                <p className="text-sm text-slate-500">Choose the exam and location context for this assignment.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Exam</Label>
                  <Select defaultValue="ex1">
                    <SelectTrigger><SelectValue placeholder="Select Exam" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ex1">EX-2026-SPRING</SelectItem>
                      <SelectItem value="ex2">EX-2026-SUMMER</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Shift</Label>
                  <Select defaultValue="s1">
                    <SelectTrigger><SelectValue placeholder="Select Shift" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1">Morning Shift (09:00 AM)</SelectItem>
                      <SelectItem value="s2">Evening Shift (02:00 PM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Select defaultValue="b1">
                    <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="b1">NY Main Campus</SelectItem>
                      <SelectItem value="b2">LA Tech Hub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Center</Label>
                  <Select defaultValue="c1">
                    <SelectTrigger><SelectValue placeholder="Select Center" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="c1">CTR-NY-01</SelectItem>
                      <SelectItem value="c2">CTR-NY-02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="py-2">
              <CandidateSelector />
            </div>
          )}

          {currentStep === 2 && (
            <div className="py-2 max-w-3xl mx-auto">
              <SeatAllocationCard />
            </div>
          )}

          {currentStep === 3 && (
            <div className="py-2 max-w-3xl mx-auto">
              <AssignmentPreview />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button onClick={handleNext}>
          {currentStep === STEPS.length - 1 ? (
            <>Confirm Assignment <Check className="w-4 h-4 ml-2" /></>
          ) : (
            <>Next Step <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
