import React from 'react';
import { PageHeader, Section } from '../components/DocumentationHelpers';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

export function ResponsiveGuidePage() {
  return (
    <div>
      <PageHeader 
        title="Responsive Guide"
        description="How our components adapt to different screen sizes."
      />

      <Section title="Breakpoints">
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Breakpoint Prefix</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Minimum Width</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Device Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-mono text-slate-600">None</td>
                <td className="px-4 py-3 font-mono text-slate-600">&lt; 640px</td>
                <td className="px-4 py-3 flex items-center gap-2"><Smartphone className="w-4 h-4 text-slate-400" /> Mobile</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-slate-600">sm:</td>
                <td className="px-4 py-3 font-mono text-slate-600">640px</td>
                <td className="px-4 py-3 flex items-center gap-2"><Tablet className="w-4 h-4 text-slate-400" /> Large Mobile / Small Tablet</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-slate-600">md:</td>
                <td className="px-4 py-3 font-mono text-slate-600">768px</td>
                <td className="px-4 py-3 flex items-center gap-2"><Tablet className="w-4 h-4 text-slate-400" /> Tablet</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-slate-600">lg:</td>
                <td className="px-4 py-3 font-mono text-slate-600">1024px</td>
                <td className="px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400" /> Desktop</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-slate-600">xl:</td>
                <td className="px-4 py-3 font-mono text-slate-600">1280px</td>
                <td className="px-4 py-3 flex items-center gap-2"><Monitor className="w-4 h-4 text-slate-400" /> Large Desktop</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Responsive Previews">
        <div className="p-8 bg-slate-100 rounded-xl border border-slate-200">
          <p className="text-center text-slate-500 text-sm">
            To test responsiveness, please resize your browser window. All components in this design system use Tailwind's mobile-first responsive utilities.
          </p>
        </div>
      </Section>
    </div>
  );
}
