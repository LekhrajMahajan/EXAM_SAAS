import { Spinner } from "@/shared/components/ui/spinner";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Spinner size="xl" />
      <p className="mt-4 text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
};

export const RouteLoader = () => {
  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  );
};
