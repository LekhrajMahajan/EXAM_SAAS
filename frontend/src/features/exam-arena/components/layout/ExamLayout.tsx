import React from 'react';
import { ExamHeader } from './ExamHeader';

interface ExamLayoutProps {
  children: React.ReactNode;
  headerProps?: any; // or properly type it based on ExamHeaderProps
}

export const ExamLayout = ({ children, headerProps }: ExamLayoutProps) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background selection:bg-secondary/30 selection:text-primary select-none">
      <ExamHeader {...headerProps} />
      <main className="flex-1 flex overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};
