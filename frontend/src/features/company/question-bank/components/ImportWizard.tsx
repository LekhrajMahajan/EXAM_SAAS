import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { TemplateDownloadCard } from './TemplateDownloadCard';
import { CSVUploader, ExcelUploader } from './FileUploader';
import { ValidationSummary } from './ValidationSummary';
import { ImportProgress } from './ImportProgress';
import { ImportPreviewTable } from './ImportPreviewTable';
import { ErrorTable } from './ErrorTable';
import { DuplicateTable } from './DuplicateTable';
import type { QuestionRow } from '../schemas/import-schemas';
import { CheckCircle2, ChevronRight, Download, Upload, AlertCircle, Eye, ShieldCheck, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_QUESTIONS: QuestionRow[] = [
  { id: '1', questionText: 'What is the capital of France?', subject: 'Geography', topic: 'Capitals', difficulty: 'Easy', marks: 1, questionType: 'Multiple Choice', language: 'English', validationStatus: 'valid' },
  { id: '2', questionText: 'Describe the theory of relativity.', subject: 'Physics', topic: 'Modern Physics', difficulty: 'Hard', marks: 10, questionType: 'Subjective', language: 'English', validationStatus: 'valid' },
  { id: '3', questionText: 'Is the earth flat?', subject: 'Science', topic: 'Astronomy', difficulty: 'Easy', marks: 1, questionType: 'True/False', language: 'English', validationStatus: 'valid' },
  { id: '', questionText: 'What is 2+2?', subject: '', topic: 'Basic Math', difficulty: 'Easy', marks: -1, questionType: 'Multiple Choice', language: 'English', validationStatus: 'invalid', errors: ['Subject is required', 'Marks must be greater than 0'] },
  { id: '4', questionText: 'What is the capital of France?', subject: 'Geography', topic: 'Capitals', difficulty: 'Easy', marks: 1, questionType: 'Multiple Choice', language: 'English', validationStatus: 'duplicate' },
];

export function ImportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleFileUpload = (_file: File) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      handleNext(); // Move to Validate File step
    }, 1500);
  };

  const handleValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      handleNext(); // Move to Preview step
    }, 2000);
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 1, label: 'Template', icon: Download },
      { id: 2, label: 'Upload', icon: Upload },
      { id: 3, label: 'Validate', icon: ShieldCheck },
      { id: 4, label: 'Preview', icon: Eye },
      { id: 5, label: 'Errors', icon: AlertCircle },
      { id: 6, label: 'Ready', icon: PlayCircle },
    ];

    return (
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isPast = currentStep > step.id;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center min-w-[80px]">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-colors
                    ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                      isPast ? 'border-primary bg-primary/10 text-primary' : 'border-muted bg-muted text-muted-foreground'}`}
                >
                  {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${isActive || isPast ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full ${isPast ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderStepIndicator()}
      
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && 'Step 1: Download Template'}
            {currentStep === 2 && 'Step 2: Upload File'}
            {currentStep === 3 && 'Step 3: Validate File'}
            {currentStep === 4 && 'Step 4: Preview Questions'}
            {currentStep === 5 && 'Step 5: Resolve Errors'}
            {currentStep === 6 && 'Step 6: Ready for Import'}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Start by downloading the standard template to format your questions correctly.'}
            {currentStep === 2 && 'Upload your populated template file (.csv or .xlsx).'}
            {currentStep === 3 && 'We are checking your file for formatting and validation rules.'}
            {currentStep === 4 && 'Review the parsed data before proceeding.'}
            {currentStep === 5 && 'Review and decide how to handle validation errors and duplicates.'}
            {currentStep === 6 && 'Everything looks good. You are ready to import the questions into the bank.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="py-4">
              <TemplateDownloadCard />
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="py-4">
              <Tabs defaultValue="excel" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="excel">Excel Upload</TabsTrigger>
                  <TabsTrigger value="csv">CSV Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="excel">
                  {isUploading ? (
                    <div className="py-12"><ImportProgress progress={65} label="Uploading file..." /></div>
                  ) : (
                    <ExcelUploader onFileSelect={handleFileUpload} />
                  )}
                </TabsContent>
                <TabsContent value="csv">
                  {isUploading ? (
                    <div className="py-12"><ImportProgress progress={65} label="Uploading file..." /></div>
                  ) : (
                    <CSVUploader onFileSelect={handleFileUpload} />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="py-12 space-y-8 flex flex-col items-center justify-center">
              {isValidating ? (
                <div className="w-full max-w-md space-y-4">
                  <ImportProgress progress={85} label="Validating schemas and logic..." />
                  <p className="text-center text-sm text-muted-foreground">Checking 5 records against question bank rules.</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <ShieldCheck className="w-16 h-16 text-primary mx-auto" />
                  <h3 className="text-xl font-medium">File Uploaded Successfully</h3>
                  <p className="text-muted-foreground">Click validate to run the integrity check.</p>
                  <Button size="lg" onClick={handleValidation} className="mt-4">Run Validation</Button>
                </div>
              )}
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="space-y-6 py-4">
              <ValidationSummary totalRows={5} validRows={3} invalidRows={1} duplicateRows={1} />
              <ImportPreviewTable data={MOCK_QUESTIONS} />
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div className="space-y-6 py-4">
              <Tabs defaultValue="errors" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="errors" className="text-red-600 data-[state=active]:bg-red-100 data-[state=active]:text-red-700">Errors (1)</TabsTrigger>
                  <TabsTrigger value="duplicates" className="text-amber-600 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">Duplicates (1)</TabsTrigger>
                </TabsList>
                <TabsContent value="errors">
                  <div className="mb-4 text-sm text-muted-foreground">
                    Rows with errors will be skipped during import. You can download the error report below to fix and re-upload later.
                  </div>
                  <ErrorTable errors={MOCK_QUESTIONS.filter(q => q.validationStatus === 'invalid')} />
                  <Button variant="outline" className="mt-4 text-red-600 border-red-200 hover:bg-red-50">
                    <Download className="mr-2 h-4 w-4" /> Download Error Report
                  </Button>
                </TabsContent>
                <TabsContent value="duplicates">
                  <div className="mb-4 text-sm text-muted-foreground">
                    Duplicate rows matching existing questions in the bank. They will be skipped by default.
                  </div>
                  <DuplicateTable duplicates={MOCK_QUESTIONS.filter(q => q.validationStatus === 'duplicate')} />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Step 6 */}
          {currentStep === 6 && (
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">Ready for Import</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You are about to import <span className="font-bold text-foreground">3</span> valid questions into the Question Bank. 1 invalid row and 1 duplicate will be skipped.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentStep === 1 || isUploading || isValidating}
          >
            Back
          </Button>
          
          <div className="flex gap-2">
            {currentStep === 6 ? (
              <Button onClick={() => navigate('/company/question-bank')} className="bg-green-600 hover:bg-green-700 text-white">
                Start Import
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                disabled={currentStep === 2 || currentStep === 3}
              >
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
