import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardGrid } from '../components/DashboardGrid';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { LiveStatsGrid } from '../components/LiveStatsGrid';
import { ActivityFeed } from '../components/ActivityFeed';
import { NotificationWidget } from '../components/NotificationWidget';
import { QuickActionCard } from '../components/QuickActionCard';
import { useRoleDashboard } from '../hooks/dashboard.hooks';
import type { ActivityItem, NotificationItem } from '../types';

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  { id: '1', title: 'Session Started', description: 'You have logged into ExamGuard Pro.', timestamp: 'Just now', type: 'success', iconName: 'LogIn' },
  { id: '2', title: 'Dashboard Loaded', description: 'Your workspace is ready.', timestamp: 'Just now', type: 'info', iconName: 'LayoutDashboard' },
];

const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'Welcome', message: 'Your dashboard is live. All systems operational.', timestamp: 'Just now', isRead: false, priority: 'low' },
];

export function RoleDashboard() {
  const { data, isLoading } = useRoleDashboard();

  const stats = data?.stats || [];
  const quickActions = data?.quickActions || [];
  const activities: ActivityItem[] = data?.activities?.length ? data.activities : FALLBACK_ACTIVITIES;
  const notifications: NotificationItem[] = data?.notifications?.length ? data.notifications : FALLBACK_NOTIFICATIONS;
  const unreadCount = data?.unreadCount || 0;
  const pendingApprovals = data?.pendingApprovals || 0;

  return (
    <DashboardLayout>
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1" />
        <Button variant="outline" className="self-start sm:self-auto bg-white gap-2 text-sm" asChild>
          <Link to="/dashboard/settings">
            <Settings className="w-4 h-4" />
            Dashboard Settings
          </Link>
        </Button>
      </div>

      {/* Welcome Banner */}
      <WelcomeBanner unreadCount={unreadCount} pendingApprovals={pendingApprovals} />

      {/* Stats Cards */}
      <LiveStatsGrid stats={stats} isLoading={isLoading} />

      {/* Quick Actions + Activity */}
      <DashboardGrid columns={3}>
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
        <div className="lg:col-span-1">
          {quickActions.length > 0 ? (
            <QuickActionCard actions={quickActions} />
          ) : (
            <NotificationWidget notifications={notifications} />
          )}
        </div>
      </DashboardGrid>

      {/* Notifications (if we have quick actions too) */}
      {quickActions.length > 0 && (
        <NotificationWidget notifications={notifications} />
      )}
    </DashboardLayout>
  );
}
