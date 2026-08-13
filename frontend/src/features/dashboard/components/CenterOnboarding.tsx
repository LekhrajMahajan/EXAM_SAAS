import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';
import { CheckCircle2, FileText, Upload, AlertCircle, FileCheck, CheckSquare, Download } from 'lucide-react';
import { centerApi } from '@/features/company/center/api/center.api';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/shared/components/ui/input';

interface CenterOnboardingProps {
  onboardingData: any;
  onComplete: () => void;
}

export const CenterOnboarding: React.FC<CenterOnboardingProps> = ({ onboardingData, onComplete }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documents, setDocuments] = useState<any[]>(onboardingData?.documents || []);

  const hasAcceptedAgreement = !!onboardingData?.agreementDetails?.acceptedTime;
  const isPendingVerification = onboardingData?.setupStatus === 'PENDING_VERIFICATION';

  useEffect(() => {
    if (isPendingVerification) {
      setStep(3);
    } else if (hasAcceptedAgreement) {
      setStep(2);
    } else {
      setStep(1);
    }
  }, [hasAcceptedAgreement, isPendingVerification]);

  const handleAcceptAgreement = async () => {
    try {
      setIsSubmitting(true);
      await centerApi.saveOnboardingStep('agreement', {
        accepted: true
      });
      toast({ title: 'Agreement accepted successfully' });
      setStep(2);
    } catch (err: any) {
      toast({ title: 'Failed to accept agreement', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (documentType: string, file: File) => {
    // In a real app, you would upload the file to S3/Cloud Storage here and get the URL.
    // For this demonstration, we'll create a fake URL.
    const fakeFileUrl = URL.createObjectURL(file);
    
    const updatedDocs = documents.map(doc => {
      if (doc.documentType === documentType) {
        return {
          ...doc,
          fileName: file.name,
          fileUrl: fakeFileUrl,
          status: 'PENDING',
          rejectionReason: '',
        };
      }
      return doc;
    });

    try {
      await centerApi.saveOnboardingStep('documents', {
        documents: updatedDocs
      });
      setDocuments(updatedDocs);
      toast({ title: `${documentType} uploaded successfully` });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    }
  };

  const handleSubmitForReview = async () => {
    try {
      setIsSubmitting(true);
      await centerApi.submitOnboarding();
      toast({ title: 'Documents submitted for review' });
      setStep(3);
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const allMandatoryUploaded = documents.every((doc: any) => doc.fileUrl && doc.status !== 'REJECTED');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 mt-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Center Onboarding</h1>
        <p className="text-muted-foreground">Please complete the setup process to activate your center.</p>
      </div>

      {step === 1 && (
        <Card className="border-indigo-100 shadow-md">
          <CardHeader className="bg-indigo-50/50 border-b">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Step 1: Instructions & Commercial Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {onboardingData?.commercialAgreement?.map((agreement: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-lg bg-slate-50">
                  <h3 className="font-semibold text-lg mb-3">{agreement.shiftName}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Price per Candidate:</span> <span className="font-medium">₹{agreement.pricePerCandidate}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Candidate Capacity:</span> <span className="font-medium">{agreement.candidateCapacity}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Minimum Guarantee:</span> <span className="font-medium">{agreement.minimumGuarantee || 0}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <Alert>
              <CheckSquare className="h-4 w-4" />
              <AlertTitle>Required Documents Checklist</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Signed Memorandum of Understanding (MOU)</li>
                  <li>PAN Card</li>
                  <li>Aadhaar Card</li>
                  <li>GST Certificate (if applicable)</li>
                  <li>Cancelled Cheque</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between bg-slate-50/50 border-t p-6">
            <Button variant="outline" onClick={() => window.open(onboardingData.mouPdfUrl || '#', '_blank')}>
              <Download className="mr-2 h-4 w-4" /> Download MOU Template
            </Button>
            <Button onClick={handleAcceptAgreement} disabled={isSubmitting}>
              Accept Agreement & Continue
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-md">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Step 2: Upload Required Documents
            </CardTitle>
            <CardDescription>
              Please upload clear copies of all required documents. Once submitted, the Company Admin will review them.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {documents.map((doc: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="flex-1">
                  <h4 className="font-medium flex items-center gap-2">
                    {doc.documentType} {doc.isMandatory && <span className="text-red-500">*</span>}
                    {doc.status === 'APPROVED' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {doc.status === 'REJECTED' && <AlertCircle className="h-4 w-4 text-red-500" />}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {doc.fileUrl ? (
                      <span className="flex items-center gap-1 text-indigo-600"><FileCheck className="h-3 w-3"/> {doc.fileName}</span>
                    ) : (
                      "No file uploaded yet."
                    )}
                  </p>
                  
                  {doc.status === 'REJECTED' && (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Document Rejected</AlertTitle>
                      <AlertDescription className="text-sm">
                        <strong>Reason:</strong> {doc.rejectionReason}
                        <br/>
                        {doc.correctionNotes && <span><strong>Notes:</strong> {doc.correctionNotes}</span>}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="shrink-0 flex items-center gap-2">
                   {doc.status !== 'APPROVED' && (
                     <div className="relative">
                       <Input 
                         type="file" 
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                         onChange={(e) => {
                           if (e.target.files?.[0]) handleFileUpload(doc.documentType, e.target.files[0]);
                         }}
                         accept=".pdf,.jpg,.jpeg,.png"
                       />
                       <Button variant={doc.status === 'REJECTED' ? 'destructive' : 'outline'}>
                         {doc.fileUrl ? 'Re-upload' : 'Upload File'}
                       </Button>
                     </div>
                   )}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end p-6 border-t bg-slate-50/50">
            <Button onClick={handleSubmitForReview} disabled={!allMandatoryUploaded || isSubmitting}>
              Submit for Verification
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-amber-100 shadow-md">
          <CardContent className="pt-10 pb-10 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
              <FileCheck className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Documents Under Review</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your uploaded documents have been submitted to the Company Admin for verification. 
              You will receive an email notification once your center is activated, or if any documents require re-uploading.
            </p>
            <div className="pt-4">
              <Button variant="outline" onClick={() => window.location.reload()}>Refresh Status</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
