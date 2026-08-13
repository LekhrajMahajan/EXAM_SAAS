import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DeviceStatusCard } from '../components/DeviceStatusCard';
import { DUMMY_DEVICE_STATUS } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function DeviceStatusPage() {
  const handleRefresh = () => {
    toast({ title: 'Pinged all connected devices. Status updated.', variant: 'default' });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Hardware & Device Status" 
          description="Monitor connection health for biometric capture hardware." 
        />
        <Button onClick={handleRefresh} variant="outline" className="bg-white">
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh Connections
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DeviceStatusCard status={DUMMY_DEVICE_STATUS} />
        
        {/* Placeholder for future expansion, e.g. multi-camera setups or troubleshooting guide */}
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center">
           <h3 className="text-slate-700 font-medium mb-2">Need help with a device?</h3>
           <p className="text-slate-500 text-sm mb-4">Ensure USB connections are secure and drivers are up to date on this client machine.</p>
           <Button variant="link">View Troubleshooting Guide</Button>
        </div>
      </div>
    </div>
  );
}
