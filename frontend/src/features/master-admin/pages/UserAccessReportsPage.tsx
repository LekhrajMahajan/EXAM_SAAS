import React, { useState, useCallback } from 'react'
import {
  Users,
  Lock,
  UserCheck,
  UserX,
  Shield,
  Activity,
  Key,
  LogIn,
  Download,
  Search,
  Filter as FilterIcon,
  RefreshCw,
  FileText,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { useTheme } from '@/providers/theme-context'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import { GenericPagination } from '@/shared/components/pagination/GenericPagination'
import { BarChart, LineChart, DoughnutChart } from '@/shared/components/charts/charts'
import { FilterDrawer } from '@/shared/components/filters/FilterComponents'
import type { TableColumn } from '@/shared/types'
import {
  useUserReportSummary,
  useUserReportList,
  useUserLoginHistory,
  useUserRolesReport,
} from '../hooks/user-report.hooks'
import { useRecentReports } from '../hooks/report.hooks'
import { userReportApi } from '../api/user-report.api'
import { useGenerateUserReport } from '../hooks/user-report.hooks'
import type { UserReportUser, LoginHistoryRecord } from '../api/user-report.api'
import { useToast } from '@/hooks/use-toast'

/*
|--------------------------------------------------------------------------
| Theme Colors (matching website palette)
| Primary  : #2D3E2C  (dark forest green)
| Secondary: #E4FD97  (lime / yellow-green)
|--------------------------------------------------------------------------
*/

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'bg-[#E4FD97] text-[#2D3E2C] border-[#E4FD97]',
  INACTIVE: 'bg-slate-100 text-slate-600 border-slate-200',
  SUSPENDED: 'bg-amber-100 text-amber-800 border-amber-200',
  BLOCKED: 'bg-red-50 text-red-700 border-red-200',
  DELETED: 'bg-rose-50 text-rose-700 border-rose-200',
}

// Website-matching chart palette: primary green + lime + supporting tones
const CHART_COLORS = ['#2D3E2C', '#4a6648', '#E4FD97', '#A8D672', '#6BAF3E', '#3D7A32', '#8BAE6E']

/*
|--------------------------------------------------------------------------
| Skeletons
|--------------------------------------------------------------------------
*/

const StatCardSkeleton = () => (
  <Card className='border border-slate-200'>
    <CardContent className='p-6'>
      <div className='flex items-center gap-4'>
        <div className='w-12 h-12 rounded-xl bg-slate-100 animate-pulse' />
        <div className='flex-1 space-y-2'>
          <div className='h-3 bg-slate-100 rounded animate-pulse w-24' />
          <div className='h-7 bg-slate-100 rounded animate-pulse w-14' />
        </div>
      </div>
    </CardContent>
  </Card>
)

const TableSkeleton = () => (
  <div className='space-y-3'>
    {[...Array(8)].map((_, i) => (
      <div key={i} className='h-12 bg-slate-50 animate-pulse rounded-lg' />
    ))}
  </div>
)

/*
|--------------------------------------------------------------------------
| Stat Card — website theme
|--------------------------------------------------------------------------
*/

