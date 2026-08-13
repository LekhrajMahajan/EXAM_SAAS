
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardGrid } from '../components/DashboardGrid';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { LiveStatsGrid } from '../components/LiveStatsGrid';
import { ActivityFeed } from '../components/ActivityFeed';
import { NotificationWidget } from '../components/NotificationWidget';
import { QuickActionCard } from '../components/QuickActionCard';
import { ChartCard } from '../components/ChartCard';
import { useRoleDashboard } from '../hooks/dashboard.hooks';
import { DUMMY_CHARTS } from '../utils/placeholder';
import type { ActivityItem, NotificationItem } from '../types';

const FA: ActivityItem[] = [
  { id: '1', title: 'Platform Initialized', description: 'Master admin session active.', timestamp: 'Just now', type: 'success', iconName: 'ShieldCheck' },
];
const FN: NotificationItem[] = [
  { id: '1', title: 'Platform Ready', message: 'All systems healthy and connected.', timestamp: 'Just now', isRead: false, priority: 'low' },
];

export function MasterAdminDashboard() {
  const { data, isLoading } = useRoleDashboard();

  const stats = data?.stats || [];
  const quickActions = data?.quickActions || [];
  const activities: ActivityItem[] = data?.activities?.length ? data.activities : FA;
  const notifications: NotificationItem[] = data?.notifications?.length ? data.notifications : FN;
  const unreadCount = data?.unreadCount || 0;
  const pendingApprovals = data?.pendingApprovals || 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Master Admin Dashboard" description="Platform performance, subscriptions, and system health." />
        <Button variant="outline" className="bg-white self-start gap-2 text-sm" asChild>
          <Link to="/dashboard/settings">
            <Settings className="w-4 h-4" /> Dashboard Settings
          </Link>
        </Button>
      </div>

      <WelcomeBanner unreadCount={unreadCount} pendingApprovals={pendingApprovals} />

      <LiveStatsGrid stats={stats} isLoading={isLoading} />

      <DashboardGrid columns={2}>
        <ChartCard data={DUMMY_CHARTS.revenueSummary} />
        <ActivityFeed activities={activities} />
      </DashboardGrid>

      <DashboardGrid columns={2}>
        <QuickActionCard actions={quickActions} />
        <NotificationWidget notifications={notifications} />
      </DashboardGrid>
    </DashboardLayout>
  );
}
