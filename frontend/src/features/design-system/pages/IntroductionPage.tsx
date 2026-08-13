import React from 'react';
import { PageHeader, Section } from '../components/DocumentationHelpers';
import { Layers, Zap, Box, BookOpen } from 'lucide-react';

export function IntroductionPage() {
  return (
    <div>
      <PageHeader 
        title="Practice Exam Design System"
        description="A unified language and component library for building interfaces at scale."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Layers className="w-8 h-8 text-indigo-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Reusable Components</h3>
          <p className="text-slate-600">A comprehensive suite of UI components designed for the exam platform context, reducing duplication and ensuring consistency.</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Zap className="w-8 h-8 text-amber-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Rapid Development</h3>
          <p className="text-slate-600">Pre-built forms, tables, and dialogs mean you can focus on business logic rather than pixel pushing.</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Box className="w-8 h-8 text-sky-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Design Tokens</h3>
          <p className="text-slate-600">Centralized variables for colors, spacing, and typography that drive the visual identity of the entire platform.</p>
        </div>
        <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
          <BookOpen className="w-8 h-8 text-emerald-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-2">Living Documentation</h3>
          <p className="text-slate-600">This module serves as the single source of truth. Always up-to-date with the latest codebase.</p>
        </div>
      </div>

      <Section title="Principles">
        <ul className="list-disc list-inside space-y-3 text-slate-700 ml-4">
          <li><strong>Accessibility First:</strong> All components aim for WCAG AA compliance.</li>
          <li><strong>Responsive by Default:</strong> Components adapt gracefully to mobile, tablet, and desktop viewports.</li>
          <li><strong>Context Agnostic:</strong> Components don't assume where they are placed; they expand to fit their containers.</li>
          <li><strong>Type-Safe:</strong> Built entirely with TypeScript for a robust developer experience.</li>
        </ul>
      </Section>
    </div>
  );
}
