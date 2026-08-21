import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  showBack?: boolean;
}

export const DashboardHeader = ({ title, description, actions, showBack }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8">
      <div className="flex items-start gap-3">
        {showBack && (
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-9 w-9 shrink-0 mt-0.5">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
