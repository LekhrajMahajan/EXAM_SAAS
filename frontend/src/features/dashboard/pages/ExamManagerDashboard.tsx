import { useState, useEffect } from 'react'
import { PageHeader } from '@/shared/components/layout/page-header'
import { DashboardLayout } from '../components/DashboardLayout'
import { DashboardGrid } from '../components/DashboardGrid'
import { WelcomeHeader } from '@/features/master-admin/components/dashboard/WelcomeHeader'
import { LiveStatsGrid } from '../components/LiveStatsGrid'
import { getDisplayStatus } from '@/shared/utils/exam-status'

import { QuickActionCard } from '../components/QuickActionCard'
import { CalendarCard } from '../components/CalendarCard'
import { useQuery } from '@tanstack/react-query'
import { examApi } from '@/features/exam-manager/api/exam.api'
import { useRoleDashboard } from '../hooks/dashboard.hooks'
import type { ActivityItem, StatItem } from '../types'

const FALLBACK_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'Exam Manager Ready',
    description: 'Workspace loaded successfully.',
    timestamp: 'Just now',
    type: 'info',
    iconName: 'Calendar',
  },
]


export function ExamManagerDashboard () {
  const { data, isLoading } = useRoleDashboard()

  const { data: examsData, isLoading: isExamsLoading } = useQuery({
    queryKey: ['exams', 'all'],
    queryFn: () => examApi.getAll({ limit: 1000 })
  })
  const allExams = examsData?.data?.exams || []
  const upcomingExams = allExams

  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const upcomingCount = allExams.filter(e => {
    const ds = getDisplayStatus(e, now);
    return ds === 'ACTIVE' || ds === 'PUBLISHED' || ds === 'UPCOMING' || ds === 'DRAFT';
  }).length;
  
  const activeCount = allExams.filter(e => getDisplayStatus(e, now) === 'EXAM_STARTED').length;
  
  const resultPublishCount = allExams.filter(e => {
    const ds = getDisplayStatus(e, now);
    return ds === 'PENDING_PUBLISH_RESULT' || ds === 'PENDING_RESULT_GENERATE';
  }).length;
  
  const completedCount = allExams.filter(e => {
    const ds = getDisplayStatus(e, now);
    return ds === 'RESULT_PUBLISHED' || ds === 'COMPLETED';
  }).length;
  
  const computedStats: StatItem[] = [
    {
      id: 'upcoming',
      label: 'Upcoming Exams',
      value: upcomingCount,
      iconName: 'Calendar',
      colorScheme: 'slate',
      trend: 'neutral',
      change: upcomingCount > 0 ? `${upcomingCount} Scheduled` : 'No upcoming'
    },
    {
      id: 'active',
      label: 'Active Exams',
      value: activeCount,
      iconName: 'PlayCircle',
      colorScheme: 'emerald',
      trend: activeCount > 0 ? 'up' : 'neutral',
      change: activeCount > 0 ? 'Running now' : 'None active'
    },
    {
      id: 'results',
      label: 'Exam Result Publish',
      value: resultPublishCount,
      iconName: 'CheckSquare',
      colorScheme: 'amber',
      trend: resultPublishCount > 0 ? 'up' : 'neutral',
      change: resultPublishCount > 0 ? 'Published' : 'Awaiting publish'
    },
    {
      id: 'completed',
      label: 'Completed Exams',
      value: completedCount,
      iconName: 'CheckCircle2',
      colorScheme: 'indigo',
      trend: 'neutral',
      change: `${completedCount} Total`
    }
  ]
  const quickActions = [
    {
      id: 'qa-exams',
      label: 'Exams',
      path: '/exam-manager/exams',
      iconName: 'FileText',
      colorScheme: 'slate',
    },
    {
      id: 'qa-topics',
      label: 'Topics',
      path: '/exam-manager/topics',
      iconName: 'BookOpen',
      colorScheme: 'emerald',
    },
  ];
  const activities: ActivityItem[] = data?.activities?.length
    ? data.activities
    : FALLBACK_ACTIVITIES

  return (
    <DashboardLayout>
      <div className='space-y-1'>
        <PageHeader
          title='Exam Manager Dashboard'
          description='Track upcoming exams, schedule, and pending tasks.'
        />
        <WelcomeHeader />
      </div>

      <LiveStatsGrid stats={computedStats} isLoading={isLoading || isExamsLoading} />

      <DashboardGrid columns={2}>
        <div className='lg:col-span-1 h-full'>
          <QuickActionCard actions={quickActions} />
        </div>
        <div className='lg:col-span-1 h-full'>
          <div className='h-full'>
            <CalendarCard exams={upcomingExams} />
          </div>
        </div>
      </DashboardGrid>
    </DashboardLayout>
  )
}
