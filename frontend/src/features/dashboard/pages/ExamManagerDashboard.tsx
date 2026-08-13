
import { PageHeader } from '@/shared/components/layout/page-header';
import { DashboardLayout } from '../components/DashboardLayout';
import { DashboardGrid } from '../components/DashboardGrid';
import { WelcomeHeader } from '@/features/master-admin/components/dashboard/WelcomeHeader';
import { LiveStatsGrid } from '../components/LiveStatsGrid';
import { ActivityFeed } from '../components/ActivityFeed';
import { QuickActionCard } from '../components/QuickActionCard';
import { NotificationWidget } from '../components/NotificationWidget';
import { CalendarCard } from '../components/CalendarCard';
import { useRoleDashboard } from '../hooks/dashboard.hooks';
import type { ActivityItem, NotificationItem } from '../types';

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  { id: '1', title: 'Exam Manager Ready', description: 'Workspace loaded successfully.', timestamp: 'Just now', type: 'info', iconName: 'Calendar' },
];
const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'Ready', message: 'All exam systems operational.', timestamp: 'Just now', isRead: false, priority: 'low' },
];

export function ExamManagerDashboard() {
  const { data, isLoading } = useRoleDashboard();

  const stats = data?.stats || [];
  const quickActions = data?.quickActions || [];
  const activities: ActivityItem[] = data?.activities?.length ? data.activities : FALLBACK_ACTIVITIES;
  const notifications: NotificationItem[] = data?.notifications?.length ? data.notifications : FALLBACK_NOTIFICATIONS;


  return (
    <DashboardLayout>
      <PageHeader title="Exam Manager Dashboard" description="Track upcoming exams, schedule, and pending tasks." />

      <WelcomeHeader />

      <LiveStatsGrid stats={stats} isLoading={isLoading} />

      <DashboardGrid columns={3}>
        <div className="lg:col-span-2">
          <ActivityFeed activities={activities} />
        </div>
        <div className="lg:col-span-1">
          <CalendarCard />
        </div>
      </DashboardGrid>

      <DashboardGrid columns={2}>
        <QuickActionCard actions={quickActions} />
        <NotificationWidget notifications={notifications} />
      </DashboardGrid>
    </DashboardLayout>
  );
}
