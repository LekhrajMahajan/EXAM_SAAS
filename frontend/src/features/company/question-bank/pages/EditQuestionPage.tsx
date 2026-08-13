import { useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/components/layout/page-header'
import { QuestionForm } from '../components/QuestionForm'
import { useQuestionDetail } from '../hooks/question.hooks'
import { Loader2 } from 'lucide-react'
import type { Question } from '../types'

export function EditQuestionPage () {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQuestionDetail(id || '')

  const question = data?.data as Question | undefined

  if (isLoading || !question) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <div className='space-y-6 max-w-5xl mx-auto'>
      <PageHeader
        title={`Edit Question: ${question.id}`}
        description='Modify the existing question details.'
      />
      <QuestionForm initialData={question} isEditing={true} questionId={id} />
    </div>
  )
}

