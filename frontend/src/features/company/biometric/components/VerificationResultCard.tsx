import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface VerificationResultCardProps {
  score: number | null;
  onRetry: () => void;
  onManualReview: () => void;
}

export function VerificationResultCard({ score, onRetry, onManualReview }: VerificationResultCardProps) {
  if (score === null) return null;

  const isVerified = score >= 85;
  const isFailed = score < 60;
  const needsReview = score >= 60 && score < 85;

  return (
    <Card className="border-slate-200 shadow-sm mt-6 overflow-hidden">
      <div className={`h-2 w-full ${isVerified ? 'bg-emerald-500' : isFailed ? 'bg-red-500' : 'bg-amber-500'}`} />
      <CardContent className="p-6 text-center">
        
        {isVerified && (
          <div className="space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Verification Successful</h3>
              <p className="text-slate-500 mt-1">Match Score: <span className="font-bold text-emerald-600">{score.toFixed(1)}%</span></p>
            </div>
            <p className="text-sm text-slate-600 bg-emerald-50 p-3 rounded-md">Candidate identity confirmed. You may allow entry.</p>
          </div>
        )}

        {isFailed && (
          <div className="space-y-4">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Verification Failed</h3>
              <p className="text-slate-500 mt-1">Match Score: <span className="font-bold text-red-600">{score.toFixed(1)}%</span></p>
            </div>
            <p className="text-sm text-slate-600 bg-red-50 p-3 rounded-md">Candidate identity could not be confirmed.</p>
            <div className="flex gap-3 justify-center pt-2">
              <Button onClick={onRetry} variant="outline" className="w-full">Retry Capture</Button>
            </div>
          </div>
        )}

        {needsReview && (
          <div className="space-y-4">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-slate-900">Manual Review Required</h3>
              <p className="text-slate-500 mt-1">Match Score: <span className="font-bold text-amber-600">{score.toFixed(1)}%</span></p>
            </div>
            <p className="text-sm text-slate-600 bg-amber-50 p-3 rounded-md">Confidence is too low for automatic verification.</p>
            <div className="flex gap-3 justify-center pt-2">
              <Button onClick={onRetry} variant="outline" className="flex-1">Retry Capture</Button>
              <Button onClick={onManualReview} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white">Manual Override</Button>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
