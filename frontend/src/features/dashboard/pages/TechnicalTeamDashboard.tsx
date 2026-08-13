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

const FA: ActivityItem[] = [{ id: '1', title: 'Technical Team Ready', description: 'Infrastructure workspace loaded.', timestamp: 'Just now', type: 'info', iconName: 'Server' }];
const FN: NotificationItem[] = [{ id: '1', title: 'Ready', message: 'All systems operational.', timestamp: 'Just now', isRead: false, priority: 'low' }];

export function TechnicalTeamDashboard() {
  const { data, isLoading } = useRoleDashboard();

  const stats = data?.stats || [];
  const quickActions = data?.quickActions || [];
  const activities: ActivityItem[] = data?.activities?.length ? data.activities : FA;
  const notifications: NotificationItem[] = data?.notifications?.length ? data.notifications : FN;
  const unreadCount = data?.unreadCount || 0;
  const systemHealth = data?.systemHealth as { server: string; database: string; uptime: number } | undefined;

  return (
    <DashboardLayout>
      <PageHeader title="Technical Dashboard" description="Monitor infrastructure, devices, system health, and issue tickets." />

      <WelcomeBanner unreadCount={unreadCount} />

      <LiveStatsGrid stats={stats} isLoading={isLoading} />

      {systemHealth && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Server', value: systemHealth.server, color: 'text-emerald-600' },
            { label: 'Database', value: systemHealth.database, color: 'text-sky-600' },
            { label: 'Uptime', value: `${Math.round(systemHealth.uptime / 60)}m`, color: 'text-indigo-600' },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

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
