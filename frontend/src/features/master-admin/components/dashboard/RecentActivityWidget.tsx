import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { History } from "lucide-react";
import { useRecentActivityLogs } from "../../hooks/activity-log.hooks";
import { Badge } from "@/shared/components/ui/badge";

export const RecentActivityWidget = () => {
  const { data: response, isLoading, isError } = useRecentActivityLogs(5);

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20 rounded-md shrink-0">
            <History className="h-4 w-4" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="text-sm text-red-500 p-4 border border-dashed rounded bg-red-50 text-center">
            Failed to load recent activity.
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !response?.data?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#2D3E2C]/20 rounded-lg bg-[#2D3E2C]/5 empty-state-box">
            <History className="h-8 w-8 text-[#A5AF79] mb-2 opacity-80 empty-state-icon" />
            <p className="text-sm font-medium text-[#2D3E2C] empty-state-title">No recent activity found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {response.data.map((activity, i) => {
              const getMethodInfo = (title: string) => {
                const upper = title.toUpperCase();
                if (upper.startsWith('GET')) return { abbr: 'G', colors: 'bg-[#E4FD97] text-[#2D3E2C]' };
                if (upper.startsWith('POST')) return { abbr: 'Po', colors: 'bg-[#A5AF79] text-white' };
                if (upper.startsWith('PUT')) return { abbr: 'Pu', colors: 'bg-[#827148] text-white' };
                if (upper.startsWith('PATCH')) return { abbr: 'Pa', colors: 'bg-[#827148] text-white' };
                if (upper.startsWith('DELETE')) return { abbr: 'D', colors: 'bg-[#2D3E2C] text-white' };
                
                return { abbr: activity.activityType?.substring(0, 1) || 'C', colors: 'bg-[#A5AF79] text-white' };
              };
              
              const { abbr, colors } = getMethodInfo(activity.title || '');

              return (
                <div key={activity._id ? `${activity._id}-${i}` : `activity-${i}`} className="flex items-start gap-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 font-bold text-xs ${colors}`}>
                    {abbr}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400">
                        {new Intl.DateTimeFormat('en-US', { 
                          month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' 
                        }).format(new Date(activity.createdAt))}
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">{activity.module}</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
