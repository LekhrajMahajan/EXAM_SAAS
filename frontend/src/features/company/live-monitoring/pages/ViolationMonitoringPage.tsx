import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { ViolationTable } from '../components/ViolationTable';
import { DUMMY_VIOLATIONS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Filter, Download } from 'lucide-react';

export function ViolationMonitoringPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Incident & Violation Log" 
          description="Detailed logs of AI-detected anomalies, tab switches, and proctor interventions." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-white">
             <Filter className="w-4 h-4 mr-2" />
             Filter Incidents
           </Button>
           <Button variant="outline" className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50">
             <Download className="w-4 h-4 mr-2" />
             Export Logs
           </Button>
        </div>
      </div>

      <ViolationTable violations={DUMMY_VIOLATIONS} />
    </div>
  );
}
