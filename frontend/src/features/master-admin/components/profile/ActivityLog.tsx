import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useUserActivities, useUserAuditLogs } from '../../hooks/profile.hooks'
import { Activity, Shield, LogIn, Settings } from 'lucide-react'

export const ActivityLog: React.FC = () => {
  const { data: activityResponse, isLoading: activityLoading } = useUserActivities()
  const { data: auditResponse, isLoading: auditLoading } = useUserAuditLogs()

  const activities = Array.isArray(activityResponse?.data) ? activityResponse.data : []
  const audits = Array.isArray(auditResponse?.data) ? auditResponse.data.slice(0, 5) : [] // Just show latest 5 for profile

  const getActivityIcon = (activity: any) => {
    const colorClass = 'text-primary'

    switch (activity.type) {
      case 'LOGIN':
        return <LogIn className={`w-4 h-4 ${colorClass}`} />
      case 'SECURITY':
        return <Shield className={`w-4 h-4 ${colorClass}`} />
      case 'SETTINGS':
        return <Settings className={`w-4 h-4 ${colorClass}`} />
      default:
        return <Activity className={`w-4 h-4 ${colorClass}`} />
    }
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <Card className='border-0 shadow-sm'>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent actions and events in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-border before:to-transparent'>
            {activityLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-12' />
                <Skeleton className='h-12' />
              </div>
            ) : activities.length === 0 ? (
              <div className='text-center py-6 text-muted-foreground relative z-10 bg-background'>
                No recent activities found.
              </div>
            ) : (
              activities.map((activity: any, i: number) => (
                <div
                  key={activity._id || i}
                  className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active'
                >
                  <div className='flex items-center justify-center w-10 h-10 rounded-full border border-background bg-muted group-[.is-active]:bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10'>
                    {getActivityIcon(activity)}
                  </div>
                  <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm'>
                    <div className='flex items-center justify-between mb-1'>
                      <span className='font-semibold text-sm text-foreground'>
                        {activity.title || activity.action}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {activity.createdAt
                          ? new Intl.DateTimeFormat('en-US', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            }).format(new Date(activity.createdAt))
                          : ''}
                      </span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {activity.description || 'Action performed successfully.'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className='border-0 shadow-sm'>
        <CardHeader>
          <CardTitle>Configuration Changes</CardTitle>
          <CardDescription>Recent audit logs tied to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {auditLoading ? (
              <div className='space-y-3'>
                <Skeleton className='h-16' />
                <Skeleton className='h-16' />
              </div>
            ) : audits.length === 0 ? (
              <div className='text-center py-6 text-muted-foreground'>No configuration changes found.</div>
            ) : (
              audits.map((audit: any, i: number) => (
                <div
                  key={audit._id || i}
                  className='p-3 border-b last:border-0 hover:bg-muted/50 transition-colors rounded-lg'
                >
                  <div className='flex items-start justify-between'>
                    <div>
                      <p className='text-sm font-medium text-foreground'>{audit.action}</p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        {audit.module} • {audit.resourceId || 'System'}
                      </p>
                    </div>
                    <span className='text-[10px] text-muted-foreground'>
                      {audit.createdAt
                        ? new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                          }).format(new Date(audit.createdAt))
                        : ''}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
