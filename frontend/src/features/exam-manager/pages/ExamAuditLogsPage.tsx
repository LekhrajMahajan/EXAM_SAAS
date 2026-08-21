import React, { useState, useEffect } from 'react'
import { useTheme } from '@/providers/theme-context'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { MasterAdminStatCard as StatCard } from '@/features/master-admin/components/cards/MasterAdminStatCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import { GenericPagination } from '@/shared/components/pagination/GenericPagination'
import { GenericTimeline } from '@/shared/components/timeline/GenericTimeline'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog'
import { DoughnutChart, LineChart } from '@/shared/components/charts/charts'
import {
  Search,
  Activity,
  Download,
  Filter as FilterIcon,
  Clock,
  Users,
  Database,
  Calendar,
  AlertCircle,
} from 'lucide-react'
import type { TableColumn, TimelineItem, StatusVariant } from '@/shared/types'
import { FilterDrawer, QuickFilters } from '@/shared/components/filters/FilterComponents'
import {
  useActivityLogs,
  useActivityDashboard,
  useRecentActivityLogs,
} from '@/features/master-admin/hooks/activity-log.hooks'
import type { ActivityLog, ActivityPriority } from '@/features/master-admin/types/activity-log.types'
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge'

// Real-time polling interval (10 seconds) to simulate Socket.IO updates
const REFETCH_INTERVAL = 10000

const PRIORITY_VARIANT: Record<
  ActivityPriority,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  LOW: 'secondary',
  MEDIUM: 'default',
  HIGH: 'destructive',
}

