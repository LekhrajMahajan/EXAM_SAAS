import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import { GenericPagination } from '@/shared/components/pagination/GenericPagination'
import type { TableColumn } from '@/shared/types'
import { useSubscriptions, useSubscriptionStatusChange, useSubscriptionStats } from '../hooks/subscription.hooks'
import type { ISubscription } from '../types/subscription.types'
import { SubscriptionStatus } from '../types/subscription.types'
import { useConfirm } from '@/providers/ConfirmProvider'
import { Button } from '@/shared/components/ui/button'
import { Plus, Power, PowerOff, ShieldX, Eye } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { AssignSubscriptionDialog } from '../components/subscription/AssignSubscriptionDialog'
import { RenewSubscriptionDialog } from '../components/subscription/RenewSubscriptionDialog'
import { RefreshCw, Users, IndianRupee, Activity, AlertCircle } from 'lucide-react'

export const SubscriptionsPage = () => {
  const confirm = useConfirm()
  const navigate = useNavigate()

  // Table State
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isAssignOpen, setIsAssignOpen] = useState(false)

  const { data: subscriptionsResponse, isLoading } = useSubscriptions({
    page: pageIndex + 1,
    limit: pageSize,
  })

  const { data: stats } = useSubscriptionStats()

  const { mutateAsync: suspendSub } = useSubscriptionStatusChange('suspend')
  const { mutateAsync: resumeSub } = useSubscriptionStatusChange('resume')
  const { mutateAsync: cancelSub } = useSubscriptionStatusChange('cancel')

  const [renewSub, setRenewSub] = useState<ISubscription | null>(null)

  const handleToggleStatus = async (sub: ISubscription) => {
    const isSuspended = sub.status === SubscriptionStatus.SUSPENDED
    if (
      await confirm(
        `Are you sure you want to ${isSuspended ? 'resume' : 'suspend'} this subscription?`,
      )
    ) {
      if (isSuspended) {
        await resumeSub({ id: sub._id, payload: { notes: 'Resumed by admin' } })
      } else {
        await suspendSub({ id: sub._id, payload: { notes: 'Suspended by admin' } })
      }
    }
  }

  const handleCancel = async (sub: ISubscription) => {
    if (
      await confirm(
        `Are you sure you want to completely cancel this subscription? This action cannot be undone.`,
      )
    ) {
      await cancelSub({ id: sub._id, payload: { notes: 'Cancelled by admin' } })
    }
  }

  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case SubscriptionStatus.ACTIVE:
        return <Badge variant='outline' className='bg-[#E4FD97] text-[#2D3E2C] border-0 hover:bg-[#E4FD97]/90'>Active</Badge>
      case SubscriptionStatus.EXPIRED:
        return <Badge variant='outline' className='bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'>Expired</Badge>
      case SubscriptionStatus.SUSPENDED:
        return <Badge variant='outline' className='bg-red-50 text-red-700 border-red-200 hover:bg-red-100'>Suspended</Badge>
      case SubscriptionStatus.CANCELLED:
        return <Badge variant='secondary'>Cancelled</Badge>
      case SubscriptionStatus.PENDING:
        return <Badge variant='outline'>Pending</Badge>
      default:
        return <Badge variant='outline'>{status}</Badge>
    }
  }

  const columns: TableColumn<ISubscription>[] = [
    {
      id: 'company',
      header: 'Company',
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>{row.companyId?.companyName || 'N/A'}</div>
          <div className='text-xs text-slate-500'>{row.companyId?.companyCode}</div>
        </div>
      ),
    },
    {
      id: 'plan',
      header: 'Plan',
      cell: ({ row }) => (
        <div>
          <div className='font-medium'>{row.planId?.planName || 'N/A'}</div>
          <div className='text-xs text-slate-500'>
            {row.planId?.planCode} • {row.billingCycle}
          </div>
        </div>
      ),
    },
    {
      id: 'startDate',
      header: 'Start Date',
      cell: ({ row }) => (row.startDate ? new Date(row.startDate).toLocaleDateString() : '-'),
    },
    {
      id: 'endDate',
      header: 'End Date',
      cell: ({ row }) => (row.endDate ? new Date(row.endDate).toLocaleDateString() : '-'),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.status),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            title='View Details'
            onClick={() => navigate(`/master-admin/subscriptions/${row._id}`)}
            className='hover:bg-[#2D3E2C]/10 icon-bright-btn'
          >
            <Eye className='w-4 h-4 text-[#2D3E2C] icon-bright' />
          </Button>
          {(() => {
            const daysUntilExpiry = row.endDate ? (new Date(row.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24) : Infinity;
            const isRenewable = daysUntilExpiry <= 3 || row.status === SubscriptionStatus.EXPIRED || row.status === SubscriptionStatus.CANCELLED;
            return isRenewable ? (
              <Button
                variant='ghost'
                size='sm'
                title='Renew Subscription'
                onClick={() => setRenewSub(row)}
                className='hover:bg-[#4A5D4E]/10 icon-bright-btn'
              >
                <RefreshCw className='w-4 h-4 text-[#4A5D4E] icon-bright' />
              </Button>
            ) : null;
          })()}
          {row.status !== SubscriptionStatus.CANCELLED &&
            row.status !== SubscriptionStatus.EXPIRED && (
              <Button
                variant='ghost'
                size='sm'
                title={row.status === SubscriptionStatus.SUSPENDED ? 'Resume' : 'Suspend'}
                onClick={() => handleToggleStatus(row)}
                className={(row.status === SubscriptionStatus.SUSPENDED ? 'hover:bg-[#BEEF68]/10' : 'hover:bg-[#7B9B7B]/10') + ' icon-bright-btn'}
              >
                {row.status === SubscriptionStatus.SUSPENDED ? (
                  <Power className='w-4 h-4 text-[#BEEF68] icon-bright' />
                ) : (
                  <PowerOff className='w-4 h-4 text-[#7B9B7B] icon-bright' />
                )}
              </Button>
            )}
          {row.status !== SubscriptionStatus.CANCELLED && (
            <Button
              variant='ghost'
              size='sm'
              title='Cancel Subscription'
              onClick={() => handleCancel(row)}
              className='hover:bg-[#7B9B7B]/10 icon-bright-btn'
            >
              <ShieldX className='w-4 h-4 text-[#7B9B7B] icon-bright' />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const subscriptions = subscriptionsResponse?.data || []
  const total = subscriptionsResponse?.pagination?.total || 0

  return (
    <div className='max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Subscriptions Management</h1>
          <p className='text-muted-foreground mt-2'>
            Assign plans to companies, monitor active subscriptions, and manage billing cycles.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant="outline" onClick={() => setIsAssignOpen(true)} className='border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button'>
            <Plus className='w-4 h-4 mr-2' />
            Assign Subscription
          </Button>
        </div>
      </div>

      {stats && (
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <StatCard
            title="Total Subscriptions"
            value={stats.total || 0}
            icon={Users}
            accent="slate"
          />
          <StatCard
            title="Active Subscriptions"
            value={stats.active || 0}
            icon={Activity}
            accent="green"
          />
          <StatCard
            title="Monthly Recurring Revenue (MRR)"
            value={`₹${stats.mrr?.toLocaleString() || 0}`}
            icon={IndianRupee}
            accent="lime"
          />
          <StatCard
            title="Expired Subscriptions"
            value={stats.expired || 0}
            icon={AlertCircle}
            accent="amber"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Company Subscriptions</CardTitle>
          <CardDescription>A list of all assigned subscriptions in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='p-8 text-center text-slate-500'>Loading subscriptions...</div>
          ) : (
            <>
              <GenericDataTable
                columns={columns}
                data={subscriptions}
                keyExtractor={(item) => item._id}
              />
              {subscriptionsResponse?.pagination && (
                <div className='mt-4'>
                  <GenericPagination
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    totalCount={total}
                    onPageChange={setPageIndex}
                    onPageSizeChange={(size) => {
                      setPageSize(size)
                      setPageIndex(0)
                    }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AssignSubscriptionDialog open={isAssignOpen} onOpenChange={setIsAssignOpen} />
      <RenewSubscriptionDialog
        open={!!renewSub}
        onOpenChange={(o) => !o && setRenewSub(null)}
        subscription={renewSub}
      />
    </div>
  )
}
