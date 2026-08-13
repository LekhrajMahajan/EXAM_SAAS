import React from 'react';

export function QRCodePlaceholder({ value }: { value?: string }) {
  return (
    <div className="w-24 h-24 bg-white border-2 border-slate-900 p-1 flex items-center justify-center flex-col gap-1 relative">
      {/* Simulate QR code pattern */}
      <div className="absolute top-1.5 left-1.5 w-4 h-4 border-2 border-slate-900" />
      <div className="absolute top-1.5 right-1.5 w-4 h-4 border-2 border-slate-900" />
      <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-2 border-slate-900" />
      <div className="w-10 h-10 border border-slate-900 bg-slate-900" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 20%, 20% 20%, 20% 100%, 0% 100%)' }} />
      <div className="w-8 h-8 border border-slate-900 bg-slate-900" style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 80%, 20% 80%, 20% 0%, 0% 0%)' }} />
      {value && <span className="text-[6px] absolute bottom-0.5 w-full text-center truncate px-1 text-slate-500">{value}</span>}
    </div>
  );
}
