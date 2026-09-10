import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { companyApi } from "../api/company.api";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// A utility to convert camelCase to Title Case
const formatLabel = (key: string) => {
  if (key === 'maxEmployees') return 'Max Roles';
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1).replace('Max ', '');
};

const formatValue = (key: string, value: number) => {
  if (key === 'storageLimitGB' || key === 'maxFileUploadSizeMB') {
    return `${value.toLocaleString()} ${key.includes('GB') ? 'GB' : 'MB'}`;
  }
  return value.toLocaleString();
};

export const SubscriptionUsagePage = () => {
  const { toast } = useToast();
  const hasShownToast = useRef(false);

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ['company-usage-stats'],
    queryFn: () => companyApi.getUsageStats(),
    staleTime: 0, // Always fetch fresh stats, never use stale cache
    refetchOnMount: 'always', // Guarantee a refetch when returning to this page
  });

  useEffect(() => {
    if (response?.success && response.data && !hasShownToast.current) {
      const { limits, currentUsage } = response.data;
      const usageKeys = Object.keys(limits).filter(key => typeof limits[key] === 'number');
      
      let hasFullLimit = false;
      let fullFeature = "";

      for (const key of usageKeys) {
        const limit = limits[key];
        const usage = currentUsage[key] || 0;
        
        if (limit > 0 && usage >= limit) {
          hasFullLimit = true;
          fullFeature = formatLabel(key);
          break;
        }
      }

      if (hasFullLimit) {
        hasShownToast.current = true;
        toast({
          title: "Usage Limit Reached",
          description: `Your ${fullFeature} limit is fully consumed. Please upgrade your subscription to increase limits.`,
          variant: "destructive",
        });
      }
    }
  }, [response, toast]);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 animate-in fade-in duration-500">
        <DashboardHeader
          title="Usage Plan"
          description="Track your current resource usage against your subscription limits."
        />
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !response?.success) {
    return (
      <div className="flex-1 space-y-6">
        <DashboardHeader
          title="Usage Plan"
          description="Track your current resource usage against your subscription limits."
        />
        <div className="flex flex-col items-center justify-center h-[50vh] text-destructive">
          <AlertCircle className="h-10 w-10 mb-4" />
          <h3 className="text-xl font-semibold">Failed to load usage data</h3>
          <p className="text-muted-foreground mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  const { limits, currentUsage } = response.data;

  // Show limits according to the plan (limit > 0). If usage exists (> 0), show it regardless.
  const usageKeys = Object.keys(limits).filter(key => {
    if (typeof limits[key] !== 'number') return false;
    const limit = limits[key];
    const usage = currentUsage[key] || 0;
    return limit > 0 || usage > 0;
  });

  return (
    <div className="flex-1 space-y-6 animate-in fade-in duration-500 p-6">
      <DashboardHeader
        title="Usage Plan & Statistics"
        description="Monitor your current resource consumption and active plan limits."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {usageKeys.map((key) => {
          const limit = limits[key];
          const usage = currentUsage[key] || 0;
          
          if (limit === undefined || limit === null) return null;

          // For this specific SAAS, 0 usually means unlimited or not allowed. Let's assume 0 limit means no restriction if feature enabled, or just display 0 if restricted.
          const isUnlimited = limit === 0 || limit === -1; 
          const percentage = isUnlimited ? 0 : Math.min(100, Math.round((usage / limit) * 100));
          
          let progressColor = "bg-primary";
          if (!isUnlimited) {
            if (percentage >= 90) progressColor = "bg-destructive";
            else if (percentage >= 75) progressColor = "bg-yellow-500";
            else progressColor = "bg-primary";
          }

          return (
            <div key={key} className="bg-card rounded-xl border border-border/50 shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden group">
              
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  {formatLabel(key)}
                </h4>
                {!isUnlimited && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${percentage >= 90 ? 'bg-destructive/10 text-destructive' : percentage >= 75 ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-primary/10 text-primary'}`}>
                    {percentage}%
                  </span>
                )}
              </div>

              <div className="mb-3">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-foreground">
                    {formatValue(key, usage)}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    / {isUnlimited ? "Unlimited" : formatValue(key, limit)}
                  </span>
                </div>
                {!isUnlimited && (
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                    {formatValue(key, Math.max(0, limit - usage))} remaining
                  </p>
                )}
              </div>

              {!isUnlimited && (
                <div className="w-full bg-secondary/40 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${progressColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
