import React from 'react';

export function DashboardGrid({ children, columns = 3 }: { children: React.ReactNode, columns?: 2 | 3 | 4 }) {
  const colClass = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${colClass} gap-6`}>
      {children}
    </div>
  );
}
