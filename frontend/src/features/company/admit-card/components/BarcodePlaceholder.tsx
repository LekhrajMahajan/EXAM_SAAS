import React from 'react';

export function BarcodePlaceholder({ value }: { value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-10 w-48 bg-white flex items-end overflow-hidden border border-slate-200">
        <div className="h-full w-1 bg-black ml-1" />
        <div className="h-full w-2 bg-black ml-1" />
        <div className="h-full w-1 bg-black ml-2" />
        <div className="h-full w-3 bg-black ml-1" />
        <div className="h-full w-1 bg-black ml-2" />
        <div className="h-full w-2 bg-black ml-1" />
        <div className="h-full w-1 bg-black ml-1" />
        <div className="h-full w-2 bg-black ml-3" />
        <div className="h-full w-1 bg-black ml-1" />
        <div className="h-full w-4 bg-black ml-2" />
        <div className="h-full w-1 bg-black ml-1" />
        <div className="h-full w-2 bg-black ml-1" />
        <div className="h-full w-1 bg-black ml-2" />
        <div className="h-full w-2 bg-black ml-1" />
      </div>
      <span className="text-xs font-mono tracking-widest text-slate-700">{value}</span>
    </div>
  );
}
