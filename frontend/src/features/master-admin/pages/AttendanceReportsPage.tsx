import React, { useState } from 'react'
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
  Download,
  Search,
  Users,
  ScanFace,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import { GenericPagination } from '@/shared/components/pagination/GenericPagination'
import { LineChart, DoughnutChart } from '@/shared/components/charts/charts'
import {
  useAttendanceSummary,
  useAttendanceList,
  useAttendanceExport,
  useGenerateAttendanceReport,
  useRecentReports,
  useIncrementDownload,
} from '../hooks/report.hooks'
import { useTheme } from '@/providers/theme-context'
import type { TableColumn } from '@/shared/types'

interface AttendanceReportRow {
  candidateId: string
  registrationNo: string
  candidateName: string
  exam: string
  session: string
  shift: string
  examCenter: string
  company: string

  attendanceStatus: string
  checkInTime: string | Date
  checkOutTime: string | Date
  biometricStatus: string
  faceVerificationStatus: string
  attendanceMethod: string
  lateMinutes: number
  id?: string
}

import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard'

export const AttendanceReportsPage = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const [pageIndex, setPageIndex] = useState(0)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [pageSize, setPageSize] = useState(10)

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  const { data: summary, refetch: refetchSummary } = useAttendanceSummary()
  const { data: listData, isLoading: isListLoading } = useAttendanceList({
    page: pageIndex + 1,
    limit: pageSize,
    search: debouncedSearch,
  })

  const { mutate: exportData, isPending: isExporting } = useAttendanceExport()
  const { mutate: generateReport, isPending: isGenerating } = useGenerateAttendanceReport()
  const { data: recentReports, isLoading: recentLoading } = useRecentReports({ limit: 10 })
  const attendanceReports =
    recentReports?.data?.filter((r: any) => r.reportType === 'ATTENDANCE').slice(0, 5) || []

  const handleExport = () => {
    exportData(
      { search: debouncedSearch },
      {
        onSuccess: (response: any) => {
          const csvString = response.data || response
          const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'Attendance_Report.csv'
          a.click()
          URL.revokeObjectURL(url)
        },
      },
    )
  }

  const columns: TableColumn<AttendanceReportRow>[] = [
    {
      id: 'candidateId',
      header: 'Candidate ID',
      accessorKey: 'candidateId' as keyof AttendanceReportRow,
    },
    {
      id: 'candidateName',
      header: 'Name',
      accessorKey: 'candidateName' as keyof AttendanceReportRow,
    },
    { id: 'exam', header: 'Exam', accessorKey: 'exam' as keyof AttendanceReportRow },
    { id: 'examCenter', header: 'Center', accessorKey: 'examCenter' as keyof AttendanceReportRow },
    {
      id: 'checkInTime',
      header: 'Check In',
      accessorKey: 'checkInTime' as keyof AttendanceReportRow,
      cell: ({ row }: { row: AttendanceReportRow }) =>
        row.checkInTime
          ? new Date(row.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '-',
    },
    {
      id: 'checkOutTime',
      header: 'Check Out',
      accessorKey: 'checkOutTime' as keyof AttendanceReportRow,
      cell: ({ row }) =>
        row.checkOutTime
          ? new Date(row.checkOutTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-',
    },
    {
      id: 'attendanceStatus',
      header: 'Status',
      accessorKey: 'attendanceStatus' as keyof AttendanceReportRow,
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            row.attendanceStatus === 'PRESENT'
              ? 'bg-primary text-primary-foreground border-primary'
              : row.attendanceStatus === 'ABSENT'
              ? 'bg-destructive/10 text-destructive border-destructive/20'
              : row.attendanceStatus === 'LATE'
              ? 'bg-secondary text-secondary-foreground border-secondary'
              : 'bg-muted text-muted-foreground border-border'
          }`}
        >
          {row.attendanceStatus || 'PENDING'}
        </span>
      ),
    },
    {
      id: 'biometricStatus',
      header: 'Biometric',
      accessorKey: 'biometricStatus' as keyof AttendanceReportRow,
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            row.biometricStatus === 'SUCCESS' || row.biometricStatus === 'VERIFIED'
              ? 'bg-secondary text-secondary-foreground border-secondary'
              : row.biometricStatus === 'FAILED'
              ? 'bg-destructive/10 text-destructive border-destructive/20'
              : 'bg-muted text-muted-foreground border-border'
          }`}
        >
          {row.biometricStatus || 'PENDING'}
        </span>
      ),
    },
    {
      id: 'faceVerificationStatus',
      header: 'Face Verif.',
      accessorKey: 'faceVerificationStatus' as keyof AttendanceReportRow,
      cell: ({ row }) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            row.faceVerificationStatus === 'SUCCESS' || row.faceVerificationStatus === 'VERIFIED'
              ? 'bg-secondary text-secondary-foreground border-secondary'
              : row.faceVerificationStatus === 'FAILED'
              ? 'bg-destructive/10 text-destructive border-destructive/20'
              : 'bg-muted text-muted-foreground border-border'
          }`}
        >
          {row.faceVerificationStatus || 'PENDING'}
        </span>
      ),
    },
  ]

  return (
    <div className='space-y-6 p-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>Attendance Reports</h1>
          <p className='text-slate-500 mt-2'>
            Comprehensive analytics and tracking for candidate attendance, verification and
            check-ins.
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
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className='w-4 h-4 animate-spin' /> : <Download className='w-4 h-4' />}
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button
            variant='outline'
            className='gap-2 border-border text-foreground hover:border-primary hover:bg-primary hover:text-secondary transition-colors font-medium'
            onClick={() => generateReport({ search: debouncedSearch })}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className='w-4 h-4 animate-spin' /> : <FileText className='w-4 h-4' />}
            {isGenerating ? 'Generating...' : 'Export Report'}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='Total Registered'
          value={summary?.data?.totalRegistered ?? '-'}
          icon={Users}
          accent='slate'
        />
        <StatCard
          title='Present Candidates'
          value={summary?.data?.present ?? '-'}
          icon={CheckCircle}
          description={`${summary?.data?.attendancePercentage ?? 0}% Attendance`}
          accent='green'
        />
        <StatCard title='Absent Candidates' value={summary?.data?.absent ?? '-'} icon={XCircle} accent='red' />
        <StatCard title='Late Check-in' value={summary?.data?.lateArrivals ?? '-'} icon={Clock} accent='amber' />
        <StatCard
          title='No Show Candidates'
          value={summary?.data?.noShows ?? '-'}
          icon={FileText}
          accent='amber'
        />
        <StatCard
          title='Biometric Verification'
          value={summary?.data?.biometricVerified ?? '-'}
          icon={UserCheck}
          accent='lime'
        />
        <StatCard
          title='Face Verification'
          value={summary?.data?.faceVerified ?? '-'}
          icon={ScanFace}
          accent='slate'
        />
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <CardContent className='p-6'>
            <h3 className='text-lg font-semibold mb-6 text-foreground'>Attendance Trend</h3>
            <div className='h-[300px]'>
              <LineChart
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                  datasets: [
                    {
                      label: 'Attendance',
                      data: [120, 150, 180, 190, 210, 250, 300],
                      borderColor: isDark ? '#E4FD97' : '#2D3E2C',
                      backgroundColor: isDark ? 'rgba(228, 253, 151, 0.1)' : 'rgba(45, 62, 44, 0.1)',
                      fill: true,
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='p-6'>
            <h3 className='text-lg font-semibold mb-6 text-foreground'>Present vs Absent</h3>
            <div className='h-[300px]'>
              <DoughnutChart
                data={{
                  labels:
                    summary?.data?.present || summary?.data?.absent || summary?.data?.lateArrivals
                      ? ['Present', 'Absent', 'Late']
                      : ['No Data'],
                  datasets: [
                    {
                      data:
                        summary?.data?.present ||
                        summary?.data?.absent ||
                        summary?.data?.lateArrivals
                          ? [
                              summary?.data?.present || 0,
                              summary?.data?.absent || 0,
                              summary?.data?.lateArrivals || 0,
                            ]
                          : [1],
                      backgroundColor:
                        summary?.data?.present ||
                        summary?.data?.absent ||
                        summary?.data?.lateArrivals
                          ? ['#2D3E2C', '#E4FD97', '#4A5D4E']
                          : ['#e2e8f0'],
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Downloaded Reports */}
      <div className='grid grid-cols-1'>
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
                {attendanceReports.map((report: any) => (
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
                {!attendanceReports.length && (
                  <p className='text-sm text-slate-500 text-center py-4'>
                    No recent reports found.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className='p-0'>
          <div className='p-6 border-b flex flex-col sm:flex-row justify-between items-center gap-4'>
            <h3 className='text-lg font-semibold text-foreground'>Attendance List</h3>
            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input
                placeholder='Search candidates...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='pl-9 bg-background border-border text-foreground'
              />
            </div>
          </div>

          {isListLoading ? (
            <div className='p-8 text-center text-slate-500'>Loading attendance records...</div>
          ) : !listData?.data || listData.data.length === 0 ? (
            <div className='p-8 text-center text-slate-500'>No attendance records found.</div>
          ) : (
            <GenericDataTable
              columns={columns as any}
              data={(listData?.data as AttendanceReportRow[]) ?? []}
              keyExtractor={(item) => item.id || item.candidateId || Math.random().toString()}
            />
          )}

          {listData?.pagination && (
            <div className='p-4 border-t'>
              <GenericPagination
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={listData.pagination.total}
                onPageChange={setPageIndex}
                onPageSizeChange={setPageSize}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
