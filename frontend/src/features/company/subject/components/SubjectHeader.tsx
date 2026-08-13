import React from 'react';

interface SubjectHeaderProps {
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function SubjectHeader({ title, description, actions }: SubjectHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
