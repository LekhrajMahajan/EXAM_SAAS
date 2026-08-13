import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from "@/providers/theme-context"
import {
  Shield,
  Users,
  Lock,
  AlertTriangle,
  Activity,
  MonitorSmartphone,
  MapPin,
  Globe,
  UserX,
  Laptop,
  Radar,
  KeyRound,
  ShieldAlert,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard'
import {
  useSecurityDashboardStats,
  useSecurityAlerts,
  useSecurityLoginAnalytics,
  useSecurityRecentActivities,
} from '../hooks/security.hooks'
import {
  PageLoader,
  CardSkeleton,
  TableSkeleton,
} from '@/shared/components/loading/LoadingComponents'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Badge } from '@/shared/components/ui/badge'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend)

export const SecurityPage = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useSecurityDashboardStats()
  const { data: alertsData, isLoading: isAlertsLoading } = useSecurityAlerts()
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useSecurityLoginAnalytics()
  const { data: activitiesData, isLoading: isActivitiesLoading } = useSecurityRecentActivities()

  const stats = statsData?.data
  const alerts = alertsData?.data || []
  const analytics = analyticsData?.data || []
  const activities = activitiesData?.data || []

  if (isStatsError) {
    return (
      <div className='p-8 text-center bg-red-50 text-red-600 rounded-lg border border-red-200'>
        <AlertTriangle className='w-10 h-10 mx-auto mb-4' />
        <h2 className='text-xl font-bold'>Failed to load security dashboard</h2>
        <p>Please check your connection and try again.</p>
      </div>
    )
  }

  const chartData = {
    labels: analytics.map((a) => a.date),
    datasets: [
      {
        label: 'Successful Logins',
        data: analytics.map((a) => a.successful),
        borderColor: isDark ? '#E4FD97' : '#2D3E2C',
        backgroundColor: isDark ? '#E4FD97' : '#2D3E2C',
        tension: 0.3,
      },
      {
        label: 'Failed Logins',
        data: analytics.map((a) => a.failed),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: isDark ? '#94A3B8' : '#64748B' }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#111827' : 'rgba(0, 0, 0, 0.8)',
        titleColor: isDark ? '#F8FAFC' : '#fff',
        bodyColor: isDark ? '#F8FAFC' : '#fff',
        borderColor: isDark ? '#334155' : 'rgba(0,0,0,0)',
        borderWidth: isDark ? 1 : 0,
      }
    },
    scales: {
      x: {
        grid: { color: isDark ? '#263244' : '#E2E8F0' },
        ticks: { color: isDark ? '#94A3B8' : '#64748B' }
      },
      y: {
        beginAtZero: true,
        grid: { color: isDark ? '#263244' : '#E2E8F0' },
        ticks: { color: isDark ? '#94A3B8' : '#64748B' }
      },
    },
  }

  return (
    <div className='space-y-6 p-6 md:p-8'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-foreground' : 'text-[#2D3E2C]'}`}>Security Dashboard</h1>
          <p className='text-muted-foreground mt-2'>
            Enterprise security monitoring and threat analytics.
          </p>
        </div>
        <div className='flex items-center gap-4'>
          <Button
            variant='outline'
            onClick={() => navigate('/master-admin/security/events')}
            className='bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800'
          >
            <Radar className='w-4 h-4 mr-2 text-red-600' />
            Threat Detection
          </Button>
          <Badge
            variant='outline'
            className={`px-4 py-2 ${isDark ? 'bg-[#E4FD97]/10 border-[#E4FD97]/30 text-[#E4FD97]' : 'bg-[#2D3E2C]/8 border-[#2D3E2C]/30 text-[#2D3E2C]'}`}
          >
            <Activity className={`w-4 h-4 mr-2 animate-pulse ${isDark ? 'text-[#E4FD97]' : 'text-[#2D3E2C]'}`} />
            Live Monitoring Active
          </Badge>
        </div>
      </div>

      {isStatsLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : stats ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            title='Total Users'
            value={stats.totalUsers}
            icon={Users}
            accent='slate'
          />
          <StatCard
            title='Active Sessions'
            value={stats.activeSessions}
            icon={Activity}
            accent='green'
          />
          <StatCard
            title='Online Users'
            value={stats.onlineUsers}
            icon={Globe}
            accent='lime'
          />
          <StatCard
            title='Security Health'
            value={`${stats.securityHealthScore}%`}
            icon={Shield}
            accent={stats.securityHealthScore > 90 ? 'green' : 'amber'}
          />
          <StatCard
            title='Locked Accounts'
            value={stats.lockedAccounts}
            icon={Lock}
            accent={stats.lockedAccounts > 0 ? 'red' : 'slate'}
          />
          <StatCard
            title='Suspended Accounts'
            value={stats.suspendedAccounts}
            icon={UserX}
            accent='slate'
          />
          <StatCard
            title='Failed Logins Today'
            value={stats.failedLoginsToday}
            icon={AlertTriangle}
            accent={stats.failedLoginsToday > 10 ? 'amber' : 'slate'}
          />
          <StatCard
            title='Active MFA Users'
            value={stats.activeMfaUsers}
            icon={KeyRound}
            accent='green'
          />
        </div>
      ) : null}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Login Analytics (Last 7 Days)</CardTitle>
            <CardDescription>Authentication success and failure trends</CardDescription>
          </CardHeader>
          <CardContent>
            {isAnalyticsLoading ? (
              <div className='h-[300px] flex items-center justify-center'>
                <PageLoader text='Loading chart data...' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <Line data={chartData} options={chartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className={isDark ? 'border-red-900/50' : 'border-red-200'}>
          <CardHeader className={isDark ? 'bg-red-950/20' : 'bg-red-50/50'}>
            <CardTitle className={`flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
              <ShieldAlert className='w-5 h-5' />
              Recent Security Alerts
            </CardTitle>
            <CardDescription className={isDark ? "text-red-300/70" : ""}>High & Critical severity events</CardDescription>
          </CardHeader>
          <CardContent className='p-0'>
            {isAlertsLoading ? (
              <div className='p-4'>
                <PageLoader text='Loading alerts...' />
              </div>
            ) : alerts.length > 0 ? (
              <div className={`divide-y max-h-[300px] overflow-y-auto ${isDark ? 'divide-red-900/30' : 'divide-red-100'}`}>
                {alerts.map((alert) => (
                  <div key={alert._id} className='p-4 flex gap-3 items-start'>
                    <div className='mt-1'>
                      <AlertTriangle className='w-5 h-5 text-red-500' />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-red-300' : ''}`}>{alert.action.replace(/_/g, ' ')}</p>
                      <p className={`text-xs mt-1 ${isDark ? 'text-red-200/70' : 'text-slate-500'}`}>{alert.description}</p>
                      <p className='text-xs text-slate-400 mt-2'>
                        {new Date(alert.createdAt).toLocaleString()}
                        {alert.performedBy &&
                          ` • ${alert.performedBy.firstName} ${alert.performedBy.lastName}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='p-8 text-center text-slate-500'>
                <Shield className='w-8 h-8 mx-auto mb-2 text-green-500' />
                <p>No high severity alerts detected.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Activities</CardTitle>
          <CardDescription>Detailed log of recent system access and modifications</CardDescription>
        </CardHeader>
        <CardContent>
          {isActivitiesLoading ? (
            <TableSkeleton rows={5} cols={6} />
          ) : activities.length > 0 ? (
            <div className='overflow-x-auto'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Device / OS</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity) => (
                    <TableRow key={activity._id}>
                      <TableCell className='text-sm whitespace-nowrap'>
                        {new Date(activity.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 bg-[#2D3E2C] text-[#E4FD97] rounded-full flex items-center justify-center font-bold text-xs'>
                            {activity.performedBy
                              ? activity.performedBy.firstName[0] + activity.performedBy.lastName[0]
                              : 'S'}
                          </div>
                          <div>
                            <p className='font-medium text-sm'>
                              {activity.performedBy
                                ? `${activity.performedBy.firstName} ${activity.performedBy.lastName}`
                                : 'System'}
                            </p>
                            <p className='text-xs text-slate-500'>
                              {activity.performedBy?.email || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className='font-medium text-sm'>
                          {activity.action.replace(/_/g, ' ')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1 text-sm'>
                          <MapPin className='w-3 h-3 text-slate-400' />
                          {activity.ipAddress || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='flex items-center gap-1 text-sm'>
                          {activity.deviceType?.toLowerCase().includes('mobile') ? (
                            <MonitorSmartphone className='w-3 h-3 text-slate-400' />
                          ) : (
                            <Laptop className='w-3 h-3 text-slate-400' />
                          )}
                          {activity.operatingSystem || 'Unknown'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            activity.severity === 'CRITICAL' || activity.severity === 'HIGH'
                              ? 'destructive'
                              : activity.severity === 'MEDIUM'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            activity.severity === 'MEDIUM'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent'
                              : ''
                          }
                        >
                          {activity.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className='text-center py-12 text-slate-500'>
              <Activity className='w-12 h-12 mx-auto text-slate-300 mb-4' />
              <h3 className='text-lg font-medium text-slate-900'>No activities found</h3>
              <p>There are no recent security activities to display.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
