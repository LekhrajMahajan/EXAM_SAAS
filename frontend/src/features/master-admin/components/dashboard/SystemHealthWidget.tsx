import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Activity } from "lucide-react";
import { useSystemHealth } from "../../hooks/dashboard.hooks";
import { Badge } from "@/shared/components/ui/badge";

export const SystemHealthWidget = () => {
  const { data: health, isLoading, isError } = useSystemHealth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20 rounded-md shrink-0">
            <Activity className="h-4 w-4" />
          </div>
          System Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <div className="text-sm text-red-500 p-4 border border-dashed rounded bg-red-50 text-center">
            Unable to reach health service
          </div>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Server</span>
              <Badge className={health?.data?.server === "Healthy" ? "bg-[#A5AF79] hover:bg-[#A5AF79]/80 text-white border-transparent health-badge-healthy" : "bg-destructive text-destructive-foreground"}>
                {health?.data?.server || "Unknown"}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Database</span>
              <Badge className={health?.data?.database === "Connected" ? "bg-[#A5AF79] hover:bg-[#A5AF79]/80 text-white border-transparent health-badge-healthy" : "bg-destructive text-destructive-foreground"}>
                {health?.data?.database || "Unknown"}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Redis</span>
              <Badge className={health?.data?.redis === "Connected" ? "bg-[#A5AF79] hover:bg-[#A5AF79]/80 text-white border-transparent health-badge-healthy" : "bg-destructive text-destructive-foreground"}>
                {health?.data?.redis || "Unknown"}
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-medium">Node Version</span>
              <span className="text-slate-700 font-medium health-text-value">{health?.data?.nodeVersion}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
