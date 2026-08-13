import React, { useState } from 'react'
import {
  Users,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  UserCheck,
  UserMinus,
  Filter,
  Search,
  RefreshCw,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from '@/shared/components/ui/dropdown-menu'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import { GenericPagination } from '@/shared/components/pagination/GenericPagination'
import { LineChart, DoughnutChart } from '@/shared/components/charts/charts'
import {
  useCandidateSummary,
  useCandidateList,
  useExportCandidateData,
  useGenerateCandidateReport,
} from '../hooks/candidate-report.hooks'
import { useRecentReports } from '../hooks/report.hooks'
import { useTheme } from '@/providers/theme-context'

interface CandidateReportRow {
  candidateCode: string
  fullName: string
  email: string
  mobile: string
  exam: string
  company: string
  center: string
  biometricVerified: boolean
  status: string
  createdAt: string | Date
  _id?: string
  id?: string
}

import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard'

export const CandidateReportsPage = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [limit, setLimit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data: summary, refetch: refetchSummary } = useCandidateSummary()
  const { data: listData, isLoading: isListLoading } = useCandidateList({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  })
  const { mutate: exportData, isPending: isExporting } = useExportCandidateData()
  const { mutate: generateReport, isPending: isGenerating } = useGenerateCandidateReport()

  const { data: recentReportsResponse, isLoading: recentLoading } = useRecentReports({
    limit: 5,
  })
  const candidateReports = (recentReportsResponse?.data || []).filter(
    (r: any) => r.reportType === 'CANDIDATE',
  )

  const handleExport = () => {
    exportData({ search: debouncedSearch })
  }

  const columns = [
    { id: 'candidateCode', header: 'Candidate ID', accessorKey: 'candidateCode' as const },
    { id: 'fullName', header: 'Full Name', accessorKey: 'fullName' as const },
    { id: 'email', header: 'Email', accessorKey: 'email' as const },
    { id: 'mobile', header: 'Mobile', accessorKey: 'mobile' as const },
    { id: 'exam', header: 'Exam', accessorKey: 'exam' as const },
    { id: 'company', header: 'Company', accessorKey: 'company' as const },
    { id: 'center', header: 'Center', accessorKey: 'center' as const },
    {
      id: 'biometricVerified',
      header: 'Biometric',
      accessorKey: 'biometricVerified' as const,
      cell: ({ row }: { row: CandidateReportRow }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${
            row.biometricVerified 
              ? 'bg-secondary text-secondary-foreground border-secondary' 
              : 'bg-destructive/10 text-destructive border-destructive/20'
          }`}
        >
          {row.biometricVerified ? 'Verified' : 'Pending'}
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status' as const,
      cell: ({ row }: { row: CandidateReportRow }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium border ${
            row.status === 'ACTIVE' 
              ? 'bg-secondary text-secondary-foreground border-secondary' 
              : 'bg-muted text-muted-foreground border-border'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      id: 'createdAt',
      header: 'Registered On',
      accessorKey: 'createdAt' as const,
      cell: ({ row }: { row: CandidateReportRow }) => {
        const date = new Date(row.createdAt)
        return new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(date)
      },
    },
  ]

  return (
    <div className='space-y-6 p-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>Candidate Reports</h1>
          <p className='text-slate-500 mt-2'>
            Comprehensive reporting and analytics for candidate registrations and attendance.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            onClick={() => refetchSummary()}
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
          >
            <RefreshCw className='w-4 h-4' />
            Refresh
          </Button>
          <Button
            variant='outline'
            onClick={handleExport}
            disabled={isExporting}
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
          >
            {isExporting ? <Loader2 className='w-4 h-4 animate-spin' /> : <FileText className='w-4 h-4' />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button
            variant='outline'
            onClick={() => generateReport({ search: debouncedSearch })}
            disabled={isGenerating}
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
          >
            {isGenerating ? <Loader2 className='w-4 h-4 animate-spin' /> : <TrendingUp className='w-4 h-4' />}
            {isGenerating ? 'Generating...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='Total Candidates'
          value={summary?.totalCandidates || 0}
          icon={Users}
          accent='slate'
        />
        <StatCard
          title='Active & Approved'
          value={summary?.activeCandidates || 0}
          icon={CheckCircle}
          accent='lime'
        />
        <StatCard
          title='Pending Verification'
          value={summary?.pendingVerification || 0}
          icon={Clock}
          accent='amber'
        />
        <StatCard
          title='Rejected / Suspended'
          value={summary?.rejectedCandidates || 0}
          icon={XCircle}
          accent='red'
        />
        <StatCard
          title='Admit Cards Generated'
          value={summary?.admitCardsGenerated || 0}
          icon={FileText}
          accent='slate'
        />
        <StatCard
          title='Candidates Appeared'
          value={summary?.appeared || 0}
          icon={UserCheck}
          accent='green'
        />
        <StatCard
          title='Candidates Absent'
          value={summary?.absent || 0}
          icon={UserMinus}
          accent='amber'
        />
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <CardContent className='p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-6'>
              Registration Trend (Last 30 Days)
            </h3>
            <div className='h-[300px]'>
              <LineChart
                data={{
                  labels:
                    summary?.registrationTrend?.map((t: { date: string; count: number }) => {
                      const d = new Date(t.date)
                      return new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                      }).format(d)
                    }) || [],
                  datasets: [
                    {
                      label: 'Registrations',
                      data:
                        summary?.registrationTrend?.map(
                          (t: { date: string; count: number }) => t.count,
                        ) || [],
                      borderColor: isDark ? '#E4FD97' : '#2D3E2C',
                      backgroundColor: isDark ? 'rgba(228, 253, 151, 0.1)' : 'rgba(45, 62, 44, 0.1)',
                      fill: true,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                        precision: 0
                      }
                    }
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6'>
            <h3 className='text-lg font-semibold text-foreground mb-6'>Attendance Distribution</h3>
            <div className='h-[300px] flex items-center justify-center'>
              <DoughnutChart
                data={{
                  labels: (summary?.totalCandidates) 
                    ? ['Appeared', 'Absent', 'Pending'] 
                    : ['No Data'],
                  datasets: [
                    {
                      data: (summary?.totalCandidates)
                        ? [
                            summary?.appeared || 0,
                            summary?.absent || 0,
                            (summary?.totalCandidates || 0) -
                              (summary?.appeared || 0) -
                              (summary?.absent || 0),
                          ]
                        : [1],
                      backgroundColor: (summary?.totalCandidates)
                        ? ['#2D3E2C', '#E4FD97', '#4A5D4E'] // Strict Priority 1, 2, 3
                        : ['#e2e8f0'],
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col sm:flex-row justify-between items-center mb-6 gap-4'>
            <h3 className='text-lg font-semibold text-foreground'>Detailed Candidate Report</h3>
            <div className='flex items-center gap-3 w-full sm:w-auto'>
              <div className='relative max-w-sm flex items-center gap-2 flex-grow'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4' />
                <Input
                  placeholder='Search candidates...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='pl-9 bg-background border-border text-foreground'
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      className={`shrink-0 border-primary/30 text-primary ${statusFilter !== 'ALL' ? 'bg-primary/10' : ''}`}
                    >
                      <Filter className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === 'ALL'}
                      onCheckedChange={() => setStatusFilter('ALL')}
                    >
                      All Status
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === 'ACTIVE'}
                      onCheckedChange={() => setStatusFilter('ACTIVE')}
                    >
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={statusFilter === 'INACTIVE'}
                      onCheckedChange={() => setStatusFilter('INACTIVE')}
                    >
                      Inactive
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {isListLoading ? (
            <div className='flex justify-center p-8'>
              <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
            </div>
          ) : (
            <div>
              <GenericDataTable
                columns={columns}
                data={listData?.data || []}
                keyExtractor={(item: CandidateReportRow) =>
                  item._id || item.id || item.candidateCode || ''
                }
              />
              {listData?.pagination && listData.pagination.total > 0 && (
                <div className='mt-4 border-t pt-4'>
                  <GenericPagination
                    pageIndex={page - 1}
                    pageSize={limit}
                    totalCount={listData.pagination.total}
                    onPageChange={(p) => setPage(p + 1)}
                    onPageSizeChange={(s) => {
                      setLimit(s)
                      setPage(1)
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Downloaded Reports */}
      <Card className='border-slate-200'>
        <CardContent className='p-6'>
          <h3 className='text-lg font-semibold mb-4 text-foreground'>Recent Downloaded Reports</h3>
          {recentLoading ? (
            <div className='space-y-3'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-10 bg-muted animate-pulse rounded' />
              ))}
            </div>
          ) : (
            <div className='space-y-4'>
              {candidateReports.map((report: any) => (
                <div
                  key={report._id}
                  className='flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border'
                >
                  <div className='flex items-center gap-3'>
                    <FileText className='w-5 h-5 text-primary' />
                    <div>
                      <p className='font-medium text-sm text-foreground'>{report.reportName}</p>
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
              {!candidateReports.length && (
                <p className='text-sm text-slate-500 text-center py-4'>No recent reports found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
