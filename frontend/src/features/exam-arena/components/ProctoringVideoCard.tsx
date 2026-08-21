import React from 'react';

interface ProctoringVideoCardProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  statusMessage?: string;
  title?: string;
  baselineImage?: string | null;
}

export function ProctoringVideoCard({ 
  videoRef, 
  statusMessage = "Camera Active",
  title = "Live Proctoring",
  baselineImage
}: ProctoringVideoCardProps) {
  // Only display as warning if it's not a normal operational state message
  const isWarning = statusMessage !== "Camera Active" && 
                    statusMessage !== "Starting camera..." && 
                    statusMessage !== "Loading face detection models..." && 
                    statusMessage !== "Proctoring Active";

  return (
    <div className='flex flex-col gap-2 w-full'>
      {isWarning && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded-md text-sm font-semibold text-center animate-pulse">
          {statusMessage}
        </div>
      )}
      <div className='flex gap-4 w-full'>
        <div className={`flex-1 bg-slate-400 rounded-md flex flex-col items-center justify-center text-slate-800 min-h-[140px] overflow-hidden ${isWarning ? 'ring-2 ring-destructive ring-offset-2' : ''}`}>
        <div className='relative w-full h-full bg-black/10 flex items-center justify-center'>
          <video
            ref={videoRef as React.RefObject<HTMLVideoElement>}
            className='absolute inset-0 w-full h-full object-cover'
            autoPlay
            playsInline
            muted
          />
        </div>
      </div>
      <div className='flex-1 bg-slate-400 rounded-md flex flex-col items-center justify-center text-slate-800 min-h-[140px] overflow-hidden'>
        <div className='relative w-full h-full bg-black/10 flex items-center justify-center'>
          {baselineImage ? (
            <img src={baselineImage} alt="Baseline Face" className='absolute inset-0 w-full h-full object-cover' />
          ) : (
             <span className="text-xs text-slate-600">No Baseline</span>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
