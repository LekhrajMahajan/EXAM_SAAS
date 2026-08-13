import React from 'react';
import { PageHeader, Section, ColorSwatch } from '../components/DocumentationHelpers';

export function DesignTokensPage() {
  return (
    <div>
      <PageHeader 
        title="Design Tokens & Colors"
        description="The foundational variables that construct our visual identity."
      />

      <Section title="Primary Colors" description="Used for primary actions, active states, and brand moments.">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ColorSwatch name="indigo-50" value="#eef2ff" className="bg-indigo-50" />
          <ColorSwatch name="indigo-100" value="#e0e7ff" className="bg-indigo-100" />
          <ColorSwatch name="indigo-500" value="#6366f1" className="bg-indigo-500" />
          <ColorSwatch name="indigo-600 (Base)" value="#4f46e5" className="bg-indigo-600" />
          <ColorSwatch name="indigo-900" value="#312e81" className="bg-indigo-900" />
        </div>
      </Section>

      <Section title="Neutral Colors" description="Used for backgrounds, borders, and text hierarchy.">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <ColorSwatch name="slate-50" value="#f8fafc" className="bg-slate-50" />
          <ColorSwatch name="slate-200 (Borders)" value="#e2e8f0" className="bg-slate-200" />
          <ColorSwatch name="slate-400 (Muted)" value="#94a3b8" className="bg-slate-400" />
          <ColorSwatch name="slate-600 (Body)" value="#475569" className="bg-slate-600" />
          <ColorSwatch name="slate-900 (Headings)" value="#0f172a" className="bg-slate-900" />
        </div>
      </Section>

      <Section title="Semantic Colors" description="Used to convey state and meaning (Success, Warning, Danger, Info).">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ColorSwatch name="Success (emerald-600)" value="#059669" className="bg-emerald-600" />
          <ColorSwatch name="Warning (amber-500)" value="#f59e0b" className="bg-amber-500" />
          <ColorSwatch name="Danger (rose-600)" value="#e11d48" className="bg-rose-600" />
          <ColorSwatch name="Info (sky-500)" value="#0ea5e9" className="bg-sky-500" />
        </div>
      </Section>
    </div>
  );
}
