import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Check, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const steps = [
  { id: 1, name: 'General Information' },
  { id: 2, name: 'Schedule' },
  { id: 3, name: 'Capacity' },
  { id: 4, name: 'Preview' },
];

export const ShiftWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  return (
    <div className="space-y-8">
      {/* Stepper */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              <div
                className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                  currentStep > step.id
                    ? 'border-blue-600'
                    : currentStep === step.id
                    ? 'border-blue-600'
                    : 'border-slate-200'
                }`}
              >
                <span className={`text-sm font-medium ${
                  currentStep > step.id ? 'text-blue-600' : currentStep === step.id ? 'text-blue-600' : 'text-slate-500'
                }`}>
                  Step {step.id}
                </span>
                <span className={`text-sm font-medium ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Content Area */}
      <Card className="min-h-[400px]">
        <CardContent className="p-8 flex items-center justify-center h-full">
          {currentStep === 1 && (
            <div className="text-center w-full max-w-md">
              <h3 className="text-xl font-medium text-slate-800 mb-4">General Information Setup</h3>
              <p className="text-slate-500 mb-8">Enter the basic details like shift name, code, exam, and location.</p>
              <div className="h-40 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 bg-slate-50">
                [General Fields Placeholder]
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div className="text-center w-full max-w-md">
              <h3 className="text-xl font-medium text-slate-800 mb-4">Schedule Setup</h3>
              <p className="text-slate-500 mb-8">Define the date, session, reporting time, and exam timings.</p>
              <div className="h-40 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 bg-slate-50">
                [Schedule Fields Placeholder]
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="text-center w-full max-w-md">
              <h3 className="text-xl font-medium text-slate-800 mb-4">Capacity Setup</h3>
              <p className="text-slate-500 mb-8">Set maximum capacity and reserved seat allocations.</p>
              <div className="h-40 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 bg-slate-50">
                [Capacity Fields Placeholder]
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <div className="text-center w-full max-w-md">
              <h3 className="text-xl font-medium text-slate-800 mb-4">Review & Submit</h3>
              <p className="text-slate-500 mb-8">Review all settings before creating the shift.</p>
              <div className="h-40 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-400 bg-slate-50">
                [Preview Summary Placeholder]
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? () => navigate('/company/shifts') : handlePrev}
        >
          {currentStep === 1 ? 'Cancel' : (
            <><ChevronLeft className="w-4 h-4 mr-2" /> Previous Step</>
          )}
        </Button>
        <Button onClick={currentStep === steps.length ? () => navigate('/company/shifts') : handleNext}>
          {currentStep === steps.length ? (
            <><Check className="w-4 h-4 mr-2" /> Create Shift</>
          ) : (
            <>Next Step <ChevronRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  );
};
