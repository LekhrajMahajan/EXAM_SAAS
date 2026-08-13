import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuditLogs } from '../hooks/audit-log.hooks';
import { GenericTimeline } from '@/shared/components/timeline/GenericTimeline';
import type { TimelineItem } from '@/shared/types';
import { Button } from '@/shared/components/ui/button';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';

export const InvoiceAuditLogPage = () => {
  const { invoiceId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const { data: auditResponse, isLoading, isError, refetch } = useAuditLogs({
    entityId: invoiceId,
  });

  const logs = Array.isArray(auditResponse?.data) ? auditResponse.data : (auditResponse?.data as any)?.data || [];

  // Client side filtering for demo if not supported perfectly on backend
  const filteredLogs = logs.filter((log: any) => {
    const matchesSearch = searchTerm ? 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.performedByRole && log.performedByRole.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    const matchesAction = actionFilter !== 'ALL' ? log.action === actionFilter : true;
    return matchesSearch && matchesAction;
  });

  const getStatusColor = (status: string, severity: string) => {
    if (status === 'FAILED') return 'error';
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      default: return 'success';
    }
  };

  const getIconForAction = (action: string) => {
    switch (action) {
      case 'GENERATE': return 'FilePlus';
      case 'UPDATE': return 'Edit';
      case 'DOWNLOAD': return 'Download';
      case 'SEND': return 'Mail';
      case 'VERIFY': return 'CheckCircle';
      case 'DELETE': return 'Trash';
      default: return 'Activity';
    }
  };

  const timelineItems: TimelineItem[] = filteredLogs.map((log: any) => ({
    id: log._id,
    title: log.action,
    description: log.description,
    timestamp: new Date(log.createdAt).toLocaleString(),
    icon: getIconForAction(log.action),
    status: getStatusColor(log.status, log.severity),
    metadata: {
      'User': (log.performedBy as any)?.name || 'System',
      'Role': log.performedByRole || 'SYSTEM',
      'Status': log.status,
    }
  }));

  const uniqueActions = Array.from(new Set(logs.map((l: any) => l.action)));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to={`/master-admin/invoices/${invoiceId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Activity History</h1>
            <p className="text-muted-foreground mt-2">
              Complete audit trail for invoice.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <CardTitle>Timeline</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search activity..."
                  className="pl-9 bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-white">
                  <Filter className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Actions</SelectItem>
                  {uniqueActions.map((action: any) => (
                    <SelectItem key={action} value={action}>{action}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">Failed to load activity history.</p>
              <Button onClick={() => refetch()} variant="outline">Retry</Button>
            </div>
          ) : isLoading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Filter className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No Activity Found</h3>
              <p className="text-slate-500">
                {searchTerm || actionFilter !== 'ALL' 
                  ? "Try adjusting your filters to see more results." 
                  : "There are no recorded activities for this invoice yet."}
              </p>
            </div>
          ) : (
            <GenericTimeline items={timelineItems} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
