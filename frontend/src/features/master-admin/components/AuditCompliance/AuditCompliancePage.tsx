import React, { useState } from 'react';
import { 
  useSecurityAuditLogs, 
  useAuditStatistics,
  useExportAuditLogs 
} from '../../hooks/security.hooks';
import type { AuditLog } from '../../types/audit-log.types';
import { AuditLogTable } from './AuditLogTable';
import { AuditDetailModal } from './AuditDetailModal';
import { ComplianceSettings } from './ComplianceSettings';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Download, Search, ShieldCheck, Activity, Target, ShieldAlert, Loader2 } from 'lucide-react';

export const AuditCompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('audit-logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Queries
  const { data: auditData, isLoading: isLoadingLogs } = useSecurityAuditLogs({
    search: searchTerm,
    severity: severityFilter !== 'ALL' ? severityFilter : undefined,
    page,
    limit: 20
  });
  const { data: statsData } = useAuditStatistics();
  const exportLogs = useExportAuditLogs();

  const stats = statsData?.data;
  const logs = auditData?.data?.docs || [];
  const totalPages = auditData?.data?.totalPages || 1;

  const handleExport = () => {
    exportLogs.mutate({
      search: searchTerm,
      severity: severityFilter !== 'ALL' ? severityFilter : undefined
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            Security Audit & Compliance
          </h2>
          <p className="text-slate-500 mt-2">
            Monitor security-sensitive actions and manage compliance frameworks.
          </p>
        </div>
        {activeTab === 'audit-logs' && (
          <Button onClick={handleExport} disabled={exportLogs.isPending} variant="outline" className="gap-2">
            {exportLogs.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Export CSV
          </Button>
        )}
      </div>

      {/* Top Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Audit Events</p>
                <h4 className="text-2xl font-bold">{stats.total.toLocaleString()}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Successful Actions</p>
                <h4 className="text-2xl font-bold">{stats.success.toLocaleString()}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg text-red-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Failed/Blocked Actions</p>
                <h4 className="text-2xl font-bold">{stats.failed.toLocaleString()}</h4>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Success Rate</p>
                <h4 className="text-2xl font-bold">{stats.successRate?.toFixed(1) || 100}%</h4>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit-logs">Audit Log Browser</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle>Security Event Ledger</CardTitle>
                  <CardDescription>Immutable record of all security-sensitive operations.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="Search events..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSearchTerm(e.target.value); setPage(1); }}
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={(v: string) => { setSeverityFilter(v); setPage(1); }}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Levels</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLogs ? (
                <div className="flex justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <>
                  <AuditLogTable 
                    logs={logs} 
                    onViewDetails={setSelectedLog} 
                  />
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 border-t pt-4">
                      <p className="text-sm text-slate-500">
                        Showing page {page} of {totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          Previous
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceSettings />
        </TabsContent>
      </Tabs>

      <AuditDetailModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  );
};
