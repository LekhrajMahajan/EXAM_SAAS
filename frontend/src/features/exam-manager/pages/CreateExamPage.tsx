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
import { Checkbox } from '@/shared/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useUserStore } from '@/stores/user/user.store'
import { examApi } from '../api/exam.api'
import { useSubjectList } from '@/features/company/subject/hooks/subject.hooks'
import { ChevronLeft, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
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
  examGroupId: z.string().optional(),
  hasMultipleShifts: z.boolean().default(false),
  normalizationEnabled: z.boolean().default(false),
  normalizationMethod: z.enum(['PERCENTILE', 'MEAN_EQUATING']).default('PERCENTILE'),
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
        subjectId: z.string().optional(),
        name: z.string().min(1, 'Subject name required'),
        questions: z.union([z.string(), z.number()]).transform((v) => Number(v)),
        marksPerQuestion: z.union([z.string(), z.number()]).transform((v) => Number(v)),
        negativeMarksPerQuestion: z.union([z.string(), z.number()]).transform((v) => Number(v)).optional(),
        sectionalCutoff: z.union([z.string(), z.number()]).transform((v) => v === '' ? null : Number(v)).optional().nullable(),
        timeAllottedMinutes: z.union([z.string(), z.number()]).transform((v) => v === '' ? null : Number(v)).optional().nullable(),
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
  cutoffType: z.enum(['MARKS', 'PERCENTAGE', 'PERCENTILE']).default('MARKS'),
  overallQualifyingPercent: z.union([z.string(), z.number()]).transform((v) => Number(v)).optional(),
  sectionalCutoffEnabled: z.boolean().default(false),
  sectionalTimeLimitEnabled: z.boolean().default(false),
  categoryWiseCutoff: z
    .array(
      z.object({
        category: z.string().min(1),
        cutoffPercent: z.union([z.string(), z.number()]).transform((v) => Number(v)),
      })
    )
    .optional(),
  qualifyingCriteriaEnabled: z.boolean().default(false),
  partWiseCutoffEnabled: z.boolean().default(false),
  parts: z
    .array(
      z.object({
        partName: z.string().optional(),
        subjectIds: z.array(z.string()).optional(),
        cutoffType: z.enum(['MARKS', 'PERCENTAGE']).default('MARKS'),
        cutoffValue: z.union([z.string(), z.number()]).transform((v) => v === '' ? null : Number(v)).optional().nullable(),
      })
    )
    .optional(),
  rankType: z.enum(['COMBINED', 'CATEGORY_WISE']).default('COMBINED'),
  tieBreakRules: z
    .array(
      z.object({
        order: z.number(),
        ruleType: z.enum([
          'HIGHER_MARKS',
          'HIGHER_PERCENTAGE',
          'MORE_CORRECT',
          'LOWER_NEGATIVE',
          'OLDER_AGE',
          'YOUNGER_AGE',
          'APPLICATION_NUMBER',
        ]),
      })
    )
    .optional(),
  isMultiStage: z.boolean().default(false),
  stageType: z.enum(['QUALIFYING_ONLY', 'SCORE_CARRIED_FORWARD']).default('SCORE_CARRIED_FORWARD'),
  stageWeightagePercent: z.union([z.string(), z.number()]).transform((v) => Number(v)).default(100),
  linkedNextExamId: z.string().optional(),
  resultDeclarationDate: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.startTime >= data.endTime) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["endTime"],
      message: "End time must be after start time.",
    });
  }

  if (Number(data.passingMarks) > Number(data.totalMarks)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["passingMarks"],
      message: "Passing marks cannot be greater than total marks.",
    });
  }

  if (data.sectionalTimeLimitEnabled) {
    if (!data.subjects || data.subjects.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subjects"],
        message: "Subjects are required when sectional time limit is enabled.",
      });
    } else {
      let totalAllocatedTime = 0;
      data.subjects.forEach((subject, index) => {
        if (!subject.timeAllottedMinutes || subject.timeAllottedMinutes <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["subjects", index, "timeAllottedMinutes"],
            message: "Time allotted is required and must be greater than 0.",
          });
        } else {
          totalAllocatedTime += subject.timeAllottedMinutes;
        }
      });

      if (totalAllocatedTime !== Number(data.duration)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["sectionalTimeLimitEnabled"],
          message: `Sum of subject time allocations (${totalAllocatedTime} min) does not match exam duration (${data.duration} min)`,
        });
      }
    }
  }

  if (data.partWiseCutoffEnabled) {
    if (!data.parts || data.parts.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parts"],
        message: "At least one part is required when part-wise cutoff is enabled.",
      });
    } else {
      const seenSubjects = new Set<string>();
      data.parts.forEach((part, i) => {
        if (!part.partName || part.partName.trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["parts", i, "partName"],
            message: "Part name is required",
          });
        }
        if (!part.subjectIds || part.subjectIds.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["parts", i, "subjectIds"],
            message: "At least one subject is required",
          });
        }
        if (part.cutoffValue === undefined || part.cutoffValue === null) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["parts", i, "cutoffValue"],
            message: "Cutoff value is required",
          });
        }

        if (part.subjectIds && part.subjectIds.length > 0) {
          part.subjectIds.forEach((subjectId, j) => {
            if (seenSubjects.has(subjectId)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["parts", i, "subjectIds"],
                message: `Subject is already assigned to another part.`,
              });
            }
            seenSubjects.add(subjectId);
          });
        }
      });
    }
  }
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
  examGroupId?: string
  hasMultipleShifts: boolean
  normalizationEnabled: boolean
  normalizationMethod: 'PERCENTILE' | 'MEAN_EQUATING'
  startTime: string
  endTime: string
  duration: number | string
  totalMarks: number | string
  passingMarks: number | string
  negativeMarks: number | string
  language: string
  instructions?: string
  subjects: { subjectId: string; name: string; questions: number | string; marksPerQuestion: number | string; negativeMarksPerQuestion?: number | string; sectionalCutoff?: number | string | null; timeAllottedMinutes?: number | string | null }[]
  faceDetectionEnabled: boolean
  faceDetectionLimit: number | string
  multipleFacesEnabled: boolean
  multipleFacesLimit: number | string
  proctoringWarningEnabled: boolean
  proctoringWarningLimit: number | string
  tabSwitchingEnabled: boolean
  shuffleSubjects: boolean
  shuffleQuestions: boolean
  cutoffType: 'MARKS' | 'PERCENTAGE' | 'PERCENTILE'
  overallQualifyingPercent?: number | string
  sectionalCutoffEnabled: boolean
  sectionalTimeLimitEnabled: boolean
  qualifyingCriteriaEnabled: boolean
  partWiseCutoffEnabled: boolean
  parts?: { partName: string; subjectIds: string[]; cutoffType: 'MARKS' | 'PERCENTAGE'; cutoffValue: number | string }[]
  categoryWiseCutoff?: { category: string; cutoffPercent: number | string }[]
  rankType: 'COMBINED' | 'CATEGORY_WISE'
  tieBreakRules?: {
    order: number
    ruleType:
      | 'HIGHER_MARKS'
      | 'HIGHER_PERCENTAGE'
      | 'MORE_CORRECT'
      | 'LOWER_NEGATIVE'
      | 'OLDER_AGE'
      | 'YOUNGER_AGE'
      | 'APPLICATION_NUMBER'
  }[]
  isMultiStage: boolean
  stageType: 'QUALIFYING_ONLY' | 'SCORE_CARRIED_FORWARD'
  stageWeightagePercent: number | string
  linkedNextExamId?: string
  resultDeclarationDate?: string
}

