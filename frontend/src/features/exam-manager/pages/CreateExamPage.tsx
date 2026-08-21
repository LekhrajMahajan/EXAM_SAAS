import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { Switch } from '@/shared/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useUserStore } from '@/stores/user/user.store'
import { examApi } from '../api/exam.api'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import type { AxiosError } from 'axios'

const formSchema = z.object({
  requirementBody: z.string().min(1, 'Requirement Body is required'),
  customRequirementBody: z.string().optional(),
  department: z.string().min(2, 'Department name is required').max(100),
  examCategory: z.string().min(1, 'Exam category is required'),
  examType: z.string().min(1, 'Exam type is required'),
  examMode: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']),
  examDate: z.string().min(1, 'Exam Date is required'),
  shift: z.string().min(1, 'Shift is required'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time (HH:MM)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time (HH:MM)'),
  duration: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  totalMarks: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  passingMarks: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  negativeMarks: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  language: z.string().min(1, 'Language is required'),
  instructions: z.string().optional(),
  subjects: z
    .array(
      z.object({
        name: z.string().min(1, 'Subject name required'),
        questions: z.union([z.string(), z.number()]).transform((v) => Number(v)),
      }),
    )
    .min(1, 'At least one subject is required'),
  faceDetectionEnabled: z.boolean().default(false),
  faceDetectionLimit: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  multipleFacesEnabled: z.boolean().default(false),
  multipleFacesLimit: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  proctoringWarningEnabled: z.boolean().default(false),
  proctoringWarningLimit: z.union([z.string(), z.number()]).transform((v) => Number(v)),
  tabSwitchingEnabled: z.boolean().default(false),
  shuffleSubjects: z.boolean().default(false),
  shuffleQuestions: z.boolean().default(false),
})

type FormValues = {
  requirementBody: string
  customRequirementBody?: string
  department: string
  examCategory: string
  examType: string
  examMode: 'ONLINE' | 'OFFLINE' | 'HYBRID'
  examDate: string
  shift: string
  startTime: string
  endTime: string
  duration: number | string
  totalMarks: number | string
  passingMarks: number | string
  negativeMarks: number | string
  language: string
  instructions?: string
  subjects: { name: string; questions: number | string }[]
  faceDetectionEnabled: boolean
  faceDetectionLimit: number | string
  multipleFacesEnabled: boolean
  multipleFacesLimit: number | string
  proctoringWarningEnabled: boolean
  proctoringWarningLimit: number | string
  tabSwitchingEnabled: boolean
  shuffleSubjects: boolean
  shuffleQuestions: boolean
}

export const CreateExamPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const profile = useUserStore((state) => state.profile)
  const [isFetching, setIsFetching] = useState(false)

  const [faceDetectionUnit, setFaceDetectionUnit] = useState<'sec' | 'min'>('sec')
  const [multipleFacesUnit, setMultipleFacesUnit] = useState<'sec' | 'min'>('sec')

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      requirementBody: '',
      customRequirementBody: '',
      department: '',
      examCategory: '',
      examType: '',
      examMode: 'ONLINE',
      examDate: '',
      shift: '',
      startTime: '',
      endTime: '',
      duration: '',
      totalMarks: '',
      passingMarks: '',
      negativeMarks: '',
      language: 'English',
      instructions: '',
      subjects: [{ name: '', questions: '' }],
      faceDetectionEnabled: false,
      faceDetectionLimit: 15,
      multipleFacesEnabled: false,
      multipleFacesLimit: 15,
      proctoringWarningEnabled: false,
      proctoringWarningLimit: 3,
      tabSwitchingEnabled: false,
      shuffleSubjects: false,
      shuffleQuestions: false,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subjects',
  })

  const watchRequirementBody = form.watch('requirementBody')
  const watchStartTime = form.watch('startTime')
  const watchEndTime = form.watch('endTime')

  // When loading an existing exam (edit mode), we set this to true so the
  // startTime watcher does NOT overwrite the saved shift value from the DB.
  const skipShiftAutoFillRef = React.useRef(false)

  useEffect(() => {
    const parseTime = (value: string) => {
      const match = value?.match(/^(\d{2}):(\d{2})$/)
      if (!match) return null
      return Number(match[1]) * 60 + Number(match[2])
    }
    const start = parseTime(watchStartTime)
    const end = parseTime(watchEndTime)

    if (watchStartTime && !skipShiftAutoFillRef.current) {
      const hour = parseInt(watchStartTime.split(':')[0], 10)
      if (hour >= 7 && hour < 12) {
        form.setValue('shift', 'Morning Shift', { shouldValidate: true })
      } else if (hour >= 12 && hour < 17) {
        form.setValue('shift', 'Afternoon Shift', { shouldValidate: true })
      } else {
        form.setValue('shift', 'Evening Shift', { shouldValidate: true })
      }
    }
    // Reset the skip flag so future manual time changes update shift normally
    skipShiftAutoFillRef.current = false

    if (start === null || end === null) {
      form.setValue('duration', 0, { shouldValidate: true })
      return
    }
    const minutes = end >= start ? end - start : end + 24 * 60 - start
    form.setValue('duration', minutes, { shouldValidate: true })
  }, [watchStartTime, watchEndTime, form])

  useEffect(() => {
    if (id) {
      const fetchExam = async () => {
        setIsFetching(true)
        try {
          const res = await examApi.getById(id)
          if (res.success) {
            const data = res.data
            // Best effort mapping for existing exams
            const reqBody = data.examTitle?.split(' - ')[0] || 'Custom'
            const isKnownReqBody = [
              'Union Public Service Commission (UPSC)',
              'Staff Selection Commission (SSC)',
              'Railway Recruitment Board (RRB)',
              'Institute of Banking Personnel Selection (IBPS)',
              'Gujarat Public Service Commission (GPSC)',
              'Gujarat State Subordinate Service Selection Board (GSSSB)',
              'Gujarat State Police Recruitment Board (GPRB)',
              'Reserve Bank of India (RBI)',
              'NABARD',
              'State Bank of India (SBI)',
            ].includes(reqBody)

            let fdLimit = data.securitySettings?.faceDetectionLimit ?? 15
            let fdUnit: 'sec' | 'min' = 'sec'
            if (fdLimit > 0 && fdLimit % 60 === 0) {
              fdUnit = 'min'
              fdLimit = fdLimit / 60
            }
            setFaceDetectionUnit(fdUnit)

            let mfLimit = data.securitySettings?.multipleFacesLimit ?? 15
            let mfUnit: 'sec' | 'min' = 'sec'
            if (mfLimit > 0 && mfLimit % 60 === 0) {
              mfUnit = 'min'
              mfLimit = mfLimit / 60
            }
            setMultipleFacesUnit(mfUnit)

            // If shift is missing from DB, calculate dynamically based on startTime
            let initialShift = data.shift || '';
            if (!initialShift && data.startTime) {
              const hour = parseInt(data.startTime.split(':')[0], 10)
              if (hour >= 7 && hour < 12) {
                initialShift = 'Morning Shift'
              } else if (hour >= 12 && hour < 17) {
                initialShift = 'Afternoon Shift'
              } else {
                initialShift = 'Evening Shift'
              }
            }

            // Prevent the startTime watcher from overwriting the saved shift
            skipShiftAutoFillRef.current = true
            form.reset({
              requirementBody: isKnownReqBody ? reqBody : 'Custom',
              customRequirementBody: isKnownReqBody ? '' : reqBody,
              department: data.examTitle?.split(' - ')[1] || '',
              examCategory: data.examCategory || '',
              examType: data.examType || '',
              examMode: (data.examMode as any) || 'ONLINE',
              examDate: data.examDate ? new Date(data.examDate).toISOString().split('T')[0] : '',
              shift: initialShift,
              startTime: data.startTime || '',
              endTime: data.endTime || '',
              duration: data.duration || '',
              totalMarks: data.totalMarks || '',
              passingMarks: data.passingMarks || '',
              negativeMarks: data.negativeMarks || '',
              language: data.language || 'English',
              instructions: data.instructions || '',
              subjects:
                data.subjects && data.subjects.length > 0
                  ? data.subjects.map((s: any) => ({ name: s.name, questions: s.questions }))
                  : [{ name: '', questions: '' }],
              faceDetectionEnabled: data.securitySettings?.faceDetectionEnabled ?? false,
              faceDetectionLimit: fdLimit,
              multipleFacesEnabled: data.securitySettings?.multipleFacesEnabled ?? false,
              multipleFacesLimit: mfLimit,
              proctoringWarningEnabled: data.securitySettings?.proctoringWarningEnabled ?? false,
              proctoringWarningLimit: data.securitySettings?.proctoringWarningLimit ?? 3,
              tabSwitchingEnabled: data.securitySettings?.tabSwitchingEnabled ?? false,
              shuffleSubjects: data.shuffleSubjects ?? false,
              shuffleQuestions: data.shuffleQuestions ?? false,
            })
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch exam details',
            variant: 'destructive',
          })
        } finally {
          setIsFetching(false)
        }
      }
      fetchExam()
    }
  }, [id, form, toast])

  const onSubmit = async (values: FormValues) => {
    try {
      if (!profile?.companyId) {
        toast({ title: 'Error', description: 'Company ID not found', variant: 'destructive' })
        return
      }

      const finalRequirementBody =
        values.requirementBody === 'Custom'
          ? values.customRequirementBody || 'Custom'
          : values.requirementBody

      const {
        requirementBody,
        customRequirementBody,
        department,
        faceDetectionEnabled: _fde,
        faceDetectionLimit: _fdl,
        multipleFacesEnabled: _mfe,
        multipleFacesLimit: _mfl,
        proctoringWarningEnabled: _pwe,
        proctoringWarningLimit: _pwl,
        tabSwitchingEnabled: _tse,
        ...restValues
      } = values

      const payload = {
        ...restValues,
        duration: Number(values.duration) || 0,
        totalMarks: Number(values.totalMarks),
        passingMarks: Number(values.passingMarks),
        negativeMarks: Number(values.negativeMarks),
        companyId: profile.companyId,
        securitySettings: {
          faceDetectionEnabled: values.faceDetectionEnabled,
          faceDetectionLimit:
            (faceDetectionUnit === 'min'
              ? Number(values.faceDetectionLimit) * 60
              : Number(values.faceDetectionLimit)) || 15,
          multipleFacesEnabled: values.multipleFacesEnabled,
          multipleFacesLimit:
            (multipleFacesUnit === 'min'
              ? Number(values.multipleFacesLimit) * 60
              : Number(values.multipleFacesLimit)) || 15,
          proctoringWarningEnabled: values.proctoringWarningEnabled,
          proctoringWarningLimit: Number(values.proctoringWarningLimit) || 3,
          tabSwitchingEnabled: values.tabSwitchingEnabled,
        },
        examTitle: finalRequirementBody + ' - ' + values.department,
        examCode: values.department.substring(0, 10).toUpperCase().replace(/\s/g, ''),
        examType: values.examType,
        examCategory: values.examCategory,
        difficulty: 'MEDIUM',
      }

      if (id) {
        await examApi.update(id, payload)
        toast({ title: 'Success', description: 'Exam updated successfully', variant: 'success' })
      } else {
        await examApi.create(payload)
        toast({ title: 'Success', description: 'Exam created successfully', variant: 'success' })
      }
      navigate('/exam-manager/exams')
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create exam',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={() => navigate(-1)}>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {id ? 'Edit Exam' : 'Create New Exam'}
          </h1>
          <p className='text-muted-foreground'>
            {id
              ? 'Update the details for this examination.'
              : 'Fill in the details to create a new examination.'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='requirementBody'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Requirement Body - Govt/PVT</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select Requirement Body' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Union Public Service Commission (UPSC)'>
                          Union Public Service Commission (UPSC)
                        </SelectItem>
                        <SelectItem value='Staff Selection Commission (SSC)'>
                          Staff Selection Commission (SSC)
                        </SelectItem>
                        <SelectItem value='Railway Recruitment Board (RRB)'>
                          Railway Recruitment Board (RRB)
                        </SelectItem>
                        <SelectItem value='Institute of Banking Personnel Selection (IBPS)'>
                          Institute of Banking Personnel Selection (IBPS)
                        </SelectItem>
                        <SelectItem value='Gujarat Public Service Commission (GPSC)'>
                          Gujarat Public Service Commission (GPSC)
                        </SelectItem>
                        <SelectItem value='Gujarat State Subordinate Service Selection Board (GSSSB)'>
                          Gujarat State Subordinate Service Selection Board (GSSSB)
                        </SelectItem>
                        <SelectItem value='Gujarat State Police Recruitment Board (GPRB)'>
                          Gujarat State Police Recruitment Board (GPRB)
                        </SelectItem>
                        <SelectItem value='Reserve Bank of India (RBI)'>
                          Reserve Bank of India (RBI)
                        </SelectItem>
                        <SelectItem value='NABARD'>NABARD</SelectItem>
                        <SelectItem value='State Bank of India (SBI)'>
                          State Bank of India (SBI)
                        </SelectItem>
                        <SelectItem value='Custom'>Custom / Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchRequirementBody === 'Custom' && (
                <FormField
                  control={form.control}
                  name='customRequirementBody'
                  render={({ field }) => (
                    <FormItem className='col-span-1 md:col-span-2'>
                      <FormLabel>Custom Requirement Body</FormLabel>
                      <FormControl>
                        <Input placeholder='Enter custom requirement body' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name='department'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department / Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. Police Department' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='examCategory'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Category</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter category' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='examMode'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select mode' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='ONLINE'>Online</SelectItem>
                        <SelectItem value='OFFLINE'>Offline</SelectItem>
                        <SelectItem value='HYBRID'>Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='language'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. English' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='examType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Prelim'>Prelim</SelectItem>
                        <SelectItem value='Mains'>Mains</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <CardTitle>Exam Paper Subject</CardTitle>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='text-primary hover:text-primary/80'
                onClick={() => append({ name: '', questions: '' })}
              >
                <Plus className='h-4 w-4 mr-2' />
                Add subject/question
              </Button>
            </CardHeader>
            <CardContent className='space-y-4'>
              {fields.map((field, index) => (
                <div key={field.id} className='flex items-start gap-4'>
                  <FormField
                    control={form.control}
                    name={`subjects.${index}.name`}
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormControl>
                          <Input placeholder='Enter Subject Name' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`subjects.${index}.questions`}
                    render={({ field }) => (
                      <FormItem className='w-40'>
                        <FormControl>
                          <Input type='number' placeholder='Question Number' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 0 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-red-500 hover:text-red-600 hover:bg-red-500/10 shrink-0'
                      onClick={() => remove(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm mt-6'>
            <CardHeader>
              <CardTitle>Shuffle Options</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='shuffleSubjects'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Shuffle Subjects</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        Randomly shuffle the order of subjects for each candidate
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='shuffleQuestions'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Shuffle Questions</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        Randomly shuffle the order of questions within each subject
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <CardTitle>Schedule & Timing</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='examDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exam Date</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='duration'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        readOnly
                        className='readOnly:opacity-80 cursor-not-allowed'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='startTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input type='time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='endTime'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input type='time' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='shift'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select Shift' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Morning Shift'>Morning Shift</SelectItem>
                        <SelectItem value='Afternoon Shift'>Afternoon Shift</SelectItem>
                        <SelectItem value='Evening Shift'>Evening Shift</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <CardTitle>Marking Scheme</CardTitle>
            </CardHeader>
            <CardContent className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <FormField
                control={form.control}
                name='totalMarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Marks</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='passingMarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Positive Marks</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='negativeMarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Negative Marks</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <CardTitle>Proctoring & Anti-Cheat Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-md dark:border-slate-800'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Face Monitoring</FormLabel>
                  <p className='text-sm text-muted-foreground'>
                    Detect if candidate&apos;s face goes missing for a specific duration.
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <FormField
                    control={form.control}
                    name='faceDetectionLimit'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2 space-y-0'>
                        <FormControl>
                          <Input type='number' className='w-20' {...field} />
                        </FormControl>
                        <Select
                          value={faceDetectionUnit}
                          onValueChange={(val: 'sec' | 'min') => setFaceDetectionUnit(val)}
                        >
                          <SelectTrigger className='w-20 border-slate-200 dark:border-slate-800 h-10'>
                            <SelectValue placeholder='Unit' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='sec'>sec</SelectItem>
                            <SelectItem value='min'>min</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='faceDetectionEnabled'
                    render={({ field }) => (
                      <FormItem className='flex items-center space-y-0'>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-md dark:border-slate-800'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Multiple/Wrong Faces</FormLabel>
                  <p className='text-sm text-muted-foreground'>
                    Detect if multiple faces or wrong face appears for a specific duration.
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <FormField
                    control={form.control}
                    name='multipleFacesLimit'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2 space-y-0'>
                        <FormControl>
                          <Input type='number' className='w-20' {...field} />
                        </FormControl>
                        <Select
                          value={multipleFacesUnit}
                          onValueChange={(val: 'sec' | 'min') => setMultipleFacesUnit(val)}
                        >
                          <SelectTrigger className='w-20 border-slate-200 dark:border-slate-800 h-10'>
                            <SelectValue placeholder='Unit' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='sec'>sec</SelectItem>
                            <SelectItem value='min'>min</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='multipleFacesEnabled'
                    render={({ field }) => (
                      <FormItem className='flex items-center space-y-0'>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-md dark:border-slate-800'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Proctoring Warning Limit</FormLabel>
                  <p className='text-sm text-muted-foreground'>
                    Auto-submit exam after a specific number of warnings.
                  </p>
                </div>
                <div className='flex items-center gap-4'>
                  <FormField
                    control={form.control}
                    name='proctoringWarningLimit'
                    render={({ field }) => (
                      <FormItem className='flex items-center gap-2 space-y-0'>
                        <FormControl>
                          <Input type='number' className='w-20' {...field} />
                        </FormControl>
                        <span className='text-sm'>warnings</span>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='proctoringWarningEnabled'
                    render={({ field }) => (
                      <FormItem className='flex items-center space-y-0'>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-md dark:border-slate-800'>
                <div className='space-y-0.5'>
                  <FormLabel className='text-base'>Tab Switching Prevention</FormLabel>
                  <p className='text-sm text-muted-foreground'>
                    Instantly auto-submit exam if candidate switches tabs or minimizes browser.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name='tabSwitchingEnabled'
                  render={({ field }) => (
                    <FormItem className='flex items-center space-y-0'>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name='instructions'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>General Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Enter instructions for candidates...'
                        className='h-32'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className='flex justify-end gap-4'>
            <Button variant='outline' type='button' onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? id
                  ? 'Saving...'
                  : 'Creating...'
                : id
                ? 'Save Changes'
                : 'Create Exam'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
