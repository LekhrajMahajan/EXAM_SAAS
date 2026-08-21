import type { ProctoringState } from '../hooks/useProctoring';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert';

interface ProctoringOverlayProps {
  proctoringState: ProctoringState;
}

export function ProctoringOverlay({ proctoringState }: ProctoringOverlayProps) {
  return (
    <>
      {/* Warnings Overlay */}
      {proctoringState.isWarningActive && !proctoringState.isAutoSubmitted && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4">
          <Alert variant="destructive" className="bg-red-50 border-red-500 shadow-2xl animate-in slide-in-from-top-10">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-red-700 font-bold">
              {proctoringState.activeWarningType === 'FACE_DETECTION' ? 'Face Detection Warning' : 'Multiple/Wrong Face Warning'}
              {' '}({proctoringState.activeWarningType === 'FACE_DETECTION' ? proctoringState.fdWarnings : proctoringState.mfWarnings}
              /{proctoringState.maxWarnings === Infinity ? '∞' : proctoringState.maxWarnings})
            </AlertTitle>
            <AlertDescription className="text-red-600 font-medium mt-1">
              {proctoringState.statusMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
