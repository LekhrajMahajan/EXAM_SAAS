import React from 'react';
import { PageHeader, Section } from '../components/DocumentationHelpers';
import * as Icons from 'lucide-react';

export function IconsPage() {
  const commonIcons = [
    'User', 'Mail', 'Search', 'Bell', 'Settings', 'Home', 'ChevronRight', 'ChevronDown',
    'CheckCircle', 'AlertCircle', 'AlertTriangle', 'XCircle', 'Menu', 'X', 'Download', 'Upload'
  ];

  return (
    <div>
      <PageHeader 
        title="Icons"
        description="We use lucide-react for all system icons."
      />

      <Section title="Common Icons">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {commonIcons.map(name => {
            const Icon = (Icons as any)[name];
            return (
              <div key={name} className="flex flex-col items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 transition-colors group">
                {Icon && <Icon className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 mb-2" />}
                <span className="text-[10px] font-mono text-slate-500 text-center truncate w-full">{name}</span>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
