import { useEffect, useState, useMemo } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { RefreshCw, Loader2, Search, User, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ImportCandidateModalPrivate } from '../components/ImportCandidateModalPrivate'
import { useCandidateImportStore } from '@/stores/candidate/candidateImport.store'
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge'

export const PrivateCandidateImportPage = () => {
  const { importedCandidates, isLoading, fetchImportedCandidates, sendToAdmin } =
    useCandidateImportStore()

  const [search, setSearch] = useState('')
  const [examFilter, setExamFilter] = useState('all')
  const [shiftFilter, setShiftFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedExams, setExpandedExams] = useState<Record<string, boolean>>({})
  const [sendingExamId, setSendingExamId] = useState<string | null>(null)

  useEffect(() => {
    fetchImportedCandidates()
  }, [fetchImportedCandidates])

  const uniqueExams = Array.from(
    new Set(importedCandidates.map((c) => c.examName).filter(Boolean)),
  ) as string[]
  const uniqueShifts = Array.from(
    new Set(importedCandidates.map((c) => c.shift).filter(Boolean)),
  ) as string[]

  const filteredCandidates = importedCandidates.filter((c) => {
    if (search) {
      const q = search.toLowerCase()
      const matches =
        c.applicationNo?.toLowerCase().includes(q) ||
        c.candidateFullName?.toLowerCase().includes(q) ||
        c.candidateId?.toLowerCase().includes(q)
      if (!matches) return false
    }
    if (examFilter !== 'all' && c.examName !== examFilter) return false
    if (shiftFilter !== 'all' && c.shift !== shiftFilter) return false
    if (statusFilter !== 'all') {
      const examStatus = c.examId?.displayStatus || c.examId?.status || 'ACTIVE'
      if (examStatus.toUpperCase() !== statusFilter.toUpperCase()) return false
    }
    return true
  })

  const groupedCandidates = useMemo(() => {
    const groups: Record<
      string,
      {
        examId: any
        examName: string
        examStatus: string
        isSentToCompanyAdmin: boolean
        candidates: any[]
      }
    > = {}

    filteredCandidates.forEach((c) => {
      const key = (typeof c.examId === 'object' ? c.examId?._id : c.examId) || c.examName
      if (!groups[key]) {
        groups[key] = {
          examId: c.examId || null,
          examName: c.examName,
          examStatus: c.examId?.displayStatus || c.examId?.status || 'ACTIVE',
          isSentToCompanyAdmin: c.isSentToCompanyAdmin || false,
          candidates: [],
        }
      }
      groups[key].candidates.push(c)
    })

    return Object.values(groups)
  }, [filteredCandidates])

  const toggleRow = (key: string) => {
    setExpandedExams((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSendToAdmin = async (examIdObj: any, key: string) => {
    const idToUse = typeof examIdObj === 'object' ? examIdObj?._id : examIdObj
    if (!idToUse) return

    setSendingExamId(key)
    // Artificial 2-second delay per user request
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await sendToAdmin(idToUse)
    setSendingExamId(null)
    fetchImportedCandidates()
  }

  return (
    <div className='space-y-6 p-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            Candidate Management (Private Authority)
          </h1>
          <p className='text-muted-foreground mt-1'>
            View, filter, and import candidates for your assigned exam.
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            className='hidden md:flex'
            onClick={() => fetchImportedCandidates()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <ImportCandidateModalPrivate onSuccess={() => fetchImportedCandidates()} />
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-card p-4 rounded-md border'>
        <div className='flex flex-1 items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0'>
          <div className='relative flex-1 min-w-[200px] max-w-xs'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search candidates...'
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

          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className='w-[150px] hidden lg:flex bg-background border-input text-foreground font-medium'>
              <SelectValue placeholder='Shift' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Shifts</SelectItem>
              {uniqueShifts.map((shift, i) => (
                <SelectItem key={i} value={shift}>
                  {shift}
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

      {/* Accordion Table */}
      <div className='space-y-4'>
        {isLoading ? (
          <div className='flex justify-center items-center h-48 border rounded-md bg-card'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : groupedCandidates.length === 0 ? (
          <div className='flex justify-center items-center h-48 border rounded-md bg-card'>
            <p className='text-muted-foreground text-sm'>
              No candidates imported yet. Click &quot;Import Candidate&quot; to begin.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {groupedCandidates.map((group) => {
              const groupKey =
                (typeof group.examId === 'object' ? group.examId?._id : group.examId) ||
                group.examName
              const isExpanded = expandedExams[groupKey]
              const dynamicColumnKeys = Array.from(
                new Set(group.candidates.flatMap((c) => Object.keys(c.dynamicFields || {}))),
              )
              const isSending = sendingExamId === groupKey

              return (
                <div
                  key={groupKey}
                  className='flex flex-col bg-card border rounded-md overflow-hidden transition-all duration-300'
                >
                  {/* Header Row */}
                  <div
                    className='flex flex-col sm:flex-row items-center justify-between p-4 gap-4 cursor-pointer hover:bg-muted/50'
                    onClick={() => toggleRow(groupKey)}
                  >
                    <div className='flex items-center gap-4 w-full sm:w-auto'>
                      {group.examId ? (
                        <ExamStatusBadge exam={group.examId} className='h-6' />
                      ) : (
                        <span className='px-2 py-1 text-[10px] font-bold rounded uppercase bg-muted text-muted-foreground'>
                          Unknown
                        </span>
                      )}
                      <span className='font-semibold text-foreground text-sm'>
                        {group.examName}
                      </span>
                      <span className='text-sm font-medium text-[#2D3E2C] bg-[#E4FD97] px-2 py-0.5 rounded-md'>
                        {group.candidates.length} Candidates
                      </span>
                    </div>
                    <div className='flex items-center gap-4 w-full sm:w-auto justify-end'>
                      <Button
                        size='sm'
                        className={`text-white shadow-sm disabled:opacity-50 ${
                          group.isSentToCompanyAdmin
                            ? 'bg-[#7A8E60] hover:bg-[#7A8E60]/90'
                            : 'bg-primary hover:bg-primary/90'
                        }`}
                        disabled={group.isSentToCompanyAdmin || isSending || !group.examId}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!group.isSentToCompanyAdmin && !isSending) {
                            handleSendToAdmin(group.examId, groupKey)
                          }
                        }}
                      >
                        {isSending ? (
                          <>
                            <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                            Sending...
                          </>
                        ) : group.isSentToCompanyAdmin ? (
                          <>
                            <svg
                              className='w-4 h-4 mr-2'
                              viewBox="0 0 24 24"
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
                            <svg
                              className='w-4 h-4 mr-2'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <line x1='22' y1='2' x2='11' y2='13'></line>
                              <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
                            </svg>
                            Send to Company Admin
                          </>
                        )}
                      </Button>
                      <Button variant='ghost' size='icon' className='h-8 w-8 shrink-0'>
                        {isExpanded ? (
                          <ChevronUp className='h-4 w-4 text-muted-foreground' />
                        ) : (
                          <ChevronDown className='h-4 w-4 text-muted-foreground' />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className='border-t bg-background'>
                      <div className='overflow-x-auto'>
                        <table className='w-full text-sm text-left'>
                          <thead className='text-xs text-muted-foreground bg-muted/50 border-b'>
                            <tr>
                              <th className='px-4 py-3 font-medium w-12'>Photo</th>
                              <th className='px-4 py-3 font-medium'>Candidate ID</th>
                              <th className='px-4 py-3 font-medium'>Application No.</th>
                              <th className='px-4 py-3 font-medium'>Full Name</th>
                              <th className='px-4 py-3 font-medium'>Aadhaar No.</th>
                              <th className='px-4 py-3 font-medium'>Center</th>
                              <th className='px-4 py-3 font-medium'>Shift</th>
                              {/* Dynamic Columns */}
                              {dynamicColumnKeys.map((col) => (
                                <th key={col} className='px-4 py-3 font-medium capitalize'>
                                  {col.replace(/([A-Z])/g, ' $1').trim()}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className='divide-y'>
                            {group.candidates.map((c, i) => (
                              <tr key={i} className='hover:bg-muted/50 transition-colors'>
                                <td className='px-4 py-3'>
                                  {c.candidatePhoto ? (
                                    <img
                                      src={c.candidatePhoto}
                                      alt={c.candidateFullName}
                                      className='w-12 h-12 rounded-full object-cover border-2 border-border shrink-0 shadow-sm'
                                    />
                                  ) : (
                                    <div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border shrink-0 shadow-sm'>
                                      <User className='w-6 h-6 text-muted-foreground' />
                                    </div>
                                  )}
                                </td>
                                <td className='px-4 py-3 text-foreground font-mono text-xs'>
                                  {c.candidateId || '—'}
                                </td>
                                <td className='px-4 py-3 text-muted-foreground'>
                                  {c.applicationNo || '—'}
                                </td>
                                <td className='px-4 py-3 text-foreground font-medium'>
                                  {c.candidateFullName || '—'}
                                </td>
                                <td className='px-4 py-3 text-muted-foreground'>
                                  {c.aadharNumber || '—'}
                                </td>
                                <td className='px-4 py-3 text-muted-foreground'>
                                  {c.centerName || '—'}
                                </td>
                                <td className='px-4 py-3 text-muted-foreground'>
                                  {c.shift || '—'}
                                </td>
                                {/* Dynamic Columns */}
                                {dynamicColumnKeys.map((col) => (
                                  <td key={col} className='px-4 py-3 text-muted-foreground'>
                                    {c.dynamicFields?.[col] || '—'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
