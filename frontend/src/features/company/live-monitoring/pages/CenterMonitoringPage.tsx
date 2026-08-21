import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { CenterStatusCard } from '../components/CenterStatusCard';
import { useLiveCenters } from '../hooks/useLiveCenters';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';

export function CenterMonitoringPage() {
  const { data, isLoading } = useLiveCenters();
  const centers = data?.data || [];

  return (
    <div className="space-y-6 p-6">
      <PageHeader 
        title="Test Centers Health" 
        description="Monitor network connectivity and device health across all active test centers." 
      />

      <div className="bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search center by name or ID..." 
            className="pl-9 bg-muted/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-muted-foreground border border-border border-dashed rounded-xl">
          Loading center health...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center: any) => (
            <CenterStatusCard key={center.id} center={center} />
          ))}
          {centers.length === 0 && (
            <div className="col-span-full text-center p-12 bg-card border border-border border-dashed rounded-xl flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-muted rounded-full">
                <Search className="w-6 h-6 text-muted-foreground opacity-50" />
              </div>
              <p className="text-muted-foreground font-medium">No centers found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
