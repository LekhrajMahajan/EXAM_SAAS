import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickAction {
  title: string;
  icon: LucideIcon;
  path: string;
  colorClass?: string;
}

interface QuickActionCardProps {
  actions: QuickAction[];
}

export const QuickActionCard = ({ actions }: QuickActionCardProps) => {
  return (
    <Card className="col-span-1 h-full border border-slate-200 dark:border-slate-800 shadow-sm bg-card text-card-foreground">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-[#2D3E2C] dark:text-[#E4FD97]">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map((action) => (
            <Link key={action.title} to={action.path} className="block w-full">
              <Button 
                variant="outline" 
                className="w-full h-24 flex flex-col items-center justify-center gap-2 rounded-xl border border-[#2D3E2C]/20 text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:border-[#334155] dark:text-[#E2E8F0] dark:hover:bg-[#2D3E2C] dark:hover:text-[#E4FD97] transition-all duration-200 shadow-sm group hover:-translate-y-0.5"
              >
                <div className="p-2 rounded-lg bg-[#2D3E2C]/5 dark:bg-[#E4FD97]/10 group-hover:bg-[#E4FD97] group-hover:text-[#2D3E2C] transition-colors">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-wrap text-center leading-tight">{action.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

