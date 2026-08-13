import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useTheme } from '@/providers/theme-context'
import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import type { TableColumn } from '@/shared/types'
import {
  useGetLoginSessions,
  useGetSessionStatistics,
  useTerminateSession,
  useForceLogoutAll,
} from '../hooks/security.hooks'
import {
  Activity,
  Computer,
  Globe,
  ShieldAlert,
  Monitor,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
} from 'lucide-react'
import { GenericEmptyState as EmptyState } from '@/shared/components/empty-state/EmptyStateComponents'
import { GenericDialog as ConfirmDialog } from '@/shared/components/dialogs/DialogComponents'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
export const LoginSessionsPage = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [terminateSessionId, setTerminateSessionId] = useState<string | null>(null)
  const [forceLogoutUserId, setForceLogoutUserId] = useState<string | null>(null)

  const { data: statsResponse, isLoading: statsLoading } = useGetSessionStatistics()
  const { data: sessionsResponse, isLoading: sessionsLoading } = useGetLoginSessions({
    page,
    limit,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter,
  })

  const terminateMutation = useTerminateSession()
  const forceLogoutMutation = useForceLogoutAll()

  const stats = statsResponse?.data || { total: 0, active: 0, expired: 0, concurrentUsers: 0 }
  const sessions = sessionsResponse?.data?.sessions || []
  const total = sessionsResponse?.data?.pagination?.total || 0

  const handleTerminate = (sessionId: string) => {
    terminateMutation.mutate(sessionId, {
      onSuccess: () => setTerminateSessionId(null),
    })
  }

  const handleForceLogout = (userId: string) => {
    forceLogoutMutation.mutate(userId, {
      onSuccess: () => setForceLogoutUserId(null),
    })
  }

  const columns: TableColumn<any>[] = [
    {
      id: 'user',
      header: 'User',
      cell: ({ row }: any) => (
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold'>
            {row.user?.firstName?.[0]}
            {row.user?.lastName?.[0]}
          </div>
          <div>
            <div className='font-medium text-slate-900'>
              {row.user?.firstName} {row.user?.lastName}
            </div>
            <div className='text-xs text-slate-500'>{row.user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }: any) => (
        <span className='px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full font-medium'>
          {row.role}
        </span>
      ),
    },
    {
      id: 'device',
      header: 'Device & IP',
      cell: ({ row }: any) => (
        <div>
          <div className='text-sm font-medium text-slate-700 flex items-center gap-1'>
            <Computer className='w-3 h-3' /> {row.browser || 'Unknown'} on{' '}
            {row.operatingSystem || 'Unknown'}
          </div>
          <div className='text-xs text-slate-500 flex items-center gap-1'>
            <Globe className='w-3 h-3' /> {row.ipAddress || 'Unknown IP'}
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const isActive = new Date(row.expiresAt) > new Date()
        return isActive ? (
          <span className='flex items-center gap-1 text-emerald-600 text-sm font-medium'>
            <CheckCircle2 className='w-4 h-4' /> Active
          </span>
        ) : (
          <span className='flex items-center gap-1 text-slate-500 text-sm font-medium'>
            <XCircle className='w-4 h-4' /> Expired
          </span>
        )
      },
    },
    {
      id: 'loginAt',
      header: 'Login Time',
      cell: ({ row }: any) => (
        <div className='text-sm text-slate-600'>
          {row.loginAt
            ? new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).format(new Date(row.loginAt))
            : 'N/A'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        const isActive = new Date(row.expiresAt) > new Date()
        return (
          <div className='flex items-center gap-2'>
            {isActive && (
              <button
                onClick={() => setTerminateSessionId(row._id)}
                className='text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2 py-1 rounded transition-colors'
              >
                Terminate
              </button>
            )}
            <button
              onClick={() => setForceLogoutUserId(row.userId)}
              className='text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors'
            >
              Force Logout All
            </button>
          </div>
        )
      },
    },
  ]

  return (
    <div className='space-y-6 p-6 md:p-8'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-foreground' : 'text-slate-900'}`}>Login Sessions Management</h1>
          <p className={isDark ? 'text-slate-400 mt-1' : 'text-slate-500 mt-1'}>Monitor and manage user login sessions dynamically</p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <StatCard
          title='Total Sessions'
          value={statsLoading ? '-' : stats.total}
          icon={Activity}
          accent='slate'
        />
        <StatCard
          title='Active Sessions'
          value={statsLoading ? '-' : stats.active}
          icon={Monitor}
          accent='green'
        />
        <StatCard
          title='Concurrent Users'
          value={statsLoading ? '-' : stats.concurrentUsers}
          icon={ShieldAlert}
          accent='amber'
        />
        <StatCard
          title='Expired Sessions'
          value={statsLoading ? '-' : stats.expired}
          icon={XCircle}
          accent='red'
        />
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle>Session History</CardTitle>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type='text'
                placeholder='Search user...'
                className={`pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`w-[140px] ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200'}`}>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {sessionsLoading ? (
            <div className='py-12 flex justify-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900'></div>
            </div>
          ) : sessions.length === 0 ? (
            <EmptyState
              icon='search'
              title='No sessions found'
              description='No active or historical login sessions match your search criteria.'
            />
          ) : (
            <GenericDataTable
              columns={columns}
              data={sessions}
              keyExtractor={(item: any) => item._id}
            />
          )}

          {total > 0 && (
            <div className='mt-4 flex items-center justify-between text-sm text-slate-500'>
              <div>
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}{' '}
                results
              </div>
              <div className='flex gap-2'>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className='px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50'
                >
                  Previous
                </button>
                <button
                  disabled={page * limit >= total}
                  onClick={() => setPage((p) => p + 1)}
                  className='px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50'
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={!!terminateSessionId}
        onCancel={() => setTerminateSessionId(null)}
        onConfirm={() => terminateSessionId && handleTerminate(terminateSessionId)}
        title='Terminate Session'
        message='Are you sure you want to terminate this session? The user will be immediately logged out of this device.'
        confirmLabel='Terminate Session'
        type='delete'
        isProcessing={terminateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!forceLogoutUserId}
        onCancel={() => setForceLogoutUserId(null)}
        onConfirm={() => forceLogoutUserId && handleForceLogout(forceLogoutUserId)}
        title='Force Logout All'
        message='Are you sure you want to log this user out from all active sessions? They will need to re-authenticate everywhere.'
        confirmLabel='Force Logout'
        type='delete'
        isProcessing={forceLogoutMutation.isPending}
      />
    </div>
  )
}
