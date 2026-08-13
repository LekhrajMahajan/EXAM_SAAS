import React from 'react';

export function DynamicFormLayout({ children, onSubmit, className = '' }: { children: React.ReactNode, onSubmit?: (e: React.FormEvent) => void, className?: string }) {
  return (
    <form onSubmit={onSubmit} className={`space-y-8 ${className}`}>
      {children}
    </form>
  );
}

export function SectionLayout({ title, description, children, className = '' }: { title: string, description?: string, children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

export function FieldWrapper({ label, error, required, children, description }: { label: string, error?: string, required?: boolean, children: React.ReactNode, description?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {description && !error && <p className="text-xs text-slate-500">{description}</p>}
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
}

export function ValidationSummary({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
      <h4 className="text-sm font-bold text-rose-800 mb-2">Please fix the following errors:</h4>
      <ul className="list-disc list-inside text-sm text-rose-600 space-y-1">
        {errors.map((err, i) => <li key={i}>{err}</li>)}
      </ul>
    </div>
  );
}
