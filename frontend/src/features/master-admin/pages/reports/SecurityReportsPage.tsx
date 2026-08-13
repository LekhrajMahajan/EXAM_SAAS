import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Lock,
  UserX,
  AlertTriangle,
  Smartphone,
  ServerOff,
  Key,
  AlertOctagon,
  FileText,
  Download,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useRecentReports } from "../../hooks/report.hooks";
import { useSecurityStatistics, useExportSecurityReports, useGenerateSecurityReport } from "../../hooks/security-report.hooks";
import { LineChart } from "@/shared/components/charts/charts";
import { useTheme } from "@/providers/theme-context";

import { MasterAdminStatCard as StatCard } from "../../components/cards/MasterAdminStatCard";

export const SecurityReportsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [severity] = useState<string | undefined>(undefined);
  const [category] = useState<string | undefined>(undefined);

  const { data: summary, refetch: refetchSummary } = useSecurityStatistics();
  const { mutate: exportData, isPending: isExporting } = useExportSecurityReports();
  const { mutate: generateReport, isPending: isGenerating } = useGenerateSecurityReport(() => {
    // navigate("/master-admin/reports");
  });
  const { data: recentReports, isLoading: recentLoading } = useRecentReports({ type: "SECURITY" });
  const securityReports = recentReports?.data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', '');
  };

  const handleExport = () => {
    exportData({ severity, category });
  };

  const handleGenerateReport = () => {
    generateReport({ severity, category });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Security Reports
          </h1>
          <p className="text-slate-500 mt-2">
            Centralized Security Reporting Center for monitoring threats, incidents, and access logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant='outline'
            onClick={() => refetchSummary()}
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
          >
            <RefreshCw className='w-4 h-4' />
            Refresh
          </Button>
          <Button
            variant='outline'
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Download className='w-4 h-4' />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button
            variant='outline'
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className='w-4 h-4 animate-spin' /> : <FileText className='w-4 h-4' />}
            {isGenerating ? 'Generating...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Security Score"
          value={summary?.summary?.securityHealthScore !== undefined ? `${summary.summary.securityHealthScore}/100` : "0/100"}
          icon={ShieldCheck}
          accent="green"
        />
        <StatCard
          title="Active Sessions"
          value={summary?.summary?.activeSessions || 0}
          icon={Users}
          accent="slate"
        />
        <StatCard
          title="Failed Logins Today"
          value={summary?.summary?.failedLoginsToday || 0}
          icon={AlertTriangle}
          accent="red"
        />
        <StatCard
          title="Locked Accounts"
          value={summary?.summary?.lockedAccounts || 0}
          icon={Lock}
          accent="red"
        />
        <StatCard
          title="Suspended Accounts"
          value={summary?.summary?.suspendedAccounts || 0}
          icon={UserX}
          accent="red"
        />
        <StatCard
          title="Active Threats"
          value={summary?.summary?.securityAlerts || 0}
          icon={ShieldAlert}
          accent="amber"
        />
        <StatCard
          title="Trusted Devices"
          value={summary?.summary?.activeTrustedDevices || 0}
          icon={Smartphone}
          accent="green"
        />
        <StatCard
          title="Blocked Devices"
          value={summary?.summary?.blockedDevices || 0}
          icon={ServerOff}
          accent="red"
        />
        <StatCard
          title="MFA Users"
          value={summary?.summary?.activeMfaUsers || 0}
          icon={Key}
          accent="lime"
        />
        <StatCard
          title="High Risk Events"
          value={summary?.summary?.securityAlerts || 0}
          icon={AlertOctagon}
          accent="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Threat Trend (Last 7 Days)
            </h3>
            <div className="h-[300px]">
              <LineChart
                data={{
                  labels: summary?.trend?.dates?.map((d: string) => {
                    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(d));
                  }) || [],
                  datasets: [
                    {
                      label: "Security Incidents",
                      data: summary?.trend?.incidents || [],
                      borderColor: isDark ? "#f87171" : "#b91c1c",
                      backgroundColor: isDark ? "rgba(248, 113, 113, 0.1)" : "rgba(185, 28, 28, 0.1)",
                      fill: true,
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Recent Downloaded Reports */}
      <div className="grid grid-cols-1">
        <Card className='border-slate-200'>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Recent Downloaded Reports</h3>
            {recentLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {securityReports.map((report: any) => (
                  <div key={report._id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm text-foreground">{report.reportName}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(report.createdAt)}
                    </div>
                  </div>
                ))}
                {securityReports.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground bg-muted/50 rounded-lg border border-dashed border-border">
                    No recent reports downloaded
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