export const ExamAuditLogsPage = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('dashboard')

  // Table State
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)

  // Filters State
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeQuickFilter, setActiveQuickFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const [filters, setFilters] = useState<{
    module?: string
    action?: string
    startDate?: string
    endDate?: string
  }>({})

  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPageIndex(0)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Queries
  const queryFilters = {
    page: pageIndex + 1,
    limit: pageSize,
    search: search || undefined,
    ...filters,
    priority: activeQuickFilter !== 'All' ? activeQuickFilter.toUpperCase() : undefined,
  }

  const { data: dashboardData } = useActivityDashboard({}, REFETCH_INTERVAL)
  const { data: logsResponse, isLoading, isError } = useActivityLogs(queryFilters, REFETCH_INTERVAL)
  const { data: recentLogs } = useRecentActivityLogs(15, {}, REFETCH_INTERVAL)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPageIndex(0)
  }

  const applyFilters = () => {
    setIsFilterOpen(false)
    setPageIndex(0)
  }

  const resetFilters = () => {
    setFilters({})
    setSearch('')
    setSearchInput('')
    setActiveQuickFilter('All')
    setPageIndex(0)
    setIsFilterOpen(false)
  }

  const exportToCSV = () => {
    if (!logsResponse?.data) return

    const headers = [
      'Activity ID',
      'Module',
      'Action',
      'Entity Name',
      'Entity ID',
      'Performed By',
      'Role',
      'Timestamp',
      'Priority',
    ]
    const rows = logsResponse.data.map((log) => [
      log._id,
      log.module,
      log.activityType,
      log.entityName || 'N/A',
      log.entityId || 'N/A',
      log.performedBy || 'System',
      log.performedByRole || 'N/A',
      new Date(log.createdAt).toISOString(),
      log.priority,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `activity_logs_${new Date().toISOString()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatModule = (module: string) => {
    if (!module) return 'System'
    if (module.startsWith('/api/v1/')) {
      const parts = module.replace('/api/v1/', '').split(/[/?]/)[0].split('/')
      return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')).join(' - ')
    }
    return module.charAt(0).toUpperCase() + module.slice(1).replace(/-/g, ' ')
  }

  const columns: TableColumn<ActivityLog>[] = [
    {
      id: 'id',
      header: 'Activity ID',
      accessorKey: '_id',
      cell: ({ row }) => (
        <span className='font-mono text-xs text-slate-500'>{row._id.substring(0, 8)}...</span>
      ),
    },
    {
      id: 'module',
      header: 'Module / Entity',
      accessorKey: 'module',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 items-start">
          <Badge variant='outline'>{formatModule(row.module)}</Badge>
          {row.examId && typeof row.examId === 'object' && (
            <ExamStatusBadge exam={row.examId} className="text-[10px] py-0 h-4 uppercase" />
          )}
        </div>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      accessorKey: 'activityType',
      cell: ({ row }) => <span className='font-semibold text-slate-700'>{row.activityType}</span>,
    },

    {
      id: 'performedBy',
      header: 'Performed By',
      accessorKey: 'performedBy',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>{row.performedBy || 'System'}</span>
          <span className='text-xs text-slate-500'>{row.performedByRole || ''}</span>
        </div>
      ),
    },
    {
      id: 'priority',
      header: 'Priority',
      accessorKey: 'priority',
      cell: ({ row }) => {
        const priorityText = row.priority ? row.priority.charAt(0).toUpperCase() + row.priority.slice(1).toLowerCase() : 'Unknown';
        return <Badge variant={PRIORITY_VARIANT[row.priority] ?? 'outline'}>{priorityText}</Badge>;
      },
    },
    {
      id: 'createdAt',
      header: 'Timestamp',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <span className='text-sm text-slate-500 whitespace-nowrap'>
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          }).format(new Date(row.createdAt))}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      accessorKey: '_id',
      cell: ({ row }) => (
        <Button variant='ghost' size='sm' onClick={() => setSelectedActivity(row)}>
          Details
        </Button>
      ),
    },
  ]

  const timelineItems: TimelineItem[] =
    recentLogs?.data?.map((log) => {
      const formattedModule = formatModule(log.module)
      const performedByText =
        log.performedBy && log.performedBy.length > 20
          ? `User ${log.performedBy.substring(0, 6)}...`
          : log.performedBy || 'System'

      return {
        id: log._id,
        title: `${log.activityType} in ${formattedModule}`,
        description:
          log.description ||
          `${performedByText} performed ${log.activityType} on ${formattedModule}${
            log.entityName ? ` (${log.entityName})` : ''
          }`,
        timestamp: new Date(log.createdAt).toLocaleString(),
        status: (log.priority === 'HIGH'
          ? 'error'
          : log.priority === 'MEDIUM'
          ? 'info'
          : 'default') as StatusVariant,
        icon: 'Activity',
        metadata: {
          ...(log.entityName || log.entityId ? { Entity: log.entityName || log.entityId } : {}),
          User: performedByText,
        },
      }
    }) || []

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-[#2D3E2C] dark:text-[#E4FD97]'>Exam Manager Audit Logs</h1>
          <p className='text-muted-foreground mt-2'>
            Comprehensive audit and activity tracking for exams, topics, and related operations.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            className='gap-2 qa-button'
            onClick={exportToCSV}
            disabled={!logsResponse?.data?.length}
          >
            <Download className='w-4 h-4' />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='dashboard'>Dashboard</TabsTrigger>
          <TabsTrigger value='logs'>Activity Logs</TabsTrigger>
          <TabsTrigger value='timeline'>Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value='dashboard' className='space-y-6'>
          {/* Summary Dashboard */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <StatCard
              title='Total Activities'
              value={dashboardData?.data?.total || 0}
              icon={Activity}
              accent='green'
            />
            <StatCard
              title='Creates / Updates'
              value={`${dashboardData?.data?.createActivities || 0} / ${dashboardData?.data?.updateActivities || 0}`}
              icon={Database}
              accent='slate'
            />
            <StatCard
              title='Activities Today'
              value={dashboardData?.data?.total || 0}
              icon={Clock}
              accent='lime'
            />
            <StatCard
              title='High Priority'
              value={dashboardData?.data?.highPriorityActivities || 0}
              icon={AlertCircle}
              accent='red'
            />
          </div>

          {/* Analytics Charts */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle>Activities by Module</CardTitle>
                <CardDescription>Top active modules in the system</CardDescription>
              </CardHeader>
              <CardContent className='h-72'>
                <DoughnutChart
                  data={{
                    labels: ['Authentication', 'Companies', 'Candidates', 'Exams', 'Settings'],
                    datasets: [
                      {
                        data: [35, 20, 15, 20, 10],
                        backgroundColor: ['#2D3E2C', '#E4FD97', '#4A6048', '#C3EB5F', '#81A07F'],
                      },
                    ],
                  }}
                  options={{ cutout: '70%' }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Volume (Last 7 Days)</CardTitle>
                <CardDescription>Number of activities tracked per day</CardDescription>
              </CardHeader>
              <CardContent className='h-72'>
                <LineChart
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                      {
                        label: 'Activities',
                        data: [150, 230, 180, 290, 310, 140, 90],
                        borderColor: isDark ? '#E4FD97' : '#2D3E2C',
                        backgroundColor: isDark ? 'rgba(228, 253, 151, 0.1)' : 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true,
                      },
                    ],
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='logs'>
          <Card>
            <CardHeader className='pb-4'>
              <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4'>
                <div>
                  <CardTitle>Activity Log Explorer</CardTitle>
                  <CardDescription>
                    View, filter and search through all system activities.
                  </CardDescription>
                </div>

                <div className='flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto'>
                  <form onSubmit={handleSearch} className='relative w-full sm:w-72'>
                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-slate-500' />
                    <Input
                      type='text'
                      placeholder='Search Activity ID, User, Module...'
                      className={`pl-9 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-slate-50'}`}
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </form>
                  <Button
                    variant='outline'
                    className='w-full sm:w-auto gap-2'
                    onClick={() => setIsFilterOpen(true)}
                  >
                    <FilterIcon className='w-4 h-4' /> Filters
                  </Button>
                </div>
              </div>
              <div className='mt-4'>
                <QuickFilters
                  filters={['All', 'High', 'Medium', 'Low']}
                  activeFilter={activeQuickFilter}
                  onSelect={(filter) => {
                    setActiveQuickFilter(filter)
                    setPageIndex(0)
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isError ? (
                <div className='p-8 text-center text-red-500 bg-red-50 rounded-lg'>
                  Failed to load activity logs. Please try again.
                </div>
              ) : isLoading && !logsResponse ? (
                <div className='space-y-3'>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className='h-12 bg-slate-100 animate-pulse rounded' />
                  ))}
                </div>
              ) : (
                <>
                  {!logsResponse?.data || logsResponse.data.length === 0 ? (
                    <div className={`p-12 text-center flex flex-col items-center justify-center rounded-lg border border-dashed ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <Activity className={`h-10 w-10 mb-4 ${isDark ? 'text-slate-500' : 'text-slate-300'}`} />
                      <h3 className={`text-lg font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>No Activity Logs Found</h3>
                      <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Adjust your filters or search terms.</p>
                      <Button variant='outline' className='mt-4' onClick={resetFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <GenericDataTable
                        columns={columns}
                        data={logsResponse.data}
                        keyExtractor={(item) => item._id}
                      />
                      {logsResponse.pagination && logsResponse.pagination.total > 0 && (
                        <div className='mt-4 border-t pt-4'>
                          <GenericPagination
                            pageIndex={pageIndex}
                            pageSize={pageSize}
                            totalCount={logsResponse.pagination.total}
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='timeline'>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Timeline</CardTitle>
              <CardDescription>Chronological view of the latest system events.</CardDescription>
            </CardHeader>
            <CardContent>
              {recentLogs?.data && recentLogs.data.length > 0 ? (
                <GenericTimeline items={timelineItems} />
              ) : (
                <p className='text-center text-slate-500 p-8'>No recent activities available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={!!selectedActivity} onOpenChange={(open) => !open && setSelectedActivity(null)}>
        <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Activity className='w-5 h-5 text-[#2D3E2C]' />
              Activity Details
            </DialogTitle>
            <DialogDescription>Detailed view of the selected system event.</DialogDescription>
          </DialogHeader>

          {selectedActivity && (
            <div className='space-y-6 mt-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-slate-50 p-4 rounded-lg activity-detail-box'>
                  <Label className='text-xs text-slate-500 uppercase activity-detail-label'>Activity ID</Label>
                  <p className='font-mono text-sm font-semibold activity-detail-value'>{selectedActivity._id}</p>
                </div>
                <div className='bg-slate-50 p-4 rounded-lg activity-detail-box'>
                  <Label className='text-xs text-slate-500 uppercase activity-detail-label'>Timestamp</Label>
                  <p className='text-sm font-semibold activity-detail-value'>
                    {new Date(selectedActivity.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className='bg-slate-50 p-4 rounded-lg activity-detail-box'>
                  <Label className='text-xs text-slate-500 uppercase activity-detail-label'>Module & Action</Label>
                  <p className='text-sm font-semibold activity-detail-value'>
                    {selectedActivity.module} - {selectedActivity.activityType}
                  </p>
                </div>
                <div className='bg-slate-50 p-4 rounded-lg activity-detail-box'>
                  <Label className='text-xs text-slate-500 uppercase activity-detail-label'>Priority & Visibility</Label>
                  <div className='text-sm font-semibold mt-1 activity-detail-value'>
                    <Badge
                      variant={PRIORITY_VARIANT[selectedActivity.priority] ?? 'outline'}
                      className='mr-2'
                    >
                      {selectedActivity.priority ? selectedActivity.priority.charAt(0).toUpperCase() + selectedActivity.priority.slice(1).toLowerCase() : ''}
                    </Badge>
                    <Badge variant='outline'>{selectedActivity.visibility ? selectedActivity.visibility.charAt(0).toUpperCase() + selectedActivity.visibility.slice(1).toLowerCase() : ''}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className='text-sm font-semibold text-slate-800 activity-detail-desc-label'>Description</Label>
                <p className='text-slate-600 mt-1 activity-detail-desc-text'>{selectedActivity.description}</p>
              </div>

              <div className='grid grid-cols-2 gap-4 border-t pt-4 activity-detail-border'>
                {(selectedActivity.entityName || selectedActivity.entityId) && (
                  <div>
                    <Label className='text-sm font-semibold text-slate-800 mb-2 block activity-detail-desc-label'>
                      Entity Details
                    </Label>
                    <div className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-500 activity-detail-label'>Name:</span>
                        <span className='font-medium activity-detail-value'>{selectedActivity.entityName || 'N/A'}</span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-slate-500 activity-detail-label'>ID:</span>
                        <span className='font-medium font-mono activity-detail-value'>
                          {selectedActivity.entityId || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <Label className='text-sm font-semibold text-slate-800 mb-2 block activity-detail-desc-label'>
                    Performed By
                  </Label>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-slate-500 activity-detail-label'>User ID:</span>
                      <span className='font-medium font-mono activity-detail-value'>
                        {selectedActivity.performedBy || 'System'}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-slate-500 activity-detail-label'>Role:</span>
                      <span className='font-medium activity-detail-value'>
                        {selectedActivity.performedByRole || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>


              {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                <div className='border-t pt-4 activity-detail-border'>
                  <Label className='text-sm font-semibold text-slate-800 mb-2 block activity-detail-desc-label'>
                    Metadata
                  </Label>
                  <div className='bg-slate-900 rounded-lg p-4 overflow-x-auto'>
                    <pre className='text-xs text-green-400 font-mono'>
                      {JSON.stringify(selectedActivity.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={applyFilters}
        onReset={resetFilters}
      >
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Module</Label>
            <Input
              placeholder='e.g. Authentication'
              value={filters.module || ''}
              onChange={(e) => setFilters({ ...filters, module: e.target.value })}
            />
          </div>
          <div className='space-y-2'>
            <Label>Action Type</Label>
            <Input
              placeholder='e.g. UPDATE'
              value={filters.action || ''}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            />
          </div>
          <div className='space-y-2'>
            <Label>Start Date</Label>
            <Input
              type='date'
              className='dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:dark:opacity-70'
              value={filters.startDate || ''}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>
          <div className='space-y-2'>
            <Label>End Date</Label>
            <Input
              type='date'
              className='dark:[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:dark:opacity-70'
              value={filters.endDate || ''}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </div>
      </FilterDrawer>
    </div>
  )
}
