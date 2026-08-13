import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, Send, ChevronDown, ChevronUp, SlidersHorizontal, Search, Loader2 } from 'lucide-react'
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
import { ImportCenterModalGovt } from '../components/ImportCenterModalGovt'

interface UploadedBatch {
  importId: string
  examName: string
  count: number
  centers: any[]
  examStatus: string
  isSentToCompanyAdmin: boolean
}

export const GovtImportCentersPage = () => {
  const navigate = useNavigate()
  const [uploadedBatches, setUploadedBatches] = useState<UploadedBatch[]>([])
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchImports = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/import-center-assign-exam')
      if (res.data?.success) {
        const batches = res.data.data.map((item: any) => ({
          importId: item._id,
          examName: item.examId?.examName || item.examId?.examTitle || 'Unknown Exam',
          count: item.centers?.length || 0,
          centers: item.centers || [],
          examStatus: item.examId?.status || 'UNKNOWN',
          isSentToCompanyAdmin: item.isSentToCompanyAdmin || false
        }))
        setUploadedBatches(batches)
      }
    } catch (err) {
      console.error('Failed to fetch imported batches:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initFetch = async () => {
      await fetchImports()
    }
    initFetch()
  }, [])

  const handleSuccess = () => {
    fetchImports()
  }

  const toggleRow = (importId: string) => {
    setExpandedRow(expandedRow === importId ? null : importId)
  }

  const handleSendToAdmin = async (importId: string) => {
    try {
      const res = await api.patch(`/import-center-assign-exam/${importId}/send`)
      if (res.data?.success) {
        await fetchImports()
      }
    } catch (err) {
      console.error('Failed to send to company admin:', err)
    }
  }

  return (
    <div className='space-y-6 p-6 max-w-7xl mx-auto text-slate-200'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-white'>
            Center Management (Govt Authority)
          </h1>
          <p className='text-slate-400 mt-1'>
            View, filter, and import centers for specific exams.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden md:flex border-[#2b303b] hover:bg-[#252a36]" onClick={fetchImports} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <ImportCenterModalGovt onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Filters Placeholder */}
      <div className='flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between bg-[#1e222d] p-4 rounded-md border border-[#2b303b]'>
        <div className='flex flex-1 items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0'>
          <div className='relative flex-1 min-w-[200px] max-w-xs'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-slate-400' />
            <Input
              placeholder='Search centers (Name, Code)...'
              className='pl-8 bg-[#13161c] border-[#2b303b] text-slate-200'
              disabled
            />
          </div>

          <Select disabled>
            <SelectTrigger className='w-[150px] bg-[#13161c] border-[#2b303b] text-slate-400'>
              <SelectValue placeholder='Exam' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Exams</SelectItem>
            </SelectContent>
          </Select>

          <Select disabled>
            <SelectTrigger className='w-[150px] bg-[#13161c] border-[#2b303b] text-slate-400'>
              <SelectValue placeholder='State' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All States</SelectItem>
            </SelectContent>
          </Select>

          <Select disabled>
            <SelectTrigger className='w-[130px] hidden lg:flex bg-[#13161c] border-[#2b303b] text-slate-400'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center gap-2 w-full sm:w-auto shrink-0'>
          <Button variant='outline' disabled className='border-[#2b303b] text-slate-400'>
            <SlidersHorizontal className='h-4 w-4 mr-2' />
            Advanced
          </Button>
        </div>
      </div>

      {/* Uploaded Batches Table */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48 border border-[#2b303b] rounded-md bg-[#1e222d]">
            <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
          </div>
        ) : uploadedBatches.length === 0 ? (
          <div className="flex justify-center items-center h-48 border border-[#2b303b] rounded-md bg-[#1e222d]">
            <p className="text-slate-400 text-sm">No centers imported yet. Click &quot;Import Center&quot; to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {uploadedBatches.map((batch) => (
              <div key={batch.importId} className="flex flex-col bg-[#1e222d] border border-[#2b303b] rounded-md overflow-hidden transition-all duration-300">
                {/* Header Row */}
                <div 
                  className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 cursor-pointer hover:bg-[#252a36]"
                  onClick={() => toggleRow(batch.importId)}
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${batch.examStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {batch.examStatus === 'ACTIVE' ? 'Active' : 'Inactive'}
                    </span>
                    <span className="font-medium text-white">{batch.examName}</span>
                    <span className="text-sm text-slate-400">{batch.count} Centers</span>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                    <Button 
                      size="sm" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-900/20 disabled:opacity-50"
                      disabled={batch.isSentToCompanyAdmin}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!batch.isSentToCompanyAdmin) {
                          handleSendToAdmin(batch.importId);
                        }
                      }}
                    >
                      {batch.isSentToCompanyAdmin ? (
                        'Sent to Admin'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send to company admin
                        </>
                      )}
                    </Button>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#13161c] transition-colors text-slate-500">
                      {expandedRow === batch.importId ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
                
                {/* Accordion Content */}
                {expandedRow === batch.importId && (
                  <div className="border-t border-[#2b303b] bg-[#13161c] p-4 animate-in slide-in-from-top-2 duration-300">
                    {batch.centers && batch.centers.length > 0 ? (
                      <div className="overflow-x-auto rounded-md border border-[#2b303b]">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-slate-300 uppercase bg-[#1e222d] border-b border-[#2b303b]">
                            <tr>
                              <th className="px-4 py-3 font-medium">Center Name</th>
                              <th className="px-4 py-3 font-medium">Center Code</th>
                              <th className="px-4 py-3 font-medium">City</th>
                              <th className="px-4 py-3 font-medium">State</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#2b303b] bg-[#13161c]">
                            {batch.centers.map((row, i) => (
                              <tr key={i} className="hover:bg-[#1e222d] transition-colors">
                                <td className="px-4 py-3 text-slate-200">{row.centerName}</td>
                                <td className="px-4 py-3 text-slate-400">{row.centerCode}</td>
                                <td className="px-4 py-3 text-slate-400">{row.city}</td>
                                <td className="px-4 py-3 text-slate-400">{row.state}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-sm text-center py-4">No center details found for this batch.</p>
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
