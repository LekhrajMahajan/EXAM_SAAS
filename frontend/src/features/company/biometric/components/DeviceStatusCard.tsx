import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { DeviceStatus } from '../types';
import { Camera, Fingerprint, ScanEye, Wifi, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DeviceStatusCardProps {
  status: DeviceStatus;
}

export function DeviceStatusCard({ status }: DeviceStatusCardProps) {
  const DeviceIndicator = ({ active, label, icon: Icon }: { active: boolean, label: string, icon: any }) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-md", active ? "bg-indigo-100 text-indigo-600" : "bg-slate-200 text-slate-500")}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      {active ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
      ) : (
        <XCircle className="w-5 h-5 text-slate-300" />
      )}
    </div>
  );

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-medium text-slate-900">Device Status</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <DeviceIndicator active={status.cameraConnected} label="Camera" icon={Camera} />
        <DeviceIndicator active={status.fingerprintScannerConnected} label="Fingerprint Scanner" icon={Fingerprint} />
        <DeviceIndicator active={status.irisScannerConnected} label="Iris Scanner" icon={ScanEye} />
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-md", status.internetStatus === 'Online' ? "bg-indigo-100 text-indigo-600" : "bg-red-100 text-red-600")}>
              <Wifi className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">Network</span>
          </div>
          <span className={cn("text-xs font-bold px-2 py-1 rounded-full", status.internetStatus === 'Online' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
            {status.internetStatus}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
