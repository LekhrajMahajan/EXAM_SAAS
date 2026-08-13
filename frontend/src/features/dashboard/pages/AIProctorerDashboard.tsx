import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardGrid } from '../components/DashboardGrid';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { LiveStatsGrid } from '../components/LiveStatsGrid';
import { ActivityFeed } from '../components/ActivityFeed';
import { QuickActionCard } from '../components/QuickActionCard';
import { NotificationWidget } from '../components/NotificationWidget';
import { useRoleDashboard } from '../hooks/dashboard.hooks';
import type { ActivityItem, NotificationItem } from '../types';

const FA: ActivityItem[] = [{ id: '1', title: 'AI Proctor Active', description: 'Surveillance systems initialized.', timestamp: 'Just now', type: 'info', iconName: 'ScanFace' }];
const FN: NotificationItem[] = [{ id: '1', title: 'Ready', message: 'AI proctoring engine connected.', timestamp: 'Just now', isRead: false, priority: 'medium' }];

export function AIProctorerDashboard() {
  const { data, isLoading } = useRoleDashboard();

  const stats = data?.stats || [];
  const quickActions = data?.quickActions || [];
  const activities: ActivityItem[] = data?.activities?.length ? data.activities : FA;
  const notifications: NotificationItem[] = data?.notifications?.length ? data.notifications : FN;
  const unreadCount = data?.unreadCount || 0;

  return (
    <DashboardLayout>
      <PageHeader title="AI Proctor Dashboard" description="AI-driven face verification, browser monitoring and trust analytics." />

      <WelcomeBanner unreadCount={unreadCount} />

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
