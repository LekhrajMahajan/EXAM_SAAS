import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Table as TableIcon, Download, Printer, Filter } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { GenericTimeline } from "@/shared/components/timeline/GenericTimeline";
import { useRole } from "../hooks/role.hooks";
import { useAuditLogs } from "../hooks/audit-log.hooks";
import type { TimelineItem } from "@/shared/types";

export const RoleAuditLogPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("timeline");
  const [searchTerm, setSearchTerm] = useState("");
  // In a real app we'd use these for server-side filtering, here we just pass them if API supports it
  // const [page, setPage] = useState(1);

  const { data: roleResponse, isLoading: isLoadingRole } = useRole(id || "");
  const role = roleResponse?.data;

  // We request logs for this specific entity (the role). 
  // Depending on backend support, we might need 'entityId' or we just filter client-side if missing.
  const { data: auditResponse, isLoading: isLoadingAudit, refetch } = useAuditLogs({ 
    entityId: id,
    limit: 100, // fetch a batch for demonstration
    sort: '-createdAt'
  });

  const auditLogs = auditResponse?.data || [];
  
  // Client-side search as fallback
  const filteredLogs = auditLogs.filter(log => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(lower) ||
      log.module.toLowerCase().includes(lower) ||
      log.description.toLowerCase().includes(lower) ||
      (log.performedBy || "").toLowerCase().includes(lower)
    );
  });

  const mapToTimeline = (): TimelineItem[] => {
    return filteredLogs.map(log => {
      let icon = "Circle";
      let status: 'default' | 'success' | 'warning' | 'error' | 'info' = 'default';

      if (log.status === 'FAILED') status = 'error';
      else if (log.action === 'CREATE') { status = 'success'; icon = 'PlusCircle'; }
      else if (log.action === 'UPDATE') { status = 'info'; icon = 'Edit'; }
      else if (log.action === 'DELETE') { status = 'error'; icon = 'Trash2'; }
      else { status = 'default'; icon = 'Activity'; }

      return {
        id: log._id,
        title: `${log.action} - ${log.module}`,
        timestamp: new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
        description: log.description,
        status,
        icon,
        metadata: {
          'Performed By': log.performedBy || 'System',
          'IP Address': log.ipAddress || 'Unknown',
          ...(log.browser ? { Browser: log.browser } : {}),
          ...(log.deviceType ? { Device: log.deviceType } : {}),
        }
      };
    });
  };

  if (isLoadingRole || isLoadingAudit) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-6">
        <Skeleton className="h-24 w-1/3" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!role) {
    return (
      <div className="max-w-7xl mx-auto space-y-4 p-6">
        <Button variant="ghost" onClick={() => navigate("/master-admin/access-management?tab=roles")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Roles
        </Button>
        <div className="text-center py-12 text-slate-500">Role not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/master-admin/access-management/roles/${role._id}`)}>
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit & Activity Log</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Tracking history for role: <span className="font-semibold text-slate-700">{role.displayName}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => refetch()} variant="secondary" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-0 mb-6 gap-4 border-b sm:border-0 pb-4 sm:pb-0">
              <TabsList>
                <TabsTrigger value="timeline" className="gap-2">
                  <Clock className="w-4 h-4" /> Timeline
                </TabsTrigger>
                <TabsTrigger value="table" className="gap-2">
                  <TableIcon className="w-4 h-4" /> Table
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input 
                  placeholder="Search logs..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 bg-white"
                />
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="timeline" className="min-h-[400px]">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No Audit Records Found
                </div>
              ) : (
                <div className="max-w-3xl">
                  <GenericTimeline items={mapToTimeline()} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="table" className="min-h-[400px]">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No Audit Records Found
                </div>
              ) : (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium text-slate-600 whitespace-nowrap">Date & Time</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Action</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Description</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Performed By</th>
                        <th className="px-4 py-3 font-medium text-slate-600">IP Address</th>
                        <th className="px-4 py-3 font-medium text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map(log => (
                        <tr key={log._id} className="border-b last:border-0 hover:bg-slate-50/50">
                          <td className="px-4 py-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline">{log.action}</Badge>
                          </td>
                          <td className="px-4 py-3 max-w-xs truncate" title={log.description}>{log.description}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{log.performedBy || 'System'}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono text-xs">{log.ipAddress || '-'}</td>
                          <td className="px-4 py-3">
                            <Badge variant={log.status === 'SUCCESS' ? 'default' : 'destructive'} 
                                   className={log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200' : ''}>
                              {log.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
