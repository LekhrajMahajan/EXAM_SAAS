import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { CandidateCard } from '../components/CandidateCard';
import { CameraCard } from '../components/CameraCard';
import { DeviceStatusCard } from '../components/DeviceStatusCard';
import { VerificationResultCard } from '../components/VerificationResultCard';
import { RetryDialog } from '../components/RetryDialog';
import { ManualReviewDialog } from '../components/ManualReviewDialog';
import { DUMMY_BIOMETRICS, DUMMY_DEVICE_STATUS } from '../utils/placeholder';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export function CandidateVerificationPage() {
  const [searchParams] = useSearchParams();
  const initialAppNo = searchParams.get('appNo');
  const navigate = useNavigate();
  
  // Use a fallback candidate for demonstration if none is found
  const [candidate] = useState(
    initialAppNo ? (DUMMY_BIOMETRICS.find(v => v.applicationNumber === initialAppNo) || DUMMY_BIOMETRICS[2]) : DUMMY_BIOMETRICS[2]
  );
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);
  const [retryOpen, setRetryOpen] = useState(false);
  const [manualReviewOpen, setManualReviewOpen] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    // Simulate biometric capture and processing delay
    setTimeout(() => {
      setIsCapturing(false);
      // Simulate random score based on candidate status for demo purposes
      if (candidate.status === 'Verified') setSimulatedScore(98.5);
      else if (candidate.status === 'Failed') setSimulatedScore(45.2);
      else if (candidate.status === 'Manual Review Required') setSimulatedScore(72.1);
      else setSimulatedScore(Math.random() > 0.5 ? 95.0 : 42.0); // random for pending
    }, 2000);
  };

  const handleRetryConfirm = () => {
    setSimulatedScore(null);
    toast({ title: 'Ready to recapture.', variant: 'default' });
  };

  const handleManualReviewConfirm = (remarks: string) => {
    toast({ title: 'Manual override submitted and logged.', variant: 'success' });
    setTimeout(() => {
      navigate('/company/biometric');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Capture Biometrics" 
        description="Verify candidate identity using biometric devices." 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 space-y-6">
          <CandidateCard candidate={candidate} />
          <DeviceStatusCard status={DUMMY_DEVICE_STATUS} />
        </div>
        
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[600px] flex flex-col">
             <div className="mb-4 pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Face Recognition</h3>
                  <p className="text-sm text-slate-500">Ensure the candidate looks directly into the camera.</p>
                </div>
                {/* Method selector could go here in the future */}
             </div>
             
             <div className="flex-1">
                <CameraCard onCapture={handleCapture} isCapturing={isCapturing} />
                
                {isCapturing && (
                  <div className="mt-6 p-4 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 flex items-center justify-center gap-3 animate-pulse">
                    <span className="w-5 h-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    Analyzing biometric data...
                  </div>
                )}

                {!isCapturing && simulatedScore !== null && (
                  <VerificationResultCard 
                    score={simulatedScore}
                    onRetry={() => setRetryOpen(true)}
                    onManualReview={() => setManualReviewOpen(true)}
                  />
                )}
             </div>
          </div>
        </div>
      </div>

      <RetryDialog open={retryOpen} onOpenChange={setRetryOpen} onConfirm={handleRetryConfirm} />
      <ManualReviewDialog open={manualReviewOpen} onOpenChange={setManualReviewOpen} onConfirm={handleManualReviewConfirm} />
    </div>
  );
}
