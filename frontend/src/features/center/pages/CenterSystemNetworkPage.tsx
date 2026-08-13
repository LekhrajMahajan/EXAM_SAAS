import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { apiClient } from '@/core/api/http/axios-client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Network, Search, Activity, Lock, CheckCircle2, XCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface NetworkScan {
  _id: string;
  ipAddress: string;
  status: 'ONLINE' | 'OFFLINE';
  latency: number | null;
  openPorts: number[];
  createdAt: string;
}

export const CenterSystemNetworkPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isReadOnly = Boolean(id) && user?.role !== 'CENTER_MANAGER';

  const [ipAddress, setIpAddress] = useState('');
  const [scans, setScans] = useState<NetworkScan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const fetchScans = async () => {
    try {
      setIsFetching(true);
      const url = id ? `/center-system-network?centerId=${id}` : '/center-system-network';
      const response = await apiClient.get<{ success: boolean; data: NetworkScan[] }>(url);
      if (response.data.success) {
        setScans(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch scans', error);
      toast.error('Failed to fetch network history');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [id]);

  const handleScan = async () => {
    if (!ipAddress.trim()) {
      toast.error('Please enter an IP address');
      return;
    }
    
    // Basic IP validation regex
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress.trim())) {
      toast.error('Invalid IP address format');
      return;
    }

    try {
      setIsLoading(true);
      toast.loading('Scanning IP...', { id: 'scan-toast' });
      
      const response = await apiClient.post<{ success: boolean; data: NetworkScan }>('/center-system-network/scan', {
        ipAddress: ipAddress.trim()
      });
      
      if (response.data.success) {
        toast.success('Scan complete', { id: 'scan-toast' });
        // Add new scan to top of list
        setScans(prev => [response.data.data, ...prev]);
        setIpAddress('');
      }
    } catch (error) {
      console.error('Failed to scan', error);
      toast.error('Scan failed', { id: 'scan-toast' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="h-8 w-8 text-primary" />
            System Network
          </h1>
          <p className="text-slate-400 mt-2">
            Scan and monitor local network systems, view online status, latency, and open ports.
          </p>
        </div>
      </div>

      {!isReadOnly && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="border-b border-slate-800 pb-4">
            <CardTitle className="text-lg font-medium text-slate-200">New Network Scan</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="Enter IP Address (e.g. 192.168.1.100)"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="pl-9 bg-slate-800 border-slate-700 text-slate-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleScan();
                  }}
                />
              </div>
              <Button 
                onClick={handleScan} 
                disabled={isLoading}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white min-w-[120px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" /> Scanning...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Scan IP
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="border-b border-slate-800 pb-4">
          <CardTitle className="text-lg font-medium text-slate-200">Scan History</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">IP Address</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Latency (ms)</th>
                  <th className="px-6 py-4 font-medium">Open Ports</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isFetching ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      Loading scan history...
                    </td>
                  </tr>
                ) : scans.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No network scans performed yet. Enter an IP above to begin.
                    </td>
                  </tr>
                ) : (
                  scans.map((scan) => (
                    <tr key={scan._id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-300">
                        {scan.ipAddress}
                      </td>
                      <td className="px-6 py-4">
                        {scan.status === 'ONLINE' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            ONLINE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                            OFFLINE
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {scan.latency !== null ? (
                          <span className="inline-flex items-center gap-1.5 text-slate-300">
                            <Clock className="h-4 w-4 text-slate-500" />
                            {scan.latency} ms
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {scan.openPorts.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {scan.openPorts.map(port => (
                              <span key={port} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                {port}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterSystemNetworkPage;
