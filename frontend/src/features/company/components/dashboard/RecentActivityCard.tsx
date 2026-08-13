import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Activity, History } from "lucide-react";

interface ActivityItem {
  id: string | number;
  action: string;
  entity: string;
  time: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
}

export const RecentActivityCard = ({ activities }: RecentActivityCardProps) => {
  return (
    <Card className="col-span-1 h-full border border-slate-200 dark:border-slate-800 shadow-sm bg-card text-card-foreground">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-2">
        <CardTitle className="flex items-center gap-2.5 text-base font-bold text-[#2D3E2C] dark:text-[#E4FD97]">
          <div className="p-1.5 rounded-md bg-[#E4FD97] text-[#2D3E2C] shrink-0">
            <Activity className="h-4 w-4" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3.5 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                <div className="h-2.5 w-2.5 rounded-full bg-[#2D3E2C] dark:bg-[#E4FD97] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug truncate">{activity.action}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {activity.entity}
                  </p>
                </div>
                <div className="shrink-0 font-medium text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[#2D3E2C]/20 dark:border-[#E4FD97]/20 rounded-xl bg-[#2D3E2C]/5 dark:bg-[#2D3E2C]/30 my-2">
            <History className="h-8 w-8 text-[#A5AF79] dark:text-[#E4FD97] mb-2.5 opacity-80" />
            <p className="text-sm font-semibold text-[#2D3E2C] dark:text-[#E4FD97]/90">No recent activity found.</p>
            <p className="text-xs text-slate-500 mt-1">Real-time organization activities will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

