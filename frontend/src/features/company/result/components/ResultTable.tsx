import React, { useMemo } from 'react'
import type { CandidateResult } from '../types'
import { GradeBadge } from './GradeBadge'
import { Button } from '@/shared/components/ui/button'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/shared/components/ui/accordion'
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge'

interface ResultTableProps {
  results: CandidateResult[]
}

export function ResultTable ({ results }: ResultTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Generated':
      case 'EVALUATED':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90 text-xs font-semibold uppercase tracking-wide'>
            Generated
          </span>
        )
      case 'Published':
      case 'PUBLISHED':
        return (
          <span className='px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200'>
            Published
          </span>
        )
      default:
        return (
          <span className='px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200'>
            {status}
          </span>
        )
    }
  }

  const groupedResults = useMemo(() => {
    const map = new Map<string, { examName: string; candidates: CandidateResult[]; examObj?: any }>()
    for (const res of results) {
      const key = res.exam
      if (!map.has(key)) {
        map.set(key, { examName: res.exam || 'Unknown Exam', candidates: [], examObj: res.examObj })
      }
      map.get(key)!.candidates.push(res)
    }
    return Array.from(map.values())
  }, [results])

  if (results.length === 0) {
    return (
      <div className='text-center p-12 bg-muted/50 border border-border border-dashed rounded-xl'>
        <p className='text-muted-foreground'>No results found.</p>
      </div>
    )
  }

  return (
    <div className='bg-card rounded-lg border border-border shadow-sm'>
      <Accordion
        type='multiple'
        className='w-full'
        defaultValue={groupedResults.map((_, i) => `item-${i}`)}
      >
        {groupedResults.map((group, index) => (
          <AccordionItem value={`item-${index}`} key={group.examName} className='border-b-0'>
            <AccordionTrigger className='px-6 py-4 hover:bg-muted/50 bg-muted/20 data-[state=open]:border-b border-border'>
              <div className='flex items-center gap-3'>
                {group.examObj ? (
                  <ExamStatusBadge exam={group.examObj} />
                ) : null}
                <span className='font-semibold text-base'>{group.examName}</span>
                <span className='px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium'>
                  {group.candidates.length} Candidate{group.candidates.length !== 1 ? 's' : ''}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className='p-0 border-b border-border'>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm text-left text-muted-foreground'>
                  <thead className='text-xs text-foreground uppercase bg-muted/50 border-b border-border'>
                    <tr>
                      <th scope='col' className='px-6 py-4'>
                        Application No.
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        Candidate Name
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        Marks Obtained
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        Total Marks
                      </th>
                      <th scope='col' className='px-6 py-4'>
                        Status
                      </th>
                      <th scope='col' className='px-6 py-4 text-right'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.candidates.map((res) => (
                      <tr
                        key={res.id}
                        className='border-b last:border-0 border-border hover:bg-muted/50 transition-colors'
                      >
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='font-mono text-foreground'>{res.applicationNumber}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='font-semibold text-foreground'>{res.candidateName}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='font-bold text-foreground'>
                            {typeof res.marksObtained === 'number' && res.marksObtained % 1 !== 0
                              ? res.marksObtained.toFixed(2)
                              : res.marksObtained}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='font-medium text-muted-foreground'>
                            {typeof res.totalMarks === 'number' && res.totalMarks % 1 !== 0
                              ? res.totalMarks.toFixed(2)
                              : res.totalMarks}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          {getStatusBadge(res.status)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right'>
                          <Button variant="outline" size="sm" className="bg-white border border-slate-200 text-slate-900 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 transition-colors" asChild>
                            <Link to={`/company/results/${res.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
