import React from 'react';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6 pb-8 p-6">
      {children}
    </div>
  );
}
