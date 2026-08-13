import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import type { Paper } from '../types'
import { Badge } from '@/shared/components/ui/badge'

interface PaperPreviewProps {
  paper: Paper
}

export const PaperPreview: React.FC<PaperPreviewProps> = ({ paper }) => {
  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='prose max-w-none text-slate-700'>
            {paper.instructions ? (
              <p>{paper.instructions}</p>
            ) : (
              <p className='italic text-slate-500'>No instructions provided.</p>
            )}
          </div>
          <div className='mt-4 flex flex-wrap gap-4 text-sm text-slate-600'>
            <div>
              Total Marks: <strong>{paper.totalMarks}</strong>
            </div>
            <div>
              Duration: <strong>{paper.duration} minutes</strong>
            </div>
            <div>
              Passing Marks: <strong>{paper.passingMarks}</strong>
            </div>
            <div>
              Negative Marking:{' '}
              <strong>{paper.negativeMarking ? `Yes (${paper.negativeMarks} marks)` : 'No'}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Questions ({paper.questions.length})</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {paper.questions.length === 0 ? (
            <div className='text-center text-slate-500 py-4'>No questions selected.</div>
          ) : (
            paper.questions.map((q, index) => (
              <div key={q.id} className='border-b pb-4 last:border-0 last:pb-0'>
                <div className='flex justify-between items-start mb-2'>
                  <div className='flex gap-3'>
                    <span className='font-bold text-slate-700'>Q{index + 1}.</span>
                    <span className='text-slate-800'>{q.text}</span>
                  </div>
                  <div className='text-sm font-medium text-slate-600 whitespace-nowrap ml-4'>
                    [{q.marks} Marks]
                  </div>
                </div>
                <div className='flex gap-2 ml-8 mt-2'>
                  <Badge variant='outline'>{q.type}</Badge>
                  <Badge variant='outline'>{q.difficulty}</Badge>
                  {q.topic && <Badge variant='secondary'>{q.topic}</Badge>}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
