import React, { useMemo } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DashboardLayout } from '../components/DashboardLayout';
import { AssignedPapersList } from '@/features/paper-setter/components/AssignedPapersList';
import { useRoleDashboard } from '../hooks/dashboard.hooks';

export function PaperSetterDashboard() {
  const { data } = useRoleDashboard();

  const { currentDate, lastLoginDate } = useMemo(() => {
    const now = new Date();
    const lastLogin = new Date(now.getTime() - 86400000);
    return {
      currentDate: `${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      lastLoginDate: `${lastLogin.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${lastLogin.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title="Paper Setter Dashboard" description="Manage question authoring, blueprints, and submissions." />

      {/* HEADER BANNER (Paper Setter Style matching Company Admin) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#2D3E2C] p-6 rounded-xl border border-[#2D3E2C] shadow-sm mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-secondary mb-1">
            Welcome Paper Setter!
          </h1>
          <p className="text-secondary/80 font-medium text-sm sm:text-base">
            Role: <span className="text-secondary font-semibold">Paper Setter</span> | Craft high-quality question papers with precision.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-secondary/80 w-full md:w-auto justify-between md:justify-end">
          <div className="text-left md:text-right hidden sm:block">
            <p className="font-medium text-secondary">
              {currentDate}
            </p>
            <p className="mt-0.5 text-xs">
              Last login: {lastLoginDate}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6 mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Your Paper Sets</h2>
        <AssignedPapersList />
      </div>
    </DashboardLayout>
  );
}