export const CreateExamPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const profile = useUserStore((state) => state.profile)
  const [isFetching, setIsFetching] = useState(false)
  const [examOptions, setExamOptions] = useState<any[]>([])

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
      subjects: [{ subjectId: '', name: '', questions: '', marksPerQuestion: 1, negativeMarksPerQuestion: 0 }],
      faceDetectionEnabled: false,
      faceDetectionLimit: 15,
      multipleFacesEnabled: false,
      multipleFacesLimit: 15,
      proctoringWarningEnabled: false,
      proctoringWarningLimit: 3,
      tabSwitchingEnabled: false,
      shuffleSubjects: false,
      shuffleQuestions: false,
      cutoffType: 'MARKS',
      overallQualifyingPercent: '',
      sectionalCutoffEnabled: false,
      sectionalTimeLimitEnabled: false,
      qualifyingCriteriaEnabled: false,
      partWiseCutoffEnabled: false,
      parts: [],
      categoryWiseCutoff: [],
      rankType: 'COMBINED',
      tieBreakRules: [
        { order: 1, ruleType: 'HIGHER_MARKS' },
        { order: 2, ruleType: 'HIGHER_PERCENTAGE' },
        { order: 3, ruleType: 'MORE_CORRECT' },
        { order: 4, ruleType: 'LOWER_NEGATIVE' },
      ],
      isMultiStage: false,
      stageType: 'SCORE_CARRIED_FORWARD',
      stageWeightagePercent: 100,
      linkedNextExamId: '',
      resultDeclarationDate: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'subjects',
  })

  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
    control: form.control,
    name: 'categoryWiseCutoff',
  })

  const { fields: partFields, append: appendPart, remove: removePart } = useFieldArray({
    control: form.control,
    name: 'parts',
  })

  const { fields: tieBreakFields, append: appendTieBreak, remove: removeTieBreak, move: moveTieBreak } = useFieldArray({
    control: form.control,
    name: 'tieBreakRules',
  })

  const watchRequirementBody = form.watch('requirementBody')
  const watchStartTime = form.watch('startTime')
  const watchEndTime = form.watch('endTime')
  const watchHasMultipleShifts = form.watch('hasMultipleShifts')
  const watchNormalizationEnabled = form.watch('normalizationEnabled')
  const watchSubjects = form.watch('subjects')
  const watchCutoffType = form.watch('cutoffType')
  const watchSectionalCutoffEnabled = form.watch('sectionalCutoffEnabled')
  const watchSectionalTimeLimitEnabled = form.watch('sectionalTimeLimitEnabled')
  const watchQualifyingCriteriaEnabled = form.watch('qualifyingCriteriaEnabled')
  const watchPartWiseCutoffEnabled = form.watch('partWiseCutoffEnabled')
  const watchParts = form.watch('parts')
  const watchIsMultiStage = form.watch('isMultiStage')
  const { data: subjectListRes } = useSubjectList()

  useEffect(() => {
    if (watchIsMultiStage && examOptions.length === 0) {
      examApi.getAll().then(res => {
        if (res.success && Array.isArray(res.data)) {
          setExamOptions(res.data.filter((e: any) => e._id !== id))
        }
      }).catch(console.error)
    }
  }, [watchIsMultiStage, examOptions.length, id])

  const watchSubjectsStringified = JSON.stringify(watchSubjects);

  useEffect(() => {
    const total = watchSubjects?.reduce((sum, subj) => {
      const q = Number(subj.questions) || 0;
      const m = Number(subj.marksPerQuestion) || 0;
      return sum + (q * m);
    }, 0) || 0;
    form.setValue('totalMarks', total, { shouldValidate: true });
  }, [watchSubjectsStringified, form])

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
              examGroupId: data.examGroupId || '',
              hasMultipleShifts: data.hasMultipleShifts ?? false,
              normalizationEnabled: data.normalizationEnabled ?? false,
              normalizationMethod: data.normalizationMethod || 'PERCENTILE',
              startTime: data.startTime || '',
              endTime: data.endTime || '',
              duration: data.duration ?? '',
              totalMarks: data.totalMarks ?? '',
              passingMarks: data.passingMarks ?? '',
              negativeMarks: data.negativeMarks ?? '',
              language: data.language || 'English',
              instructions: data.instructions || '',
              subjects:
                data.subjects && data.subjects.length > 0
                  ? data.subjects.map((s: any) => ({ name: s.name, questions: s.questions, marksPerQuestion: s.marksPerQuestion ?? 1, sectionalCutoff: s.sectionalCutoff ?? '', timeAllottedMinutes: s.timeAllottedMinutes ?? '' }))
                  : [{ name: '', questions: '', marksPerQuestion: 1, sectionalCutoff: '', timeAllottedMinutes: '' }],
              faceDetectionEnabled: data.securitySettings?.faceDetectionEnabled ?? false,
              faceDetectionLimit: fdLimit,
              multipleFacesEnabled: data.securitySettings?.multipleFacesEnabled ?? false,
              multipleFacesLimit: mfLimit,
              proctoringWarningEnabled: data.securitySettings?.proctoringWarningEnabled ?? false,
              proctoringWarningLimit: data.securitySettings?.proctoringWarningLimit ?? 3,
              tabSwitchingEnabled: data.securitySettings?.tabSwitchingEnabled ?? false,
              shuffleSubjects: data.shuffleSubjects ?? false,
              shuffleQuestions: data.shuffleQuestions ?? false,
              cutoffType: data.cutoffType || 'MARKS',
              overallQualifyingPercent: data.overallQualifyingPercent ?? '',
              sectionalCutoffEnabled: data.sectionalCutoffEnabled ?? false,
              sectionalTimeLimitEnabled: data.sectionalTimeLimitEnabled ?? false,
              partWiseCutoffEnabled: data.partWiseCutoffEnabled ?? false,
              parts:
                data.parts && data.parts.length > 0
                  ? data.parts.map((p: any) => ({ partName: p.partName, subjectIds: p.subjectIds || [], cutoffType: p.cutoffType || 'MARKS', cutoffValue: p.cutoffValue ?? '' }))
                  : [{ partName: '', subjectIds: [], cutoffType: 'MARKS', cutoffValue: '' }],
              categoryWiseCutoff:
                data.categoryWiseCutoff && data.categoryWiseCutoff.length > 0
                  ? data.categoryWiseCutoff.map((c: any) => ({ category: c.category, cutoffPercent: c.cutoffPercent ?? '' }))
                  : [{ category: 'GENERAL', cutoffPercent: '' }],
              rankType: data.rankType || 'COMBINED',
              tieBreakRules: data.tieBreakRules && data.tieBreakRules.length > 0 ? data.tieBreakRules : [
                { order: 1, ruleType: 'HIGHER_MARKS' },
                { order: 2, ruleType: 'HIGHER_PERCENTAGE' },
                { order: 3, ruleType: 'MORE_CORRECT' },
                { order: 4, ruleType: 'LOWER_NEGATIVE' },
              ],
              isMultiStage: data.isMultiStage ?? false,
              stageType: data.stageType || 'SCORE_CARRIED_FORWARD',
              stageWeightagePercent: data.stageWeightagePercent ?? 100,
              linkedNextExamId: data.linkedNextExamId || '',
              resultDeclarationDate: data.resultDeclarationDate ? new Date(data.resultDeclarationDate).toISOString().split('T')[0] : '',
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
        qualifyingCriteriaEnabled: _qce,
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
        cutoffType: values.cutoffType,
        overallQualifyingPercent: values.overallQualifyingPercent != null && values.overallQualifyingPercent !== '' ? Number(values.overallQualifyingPercent) : null,
        examGroupId: values.examGroupId || null,
        hasMultipleShifts: values.hasMultipleShifts,
        normalizationEnabled: values.normalizationEnabled,
        normalizationMethod: values.normalizationMethod,
        sectionalCutoffEnabled: values.sectionalCutoffEnabled,
        sectionalTimeLimitEnabled: values.sectionalTimeLimitEnabled,
        partWiseCutoffEnabled: values.partWiseCutoffEnabled,
        parts: values.partWiseCutoffEnabled ? values.parts?.map((p) => ({
          partName: p.partName,
          subjectIds: p.subjectIds,
          cutoffType: p.cutoffType,
          cutoffValue: Number(p.cutoffValue),
        })) : [],
        categoryWiseCutoff: values.categoryWiseCutoff?.map((c) => ({
          category: c.category,
          cutoffPercent: Number(c.cutoffPercent),
        })),
        subjects: values.subjects?.map((s) => ({
          subjectId: s.subjectId || undefined,
          name: s.name,
          questions: Number(s.questions),
          marksPerQuestion: Number(s.marksPerQuestion),
          sectionalCutoff: values.sectionalCutoffEnabled && s.sectionalCutoff != null && s.sectionalCutoff !== '' ? Number(s.sectionalCutoff) : null,
          timeAllottedMinutes: s.timeAllottedMinutes != null && s.timeAllottedMinutes !== '' ? Number(s.timeAllottedMinutes) : null,
        })),
        rankType: values.rankType,
        tieBreakRules: values.tieBreakRules,
        isMultiStage: values.isMultiStage,
        stageType: values.stageType,
        stageWeightagePercent: Number(values.stageWeightagePercent),
        linkedNextExamId: values.linkedNextExamId || null,
        resultDeclarationDate: values.resultDeclarationDate || null,
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

  const onInvalid = (errors: any) => {
    console.error('Validation Errors:', errors)
    
    // Extract nested keys if present (like subjects.0.name)
    const extractKeys = (obj: any, prefix = ''): string[] => {
      return Object.keys(obj).reduce((acc: string[], key) => {
        const pre = prefix.length ? prefix + '.' : '';
        if (typeof obj[key] === 'object' && obj[key] !== null && !obj[key].message) {
          return [...acc, ...extractKeys(obj[key], pre + key)];
        }
        return [...acc, pre + key];
      }, []);
    };
    
    const errorPaths = extractKeys(errors).join(', ')
    toast({
      title: 'Validation Error',
      description: `Please check the following fields: ${errorPaths}`,
      variant: 'destructive',
    })
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
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className='space-y-6'>
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
              <FormField
                control={form.control}
                name='sectionalTimeLimitEnabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Sectional Time Limits</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        Enable specific time limits for each subject
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
                name='sectionalCutoffEnabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Enable Sectional Cutoffs</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        Require candidates to pass each subject individually
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

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm mt-6'>
            <CardHeader className='flex flex-row items-center justify-between pb-4'>
              <CardTitle>Exam Paper Subject</CardTitle>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='text-primary hover:text-primary/80'
                onClick={() => append({ subjectId: '', name: '', questions: '', marksPerQuestion: 1, negativeMarksPerQuestion: 0, timeAllottedMinutes: '' })}
              >
                <Plus className='h-4 w-4 mr-2' />
                Add subject/question
              </Button>
            </CardHeader>
            <CardContent className='space-y-4 overflow-x-auto'>
              {fields.length > 0 && (
                <div className='flex items-center gap-4 px-1 pb-2 text-sm font-medium text-muted-foreground border-b mb-2'>
                  <div className='flex-1 min-w-[200px] pl-6'>Subject Name</div>
                  <div className='w-40'>Questions</div>
                  <div className='w-40'>Marks per Question</div>
                  {watchSectionalCutoffEnabled && <div className='w-40'>Sectional Cutoff</div>}
                  {watchSectionalTimeLimitEnabled && <div className='w-40'>Time (Minutes)</div>}
                  {fields.length > 0 && <div className='w-8 shrink-0'></div>}
                </div>
              )}
              {fields.map((field, index) => (
                <div key={field.id} className='flex items-start gap-4'>
                  <FormField
                    control={form.control}
                    name={`subjects.${index}.name`}
                    render={({ field }) => (
                      <FormItem className='flex-1 min-w-[200px]'>
                        <FormControl>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-sm text-muted-foreground w-4'>{index + 1}.</span>
                            <Input placeholder='Enter Subject Name' {...field} />
                          </div>
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
                          <Input type='number' placeholder='Questions' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`subjects.${index}.marksPerQuestion`}
                    render={({ field }) => (
                      <FormItem className='w-40'>
                        <FormControl>
                          <Input type='number' placeholder='Marks' min={1} step='any' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {watchSectionalCutoffEnabled && (
                    <FormField
                      control={form.control}
                      name={`subjects.${index}.sectionalCutoff`}
                      render={({ field }) => (
                        <FormItem className='w-40'>
                          <FormControl>
                            <Input type='number' placeholder='Cutoff' step='any' {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {watchSectionalTimeLimitEnabled && (
                    <FormField
                      control={form.control}
                      name={`subjects.${index}.timeAllottedMinutes`}
                      render={({ field }) => (
                        <FormItem className='w-40'>
                          <FormControl>
                            <Input type='number' placeholder='Time (min)' step='any' {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
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
              <div className='flex flex-col sm:flex-row sm:justify-end gap-4 pt-4 border-t'>
                <div className='flex items-center gap-2 font-medium'>
                  <span className='text-muted-foreground'>Total Questions:</span>
                  <span>{watchSubjects?.reduce((acc, curr) => acc + (Number(curr.questions) || 0), 0) || 0}</span>
                </div>
                {watchSectionalTimeLimitEnabled && (
                  <div className='flex items-center gap-2 font-medium'>
                    <span className='text-muted-foreground'>Total Allocated Time:</span>
                    <span
                      className={(() => {
                        const sum = watchSubjects?.reduce((acc, curr) => acc + (Number(curr.timeAllottedMinutes) || 0), 0) || 0;
                        const duration = Number(form.getValues('duration')) || 0;
                        return sum === duration && sum > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
                      })()}
                    >
                      {watchSubjects?.reduce((acc, curr) => acc + (Number(curr.timeAllottedMinutes) || 0), 0) || 0} / {form.getValues('duration') || 0} min
                    </span>
                  </div>
                )}
              </div>
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
              <CardTitle>Shift & Normalization</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FormField
                control={form.control}
                name='hasMultipleShifts'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm dark:border-slate-800'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>This exam has multiple shifts</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        Enable if this exam spans multiple shifts and requires linking.
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchHasMultipleShifts && (
                <>
                  <FormField
                    control={form.control}
                    name='examGroupId'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exam Group Identifier</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g., SSC-CGL-TIER1-2023 (must be exact across shifts)' {...field} />
                        </FormControl>
                        <div className='text-sm text-muted-foreground mt-1'>
                          Enter a shared group ID to link multiple shifts of this exam together.
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name='normalizationEnabled'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm dark:border-slate-800 mt-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>Enable Score Normalization</FormLabel>
                          <div className='text-sm text-muted-foreground'>
                            Adjusts scores for difficulty differences between shifts. Actual normalized scores are calculated only after results for all shifts are generated — this cannot be computed at exam creation time.
                          </div>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchNormalizationEnabled && (
                    <FormField
                      control={form.control}
                      name='normalizationMethod'
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                          <FormLabel>Normalization Method</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select Method' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='PERCENTILE'>Percentile-based</SelectItem>
                              <SelectItem value='MEAN_EQUATING'>Mean-Equating</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </>
              )}
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
                      <Input type='number' readOnly className='readOnly:opacity-80 cursor-not-allowed' {...field} />
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
                    <FormLabel>Passing Marks</FormLabel>
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
              <div className='flex items-center justify-between'>
                <CardTitle>Qualifying Criteria</CardTitle>
                <FormField
                  control={form.control}
                  name='qualifyingCriteriaEnabled'
                  render={({ field }) => (
                    <FormItem className='flex items-center space-x-2 space-y-0'>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardHeader>
            {watchQualifyingCriteriaEnabled && (
              <CardContent className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <FormField
                    control={form.control}
                    name='cutoffType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cutoff Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Cutoff Type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='MARKS'>Marks (Absolute)</SelectItem>
                            <SelectItem value='PERCENTAGE'>Percentage (%)</SelectItem>
                            <SelectItem value='PERCENTILE'>Percentile</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='overallQualifyingPercent'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Overall Qualifying Percentage (Optional)</FormLabel>
                        <FormControl>
                          <Input type='number' placeholder='e.g., 35' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Category-wise Cutoff (Optional)</CardTitle>
                <Button type='button' variant='outline' size='sm' onClick={() => appendCategory({ category: '', cutoffPercent: '' })}>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Category Cutoff
                </Button>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {categoryFields.length === 0 ? (
                <div className='text-sm text-muted-foreground italic text-center py-4'>
                  No category-wise cutoffs added. (Default passing criteria will apply to all)
                </div>
              ) : (
                categoryFields.map((field, index) => (
                  <div key={field.id} className='flex items-start gap-4'>
                    <FormField
                      control={form.control}
                      name={`categoryWiseCutoff.${index}.category`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder='Select Category' />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value='GENERAL'>General / UR</SelectItem>
                                <SelectItem value='OBC'>OBC</SelectItem>
                                <SelectItem value='SC'>SC</SelectItem>
                                <SelectItem value='ST'>ST</SelectItem>
                                <SelectItem value='EWS'>EWS</SelectItem>
                                <SelectItem value='PWD'>PWD</SelectItem>
                                <SelectItem value='EX_SERVICEMAN'>Ex-Serviceman</SelectItem>
                                <SelectItem value='FEMALE'>Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`categoryWiseCutoff.${index}.cutoffPercent`}
                      render={({ field }) => (
                        <FormItem className='flex-1'>
                          <FormControl>
                            <Input type='number' placeholder='Cutoff Percentage/Marks' {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='text-red-500 hover:text-red-600 hover:bg-red-500/10 shrink-0'
                      onClick={() => removeCategory(index)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Part-wise (Group) Cutoff (Optional)</CardTitle>
                <FormField
                  control={form.control}
                  name='partWiseCutoffEnabled'
                  render={({ field }) => (
                    <FormItem className='flex items-center space-x-2 space-y-0'>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <p className='text-sm text-muted-foreground mt-1'>
                Group subjects into parts. Candidates must clear the combined cutoff for every part to qualify.
              </p>
            </CardHeader>
            {watchPartWiseCutoffEnabled && (
              <CardContent className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm text-muted-foreground font-medium'>
                    {Array.from(new Set(watchParts?.flatMap((p: any) => p.subjectIds || []))).length} of {watchSubjects?.length || 0} subjects assigned
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => appendPart({ partName: '', subjectIds: [], cutoffType: 'MARKS', cutoffValue: '' })}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Add Part
                  </Button>
                </div>

                {partFields.length === 0 ? (
                  <div className='text-sm text-muted-foreground italic text-center py-4'>
                    No parts added. Click &quot;Add Part&quot; to configure.
                  </div>
                ) : (
                  partFields.map((field, index) => (
                    <div key={field.id} className='p-4 border rounded-lg bg-slate-50/50 dark:bg-slate-800/20 space-y-4 relative'>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-2 top-2 text-red-500 hover:text-red-600 hover:bg-red-500/10'
                        onClick={() => removePart(index)}
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                      
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pr-8'>
                        <FormField
                          control={form.control}
                          name={`parts.${index}.partName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Part Name</FormLabel>
                              <FormControl>
                                <Input placeholder='e.g. Part A' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className='grid grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name={`parts.${index}.cutoffType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cutoff Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value='MARKS'>Marks</SelectItem>
                                    <SelectItem value='PERCENTAGE'>Percentage</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`parts.${index}.cutoffValue`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                  <Input type='number' placeholder='Cutoff' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name={`parts.${index}.subjectIds`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subjects in this Part</FormLabel>
                            <div className='flex flex-wrap gap-4 mt-2'>
                              {watchSubjects?.map((subj: any, subjIdx: number) => {
                                if (!subj.name) return null;
                                
                                // Check if this subject is already selected in another part
                                const isAssignedToOtherPart = watchParts?.some(
                                  (p: any, pIdx: number) => pIdx !== index && p.subjectIds?.includes(subj.name)
                                );
                                
                                if (isAssignedToOtherPart) return null;

                                const isChecked = field.value?.includes(subj.name);
                                
                                // Clean up the name for display (remove digits that might have been added as typos or manual indexing)
                                const displayName = subj.name.replace(/\d+/g, '').trim();

                                return (
                                  <div key={subjIdx} className='flex items-center space-x-2'>
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        if (checked) {
                                          field.onChange([...current, subj.name]);
                                        } else {
                                          field.onChange(current.filter((id: string) => id !== subj.name));
                                        }
                                      }}
                                    />
                                    <span className='text-sm'>{displayName}</span>
                                  </div>
                                )
                              })}
                              {(!watchSubjects || watchSubjects.length === 0) && (
                                <span className='text-sm text-muted-foreground'>No subjects added to the exam yet.</span>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))
                )}
              </CardContent>
            )}
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <CardTitle>Result & Rank Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <FormField
                  control={form.control}
                  name='rankType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rank Generation Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select Rank Type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='COMBINED'>Combined / Overall Ranking</SelectItem>
                          <SelectItem value='CATEGORY_WISE'>Category-wise Ranking</SelectItem>
                          <SelectItem value='BOTH'>Both Combined & Category-wise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='resultDeclarationDate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Result Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type='date' {...field} value={field.value ?? ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel className='text-base font-semibold block mb-4'>Tie-Break Rules</FormLabel>
                <div className='space-y-2'>
                  {tieBreakFields.map((field, index) => (
                    <div key={field.id} className='flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-md'>
                      <div className='font-bold text-slate-500 w-8'>#{index + 1}</div>
                      <FormField
                        control={form.control}
                        name={`tieBreakRules.${index}.ruleType`}
                        render={({ field }) => (
                          <FormItem className='flex-1 mb-0'>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder='Select Rule' />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value='HIGHER_MARKS'>Higher Total Marks</SelectItem>
                                  <SelectItem value='HIGHER_PERCENTAGE'>Higher Percentage</SelectItem>
                                  <SelectItem value='MORE_CORRECT'>More Correct Answers</SelectItem>
                                  <SelectItem value='LOWER_NEGATIVE'>Lower Negative Marks</SelectItem>
                                  <SelectItem value='OLDER_AGE'>Older Age Candidate</SelectItem>
                                  <SelectItem value='YOUNGER_AGE'>Younger Age Candidate</SelectItem>
                                  <SelectItem value='APPLICATION_NUMBER'>Earliest Application Number</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className='flex flex-col gap-1'>
                        <Button type='button' variant='ghost' size='icon' className='h-6 w-6' disabled={index === 0} onClick={() => moveTieBreak(index, index - 1)}>
                          <ChevronUp className='h-4 w-4' />
                        </Button>
                        <Button type='button' variant='ghost' size='icon' className='h-6 w-6' disabled={index === tieBreakFields.length - 1} onClick={() => moveTieBreak(index, index + 1)}>
                          <ChevronDown className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm'>
            <CardHeader>
              <CardTitle>Multi-Stage Configuration</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              <FormField
                control={form.control}
                name='isMultiStage'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm dark:border-slate-800'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Is this exam part of a multi-stage recruitment?</FormLabel>
                      <div className='text-sm text-muted-foreground'>
                        e.g., Prelims leading to Mains, or Mains leading to Interview
                      </div>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {watchIsMultiStage && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-lg'>
                  <FormField
                    control={form.control}
                    name='stageType'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select Stage Type' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value='QUALIFYING_ONLY'>Qualifying Only (Scores not added to final)</SelectItem>
                            <SelectItem value='SCORE_CARRIED_FORWARD'>Score Carried Forward to Final Merit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='stageWeightagePercent'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stage Weightage (%)</FormLabel>
                        <FormControl>
                          <Input type='number' placeholder='e.g., 100' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='linkedNextExamId'
                    render={({ field }) => (
                      <FormItem className='col-span-1 md:col-span-2'>
                        <FormLabel>Link to Next Stage Exam (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Select the next exam stage' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {examOptions.map(exam => (
                              <SelectItem key={exam._id} value={exam._id}>
                                {exam.examTitle} ({exam.examCode})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
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
