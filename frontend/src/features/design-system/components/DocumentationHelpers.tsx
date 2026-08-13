import React from 'react';

export function PageHeader({ title, description }: { title: string, description: string }) {
  return (
    <div className="mb-10">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{title}</h1>
      <p className="text-lg text-slate-600">{description}</p>
    </div>
  );
}

export function Section({ title, description, children }: { title: string, description?: string, children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-2">{title}</h2>
        {description && <p className="text-slate-600">{description}</p>}
      </div>
      {children}
    </section>
  );
}

export function ComponentPreview({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`p-8 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

export function TokenTable({ columns, data }: { columns: string[], data: any[][] }) {
  return (
    <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {columns.map((c, i) => <th key={i} className="px-4 py-3 font-semibold text-slate-700">{c}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-slate-600">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ColorSwatch({ name, value, className }: { name: string, value: string, className: string }) {
  return (
    <div className="flex flex-col">
      <div className={`h-16 rounded-lg mb-2 border border-slate-200/50 shadow-sm ${className}`} />
      <span className="text-xs font-bold text-slate-800">{name}</span>
      <span className="text-xs text-slate-500 font-mono">{value}</span>
    </div>
  );
}
