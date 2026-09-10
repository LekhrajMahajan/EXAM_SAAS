import React from 'react';
import { MASettingsSidebar } from './MASettingsSidebar';

interface MASettingsLayoutProps {
  children: React.ReactNode;
}

export function MASettingsLayout({ children }: MASettingsLayoutProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-8rem)]">
       {/* Sidebar for Settings Navigation */}
       <div className="w-full md:w-64 flex-shrink-0">
          <MASettingsSidebar />
       </div>
       
       {/* Main Content Area */}
       <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {children}
       </div>
    </div>
  );
}
