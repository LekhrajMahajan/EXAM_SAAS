import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { useTheme } from '@/providers/theme-context'
import { GenericDataTable } from '@/shared/components/datatable/GenericDataTable'
import { GenericPagination } from '@/shared/components/pagination/GenericPagination'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Label } from '@/shared/components/ui/label'
import {
  Search,
  Download,
  FileText,
  Calendar,
  Star,
  Clock,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import type { TableColumn } from '@/shared/types'
import {
  useReports,
  useReportDashboard,
  useReportStatistics,
  useToggleFavorite,
  useIncrementDownload,
} from '../hooks/report.hooks'
import { reportApi } from '../api/report.api'
import { useReportTemplates } from '../hooks/report-advanced.hooks'
import type { Report, ReportStatus } from '../types/report.types'
import { DoughnutChart, LineChart } from '@/shared/components/charts/charts'
import { toast } from 'react-hot-toast'

const STATUS_VARIANT: Record<ReportStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  COMPLETED: 'default',
  PENDING: 'secondary',
  PROCESSING: 'outline',
  FAILED: 'destructive',
}

import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard'

export const ReportsPage = () => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [activeTab, setActiveTab] = useState('dashboard')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const { data: dashboardStats, refetch: refetchDashboard } = useReportDashboard()
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useReportStatistics()

  const {
    data: reportsResponse,
    isLoading: reportsLoading,
    isError,
    refetch: refetchReports,
  } = useReports({
    page: pageIndex + 1,
    limit: pageSize,
    search: search || undefined,
    reportType: 'MASTER',
  })

  const toggleFavoriteMutation = useToggleFavorite()
  const incrementDownloadMutation = useIncrementDownload()
  const { data: templatesData } = useReportTemplates({ limit: 10 })

  const [isMasterReportModalOpen, setIsMasterReportModalOpen] = useState(false)
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false)
  const [loadingStep, setLoadingStep] = useState('Preparing Reports...')
  const [masterReportResult, setMasterReportResult] = useState<{successful: string[], failed: string[]} | null>(null)
  
  const [selectedModules, setSelectedModules] = useState<string[]>([
    'USER_ACCESS', 'CANDIDATE', 'EXAM', 'ATTENDANCE', 'RESULT', 'FINANCIAL', 'SECURITY'
  ])

  const AVAILABLE_MODULES = [
    { id: 'USER_ACCESS', label: 'User & Access Reports' },
    { id: 'CANDIDATE', label: 'Candidate Reports' },
    { id: 'EXAM', label: 'Exam Reports' },
    { id: 'ATTENDANCE', label: 'Attendance Reports' },
    { id: 'RESULT', label: 'Result & Merit Reports' },
    { id: 'FINANCIAL', label: 'Financial Reports' },
    { id: 'SECURITY', label: 'Security Reports' },
  ]

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules((prev) => 
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPageIndex(0)
  }

  const generateCombinedReport = async () => {
    setIsGeneratingMaster(true)
    
    const steps = [
      'Preparing Reports...',
      'Generating PDFs...',
      'Merging PDFs...',
      'Finalizing...'
    ];
    let stepIndex = 0;
    setLoadingStep(steps[stepIndex]);
    
    const intervalId = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      if (stepIndex === steps.length - 1) {
        // stay on finalizing for a while
        clearInterval(intervalId);
      }
      setLoadingStep(steps[stepIndex]);
    }, 3000);

    try {
      // Pass any global filters you might have in the UI here. We'll pass the search filter as an example.
      const filters = { search: search || undefined };
      
      const { data, headers } = await reportApi.generateMasterReport({
        modules: selectedModules,
        ...filters
      });

      clearInterval(intervalId);
      
      const successful = headers['x-report-success'] ? headers['x-report-success'].split(',') : [];
      const failed = headers['x-report-failed'] ? headers['x-report-failed'].split(',') : [];

      setMasterReportResult({ successful, failed });

      // Trigger download
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      
      // Try to get filename from content-disposition header if available, otherwise fallback
      let filename = `Master_Report_${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}.pdf`;
      const contentDisposition = headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      refetchReports(); // Refresh the report history table dynamically
      refetchDashboard();
      refetchStats();
      
      setIsMasterReportModalOpen(false)
    } catch (error) {
      clearInterval(intervalId);
      console.error('Failed to generate master PDF', error)
      setMasterReportResult({ successful: [], failed: selectedModules });
    } finally {
      setIsGeneratingMaster(false)
    }
  }

  const handleDownload = async (id: string, reportName: string, metadata?: any) => {
    incrementDownloadMutation.mutate(id)
    setDownloadingId(id)
    
    const downloadTask = async () => {
      try {
        const modules = metadata?.includedModules || ['USER_ACCESS', 'CANDIDATE', 'EXAM', 'ATTENDANCE', 'RESULT', 'FINANCIAL', 'SECURITY'];
        const { data } = await reportApi.generateMasterReport({ modules, saveRecord: false });
        
        const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${(reportName || 'Master_Report').replace(/\s+/g, '_')}_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } finally {
        setDownloadingId(null)
      }
    };

    toast.promise(downloadTask(), {
      loading: 'Downloading Report...',
      success: 'Report downloaded successfully!',
      error: 'Failed to download report',
    });
  }

  const columns: TableColumn<Report>[] = [
    {
      id: 'name',
      header: 'Report Name',
      accessorKey: 'reportName',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <FileText className={`w-4 h-4 ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`} />
          <span className={`font-semibold ${isDark ? 'text-slate-200' : ''}`}>{row.reportName}</span>
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      accessorKey: 'reportType',
      cell: ({ row }) => {
        if (row.reportType === 'MASTER') {
          const modules = (row.metadata?.includedModules as string[]) || [];
          return (
            <div className='flex flex-col'>
              <span className='text-slate-600 font-medium'>Master Report</span>
              {modules.length > 0 && (
                <div className='flex flex-wrap gap-1 mt-1 max-w-[200px]'>
                  {modules.map((m) => (
                    <Badge key={m} variant='secondary' className='text-[10px] py-0 px-1'>
                      {m.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )
        }
        return <span className='text-slate-600'>{row.reportType}</span>
      },
    },
    {
      id: 'format',
      header: 'Format',
      accessorKey: 'format',
      cell: ({ row }) => <span className='font-mono text-sm'>{row.format}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.status] ?? 'outline'}>{row.status}</Badge>
      ),
    },
    {
      id: 'generatedAt',
      header: 'Generated At',
      accessorKey: 'generatedAt',
      cell: ({ row }) => (
        <span className='text-sm text-slate-500'>
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          }).format(new Date(row.generatedAt))}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const isDownloading = downloadingId === row._id;
        return (
          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              title='Download Report'
              disabled={row.status !== 'COMPLETED' || isDownloading}
              onClick={() => handleDownload(row._id, row.reportName, row.metadata)}
            >
              {isDownloading ? (
                <Loader2 className={`w-4 h-4 animate-spin ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`} />
              ) : (
                <Download className={`w-4 h-4 ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`} />
              )}
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className='space-y-6 p-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-slate-200' : 'text-[#2D3E2C]'}`}>Reports & Analytics</h1>
          <p className='text-muted-foreground mt-2'>
            View system analytics and download generated reports.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsMasterReportModalOpen(true)}
          className="gap-2 border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] qa-button transition-colors"
        >
          Generate Master Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='mb-4'>
          <TabsTrigger value='dashboard'>Dashboard</TabsTrigger>
          <TabsTrigger value='history'>Report History</TabsTrigger>
        </TabsList>

        <TabsContent value='dashboard' className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <StatCard
              title='Total Reports'
              value={dashboardStats?.data.totalReports || 0}
              icon={FileText}
              accent='slate'
            />
            <StatCard
              title='Generated Today'
              value={dashboardStats?.data.generatedToday || 0}
              icon={Clock}
              accent='lime'
            />
            <StatCard
              title='Scheduled Reports'
              value={dashboardStats?.data.scheduledReports || 0}
              icon={Calendar}
              accent='amber'
            />
            <StatCard
              title='Failed Reports'
              value={dashboardStats?.data.failedReports || 0}
              icon={AlertCircle}
              accent='red'
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Reports Generated (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className='h-64 flex items-center justify-center bg-slate-50 rounded-lg animate-pulse' />
                ) : (
                  <div className='h-64'>
                    {statsData?.data.reportsByDay && (
                      <LineChart
                        data={{
                          labels: statsData.data.reportsByDay.map((d) => d.date),
                          datasets: [
                            {
                              label: 'Reports',
                              data: statsData.data.reportsByDay.map((d) => d.count),
                              borderColor: '#A8D672',
                              tension: 0.4,
                            },
                          ],
                        }}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reports by Module</CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className='h-64 flex items-center justify-center bg-slate-50 rounded-lg animate-pulse' />
                ) : (
                  <div className='h-64'>
                    {statsData?.data.reportsByModule && (
                      <DoughnutChart
                        data={{
                          labels: statsData.data.reportsByModule.map((m) => m.module),
                          datasets: [
                            {
                              data: statsData.data.reportsByModule.map((m) => m.count),
                              backgroundColor: [
                                '#2D3E2C',
                                '#E4FD97',
                                '#A8D672',
                                '#617034',
                                '#3E543D',
                                '#C4F06A',
                                '#1E2A1E',
                                '#D1F84F',
                              ],
                            },
                          ],
                        }}
                      />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        <TabsContent value='history'>
          <Card>
            <CardHeader className='pb-4'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <CardTitle>All Reports</CardTitle>
                <form onSubmit={handleSearch} className='flex items-center gap-2 w-full sm:w-auto'>
                  <div className='relative w-full sm:w-64'>
                    <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-slate-500' />
                    <Input
                      type='text'
                      placeholder='Search reports...'
                      className='pl-9 bg-slate-50'
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                    />
                  </div>
                  <Button type='submit' variant='secondary'>
                    Search
                  </Button>
                </form>
              </div>
            </CardHeader>
            <CardContent>
              {isError ? (
                <div className='p-8 text-center text-red-500 bg-red-50 rounded-lg'>
                  Failed to load reports. Please try again.
                </div>
              ) : reportsLoading && !reportsResponse ? (
                <div className='space-y-3'>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className='h-12 bg-slate-100 animate-pulse rounded' />
                  ))}
                </div>
              ) : (
                <>
                  {(!reportsResponse?.data || reportsResponse.data.length === 0) && (
                    <div className='p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed'>
                      No reports found.
                    </div>
                  )}
                  {reportsResponse?.data && reportsResponse.data.length > 0 && (
                    <GenericDataTable
                      columns={columns}
                      data={reportsResponse.data}
                      keyExtractor={(item) => item._id}
                    />
                  )}
                  {reportsResponse?.pagination && reportsResponse.pagination.total > 0 && (
                    <GenericPagination
                      pageIndex={pageIndex}
                      pageSize={pageSize}
                      totalCount={reportsResponse.pagination.total}
                      onPageChange={setPageIndex}
                      onPageSizeChange={(size) => {
                        setPageSize(size)
                        setPageIndex(0)
                      }}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Master Report Selection Modal */}
      <Dialog open={isMasterReportModalOpen} onOpenChange={setIsMasterReportModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Generate Master Report</DialogTitle>
          </DialogHeader>
          <div className='py-4 space-y-4'>
            <p className='text-sm text-slate-500'>
              Select the modules you want to include in the merged Master PDF. 
              The system will extract the summary contents for each selected module.
            </p>
            <div className='grid gap-3'>
              {AVAILABLE_MODULES.map((module) => (
                <div key={module.id} className='flex items-center space-x-3'>
                  <Checkbox
                    id={`module-${module.id}`}
                    checked={selectedModules.includes(module.id)}
                    onCheckedChange={() => handleModuleToggle(module.id)}
                  />
                  <Label htmlFor={`module-${module.id}`} className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    {module.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsMasterReportModalOpen(false)} disabled={isGeneratingMaster}>
              Cancel
            </Button>
            <Button
              onClick={generateCombinedReport}
              className='bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90'
              disabled={selectedModules.length === 0 || isGeneratingMaster}
            >
              {isGeneratingMaster ? (
                <>
                  <div className='w-4 h-4 mr-2 border-2 border-t-transparent border-[#E4FD97] rounded-full animate-spin' />
                  {loadingStep}
                </>
              ) : (
                <>
                  <Download className='w-4 h-4 mr-2' />
                  Download PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Master Report Result Summary Dialog */}
      <Dialog open={!!masterReportResult} onOpenChange={() => setMasterReportResult(null)}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Master Report Generation Summary</DialogTitle>
          </DialogHeader>
          <div className='py-4 space-y-4'>
            {masterReportResult?.successful.length ? (
              <div>
                <h4 className='text-sm font-semibold text-green-600 flex items-center mb-2'>
                  <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                  Successful Reports ({masterReportResult.successful.length})
                </h4>
                <ul className='text-sm text-slate-600 list-disc pl-5'>
                  {masterReportResult.successful.map((moduleId: string) => (
                    <li key={moduleId}>{AVAILABLE_MODULES.find(m => m.id === moduleId)?.label || moduleId}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            
            {masterReportResult?.failed.length ? (
              <div className="mt-4">
                <h4 className='text-sm font-semibold text-red-600 flex items-center mb-2'>
                  <span className="w-2 h-2 rounded-full bg-red-600 mr-2"></span>
                  Failed Reports ({masterReportResult.failed.length})
                </h4>
                <ul className='text-sm text-slate-600 list-disc pl-5'>
                  {masterReportResult.failed.map((moduleId: string) => (
                    <li key={moduleId}>{AVAILABLE_MODULES.find(m => m.id === moduleId)?.label || moduleId}</li>
                  ))}
                </ul>
                <p className='text-xs text-red-500 mt-2'>
                  These reports encountered an error during generation and were omitted from the Master PDF. You may retry generating them later.
                </p>
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button onClick={() => setMasterReportResult(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
