import React, { useEffect, useState, useMemo } from 'react'
import { PageHeader } from '@/shared/components/layout/page-header'
import { StatisticsGrid } from '../components/StatisticsGrid'
import { ResultTable } from '../components/ResultTable'
import { Button } from '@/shared/components/ui/button'
import { Link } from 'react-router-dom'
import { PlusCircle, Search, Download } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { apiClient } from '@/core/api/http/axios-client'
import type { CandidateResult } from '../types'
import { toast } from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ExportResultsModal } from '../components/ExportResultsModal'

const EMPTY_STATS = {
  totalResults: 0,
  publishedResults: 0,
  pendingResults: 0,
  failedResults: 0,
  averageScore: 0,
  highestScore: 0,
  lowestScore: 0,
  passPercentage: 0,
}

export function ResultDashboardPage () {
  const [stats, setStats] = useState(EMPTY_STATS)
  const [results, setResults] = useState<CandidateResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedExam, setSelectedExam] = useState<string>("All Exams")
  const [searchQuery, setSearchQuery] = useState("")
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  const uniqueExams = useMemo(() => {
    const examsMap = new Map<string, { id: string, name: string }>()
    results.forEach(r => {
      const examId = r.examObj?._id || r.examObj?.id || r.exam;
      if (r.exam && examId) {
        examsMap.set(r.exam, { id: examId, name: r.exam })
      }
    })
    return Array.from(examsMap.values())
  }, [results])

  const filteredResults = useMemo(() => {
    return results.filter(r => {
      const matchesExam = selectedExam === "All Exams" || r.exam === selectedExam;
      const matchesSearch = !searchQuery || 
        r.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        r.applicationNumber?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesExam && matchesSearch;
    })
  }, [results, selectedExam, searchQuery])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        // Fetch stats
        const statsRes = await apiClient.get('/results/dashboard')
        if (statsRes.data?.data) {
          const d = statsRes.data.data
          setStats({
            totalResults: d.totalCandidates || 0,
            publishedResults: d.publishedResults || 0,
            pendingResults: d.pendingResults || 0,
            failedResults: d.failCandidates || 0,
            averageScore: d.averageScore || 0,
            highestScore: d.highestScore || 0,
            lowestScore: d.lowestScore || 0,
            passPercentage: d.totalCandidates
              ? Math.round(((d.passCandidates || 0) / d.totalCandidates) * 100)
              : 0,
          })
        }

        // Fetch recent results (or all results for the table)
        const resultsRes = await apiClient.get('/results')
        if (resultsRes.data?.data) {
          setResults(resultsRes.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className='p-6 space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <PageHeader
          title='Result Management Dashboard'
          description='Overview of result generation, publications, and candidate performance.'
        />
        <div className='flex items-center gap-2'>
          <Button 
            variant="outline" 
            className="bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className='w-4 h-4 mr-2' />
            Export
          </Button>
          <Button variant="outline" className="bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors" asChild>
            <Link to="/company/results/publish">Publish Results</Link>
          </Button>
          <Button variant="outline" className="bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors" asChild>
            <Link to="/company/results/generate">
              <PlusCircle className='w-4 h-4 mr-2' />
              Generate Results
            </Link>
          </Button>
        </div>
      </div>

      <StatisticsGrid stats={stats} />

      <div className='space-y-4'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <h3 className='text-lg font-bold text-foreground'>Recently Generated Results</h3>
          <div className='flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto'>
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-full sm:w-[220px] bg-white dark:bg-[#16191F] border-slate-200 dark:border-slate-800">
                <SelectValue placeholder="All Exams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Exams">All Exams</SelectItem>
                {uniqueExams.map((exam) => (
                  <SelectItem key={exam.id} value={exam.name}>{exam.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
              <Input 
                placeholder='Search candidates...' 
                className='pl-9 bg-card' 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className='text-center p-12 bg-muted/50 border border-border border-dashed rounded-xl'>
            <p className='text-muted-foreground'>Loading results...</p>
          </div>
        ) : (
          <ResultTable results={filteredResults} />
        )}
      </div>

      <ExportResultsModal 
        open={isExportModalOpen} 
        onOpenChange={setIsExportModalOpen} 
        uniqueExams={uniqueExams} 
      />
    </div>
  )
}
