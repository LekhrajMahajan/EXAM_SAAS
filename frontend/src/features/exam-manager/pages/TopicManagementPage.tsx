import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Search, Edit, Trash2, MinusCircle } from 'lucide-react'
import { Switch } from '@/shared/components/ui/switch'
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Card, CardContent } from '@/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Badge } from '@/shared/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { useUserStore } from '@/stores/user/user.store'
import { topicApi } from '../api/topic.api'
import { subjectApi } from '../api/subject.api'
import { chapterApi } from '../api/chapter.api'
import { examApi } from '../api/exam.api'
import type { Topic } from '../api/topic.api'
import type { Subject } from '../api/subject.api'
import type { AxiosError } from 'axios'
import { useFieldArray } from 'react-hook-form'

const formSchema = z.object({
  examId: z.string().min(1, 'Exam is required'),
  category: z.string().min(1, 'Category is required'),
  subjects: z
    .array(
      z.object({
        subjectName: z.string().min(1, 'Subject is required'),
        subjectCode: z.string().min(1, 'Subject Code is required'),
        topics: z.string().min(1, 'Topics are required'),
      }),
    )
    .min(1, 'At least one subject is required'),
  description: z.string().min(1, 'Description is required'),
})

type FormValues = z.infer<typeof formSchema>

const isExamLocked = (status?: string) => {
  if (!status) return false
  return status.toUpperCase() !== 'ACTIVE'
}

