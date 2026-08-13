import React from 'react';
import { PageHeader, Section } from '../components/DocumentationHelpers';

export function LayoutSystemPage() {
  return (
    <div>
      <PageHeader 
        title="Layout System"
        description="Grids, spacing, and structural components."
      />

      <Section title="Spacing Scale" description="We use Tailwind's default spacing scale (1 unit = 0.25rem / 4px).">
        <div className="space-y-4">
          {[1, 2, 4, 6, 8, 12, 16].map(unit => (
            <div key={unit} className="flex items-center gap-4">
              <div className="w-16 text-sm font-mono text-slate-500">space-{unit}</div>
              <div className="w-16 text-sm text-slate-400">{unit * 4}px</div>
              <div className="bg-indigo-500 h-4 rounded-sm" style={{ width: `${unit * 0.25}rem` }}></div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Standard Container" description="Most pages are wrapped in a standard max-width container with responsive padding.">
        <div className="bg-slate-200 p-4 rounded-xl border border-slate-300">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center text-slate-500 font-mono text-sm border-dashed">
            max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
          </div>
        </div>
      </Section>
    </div>
  );
}
