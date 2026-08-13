import React from 'react';
import { PageHeader, Section, TokenTable } from '../components/DocumentationHelpers';

export function TypographyPage() {
  return (
    <div>
      <PageHeader 
        title="Typography"
        description="Fonts, sizes, weights, and line heights."
      />

      <Section title="Font Families" description="We use system fonts to ensure fast loading times and native feel across OS platforms.">
        <div className="p-6 bg-white border border-slate-200 rounded-xl mb-4">
          <div className="text-4xl font-sans text-slate-900 mb-2">Inter, system-ui, sans-serif</div>
          <p className="text-slate-500">Primary Font Family (sans)</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl">
          <div className="text-4xl font-mono text-slate-900 mb-2">ui-monospace, SFMono-Regular</div>
          <p className="text-slate-500">Monospace Font Family (mono) - Used for code, keys, and specific data points.</p>
        </div>
      </Section>

      <Section title="Font Sizes">
        <div className="space-y-6 bg-white p-8 border border-slate-200 rounded-xl">
          <div className="flex items-end gap-6 border-b border-slate-100 pb-4">
            <div className="w-24 text-sm text-slate-400 font-mono">text-xs</div>
            <div className="text-xs text-slate-900">The quick brown fox jumps over the lazy dog.</div>
          </div>
          <div className="flex items-end gap-6 border-b border-slate-100 pb-4">
            <div className="w-24 text-sm text-slate-400 font-mono">text-sm</div>
            <div className="text-sm text-slate-900">The quick brown fox jumps over the lazy dog.</div>
          </div>
          <div className="flex items-end gap-6 border-b border-slate-100 pb-4">
            <div className="w-24 text-sm text-slate-400 font-mono">text-base</div>
            <div className="text-base text-slate-900">The quick brown fox jumps over the lazy dog.</div>
          </div>
          <div className="flex items-end gap-6 border-b border-slate-100 pb-4">
            <div className="w-24 text-sm text-slate-400 font-mono">text-lg</div>
            <div className="text-lg font-medium text-slate-900">The quick brown fox jumps over the lazy dog.</div>
          </div>
          <div className="flex items-end gap-6 border-b border-slate-100 pb-4">
            <div className="w-24 text-sm text-slate-400 font-mono">text-xl</div>
            <div className="text-xl font-bold text-slate-900">The quick brown fox jumps over the lazy dog.</div>
          </div>
          <div className="flex items-end gap-6">
            <div className="w-24 text-sm text-slate-400 font-mono">text-3xl</div>
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">The quick brown fox jumps...</div>
          </div>
        </div>
      </Section>
    </div>
  );
}
