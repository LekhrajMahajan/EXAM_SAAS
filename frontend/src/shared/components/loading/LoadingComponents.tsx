import React from 'react';
import { Loader2 } from 'lucide-react';

export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
}

export function ButtonLoader({ text = 'Processing' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number, cols?: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded animate-pulse flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div key={c} className="h-4 bg-slate-100 rounded animate-pulse flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full animate-pulse" />
        <div className="h-3 bg-slate-100 rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 max-w-2xl">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse" />
          <div className="h-10 bg-slate-100 rounded w-full animate-pulse" />
        </div>
      ))}
      <div className="h-10 bg-slate-200 rounded w-32 animate-pulse mt-8" />
    </div>
  );
}
