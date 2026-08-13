import type { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const DashboardHeader = ({ title, description, actions }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