const getStatusBadgeConfig = (status?: string) => {
  if (!status) return { label: 'UNKNOWN', className: 'bg-slate-500 text-white' }
  const s = status.toUpperCase()
  const config: Record<string, { label: string; className: string }> = {
    ACTIVE: { label: 'ACTIVE', className: 'bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-[#E4FD97]' },
    DRAFT: { label: 'DRAFT', className: 'bg-slate-500 hover:bg-slate-600 text-white' },
    EXAM_STARTED: { label: 'EXAM STARTED', className: 'bg-amber-600 hover:bg-amber-700 text-white' },
    EXAM_ENDED: { label: 'EXAM ENDED', className: 'bg-red-600 hover:bg-red-700 text-white' },
    COMPLETED: { label: 'COMPLETED', className: 'bg-slate-600 hover:bg-slate-700 text-white' },
    RESULT_GENERATED: { label: 'RESULT GENERATED', className: 'bg-purple-600 hover:bg-purple-700 text-white' },
    CANCELLED: { label: 'CANCELLED', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    INACTIVE: { label: 'INACTIVE', className: 'bg-gray-400 hover:bg-gray-500 text-white' },
  }
  return config[s] || { label: s.replace(/_/g, ' '), className: 'bg-slate-500 text-white' }
}

const TopicsInput = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const topicsArray = value ? value.split(',').map(t => t.trim()).filter(Boolean) : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTopic = inputValue.trim();
      if (newTopic) {
        if (topicsArray.some(t => t.toLowerCase() === newTopic.toLowerCase())) {
          setErrorMsg(`Topic "${newTopic}" already exists!`);
          return;
        }
        const newTopics = [...topicsArray, newTopic];
        onChange(newTopics.join(', '));
        setInputValue('');
        setErrorMsg(null);
      }
    }
  };

  const removeTopic = (indexToRemove: number) => {
    const newTopics = topicsArray.filter((_, i) => i !== indexToRemove);
    onChange(newTopics.join(', '));
  };

  return (
    <div className="space-y-2">
      {topicsArray.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-slate-100 dark:bg-slate-900/40 rounded-md border border-slate-200 dark:border-slate-800">
          {topicsArray.map((topic, i) => (
            <Badge key={i} variant="outline" className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium shadow-sm">
              {topic}
              <button
                type="button"
                onClick={() => removeTopic(i)}
                className="text-red-500 hover:text-red-700 ml-1 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 w-4 h-4 transition-colors"
                title="Remove topic"
              >
                <MinusCircle className="w-3.5 h-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (errorMsg) setErrorMsg(null);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          const newTopic = inputValue.trim();
          if (newTopic) {
            if (topicsArray.some(t => t.toLowerCase() === newTopic.toLowerCase())) {
              setErrorMsg(`Topic "${newTopic}" already exists!`);
              return;
            }
            const newTopics = [...topicsArray, newTopic];
            onChange(newTopics.join(', '));
            setInputValue('');
            setErrorMsg(null);
          }
        }}
        placeholder='Type a topic and press Enter or Comma to add'
        className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400'
      />
      {errorMsg && (
        <p className="text-sm font-medium text-red-500 mt-1">{errorMsg}</p>
      )}
    </div>
  );
};

export const TopicManagementPage = () => {
  const { toast } = useToast()
  const profile = useUserStore((state) => state.profile)
  const [topics, setTopics] = useState<Topic[]>([])
  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [subjectsList, setSubjectsList] = useState<Subject[]>([])
  const [exams, setExams] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [editingExamId, setEditingExamId] = useState<string | null>(null)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])

  const getDisplayStatus = useCallback((exam: any) => {
    if (exam.displayStatus) return exam.displayStatus
    if ((exam as any).isResultPublished) return 'RESULT_GENERATED'
    if (['COMPLETED', 'CANCELLED', 'ARCHIVED', 'EXAM_ENDED', 'RESULT_GENERATED'].includes(exam.status)) return exam.status

    if (exam.status === 'ACTIVE' || exam.status === 'EXAM_STARTED') {
      try {
        const examDate = new Date(exam.examDate)
        const [startH, startM] = (exam.startTime || '').split(':').map(Number)
        if (isNaN(startH) || isNaN(startM)) return exam.status
        const startDT = new Date(examDate)
        startDT.setHours(startH, startM, 0, 0)

        const [endH, endM] = (exam.endTime || '').split(':').map(Number)
        if (!isNaN(endH) && !isNaN(endM)) {
          const endDT = new Date(examDate)
          endDT.setHours(endH, endM, 0, 0)
          if (now >= endDT) return 'EXAM_ENDED'
          if (now >= startDT) return 'EXAM_STARTED'
        } else {
          if (now >= startDT) return 'EXAM_STARTED'
        }
      } catch {
        // fallback
      }
    }
    return exam.status
  }, [now])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      examId: '',
      category: '',
      subjects: [{ subjectName: '', subjectCode: '', topics: '' }],
      description: '',
    },
  })

  const watchSubjects = form.watch('subjects')
  const endOfListRef = useRef<HTMLDivElement>(null)

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subjects',
  })

  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true)
      
      // If no exams yet, fallback to global fetch
      if (!exams || exams.length === 0) {
        const res = await topicApi.getAll({ search, limit: 1000 })
        if (res.success) {
          setTopics(res.data.topics || [])
        }
        return
      }

      // Approach 1: Fetch topics exam-wise
      const promises = exams.map((exam) => 
        topicApi.getAll({ search, limit: 500, examId: exam._id })
      )
      
      // Fetch global topics (topics not bound to a specific exam) - we use limit=500 for global topics too. 
      // In the backend, if examId is not passed, it fetches ALL topics, so we might get some overlap here,
      // but `setTopics` will deduplicate them below if needed, or we just rely on `groupedData` logic.
      // Actually, since backend returns all topics when examId is omitted, we just use the global fetch.
      // Fetch global topics (topics not bound to a specific exam) by passing examId: 'null'
      promises.push(topicApi.getAll({ search, limit: 500, examId: 'null' }))

      const results = await Promise.all(promises)
      let allTopics: any[] = []
      
      results.forEach((res) => {
        if (res.success && res.data?.topics) {
          allTopics = [...allTopics, ...res.data.topics]
        }
      })
      
      // Deduplicate topics by _id in case the global fetch overlaps with exam-specific fetches
      const uniqueTopics = Array.from(new Map(allTopics.map(t => [t._id, t])).values())
      setTopics(uniqueTopics)
      
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch topics', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }, [search, exams, toast])

  const watchExamId = form.watch('examId')

  useEffect(() => {
    if (watchExamId) {
      const selectedExam = exams.find((e) => e._id === watchExamId)
      if (selectedExam && selectedExam.subjects) {
        setSubjectsList(
          selectedExam.subjects.map(
            (s: any) => {
              const realSubject = allSubjects.find(sub => sub.subjectName === s.name)
              return realSubject || ({
                _id: s.name,
                subjectName: s.name,
                subjectCode: '',
              } as Subject)
            }
          ),
        )
      } else {
        setSubjectsList([])
      }
    } else {
      setSubjectsList([])
    }
  }, [watchExamId, exams, allSubjects])

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await subjectApi.getAll({ limit: 1000 })
      if (res.success) {
        setAllSubjects(res.data.subjects || [])
      }
    } catch (error) {
      // Handle error quietly
    }
  }, [])

  const fetchExams = useCallback(async () => {
    try {
      const res = await examApi.getAll({ limit: 100 })
      if (res.success) {
        setExams(res.data.exams || [])
      }
    } catch (error) {
      // Handle error quietly
    }
  }, [])

  useEffect(() => {
    fetchTopics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchExams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchSubjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEditAll = (exam: any, subjects: any[]) => {
    setEditingExamId(exam._id)

    const formSubjects = subjects.map((sub) => {
      const matchingSub = allSubjects.find((s) => s.subjectName === sub.subjectName)
      
      // Only use topics that belong to THIS specific exam
      const examSpecificTopics = sub.topics.filter((t: any) => {
        const tExamId = (t.examId as any)?._id || t.examId
        return tExamId === exam._id || tExamId?.toString() === exam._id?.toString()
      })
      
      return {
        subjectName: matchingSub ? matchingSub._id : sub.subjectName,
        subjectCode: matchingSub ? matchingSub.subjectCode : '',
        topics: examSpecificTopics.map((t: any) => t.topicName).join(', '),
      }
    })

    if (formSubjects.length === 0) {
      formSubjects.push({ subjectName: '', subjectCode: '', topics: '' })
    }

    form.reset({
      examId: exam._id,
      category: exam.examCategory || '',
      subjects: formSubjects,
      description: exam.description || '',
    })

    setIsDialogOpen(true)
  }

  const handleRemoveAll = async (exam: any, subjects: any[]) => {
    if (
      confirm(
        `Are you sure you want to remove all topics for "${exam.examName || exam.examTitle}"?`,
      )
    ) {
      try {
        const topicsToDelete = subjects.flatMap((s) => s.topics)
        await Promise.all(topicsToDelete.map((t) => topicApi.delete(t._id)))
        toast({
          title: 'Success',
          description: 'All topics removed successfully',
          variant: 'success',
        })
        fetchTopics()
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to remove some topics',
          variant: 'destructive',
        })
      }
    }
  }

  const onSubmit = async (values: FormValues) => {
    const failedTopics: string[] = []
    try {
      if (!profile?.companyId) {
        toast({ title: 'Error', description: 'Company ID not found', variant: 'destructive' })
        return
      }

      const companyId = profile.companyId
      const now = Date.now()

      if (editingExamId) {
        const existingExamGroup = groupedData.examGroups.find((g) => g.exam._id === editingExamId)
        // Only get topics that SPECIFICALLY belong to this exam (by examId)
        const existingTopics = existingExamGroup
          ? existingExamGroup.subjects.flatMap((s) => s.topics).filter((t) => {
              const tExamId = (t.examId as any)?._id || t.examId
              return tExamId === editingExamId || tExamId?.toString() === editingExamId
            })
          : []
        const topicNamesToKeep = new Set<string>()
        const newTopicsToCreate = []

        for (const block of values.subjects) {
          if (!block.subjectName || !block.topics) continue

          const matchingSub = subjectsList.find((s) => s._id === block.subjectName)
          const actualSubjectName = matchingSub ? matchingSub.subjectName : block.subjectName
          const topicNames = block.topics
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0)

          let count = 1
          for (const topicName of topicNames) {
            // Match by topicName + subject + THIS exam only
            const existingTopic = existingTopics.find((t) => {
              const tSubName = t.subjectId?.subjectName || t.subjectName
              return tSubName === actualSubjectName && t.topicName === topicName
            })

            if (existingTopic) {
              topicNamesToKeep.add(existingTopic._id)
            } else {
              const uniqueSuffix = `${count}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
              const prefix = block.subjectCode ? block.subjectCode.substring(0, 28 - uniqueSuffix.length) : 'TOPIC'
              const payload: any = {
                companyId,
                examId: editingExamId,
                subjectName: actualSubjectName,
                topicName,
                topicCode: `${prefix}-${uniqueSuffix}`.toUpperCase(),
                topicNumber: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 10000),
                displayOrder: count,
                description: values.description,
              }
              if (/^[0-9a-fA-F]{24}$/.test(block.subjectName)) {
                payload.subjectId = block.subjectName
              }
              newTopicsToCreate.push(payload)
            }
            count++
          }
        }

        // Only delete topics that belong to THIS exam
        const topicsToDelete = existingTopics.filter((t) => !topicNamesToKeep.has(t._id))
        for (const t of topicsToDelete) {
          await topicApi.delete(t._id)
        }
        for (const payload of newTopicsToCreate) {
          try {
            await topicApi.create(payload)
          } catch (error: any) {
            if (error.response?.status === 409) {
              failedTopics.push(payload.topicName)
            } else {
              throw error
            }
          }
        }
      } else {
        const payloads = []
        for (const block of values.subjects) {
          if (!block.subjectName || !block.topics) continue

          const matchingSub = subjectsList.find((s) => s._id === block.subjectName)
          const actualSubjectName = matchingSub ? matchingSub.subjectName : block.subjectName

          const topicNames = block.topics
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
          let count = 1
          for (const topicName of topicNames) {
            const uniqueSuffix = `${count}${Math.random().toString(36).substring(2, 6).toUpperCase()}`
            const prefix = block.subjectCode ? block.subjectCode.substring(0, 28 - uniqueSuffix.length) : 'TOPIC'
            const payload: any = {
              companyId,
              examId: values.examId,
              subjectName: actualSubjectName,
              topicName,
              topicCode: `${prefix}-${uniqueSuffix}`.toUpperCase(),
              topicNumber: Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 10000),
              displayOrder: count,
              description: values.description,
            }
            if (/^[0-9a-fA-F]{24}$/.test(block.subjectName)) {
              payload.subjectId = block.subjectName
            }
            payloads.push(payload)
            count++
          }
        }
        for (const p of payloads) {
          try {
            await topicApi.create(p)
          } catch (error: any) {
            if (error.response?.status === 409) {
              failedTopics.push(p.topicName)
            } else {
              throw error
            }
          }
        }
      }

      if (failedTopics.length > 0) {
        toast({
          title: 'Partial Success',
          description: `Saved successfully, but these topics already exist and were ignored: ${failedTopics.join(', ')}`,
          variant: 'default',
        })
      } else {
        toast({
          title: 'Success',
          description: editingExamId ? 'Topics updated successfully' : 'Topics created successfully',
          variant: 'success',
        })
      }
      
      setIsDialogOpen(false)
      setEditingExamId(null)
      form.reset()
      fetchTopics()
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to process topics',
        variant: 'destructive',
      })
    }
  }

  const groupedData = React.useMemo(() => {
    const examGroups: { exam: any; subjects: { subjectName: string; topics: Topic[] }[] }[] = []
    const usedTopicIds = new Set<string>()

    exams.forEach((exam) => {
      const examSubjects: { subjectName: string; topics: Topic[] }[] = []
      if (exam.subjects) {
        exam.subjects.forEach((sub: any) => {
          // Filter by BOTH examId AND subjectName to isolate per-exam topics
          const subjectTopics = topics.filter((t) => {
            const tSubjectName = t.subjectId?.subjectName || t.subjectName
            const tExamId = (t.examId as any)?._id || t.examId
            const matchesSubject = tSubjectName === sub.name
            const matchesExam = tExamId === exam._id || tExamId?.toString() === exam._id?.toString()
            return matchesSubject && matchesExam
          })
          subjectTopics.forEach((t) => usedTopicIds.add(t._id))
          examSubjects.push({
            subjectName: sub.name,
            topics: subjectTopics,
          })
        })
      }
      examGroups.push({
        exam,
        subjects: examSubjects,
      })
    })

    const otherTopics = topics.filter((t) => !usedTopicIds.has(t._id))

    return { examGroups, otherTopics }
  }, [exams, topics])

  const handleDeleteTopic = async (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await topicApi.delete(id)
        toast({ title: 'Success', description: 'Topic deleted successfully', variant: 'success' })
        fetchTopics()
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete topic', variant: 'destructive' })
      }
    }
  }

  return (
    <div className='p-6 max-w-7xl mx-auto space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Topics</h1>
          <p className='text-muted-foreground'>Manage topics for chapters</p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setEditingExamId(null)
              form.reset({
                examId: '',
                category: '',
                subjects: [{ subjectName: '', subjectCode: '', topics: '' }],
                description: '',
              })
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-white dark:bg-slate-900 text-primary dark:text-slate-200 border-primary dark:border-slate-700 hover:bg-primary dark:hover:bg-slate-800 hover:text-white dark:hover:text-slate-100">
              <Plus className='mr-2 h-4 w-4' /> Create Topic
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle className="text-slate-900 dark:text-slate-100">{editingExamId ? 'Edit Topics' : 'Create New Topic'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='examId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Exam</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'>
                              <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exams.map((exam) => (
                              <SelectItem key={exam._id} value={exam._id}>
                                <div className="flex items-center gap-2">
                                  {exam.examCode} - {exam.examTitle}
                                  <ExamStatusBadge exam={exam} className="ml-2" />
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='e.g. Science'
                            className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='space-y-4'>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className='p-4 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/50 space-y-4'
                    >
                      <div className='flex justify-between items-center'>
                        <h4 className='text-sm font-medium text-slate-900 dark:text-slate-100'>Subject {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='text-red-500 hover:text-red-400'
                            onClick={() => remove(index)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        )}
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.subjectName`}
                          render={({ field: fProps }) => (
                            <FormItem>
                              <FormLabel>Subject Name</FormLabel>
                              <Select
                                onValueChange={(val) => {
                                  fProps.onChange(val)
                                  const selectedSubject = subjectsList.find((s) => s._id === val)
                                  if (selectedSubject && selectedSubject.subjectCode) {
                                    form.setValue(`subjects.${index}.subjectCode`, selectedSubject.subjectCode)
                                  }
                                }}
                                defaultValue={fProps.value}
                                disabled={!watchExamId}
                              >
                                <FormControl>
                                  <SelectTrigger className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100'>
                                    <SelectValue placeholder='Select Subject' />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjectsList
                                    .filter(
                                      (sub) =>
                                        !watchSubjects?.some(
                                          (ws, i) => ws.subjectName === sub._id && i !== index,
                                        ),
                                    )
                                    .map((sub) => (
                                      <SelectItem key={sub._id} value={sub._id}>
                                        {sub.subjectName}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.subjectCode`}
                          render={({ field: fProps }) => (
                            <FormItem>
                              <FormLabel>Subject Code</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder='e.g. SUB-01'
                                  className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400'
                                  {...fProps}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.topics`}
                          render={({ field: fProps }) => (
                            <FormItem className='md:col-span-2'>
                              <FormLabel>Topics (Comma Separated)</FormLabel>
                              <FormControl>
                                <TopicsInput
                                  value={fProps.value}
                                  onChange={fProps.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  <div ref={endOfListRef} />
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100'
                    onClick={() => {
                      append({ subjectName: '', subjectCode: '', topics: '' })
                      setTimeout(() => {
                        endOfListRef.current?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                  >
                    <Plus className='mr-2 h-4 w-4' /> Add Subject
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Description...'
                          className='bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className='flex justify-end gap-2'>
                  <Button type='button' variant='outline' className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type='submit'>{editingExamId ? 'Save Changes' : 'Create Topic'}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex gap-4 mb-6'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search topics...'
            className='pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center p-8 text-muted-foreground'>Loading topics...</div>
      ) : (
        <div className='space-y-8'>
          {groupedData.examGroups.map(({ exam, subjects }) => (
            <Card key={exam._id} className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 overflow-hidden'>
              <div className='p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50 flex justify-between items-center'>
                <div>
                  <div className='flex items-center gap-2'>
                    <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>
                      {exam.examName || exam.examTitle}
                    </h2>
                    {exam && (
                      <ExamStatusBadge exam={exam} className="text-[10px] py-0 h-5" />
                    )}
                  </div>
                  {exam.description && (
                    <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>{exam.description}</p>
                  )}
                </div>
                <div className='flex items-center gap-3'>
                  <Badge
                    variant='secondary'
                    className='bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  >
                    {subjects.length} Subjects
                  </Badge>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50'
                    onClick={() => handleEditAll(exam, subjects)}
                    disabled={isExamLocked(getDisplayStatus(exam))}
                    title={isExamLocked(getDisplayStatus(exam)) ? "Cannot edit topics for a locked exam" : ""}
                  >
                    Edit All
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50'
                    onClick={() => handleRemoveAll(exam, subjects)}
                    disabled={isExamLocked(getDisplayStatus(exam))}
                    title={isExamLocked(getDisplayStatus(exam)) ? "Cannot remove topics for a locked exam" : ""}
                  >
                    Remove All
                  </Button>
                </div>
              </div>
              <CardContent className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                  {subjects.map(({ subjectName, topics: subjectTopics }, idx) => (
                    <Card key={idx} className='bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm'>
                      <div className='p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center'>
                        <div>
                          <h3 className='font-medium text-slate-800 dark:text-slate-200'>{subjectName}</h3>
                        </div>
                        <Badge
                          variant='outline'
                          className='text-xs bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        >
                          {subjectTopics.length} Topics
                        </Badge>
                      </div>
                      <div className='p-4'>
                        <div className='flex flex-wrap gap-2'>
                          {subjectTopics.length > 0 ? (
                            subjectTopics.map((t) => (
                              <Badge
                                key={t._id}
                                variant='secondary'
                                className='bg-[#f4fccf] dark:bg-[#d6ec67]/10 text-[#1c4524] dark:text-[#d6ec67] hover:bg-[#e0f291] dark:hover:bg-[#d6ec67] dark:hover:text-[#133018] font-medium px-2.5 py-1 border border-transparent dark:border-[#d6ec67]/20 dark:hover:border-[#bed647] transition-colors'
                              >
                                {t.topicName}
                              </Badge>
                            ))
                          ) : (
                            <span className='text-sm text-slate-500 italic'>
                              No topics assigned
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {groupedData.otherTopics.length > 0 && (
            <Card className='bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 overflow-hidden'>
              <div className='p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50'>
                <h2 className='text-xl font-semibold text-slate-900 dark:text-slate-100'>Other Subjects</h2>
                <p className='text-sm text-slate-500 dark:text-slate-400 mt-1'>
                  Topics not associated with any exam&apos;s subjects
                </p>
              </div>
              <CardContent className='p-6'>
                <div className='flex flex-wrap gap-2'>
                  {groupedData.otherTopics.map((t) => (
                    <Badge
                      key={t._id}
                      variant='secondary'
                      className='bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 font-normal px-2.5 py-1'
                    >
                      {t.topicName} {t.subjectName ? `(${t.subjectName})` : ''}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {groupedData.examGroups.length === 0 && groupedData.otherTopics.length === 0 && (
            <div className='text-center p-12 text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50'>
              No topics found. Create a topic to get started.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
