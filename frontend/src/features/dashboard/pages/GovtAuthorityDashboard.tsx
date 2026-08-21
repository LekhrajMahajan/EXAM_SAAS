
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DashboardLayout } from '../components/DashboardLayout';
import { WelcomeBanner } from '../components/WelcomeBanner';
import { LiveStatsGrid } from '../components/LiveStatsGrid';
import { useRoleDashboard } from '../hooks/dashboard.hooks';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import type { StatItem } from '../types';

export function GovtAuthorityDashboard() {
  const { data } = useRoleDashboard();
  const { user } = useAuthStore();
  const isPrivate = user?.role === 'PRIVATE_AUTHORITY';

  const [importedCandidateCount, setImportedCandidateCount] = useState(0);
  const [importedCenterCount, setImportedCenterCount] = useState(0);
  const [isCountsLoading, setIsCountsLoading] = useState(true);

  // Both Govt Authority AND Private Authority show the same two cards
  useEffect(() => {
    Promise.all([
      api.get('/import-candidate').catch(() => ({ data: { success: false } })),
      api.get('/import-center-assign-exam').catch(() => ({ data: { success: false } }))
    ]).then(([candidateRes, centerRes]) => {
      if (candidateRes.data?.success) {
        setImportedCandidateCount(candidateRes.data.data.length || 0);
      }
      if (centerRes.data?.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const totalCenters = centerRes.data.data.reduce((acc: number, item: any) => acc + (item.centers?.length || 0), 0);
        setImportedCenterCount(totalCenters);
      }
    }).finally(() => {
      setIsCountsLoading(false);
    });
  }, []);

  const customStats: StatItem[] = [
    {
      id: 'imported_candidates',
      label: 'IMPORTED CANDIDATES',
      value: importedCandidateCount,
      change: 'Imported',
      iconName: 'Users',
      colorScheme: 'indigo'
    },
    {
      id: 'imported_centers',
      label: 'IMPORT CENTER ASSIGN EXAM',
      value: importedCenterCount,
      change: 'Centers Assigned',
      iconName: 'Building2',
      colorScheme: 'emerald'
    }
  ];

  const unreadCount = data?.unreadCount || 0;

  return (
    <DashboardLayout>
      <PageHeader 
        title={isPrivate ? "Private Authority Dashboard" : "Government Authority Dashboard"} 
        description={isPrivate ? "Manage and monitor your assigned examination center." : "Platform compliance, transparency, and national exam analytics."} 
      />

      <WelcomeBanner unreadCount={unreadCount} />

      <LiveStatsGrid stats={customStats} isLoading={isCountsLoading} />
    </DashboardLayout>
  );
}
