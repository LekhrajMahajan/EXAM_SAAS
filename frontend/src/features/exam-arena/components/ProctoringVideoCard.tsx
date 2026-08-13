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
  return (
    <div className='flex gap-4 w-full'>
      <div className='flex-1 bg-slate-400 rounded-md flex flex-col items-center justify-center text-slate-800 min-h-[140px] overflow-hidden'>
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
  );
}
