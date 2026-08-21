import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ViolationTable } from '../components/ViolationTable';
import { Button } from '@/shared/components/ui/button';
import { Filter, Download } from 'lucide-react';
import { useViolations } from '../hooks/useViolations';

export function ViolationMonitoringPage() {
  const { data, isLoading } = useViolations();
  const violations = data?.data || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Incident & Violation Log" 
          description="Detailed logs of AI-detected anomalies, tab switches, and proctor interventions." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-card">
             <Filter className="w-4 h-4 mr-2" />
             Filter Incidents
           </Button>
           <Button variant="outline" className="bg-card text-primary border-primary/20 hover:bg-primary/10">
             <Download className="w-4 h-4 mr-2" />
             Export Logs
           </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-muted-foreground border border-border border-dashed rounded-xl">
          Loading violations...
        </div>
      ) : (
        <ViolationTable violations={violations} />
      )}
    </div>
  );
}
