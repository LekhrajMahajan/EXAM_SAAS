import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useTheme } from '@/providers/theme-context'
import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import {
  useGetDevices,
  useGetDeviceStatistics,
  useTrustDevice,
  useUntrustDevice,
  useBlockDevice,
  useUnblockDevice,
  useRemoveDevice,
} from '../hooks/security.hooks'
import {
  Computer,
  Globe,
  ShieldAlert,
  Monitor,
  CheckCircle2,
  XCircle,
  Search,
  Trash2,
  Shield,
  ShieldOff,
  AlertTriangle,
} from 'lucide-react'
import { GenericEmptyState as EmptyState } from '@/shared/components/empty-state/EmptyStateComponents'
import { GenericDialog as ConfirmDialog } from '@/shared/components/dialogs/DialogComponents'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

export const TrustedDevicesPage = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')

  const [confirmAction, setConfirmAction] = useState<{ type: string; id: string } | null>(null)

  const { data: statsResponse, isLoading: statsLoading } = useGetDeviceStatistics()
  const { data: devicesResponse, isLoading: devicesLoading } = useGetDevices({
    page,
    limit,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter,
    riskLevel: riskFilter === 'all' ? undefined : riskFilter,
  })

  const trustMutation = useTrustDevice()
  const untrustMutation = useUntrustDevice()
  const blockMutation = useBlockDevice()
  const unblockMutation = useUnblockDevice()
  const removeMutation = useRemoveDevice()

  const stats = statsResponse?.data || { total: 0, trusted: 0, blocked: 0, highRisk: 0 }
  const devices = devicesResponse?.data?.devices || []
  const total = devicesResponse?.data?.pagination?.total || 0

  const handleConfirm = () => {
    if (!confirmAction) return

    switch (confirmAction.type) {
      case 'TRUST':
        trustMutation.mutate(confirmAction.id, { onSuccess: () => setConfirmAction(null) })
        break
      case 'UNTRUST':
        untrustMutation.mutate(confirmAction.id, { onSuccess: () => setConfirmAction(null) })
        break
      case 'BLOCK':
        blockMutation.mutate(confirmAction.id, { onSuccess: () => setConfirmAction(null) })
        break
      case 'UNBLOCK':
        unblockMutation.mutate(confirmAction.id, { onSuccess: () => setConfirmAction(null) })
        break
      case 'REMOVE':
        removeMutation.mutate(confirmAction.id, { onSuccess: () => setConfirmAction(null) })
        break
    }
  }

  const getConfirmDialogConfig = () => {
    if (!confirmAction) return { title: '', message: '', type: 'info' as any, isProcessing: false }

    switch (confirmAction.type) {
      case 'TRUST':
        return {
          title: 'Trust Device',
          message:
            'Are you sure you want to mark this device as trusted? Security checks for this device will be reduced.',
          type: 'success' as any,
          isProcessing: trustMutation.isPending,
        }
      case 'UNTRUST':
        return {
          title: 'Untrust Device',
          message:
            'Are you sure you want to untrust this device? Additional security verifications may be required.',
          type: 'warning' as any,
          isProcessing: untrustMutation.isPending,
        }
      case 'BLOCK':
        return {
          title: 'Block Device',
          message:
            'Are you sure you want to block this device? Any active sessions will be terminated and further access will be denied.',
          type: 'delete' as any,
          isProcessing: blockMutation.isPending,
        }
      case 'UNBLOCK':
        return {
          title: 'Unblock Device',
          message:
            'Are you sure you want to unblock this device? The user will be able to login from this device again.',
          type: 'success' as any,
          isProcessing: unblockMutation.isPending,
        }
      case 'REMOVE':
        return {
          title: 'Remove Device',
          message:
            'Are you sure you want to remove this device record? This will also log out any associated sessions.',
          type: 'delete' as any,
          isProcessing: removeMutation.isPending,
        }
      default:
        return { title: '', message: '', type: 'info' as any, isProcessing: false }
    }
  }

  const dialogConfig = getConfirmDialogConfig()

  const columns = [
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
      id: 'device',
      header: 'Device & IP',
      cell: ({ row }: any) => (
        <div>
          <div className='text-sm font-medium text-slate-700 flex items-center gap-1'>
            <Computer className='w-3 h-3' /> {row.deviceName || 'Unknown Device'}
          </div>
          <div className='text-xs text-slate-500 flex items-center gap-1 mt-1'>
            <Globe className='w-3 h-3' /> {row.ipAddress || 'Unknown IP'}{' '}
            {row.location ? `(${row.location})` : ''}
          </div>
          <div className='text-xs text-slate-400 mt-0.5'>
            {row.browser} {row.browserVersion} / {row.operatingSystem}
          </div>
        </div>
      ),
    },
    {
      id: 'trustStatus',
      header: 'Trust Status',
      cell: ({ row }: any) => {
        if (row.isBlocked) {
          return (
            <span className='flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-full w-fit text-xs font-medium border border-red-200'>
              <ShieldAlert className='w-3 h-3' /> Blocked
            </span>
          )
        }
        if (row.trusted) {
          return (
            <span className='flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit text-xs font-medium border border-emerald-200'>
              <Shield className='w-3 h-3' /> Trusted
            </span>
          )
        }
        return (
          <span className='flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-full w-fit text-xs font-medium border border-slate-200'>
            <ShieldOff className='w-3 h-3' /> Untrusted
          </span>
        )
      },
    },
    {
      id: 'riskScore',
      header: 'Risk Score',
      cell: ({ row }: any) => {
        const score = row.riskScore || 0
        let colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-200'
        let text = 'Low Risk'
        if (score >= 70) {
          colorClass = 'text-red-600 bg-red-50 border-red-200'
          text = 'High Risk'
        } else if (score >= 30) {
          colorClass = 'text-amber-600 bg-amber-50 border-amber-200'
          text = 'Medium Risk'
        }

        return (
          <div className='flex flex-col gap-1'>
            <span
              className={`px-2 py-1 rounded-full w-fit text-xs font-medium border ${colorClass}`}
            >
              {text} ({score})
            </span>
          </div>
        )
      },
    },
    {
      id: 'lastLoginAt',
      header: 'Last Login',
      cell: ({ row }: any) => (
        <div className='text-sm text-slate-600'>
          {row.lastLoginAt
            ? new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).format(new Date(row.lastLoginAt))
            : 'N/A'}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => {
        return (
          <div className='flex flex-wrap items-center gap-2 max-w-[200px]'>
            {!row.isBlocked && !row.trusted && (
              <button
                onClick={() => setConfirmAction({ type: 'TRUST', id: row._id })}
                className='text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors'
              >
                Trust
              </button>
            )}
            {!row.isBlocked && row.trusted && (
              <button
                onClick={() => setConfirmAction({ type: 'UNTRUST', id: row._id })}
                className='text-xs font-medium text-slate-700 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors'
              >
                Untrust
              </button>
            )}
            {!row.isBlocked && (
              <button
                onClick={() => setConfirmAction({ type: 'BLOCK', id: row._id })}
                className='text-xs font-medium text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition-colors'
              >
                Block
              </button>
            )}
            {row.isBlocked && (
              <button
                onClick={() => setConfirmAction({ type: 'UNBLOCK', id: row._id })}
                className='text-xs font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition-colors'
              >
                Unblock
              </button>
            )}
            <button
              onClick={() => setConfirmAction({ type: 'REMOVE', id: row._id })}
              className='p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors'
              title='Remove Device'
            >
              <Trash2 className='w-4 h-4' />
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
          <h1 className={`text-2xl font-bold ${isDark ? 'text-foreground' : 'text-slate-900'}`}>Device Trust Management</h1>
          <p className={isDark ? 'text-slate-400 mt-1' : 'text-slate-500 mt-1'}>
            Monitor, verify, and manage trusted devices across your organization
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <StatCard
          title='Total Devices'
          value={statsLoading ? '-' : stats.total}
          icon={Monitor}
          accent='slate'
        />
        <StatCard
          title='Trusted Devices'
          value={statsLoading ? '-' : stats.trusted}
          icon={Shield}
          accent='green'
        />
        <StatCard
          title='High Risk Devices'
          value={statsLoading ? '-' : stats.highRisk}
          icon={AlertTriangle}
          accent='amber'
        />
        <StatCard
          title='Blocked Devices'
          value={statsLoading ? '-' : stats.blocked}
          icon={ShieldAlert}
          accent='red'
        />
      </div>

      <Card>
        <CardHeader className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
          <CardTitle>Device Inventory</CardTitle>
          <div className='flex flex-wrap items-center gap-3'>
            <div className='relative'>
              <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
              <input
                type='text'
                placeholder='Search user, device, IP...'
                className={`pl-9 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'}`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className={`w-[140px] ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200'}`}>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="TRUSTED">Trusted</SelectItem>
                <SelectItem value="UNTRUSTED">Untrusted</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className={`w-[140px] ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200'}`}>
                <SelectValue placeholder="All Risks" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risks</SelectItem>
                <SelectItem value="LOW">Low Risk</SelectItem>
                <SelectItem value="MEDIUM">Medium Risk</SelectItem>
                <SelectItem value="HIGH">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {devicesLoading ? (
            <div className='py-12 flex justify-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
            </div>
          ) : devices.length === 0 ? (
            <EmptyState
              icon='search'
              title='No devices found'
              description='No devices match your search criteria.'
            />
          ) : (
            <GenericDataTable
              columns={columns}
              data={devices}
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
        isOpen={!!confirmAction}
        onCancel={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmLabel={dialogConfig.title}
        type={dialogConfig.type}
        isProcessing={dialogConfig.isProcessing}
      />
    </div>
  )
}
