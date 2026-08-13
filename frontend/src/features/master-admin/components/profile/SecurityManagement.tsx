import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useUserSessions, useUserDevices, useRemoveSession, useRemoveDevice, useTrustDevice } from "../../hooks/profile.hooks";
import { toast } from "react-hot-toast";
import { Laptop, Smartphone, Globe, Shield, ShieldAlert, X } from "lucide-react";

export const SecurityManagement: React.FC = () => {
  const { data: sessionsResponse, isLoading: sessionsLoading } = useUserSessions();
  const { data: devicesResponse, isLoading: devicesLoading } = useUserDevices();
  
  const removeSession = useRemoveSession();
  const removeDevice = useRemoveDevice();
  const trustDevice = useTrustDevice();

  const sessions = sessionsResponse?.data || [];
  const devices = devicesResponse?.data || [];

  const handleRevokeSession = (sessionId: string) => {
    removeSession.mutate(sessionId, {
      onSuccess: () => toast.success("Session revoked successfully"),
      onError: () => toast.error("Failed to revoke session")
    });
  };

  const handleTrustDevice = (deviceId: string) => {
    trustDevice.mutate(deviceId, {
      onSuccess: () => toast.success("Device marked as trusted"),
      onError: () => toast.error("Failed to trust device")
    });
  };

  const handleRemoveDevice = (deviceId: string) => {
    removeDevice.mutate(deviceId, {
      onSuccess: () => toast.success("Device removed successfully"),
      onError: () => toast.error("Failed to remove device")
    });
  };

  const getDeviceIcon = (os: string) => {
    if (os?.toLowerCase().includes('ios') || os?.toLowerCase().includes('android')) return <Smartphone className="w-5 h-5 text-slate-500" />;
    return <Laptop className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Review and revoke active sessions across your devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessionsLoading ? (
              <div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-6 text-slate-500">No active sessions found.</div>
            ) : (
              sessions.map((session: any) => (
                <div key={session._id} className="flex items-center justify-between p-4 border rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                        {session.browser || 'Unknown Browser'} on {session.operatingSystem || 'Unknown OS'}
                        <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0 h-4 bg-emerald-50 text-emerald-600 border-emerald-200">Active Now</Badge>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        IP: {session.ipAddress} • Last active: {session.lastActivityAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(session.lastActivityAt)) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleRevokeSession(session.sessionId)}>
                    Revoke
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Trusted Devices</CardTitle>
          <CardDescription>Manage devices that skip multi-factor authentication.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devicesLoading ? (
              <div className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></div>
            ) : devices.length === 0 ? (
              <div className="text-center py-6 text-slate-500">No devices found.</div>
            ) : (
              devices.map((device: any) => (
                <div key={device._id} className="flex items-center justify-between p-4 border rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border shadow-sm flex items-center justify-center shrink-0">
                      {getDeviceIcon(device.operatingSystem)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                        {device.deviceName || 'Unknown Device'}
                        {device.trusted ? (
                          <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0 h-4 bg-emerald-50 text-emerald-600">
                            <Shield className="w-3 h-3 mr-1" /> Trusted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] font-normal px-1.5 py-0 h-4 text-slate-500">
                            <ShieldAlert className="w-3 h-3 mr-1" /> Untrusted
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {device.browser} • Last login: {device.lastLoginAt ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(device.lastLoginAt)) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!device.trusted && (
                      <Button variant="outline" size="sm" onClick={() => handleTrustDevice(device.deviceId)}>
                        Trust Device
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => handleRemoveDevice(device.deviceId)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
