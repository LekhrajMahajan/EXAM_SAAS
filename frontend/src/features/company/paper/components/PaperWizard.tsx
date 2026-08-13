import React, { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { PaperForm } from './PaperForm';
import { QuestionSelector } from './QuestionSelector';
import { BlueprintBuilder } from './BlueprintBuilder';
import { PaperPreview } from './PaperPreview';
import { Validation } from './Validation';
import { DUMMY_PAPERS } from '../utils/placeholder';

const STEPS = [
  { id: 'basic', label: 'Basic Information' },
  { id: 'questions', label: 'Question Selection' },
  { id: 'blueprint', label: 'Blueprint' },
  { id: 'preview', label: 'Preview' },
];

export const PaperWizard: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0:
        return <PaperForm onSubmit={nextStep} />;
      case 1:
        return <QuestionSelector />;
      case 2:
        return <BlueprintBuilder />;
      case 3:
        return <PaperPreview paper={DUMMY_PAPERS[0]} />;
      default:
        return null;
    }
  };

  const dummyValidations = [
    { id: '1', rule: 'Basic information complete', passed: true },
    { id: '2', rule: 'At least one question selected', passed: currentStepIndex > 0 },
    { id: '3', rule: 'Blueprint marks match total marks', passed: currentStepIndex > 1 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Wizard Header / Progress */}
        <div className="bg-white p-4 rounded-lg border flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1 relative">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm z-10
                  ${index < currentStepIndex ? 'bg-success text-white' : 
                    index === currentStepIndex ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}
              >
                {index + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${index <= currentStepIndex ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <div 
                  className={`absolute top-4 left-1/2 w-full h-[2px] -z-10
                    ${index < currentStepIndex ? 'bg-success' : 'bg-slate-200'}`} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Wizard Footer Controls */}
        {currentStepIndex > 0 && (
          <div className="bg-white p-4 rounded-lg border flex justify-between">
            <Button variant="outline" onClick={prevStep}>Previous Step</Button>
            {currentStepIndex < STEPS.length - 1 ? (
              <Button onClick={nextStep}>Next Step</Button>
            ) : (
              <Button variant="success">Publish Paper</Button>
            )}
          </div>
        )}
      </div>

      <div className="w-full lg:w-80">
        <div className="sticky top-6">
          <Validation validations={dummyValidations} />
        </div>
      </div>
    </div>
  );
};
