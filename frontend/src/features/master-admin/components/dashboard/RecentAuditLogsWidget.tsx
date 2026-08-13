import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ShieldAlert } from "lucide-react";
import { useRecentAuditLogs } from "../../hooks/audit-log.hooks";
import { Badge } from "@/shared/components/ui/badge";

export const RecentAuditLogsWidget = () => {
  const { data: response, isLoading, isError } = useRecentAuditLogs(5);

  return (
    <Card className="col-span-full md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Latest Audit Logs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="text-sm text-red-500 p-4 border border-dashed rounded bg-red-50 text-center">
            Failed to load audit logs.
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : !response?.data?.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#2D3E2C]/20 rounded-lg bg-[#2D3E2C]/5 empty-state-box">
            <ShieldAlert className="h-8 w-8 text-[#A5AF79] mb-2 opacity-80 empty-state-icon" />
            <p className="text-sm font-medium text-[#2D3E2C] empty-state-title">No recent audit logs found.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {response.data.map((log, i) => (
              <div key={log._id ? `${log._id}-${i}` : `log-${i}`} className="border-b last:border-0 pb-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-semibold">{log.action}</span>
                  <Badge variant={log.severity === "CRITICAL" ? "destructive" : log.severity === "HIGH" ? "destructive" : "secondary"} className="text-[10px]">
                    {log.severity}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mb-1 line-clamp-2">{log.description}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>{log.module} {log.entityName ? `(${log.entityName})` : ''}</span>
                  <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
