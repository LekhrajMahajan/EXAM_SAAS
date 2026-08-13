import { DashboardStatsCards } from "../components/dashboard/DashboardStatsCards";
import { SystemHealthWidget } from "../components/dashboard/SystemHealthWidget";
import { RecentActivityWidget } from "../components/dashboard/RecentActivityWidget";
import { RecentAuditLogsWidget } from "../components/dashboard/RecentAuditLogsWidget";
import { DashboardChartsWidget } from "../components/dashboard/DashboardChartsWidget";
import { PendingApprovalsWidget } from "../components/dashboard/PendingApprovalsWidget";
import { WelcomeHeader } from "../components/dashboard/WelcomeHeader";
import { QuickActionsWidget } from "../components/dashboard/QuickActionsWidget";
import { RoleGuard } from "@/features/auth/components/RoleGuard";

export const DashboardPage = () => {
  return (
    <RoleGuard allowedRoles={["MASTER_ADMIN"]}>
      <div className="space-y-6 pb-8 p-6">
        {/* Welcome Header */}
        <WelcomeHeader />

        {/* Quick Actions */}
        <QuickActionsWidget />

        {/* Top Stats Cards */}
        <DashboardStatsCards />

        {/* Charts */}
        <DashboardChartsWidget />

        {/* Main Grid for Widgets */}
        <div className="grid gap-4 lg:grid-cols-3">
          
          {/* Pending Approvals spans 2 columns */}
          <div className="lg:col-span-2">
            <PendingApprovalsWidget />
          </div>

          {/* System Health spans 1 column */}
          <div className="lg:col-span-1">
            <SystemHealthWidget />
          </div>
        </div>

        {/* Bottom Grid for Logs */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Activity Logs */}
          <RecentActivityWidget />

          {/* Audit Logs */}
          <RecentAuditLogsWidget />
        </div>
      </div>
    </RoleGuard>
  );
};
