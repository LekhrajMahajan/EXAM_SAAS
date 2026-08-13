import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyModuleWidgetProps {
  title: string;
  icon: LucideIcon;
  message?: string;
  className?: string;
}

export const EmptyModuleWidget = ({ title, icon: Icon, message, className }: EmptyModuleWidgetProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-slate-400" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg bg-slate-50/50">
          <AlertCircle className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-600">Module Unavailable</p>
          <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
            {message || `The ${title.toLowerCase()} service is currently not connected or lacks an API endpoint.`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
