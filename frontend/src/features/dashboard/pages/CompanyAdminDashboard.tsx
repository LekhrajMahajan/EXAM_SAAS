import React from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
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
import { useRoleDashboard } from '../hooks/dashboard.hooks';
import { useUserStore } from '@/stores/user/user.store';
import type { ActivityItem, NotificationItem } from '../types';

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  { id: '1', title: 'Dashboard Ready', description: 'Company admin workspace initialized.', timestamp: 'Just now', type: 'info', iconName: 'LayoutDashboard' },
];
const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'System Ready', message: 'All live endpoints are synchronized.', timestamp: 'Just now', isRead: false, priority: 'low' },
];

export function CompanyAdminDashboard() {
  const profile = useUserStore((state) => state.profile);
  const { data, isLoading } = useRoleDashboard();

  if (profile && !profile.subscriptionPlan) {
    return <Navigate to="/company/subscription" replace />;
  }

  const stats = data?.stats || [];
  const quickActions = data?.quickActions || [];
  const activities: ActivityItem[] = data?.activities?.length ? data.activities : FALLBACK_ACTIVITIES;
  const notifications: NotificationItem[] = data?.notifications?.length ? data.notifications : FALLBACK_NOTIFICATIONS;
  const unreadCount = data?.unreadCount || 0;
  const pendingApprovals = data?.pendingApprovals || 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Company Dashboard" description="Overview of your exams, centers, candidates, and quick actions." />
        <Button variant="outline" className="bg-white self-start gap-2 text-sm" asChild>
          <Link to="/dashboard/settings">
            <Settings className="w-4 h-4 mr-1" />Dashboard Settings
          </Link>
        </Button>
      </div>

      <WelcomeBanner unreadCount={unreadCount} pendingApprovals={pendingApprovals} />

      <LiveStatsGrid stats={stats} isLoading={isLoading} />

      <DashboardGrid columns={3}>
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
        <div className="lg:col-span-1">
          <QuickActionCard actions={quickActions} />
        </div>
      </DashboardGrid>

      <NotificationWidget notifications={notifications} />
    </DashboardLayout>
  );
}
