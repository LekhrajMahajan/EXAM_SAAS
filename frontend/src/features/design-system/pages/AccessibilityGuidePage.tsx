import React from 'react';
import { PageHeader, Section } from '../components/DocumentationHelpers';
import { Keyboard, MousePointer2, Eye } from 'lucide-react';

export function AccessibilityGuidePage() {
  return (
    <div>
      <PageHeader 
        title="Accessibility Guide"
        description="Guidelines for creating inclusive experiences."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Keyboard className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Keyboard Navigation</h3>
          <p className="text-sm text-slate-600">All interactive elements must be focusable and operable via keyboard. Ensure logical tab order.</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <MousePointer2 className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Focus States</h3>
          <p className="text-sm text-slate-600">Never remove focus outlines without providing a highly visible alternative. We use ring-2 ring-indigo-600.</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Eye className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Color Contrast</h3>
          <p className="text-sm text-slate-600">Text and interactive elements must meet WCAG AA contrast ratio of at least 4.5:1 against their backgrounds.</p>
        </div>
      </div>

      <Section title="ARIA Placeholders">
        <div className="bg-slate-900 text-slate-300 p-6 rounded-xl font-mono text-sm space-y-4">
          <p>{`<button aria-label="Close dialog" aria-expanded="false">...</button>`}</p>
          <p>{`<div role="alert" aria-live="polite">Update successful</div>`}</p>
          <p>{`<nav aria-label="Primary navigation">...</nav>`}</p>
        </div>
      </Section>
    </div>
  );
}
