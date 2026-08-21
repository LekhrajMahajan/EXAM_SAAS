import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Send, ChevronDown, ChevronUp, Search, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import api from '@/services/api'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ImportCenterModalPrivate } from '../components/ImportCenterModalPrivate'
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge'
import toast from 'react-hot-toast'

interface UploadedBatch {
  importId: string
  examName: string
  count: number
  centers: any[]
  examStatus: string
  isSentToCompanyAdmin: boolean
  examId: any
}

export const PrivateImportCentersPage = () => {
  const [uploadedBatches, setUploadedBatches] = useState<UploadedBatch[]>([])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [examFilter, setExamFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchImports = useCallback(async () => {
    try {
      setIsLoading(true)
      // Backend automatically scopes to assigned exam for PRIVATE_AUTHORITY
      const res = await api.get('/import-center-assign-exam')
      if (res.data?.success) {
        const batches = res.data.data.map((item: any) => ({
          importId: item._id,
          examName: item.examId?.examName || item.examId?.examTitle || 'Unknown Exam',
          count: item.centers?.length || 0,
          centers: item.centers || [],
          examStatus: item.examId?.status || 'UNKNOWN',
          isSentToCompanyAdmin: item.isSentToCompanyAdmin || false,
          examId: item.examId,
        }))
        setUploadedBatches(batches)
      }
    } catch (err) {
      console.error('Failed to fetch imported batches:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setIsLoading(true)
        const res = await api.get('/import-center-assign-exam')
        if (!cancelled && res.data?.success) {
          const batches = res.data.data.map((item: any) => ({
            importId: item._id,
            examName: item.examId?.examName || item.examId?.examTitle || 'Unknown Exam',
            count: item.centers?.length || 0,
            centers: item.centers || [],
            examStatus: item.examId?.status || 'UNKNOWN',
            isSentToCompanyAdmin: item.isSentToCompanyAdmin || false,
            examId: item.examId,
          }))
          setUploadedBatches(batches)
        }
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch imported batches:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const handleSuccess = () => {
    fetchImports()
  }

  const toggleRow = (importId: string) => {
    setExpandedRow(expandedRow === importId ? null : importId)
  }

  const handleSendToAdmin = async (importId: string) => {
    try {
      setSendingId(importId)
      const res = await api.patch(`/import-center-assign-exam/${importId}/send`)
      
      // Artificial delay so the user can clearly see the "Sending..." spinner and feel the process
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (res.data?.success) {
        toast.success("Successfully sent to company admin")
        setUploadedBatches(prev => prev.map(batch => 
          batch.importId === importId ? { ...batch, isSentToCompanyAdmin: true } : batch
        ))
      }
    } catch (err: any) {
      console.error('Failed to send to company admin:', err)
      toast.error(err.response?.data?.message || "Failed to send to company admin")
    } finally {
      setSendingId(null)
    }
  }

  const uniqueExams = Array.from(
    new Set(uploadedBatches.map((b) => b.examName).filter(Boolean)),
  ) as string[]
  const uniqueStates = Array.from(
    new Set(uploadedBatches.flatMap((b) => b.centers.map((c: any) => c.state)).filter(Boolean)),
  ) as string[]

  const filteredBatches = uploadedBatches.filter((batch) => {
    if (search) {
      const q = search.toLowerCase()
      const matchesSearch =
        batch.examName.toLowerCase().includes(q) ||
        batch.centers.some(
          (c: any) =>
            c.centerName?.toLowerCase().includes(q) ||
            c.centerCode?.toLowerCase().includes(q) ||
            c.city?.toLowerCase().includes(q),
        )
      if (!matchesSearch) return false
    }
    if (examFilter !== 'all' && batch.examName !== examFilter) return false
    if (stateFilter !== 'all' && !batch.centers.some((c: any) => c.state === stateFilter))
      return false

    if (statusFilter !== 'all') {
      const st = batch.examStatus.toUpperCase()
      if (statusFilter === 'active' && st !== 'ACTIVE') return false
      if (statusFilter === 'inactive' && st === 'ACTIVE') return false
    }

    return true
  })

  return (
    <div className='space-y-6 p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Center Management (Private Authority)
          </h1>
          <p className='text-muted-foreground mt-1'>
            View, filter, and import centers for your assigned exam.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='hidden md:flex'
            onClick={fetchImports}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <ImportCenterModalPrivate onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-md border'>
        <div className='flex flex-1 items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0'>
          <div className='relative flex-1 min-w-[200px] max-w-xs'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search centers (Name, Code)...'
              className='pl-8 bg-background border-input text-foreground focus-visible:ring-1'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={examFilter} onValueChange={setExamFilter}>
            <SelectTrigger className='w-[150px] bg-background border-input text-foreground font-medium'>
              <SelectValue placeholder='Exam' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Exams</SelectItem>
              {uniqueExams.map((exam, i) => (
                <SelectItem key={i} value={exam}>
                  {exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className='w-[150px] bg-background border-input text-foreground font-medium'>
              <SelectValue placeholder='State' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All States</SelectItem>
              {uniqueStates.map((state, i) => (
                <SelectItem key={i} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[130px] hidden lg:flex bg-background border-input text-foreground font-medium'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='inactive'>Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='space-y-4'>
        {isLoading ? (
          <div className='flex justify-center items-center h-48 border rounded-md bg-card'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className='flex justify-center items-center h-48 border rounded-md bg-card'>
            <p className='text-muted-foreground text-sm'>
              No centers imported yet. Click &quot;Import Center&quot; to begin.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredBatches.map((batch) => (
              <div
                key={batch.importId}
                className='flex flex-col bg-card border rounded-md overflow-hidden transition-all duration-300'
              >
                {/* Header Row */}
                <div
                  className='flex flex-col sm:flex-row items-center justify-between p-4 gap-4 cursor-pointer hover:bg-muted/50'
                  onClick={() => toggleRow(batch.importId)}
                >
                  <div className='flex items-center gap-4 w-full sm:w-auto'>
                    {batch.examId ? (
                      <ExamStatusBadge exam={batch.examId} className='h-6' />
                    ) : (
                      <span
                        className={`px-2 py-1 text-[10px] font-bold rounded uppercase ${
                          batch.examStatus === 'ACTIVE'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {batch.examStatus === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    )}
                    <span className='font-semibold text-foreground text-sm'>{batch.examName}</span>
                    <span className='text-sm font-medium text-[#2D3E2C] bg-[#E4FD97] px-2 py-0.5 rounded-md'>
                      {batch.count} Centers
                    </span>
                  </div>
                  <div className='flex items-center gap-4 w-full sm:w-auto justify-end'>
                    <Button
                      size='sm'
                      className={`text-white shadow-sm disabled:opacity-50 ${
                        batch.isSentToCompanyAdmin ? 'bg-[#7A8E60] hover:bg-[#7A8E60]/90' : ''
                      }`}
                      disabled={batch.isSentToCompanyAdmin || sendingId === batch.importId}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!batch.isSentToCompanyAdmin && sendingId !== batch.importId) {
                          handleSendToAdmin(batch.importId)
                        }
                      }}
                    >
                      {sendingId === batch.importId ? (
                        <>
                          <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                          Sending...
                        </>
                      ) : batch.isSentToCompanyAdmin ? (
                        <>
                          <svg
                            className='w-4 h-4 mr-2'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path
                              d="M5 12L10 17L20 7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Sended
                        </>
                      ) : (
                        <>
                          <Send className='w-4 h-4 mr-2' />
                          Send to company admin
                        </>
                      )}
                    </Button>
                    <div className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground'>
                      {expandedRow === batch.importId ? (
                        <ChevronUp className='w-5 h-5' />
                      ) : (
                        <ChevronDown className='w-5 h-5' />
                      )}
                    </div>
                  </div>
                </div>

                {/* Accordion Content */}
                {expandedRow === batch.importId && (
                  <div className='border-t bg-card/50 p-4 animate-in slide-in-from-top-2 duration-300'>
                    {batch.centers && batch.centers.length > 0 ? (
                      <div className='overflow-x-auto rounded-md border'>
                        <table className='w-full text-sm text-left'>
                          <thead className='text-xs text-muted-foreground bg-muted/50 border-b'>
                            <tr>
                              <th className='px-4 py-3 font-medium'>Center Name</th>
                              <th className='px-4 py-3 font-medium'>Center Code</th>
                              <th className='px-4 py-3 font-medium'>City</th>
                              <th className='px-4 py-3 font-medium'>State</th>
                            </tr>
                          </thead>
                          <tbody className='divide-y bg-transparent'>
                            {batch.centers.map((row, i) => (
                              <tr key={i} className='hover:bg-muted/50 transition-colors'>
                                <td className='px-4 py-3 text-foreground'>{row.centerName}</td>
                                <td className='px-4 py-3 text-muted-foreground'>
                                  {row.centerCode}
                                </td>
                                <td className='px-4 py-3 text-muted-foreground'>{row.city}</td>
                                <td className='px-4 py-3 text-muted-foreground'>{row.state}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className='text-muted-foreground text-sm text-center py-4'>
                        No center details found for this batch.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
