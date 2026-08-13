import type { ReactNode } from "react";

interface StatisticsGridProps {
  children: ReactNode;
}

export const StatisticsGrid = ({ children }: StatisticsGridProps) => {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 mb-8">
      {children}
    </div>
  );
};
