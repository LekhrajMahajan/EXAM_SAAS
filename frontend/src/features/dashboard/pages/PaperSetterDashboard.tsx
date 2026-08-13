import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DashboardLayout } from '../components/DashboardLayout';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { AssignedPapersList } from '@/features/paper-setter/components/AssignedPapersList';
import { useRoleDashboard } from '../hooks/dashboard.hooks';

export function PaperSetterDashboard() {
  const { data } = useRoleDashboard();
  const unreadCount = data?.unreadCount || 0;

  return (
    <DashboardLayout>
      <PageHeader title="Paper Setter Dashboard" description="Manage question authoring, blueprints, and submissions." />

      <WelcomeBanner unreadCount={unreadCount} />

      <div className="space-y-4 mt-6 mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Your Paper Sets</h2>
        <AssignedPapersList />
      </div>
    </DashboardLayout>
  );
}