import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard'

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState ({
  icon: Icon = FileText,
  message,
}: {
  icon?: React.ElementType
  message: string
}) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  return (
    <div className='flex flex-col items-center justify-center py-16 text-center select-none'>
      <div className={`w-16 h-16 rounded-full border flex items-center justify-center mb-4 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <Icon className={`w-8 h-8 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
      </div>
      <p className={`font-medium text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{message}</p>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| CSV Export helper
|--------------------------------------------------------------------------
*/

function exportToCSV (rows: Record<string, unknown>[], filename: string) {
  if (!rows.length) return
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((h) => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','),
    ),
  ].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/*
|--------------------------------------------------------------------------
| Main Page
|--------------------------------------------------------------------------
*/

export const UserAccessReportsPage = () => {
  const { toast } = useToast()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const { mutate: generateReport, isPending: isGenerating } = useGenerateUserReport()

  const [activeTab, setActiveTab] = useState('overview')
  const [userPage, setUserPage] = useState(0)
  const [userPageSize, setUserPageSize] = useState(20)
  const [userSearch, setUserSearch] = useState('')
  const [userSearchInput, setUserSearchInput] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [loginPage, setLoginPage] = useState(0)
  const [loginFilter, setLoginFilter] = useState<{ successful?: string }>({})

  const [filters, setFilters] = useState<{
    status?: string
    role?: string
    startDate?: string
    endDate?: string
  }>({})
  const [pendingFilters, setPendingFilters] = useState({ ...filters })

  /*── Query params ──────────────────────────────────────────────*/

  const userListParams = {
    page: userPage + 1,
    limit: userPageSize,
    ...(userSearch ? { search: userSearch } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.startDate ? { startDate: filters.startDate } : {}),
    ...(filters.endDate ? { endDate: filters.endDate } : {}),
  }

  const loginHistoryParams = {
    page: loginPage + 1,
    limit: 20,
    ...(loginFilter.successful !== undefined ? { successful: loginFilter.successful } : {}),
  }

  /*── Queries ───────────────────────────────────────────────────*/

  const {
    data: summaryData,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useUserReportSummary({})
  const { data: recentReports, isLoading: recentLoading } = useRecentReports({ limit: 10 })
  const userAccessReports =
    recentReports?.data
      ?.filter(
        (r: any) => r.reportType === 'USER_ACCESS' || r.reportName?.toLowerCase().includes('user'),
      )
      .slice(0, 3) || []
  const { data: usersData, isLoading: usersLoading } = useUserReportList(
    userListParams as Record<string, unknown>,
  )
  const { data: loginData, isLoading: loginLoading } = useUserLoginHistory(
    loginHistoryParams as Record<string, unknown>,
  )
  const { data: rolesData, isLoading: rolesLoading } = useUserRolesReport({})

  const summary = summaryData?.data
  const users = usersData?.data || []
  const usersPagination = usersData?.pagination
  const loginRecords = loginData?.data?.records || []
  const loginStats = loginData?.data?.stats
  const loginsByDay = loginData?.data?.loginsByDay || []
  const loginPagination = loginData?.pagination
  const rolesReport = rolesData?.data

  /*── Handlers ──────────────────────────────────────────────────*/

  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setUserSearch(userSearchInput)
    setUserPage(0)
  }

  const handleApplyFilters = () => {
    setFilters({ ...pendingFilters })
    setUserPage(0)
    setIsFilterOpen(false)
  }

  const handleResetFilters = () => {
    setPendingFilters({})
    setFilters({})
    setUserPage(0)
  }

  const handleExportCSV = useCallback(async () => {
    setIsExporting(true)
    try {
      const result = await userReportApi.getExport({
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.role ? { role: filters.role } : {}),
      })
      exportToCSV(result.data as Record<string, unknown>[], 'user_access_report')
      toast({ title: 'Export successful', description: `${result.data.length} records exported.` })
    } catch {
      toast({
        title: 'Export failed',
        description: 'Could not export data.',
        variant: 'destructive',
      })
    } finally {
      setIsExporting(false)
    }
  }, [filters, toast])

  /*── User Table Columns ────────────────────────────────────────*/

  const userColumns: TableColumn<UserReportUser>[] = [
    {
      id: 'name',
      header: 'User',
      accessorKey: 'firstName',
      cell: ({ row }) => (
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full bg-[#2D3E2C] flex items-center justify-center shrink-0'>
            <span className='text-xs font-bold text-[#E4FD97]'>
              {row.firstName?.[0]?.toUpperCase()}
              {row.lastName?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className={`font-semibold text-sm leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {row.firstName} {row.lastName}
            </p>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'employeeCode',
      header: 'Emp. ID',
      accessorKey: 'employeeCode',
      cell: ({ row }) => (
        <span className={`font-mono text-xs border px-2 py-0.5 rounded ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
          {row.employeeCode || 'NA'}
        </span>
      ),
    },
    {
      id: 'company',
      header: 'Company',
      accessorKey: 'company',
      cell: ({ row }) => <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{row.company || 'NA'}</span>,
    },
    {
      id: 'department',
      header: 'Department',
      accessorKey: 'department',
      cell: ({ row }) => <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{row.department || 'NA'}</span>,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${isDark ? 'bg-[#E4FD97]/10 text-[#E4FD97] border-[#E4FD97]/30' : 'bg-[#2D3E2C]/8 text-[#2D3E2C] border-[#2D3E2C]/20'}`}>
          {row.role?.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            row.status
              ? STATUS_COLOR[row.status] || 'bg-slate-100 text-slate-600 border-slate-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          {row.status || 'NA'}
        </span>
      ),
    },
    {
      id: 'lastLoginAt',
      header: 'Last Login',
      accessorKey: 'lastLoginAt',
      cell: ({ row }) => (
        <span className='text-xs text-slate-500'>
          {row.lastLoginAt ? (
            new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(
              new Date(row.lastLoginAt),
            )
          ) : (
            <span className='text-slate-400 font-medium'>NA</span>
          )}
        </span>
      ),
    },
  ]

  /*── Login History Columns ─────────────────────────────────────*/

  const loginColumns: TableColumn<LoginHistoryRecord>[] = [
    {
      id: 'user',
      header: 'User',
      accessorKey: 'firstName',
      cell: ({ row }) => (
        <div>
          <p className={`font-semibold text-sm leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {row.firstName} {row.lastName}
          </p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>{row.email}</p>
        </div>
      ),
    },
    {
      id: 'result',
      header: 'Result',
      accessorKey: 'successful',
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            row.successful
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {row.successful ? <UserCheck className='w-3 h-3' /> : <UserX className='w-3 h-3' />}
          {row.successful ? 'Success' : 'Failed'}
        </span>
      ),
    },
    {
      id: 'loginAt',
      header: 'Timestamp',
      accessorKey: 'loginAt',
      cell: ({ row }) => (
        <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          {row.loginAt
            ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(
                new Date(row.loginAt),
              )
            : 'NA'}
        </span>
      ),
    },
    {
      id: 'ip',
      header: 'IP Address',
      accessorKey: 'ipAddress',
      cell: ({ row }) => (
        <span className={`font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{row.ipAddress || 'NA'}</span>
      ),
    },
    {
      id: 'browser',
      header: 'Browser / OS',
      accessorKey: 'browser',
      cell: ({ row }) => (
        <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          <p className='font-medium'>{row.browser || 'NA'}</p>
          <p className={`text-slate-400`}>{row.operatingSystem || 'NA'}</p>
        </div>
      ),
    },
    {
      id: 'location',
      header: 'Location',
      accessorKey: 'location',
      cell: ({ row }) => <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{row.location || 'NA'}</span>,
    },
  ]

  /*── Chart Data ────────────────────────────────────────────────*/

  const roleChartData = rolesReport?.usersByRole?.length
    ? {
        labels: rolesReport.usersByRole.map((r) => r.role?.replace(/_/g, ' ') || r.role),
        datasets: [
          {
            data: rolesReport.usersByRole.map((r) => r.count),
            backgroundColor: CHART_COLORS,
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 8,
          },
        ],
      }
    : null

  const statusChartData = rolesReport?.usersByStatus?.length
    ? {
        labels: rolesReport.usersByStatus.map((s) => s.status),
        datasets: [
          {
            label: 'Users',
            data: rolesReport.usersByStatus.map((s) => s.count),
            backgroundColor: ['#2D3E2C', '#4a6648', '#E4FD97', '#A8D672', '#3D7A32'],
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      }
    : null

  const newUsersChartData = rolesReport?.newUsersLast30Days?.length
    ? {
        labels: rolesReport.newUsersLast30Days.map((d) => d.date),
        datasets: [
          {
            label: 'New Users',
            data: rolesReport.newUsersLast30Days.map((d) => d.count),
            borderColor: isDark ? '#E4FD97' : '#2D3E2C',
            backgroundColor: isDark ? 'rgba(228,253,151,0.08)' : 'rgba(45,62,44,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: isDark ? '#E4FD97' : '#2D3E2C',
          },
        ],
      }
    : null

  const loginTrendChartData = loginsByDay.length
    ? {
        labels: loginsByDay.map((d) => d.date),
        datasets: [
          {
            label: 'Successful',
            data: loginsByDay.map((d) => d.successful),
            borderColor: isDark ? '#E4FD97' : '#2D3E2C',
            backgroundColor: isDark ? 'rgba(228,253,151,0.08)' : 'rgba(45,62,44,0.08)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: isDark ? '#E4FD97' : '#2D3E2C',
          },
          {
            label: 'Failed',
            data: loginsByDay.map((d) => d.failed),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.06)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#ef4444',
          },
        ],
      }
    : null

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  /*── Render ────────────────────────────────────────────────────*/

  return (
    <div className={`space-y-6 p-6 min-h-full ${isDark ? '' : 'bg-[#F8FAFC]'}`}>
      {/* ── Header ───────────────────────────────────────────── */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
            User &amp; Access Reports
          </h1>
          <p className='text-slate-500 mt-1 text-sm'>
            Comprehensive user activity, login history, role distribution, and access analytics.
          </p>
        </div>
        <div className='flex items-center gap-3 shrink-0'>
          <Button
            variant='outline'
            onClick={() => refetchSummary()}
            className='border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button transition-colors gap-2 font-medium'
          >
            <RefreshCw className='w-4 h-4' />
            Refresh
          </Button>
          <Button
            variant='outline'
            className='border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button transition-colors gap-2 font-medium'
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className='w-4 h-4' />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button
            variant='outline'
            className='border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button transition-colors gap-2 font-medium'
            onClick={() => generateReport({})}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className='w-4 h-4' />}
            {isGenerating ? 'Generating...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* ── Summary Cards ────────────────────────────────────── */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {summaryLoading ? (
          [...Array(8)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title='Total Users'
              value={summary?.totalUsers ?? 0}
              icon={Users}
              accent='green'
              description='All registered users'
            />
            <StatCard
              title='Active Users'
              value={summary?.activeUsers ?? 0}
              icon={UserCheck}
              accent='lime'
              description='Currently active'
            />
            <StatCard
              title='Locked Accounts'
              value={summary?.lockedUsers ?? 0}
              icon={Lock}
              accent='red'
              description='Blocked accounts'
            />
            <StatCard
              title='Suspended Users'
              value={summary?.suspendedUsers ?? 0}
              icon={UserX}
              accent='amber'
              description='Suspended accounts'
            />
            <StatCard
              title='Total Roles'
              value={summary?.totalRoles ?? 0}
              icon={Shield}
              accent='green'
              description='Distinct roles assigned'
            />
            <StatCard
              title='Active Sessions'
              value={summary?.activeSessions ?? 0}
              icon={Activity}
              accent='slate'
              description='Live sessions'
            />
            <StatCard
              title='Permission Links'
              value={summary?.permissionAssignments ?? 0}
              icon={Key}
              accent='slate'
              description='Employee-role mappings'
            />
            <StatCard
              title='Logins Today'
              value={summary?.loginAttemptsToday ?? 0}
              icon={LogIn}
              accent='lime'
              description='All login attempts today'
            />
          </>
        )}
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className={`mb-4 border p-1 h-auto gap-1 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
          {(['overview', 'users', 'login-history', 'roles'] as const).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className='data-[state=active]:bg-[#2D3E2C] data-[state=active]:text-[#E4FD97] data-[state=active]:shadow-none rounded-md px-4 py-1.5 text-sm font-medium transition-all'
            >
              {tab === 'overview'
                ? 'Overview'
                : tab === 'users'
                ? 'Users List'
                : tab === 'login-history'
                ? 'Login History'
                : 'Role Distribution'}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══════════════════════════════════════════════════════
            TAB: Overview
        ═══════════════════════════════════════════════════════ */}
        <TabsContent value='overview' className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card className='border-slate-200'>
              <CardHeader className='pb-2'>
                <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>Users by Role</CardTitle>
                <CardDescription>Distribution of users across system roles</CardDescription>
              </CardHeader>
              <CardContent className='h-72'>
                {rolesLoading ? (
                  <div className='h-full bg-slate-50 rounded-lg animate-pulse' />
                ) : roleChartData ? (
                  <DoughnutChart data={roleChartData} options={{ cutout: '65%' }} />
                ) : (
                  <EmptyState message='No role data available' />
                )}
              </CardContent>
            </Card>

            <Card className='border-slate-200'>
              <CardHeader className='pb-2'>
                <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
                  Users by Status
                </CardTitle>
                <CardDescription>Account status breakdown</CardDescription>
              </CardHeader>
              <CardContent className='h-72'>
                {rolesLoading ? (
                  <div className='h-full bg-slate-50 rounded-lg animate-pulse' />
                ) : statusChartData ? (
                  <BarChart data={statusChartData} />
                ) : (
                  <EmptyState message='No status data available' />
                )}
              </CardContent>
            </Card>

            <Card className='border-slate-200'>
              <CardHeader className='pb-2'>
                <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
                  New Users (Last 30 Days)
                </CardTitle>
                <CardDescription>Daily new user registrations</CardDescription>
              </CardHeader>
              <CardContent className='h-72'>
                {rolesLoading ? (
                  <div className='h-full bg-slate-50 rounded-lg animate-pulse' />
                ) : newUsersChartData ? (
                  <LineChart data={newUsersChartData} />
                ) : (
                  <EmptyState icon={TrendingUp} message='No registration data in this period' />
                )}
              </CardContent>
            </Card>

            <Card className='border-slate-200'>
              <CardHeader className='pb-2'>
                <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
                  Login Trend (Last 30 Days)
                </CardTitle>
                <CardDescription>Successful vs failed login attempts</CardDescription>
              </CardHeader>
              <CardContent className='h-72'>
                {loginLoading ? (
                  <div className='h-full bg-slate-50 rounded-lg animate-pulse' />
                ) : loginTrendChartData ? (
                  <LineChart data={loginTrendChartData} />
                ) : (
                  <EmptyState icon={LogIn} message='No login history data available' />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Downloaded Reports */}
          <Card className='border-slate-200'>
            <CardContent className='p-6'>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
                Recent Downloaded Reports
              </h3>
              {recentLoading ? (
                <div className='space-y-3'>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className='h-10 bg-slate-100 animate-pulse rounded' />
                  ))}
                </div>
              ) : (
                <div className='space-y-4'>
                  {userAccessReports.map((report: any) => (
                    <div
                      key={report._id}
                      className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}
                    >
                      <div className='flex items-center gap-3'>
                        <FileText className={`w-5 h-5 ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`} />
                        <div>
                          <p className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>{report.reportName}</p>
                        </div>
                      </div>
                      <div className='text-xs text-slate-500 text-right'>
                        {new Date(report.createdAt).toLocaleDateString()}{' '}
                        {new Date(report.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  ))}
                  {!userAccessReports.length && (
                    <p className='text-sm text-slate-500 text-center py-4'>
                      No recent reports found.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════
            TAB: Users List
        ═══════════════════════════════════════════════════════ */}
        <TabsContent value='users'>
          <Card className='border-slate-200'>
            <CardHeader className='pb-4 border-b border-slate-100'>
              <div className='flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between'>
                <div>
                  <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>All Users</CardTitle>
                  {usersPagination && (
                    <p className='text-xs text-slate-400 mt-0.5'>
                      {usersPagination.total} total users
                    </p>
                  )}
                </div>
                <div className='flex items-center gap-2 w-full sm:w-auto flex-wrap'>
                  <form
                    onSubmit={handleUserSearch}
                    className='flex items-center gap-2 flex-1 sm:flex-none'
                  >
                    <div className='relative w-full sm:w-60'>
                      <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-slate-400' />
                      <Input
                        type='text'
                        placeholder='Search name, email...'
                        className={`pl-9 h-9 text-sm focus-visible:ring-[#2D3E2C]/30 focus-visible:border-[#2D3E2C] ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-500' : 'bg-slate-50 border-slate-200'}`}
                        value={userSearchInput}
                        onChange={(e) => setUserSearchInput(e.target.value)}
                      />
                    </div>
                    <Button
                      type='submit'
                      variant='outline'
                      size='sm'
                      className='border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button transition-colors'
                    >
                      Search
                    </Button>
                  </form>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsFilterOpen(true)}
                    className={`gap-2 shrink-0 transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button`}
                  >
                    <FilterIcon className='w-4 h-4' />
                    Filter
                    {activeFiltersCount > 0 && (
                      <span className='ml-0.5 bg-[#2D3E2C] text-[#E4FD97] text-xs rounded-full px-1.5 py-0 leading-4'>
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className='gap-2 shrink-0 border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button transition-colors'
                  >
                    <Download className='w-4 h-4' />
                    Export
                  </Button>
                </div>
              </div>

              {/* Active filter pills */}
              {activeFiltersCount > 0 && (
                <div className='flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100'>
                  {filters.status && (
                    <span className='inline-flex items-center gap-1 bg-[#2D3E2C]/8 text-[#2D3E2C] text-xs px-2.5 py-1 rounded-full border border-[#2D3E2C]/20 font-medium'>
                      Status: {filters.status}
                      <button
                        onClick={() => setFilters((f) => ({ ...f, status: undefined }))}
                        className='ml-1 hover:text-red-500 font-bold'
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {filters.role && (
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${isDark ? 'bg-[#E4FD97]/10 text-[#E4FD97] border-[#E4FD97]/30' : 'bg-[#2D3E2C]/8 text-[#2D3E2C] border-[#2D3E2C]/20'}`}>
                      Role: {filters.role}
                      <button
                        onClick={() => setFilters((f) => ({ ...f, role: undefined }))}
                        className='ml-1 hover:text-red-500 font-bold'
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {(filters.startDate || filters.endDate) && (
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${isDark ? 'bg-[#E4FD97]/10 text-[#E4FD97] border-[#E4FD97]/30' : 'bg-[#2D3E2C]/8 text-[#2D3E2C] border-[#2D3E2C]/20'}`}>
                      Date Range
                      <button
                        onClick={() =>
                          setFilters((f) => ({ ...f, startDate: undefined, endDate: undefined }))
                        }
                        className='ml-1 hover:text-red-500 font-bold'
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={handleResetFilters}
                    className='text-xs text-slate-400 hover:text-red-500 transition-colors underline underline-offset-2'
                  >
                    Clear all
                  </button>
                </div>
              )}
            </CardHeader>

            <CardContent className='pt-4'>
              {usersLoading ? (
                <TableSkeleton />
              ) : users.length === 0 ? (
                <EmptyState icon={Users} message='No users found for the selected filters.' />
              ) : (
                <>
                  <GenericDataTable
                    columns={userColumns}
                    data={users}
                    keyExtractor={(item: UserReportUser) => item._id}
                  />
                  {usersPagination && usersPagination.total > 0 && (
                    <GenericPagination
                      pageIndex={userPage}
                      pageSize={userPageSize}
                      totalCount={usersPagination.total}
                      onPageChange={setUserPage}
                      onPageSizeChange={(size) => {
                        setUserPageSize(size)
                        setUserPage(0)
                      }}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════
            TAB: Login History
        ═══════════════════════════════════════════════════════ */}
        <TabsContent value='login-history' className='space-y-4'>
          {/* Quick filter pills */}
          <div className='flex items-center gap-2 flex-wrap'>
            <span className={`text-sm font-semibold mr-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Filter:</span>
            {[
              { label: 'All', value: undefined },
              { label: '✓ Success', value: 'true' },
              { label: '✗ Failed', value: 'false' },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  setLoginFilter(opt.value === undefined ? {} : { successful: opt.value })
                  setLoginPage(0)
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 ${
                  loginFilter.successful === opt.value
                    ? isDark ? 'bg-[#E4FD97] text-[#2D3E2C] border-[#E4FD97] shadow-sm' : 'bg-[#2D3E2C] text-[#E4FD97] border-[#2D3E2C] shadow-sm'
                    : isDark ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-slate-100 hover:border-slate-500' : 'bg-white text-slate-600 border-slate-200 hover:border-[#2D3E2C] hover:text-[#2D3E2C]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <Card className='border-slate-200'>
            <CardHeader className='pb-3 border-b border-slate-100'>
              <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>Login History</CardTitle>
              <CardDescription>
                {loginStats
                  ? `${loginStats.totalLogins} total · ${loginStats.successful} successful · ${loginStats.failed} failed`
                  : 'Loading login data...'}
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-4'>
              {loginLoading ? (
                <TableSkeleton />
              ) : loginRecords.length === 0 ? (
                <EmptyState icon={LogIn} message='No login records found.' />
              ) : (
                <>
                  <GenericDataTable
                    columns={loginColumns}
                    data={loginRecords}
                    keyExtractor={(item: LoginHistoryRecord) => `${item.email}-${item.loginAt}`}
                  />
                  {loginPagination && loginPagination.total > 0 && (
                    <GenericPagination
                      pageIndex={loginPage}
                      pageSize={20}
                      totalCount={loginPagination.total}
                      onPageChange={setLoginPage}
                      onPageSizeChange={() => {}}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════
            TAB: Role Distribution
        ═══════════════════════════════════════════════════════ */}
        <TabsContent value='roles' className='space-y-6'>
          {rolesLoading ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {[0, 1].map((i) => (
                <Card key={i} className='border-slate-200'>
                  <CardContent className='pt-6'>
                    <div className='h-72 bg-slate-50 animate-pulse rounded-lg' />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !rolesReport ? (
            <EmptyState icon={Shield} message='No role data available.' />
          ) : (
            <>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card className='border-slate-200'>
                  <CardHeader className='pb-2'>
                    <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
                      Role Distribution
                    </CardTitle>
                    <CardDescription>Users count per system role</CardDescription>
                  </CardHeader>
                  <CardContent className='h-80'>
                    {roleChartData ? (
                      <DoughnutChart data={roleChartData} options={{ cutout: '60%' }} />
                    ) : (
                      <EmptyState message='No data' />
                    )}
                  </CardContent>
                </Card>

                <Card className='border-slate-200'>
                  <CardHeader className='pb-2'>
                    <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
                      Status Distribution
                    </CardTitle>
                    <CardDescription>Users by account status</CardDescription>
                  </CardHeader>
                  <CardContent className='h-80'>
                    {statusChartData ? (
                      <BarChart data={statusChartData} />
                    ) : (
                      <EmptyState message='No data' />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Role summary table */}
              <Card className='border-slate-200'>
                <CardHeader className='pb-3 border-b border-slate-100'>
                  <CardTitle className={`text-base font-bold ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
                    Roles Summary
                  </CardTitle>
                  <CardDescription>Users per role with active breakdown</CardDescription>
                </CardHeader>
                <CardContent className='pt-4'>
                  {rolesReport.usersByRole.length === 0 ? (
                    <EmptyState icon={Shield} message='No roles found.' />
                  ) : (
                    <div className='overflow-x-auto'>
                      <table className='w-full text-sm'>
                        <thead>
                          <tr className='border-b border-slate-100'>
                            <th className='text-left py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide'>
                              Role
                            </th>
                            <th className='text-center py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide'>
                              Total
                            </th>
                            <th className='text-center py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide'>
                              Active
                            </th>
                            <th className='text-center py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide'>
                              Inactive
                            </th>
                            <th className='py-3 px-4 font-semibold text-slate-500 text-xs uppercase tracking-wide'>
                              Share
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rolesReport.usersByRole.map((r, idx) => {
                            const totalAll = rolesReport.usersByRole.reduce(
                              (acc, rr) => acc + rr.count,
                              0,
                            )
                            const pct = totalAll > 0 ? Math.round((r.count / totalAll) * 100) : 0
                            const color = CHART_COLORS[idx % CHART_COLORS.length]
                            return (
                              <tr
                                key={r.role}
                                className={`border-b transition-colors ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50/70'}`}
                              >
                                <td className='py-3 px-4'>
                                  <div className='flex items-center gap-2.5'>
                                    <span
                                      className='w-2.5 h-2.5 rounded-full shrink-0'
                                      style={{ backgroundColor: color }}
                                    />
                                    <span className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                      {r.role?.replace(/_/g, ' ')}
                                    </span>
                                  </div>
                                </td>
                                <td className='py-3 px-4 text-center'>
                                  <span className={`font-bold text-base ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>
                                    {r.count}
                                  </span>
                                </td>
                                <td className='py-3 px-4 text-center'>
                                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-[#2D3E2C]'}`}>{r.active}</span>
                                </td>
                                <td className='py-3 px-4 text-center'>
                                  <span className='text-slate-400'>{r.count - r.active}</span>
                                </td>
                                <td className='py-3 px-4'>
                                  <div className='flex items-center gap-2.5'>
                                    <div className='flex-1 h-2 bg-slate-100 rounded-full overflow-hidden'>
                                      <div
                                        className='h-full rounded-full transition-all duration-700'
                                        style={{ width: `${pct}%`, backgroundColor: color }}
                                      />
                                    </div>
                                    <span className='text-xs text-slate-400 w-8 text-right font-medium'>
                                      {pct}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Filter Drawer ─────────────────────────────────────── */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        title='Filter Users'
      >
        <div className='space-y-5'>
          <div>
            <Label className='text-sm font-semibold text-slate-700 mb-2 block'>
              Account Status
            </Label>
            <Select
              value={pendingFilters.status || ''}
              onValueChange={(val) =>
                setPendingFilters((f) => ({ ...f, status: val || undefined }))
              }
            >
              <SelectTrigger className='bg-slate-50 border-slate-200 focus:border-[#2D3E2C] focus:ring-[#2D3E2C]/20'>
                <SelectValue placeholder='Any status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=''>Any status</SelectItem>
                <SelectItem value='ACTIVE'>Active</SelectItem>
                <SelectItem value='INACTIVE'>Inactive</SelectItem>
                <SelectItem value='SUSPENDED'>Suspended</SelectItem>
                <SelectItem value='BLOCKED'>Blocked</SelectItem>
                <SelectItem value='DELETED'>Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className='text-sm font-semibold text-slate-700 mb-2 block'>Role</Label>
            <Input
              placeholder='e.g. MASTER_ADMIN'
              value={pendingFilters.role || ''}
              onChange={(e) =>
                setPendingFilters((f) => ({ ...f, role: e.target.value || undefined }))
              }
              className='bg-slate-50 border-slate-200 focus-visible:ring-[#2D3E2C]/20 focus-visible:border-[#2D3E2C]'
            />
          </div>

          <div>
            <Label className='text-sm font-semibold text-slate-700 mb-2 block'>
              Date Range (Created)
            </Label>
            <div className='space-y-2'>
              <div>
                <Label className='text-xs text-slate-400 mb-1 block'>From</Label>
                <Input
                  type='date'
                  value={pendingFilters.startDate || ''}
                  onChange={(e) =>
                    setPendingFilters((f) => ({ ...f, startDate: e.target.value || undefined }))
                  }
                  className='bg-slate-50 border-slate-200 focus-visible:ring-[#2D3E2C]/20 focus-visible:border-[#2D3E2C]'
                />
              </div>
              <div>
                <Label className='text-xs text-slate-400 mb-1 block'>To</Label>
                <Input
                  type='date'
                  value={pendingFilters.endDate || ''}
                  onChange={(e) =>
                    setPendingFilters((f) => ({ ...f, endDate: e.target.value || undefined }))
                  }
                  className='bg-slate-50 border-slate-200 focus-visible:ring-[#2D3E2C]/20 focus-visible:border-[#2D3E2C]'
                />
              </div>
            </div>
          </div>
        </div>
      </FilterDrawer>
    </div>
  )
}
