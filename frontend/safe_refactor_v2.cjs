const fs = require('fs');
const path = require('path');
const p = path.resolve('src/features/exam-manager/pages/CreateExamPage.tsx');
let content = fs.readFileSync(p, 'utf8');

// 1. Add imports
content = content.replace(
  "import { examApi } from '../api/exam.api'",
  "import { examApi } from '../api/exam.api'\nimport { useSubjectList } from '@/features/company/subject/hooks/subject.hooks'"
);

// 2. Schema: Update subjects object
content = content.replace(
  `        name: z.string().min(1, 'Subject name required'),
        questions: z.union([z.string(), z.number()]).transform((v) => Number(v)),
        marksPerQuestion: z.union([z.string(), z.number()]).transform((v) => Number(v)),
        negativeMarksPerQuestion: z.union([z.string(), z.number()]).transform((v) => Number(v)).optional(),`,
  `        subjectId: z.string().min(1, 'Subject ID required'),
        name: z.string().min(1, 'Subject name required'),
        questions: z.union([z.string(), z.number()]).transform((v) => Number(v)),
        marksPerQuestion: z.union([z.string(), z.number()]).transform((v) => Number(v)),
        negativeMarksPerQuestion: z.union([z.string(), z.number()]).transform((v) => Number(v)).optional(),`
);

// 2.5 TypeScript Type: FormValues
content = content.replace(
  `  subjects: { name: string; questions: number | string; marksPerQuestion: number | string; negativeMarksPerQuestion?: number | string; sectionalCutoff?: number | string | null; timeAllottedMinutes?: number | string | null }[]`,
  `  subjects: { subjectId: string; name: string; questions: number | string; marksPerQuestion: number | string; negativeMarksPerQuestion?: number | string; sectionalCutoff?: number | string | null; timeAllottedMinutes?: number | string | null }[]`
);

// 4. Hook call
content = content.replace(
  "const watchIsMultiStage = form.watch('isMultiStage')",
  "const watchIsMultiStage = form.watch('isMultiStage')\n  const { data: subjectListRes } = useSubjectList()"
);

// 5. Default subject initialization (for create mode)
content = content.replace(
  "subjects: [{ name: '', questions: '', marksPerQuestion: 1, negativeMarksPerQuestion: 0 }]",
  "subjects: [{ subjectId: '', name: '', questions: '', marksPerQuestion: 1, negativeMarksPerQuestion: 0 }]"
);

// 6. Edit mode load mapping
content = content.replace(
  `        subjects: data.subjects.map((s: any) => ({
          name: s.name,
          questions: s.questions,
          marksPerQuestion: s.marksPerQuestion ?? 1,
          negativeMarksPerQuestion: s.negativeMarksPerQuestion ?? 0,
          sectionalCutoff: s.sectionalCutoff,
          timeAllottedMinutes: s.timeAllottedMinutes,
        })),`,
  `        subjects: data.subjects.map((s: any) => ({
          subjectId: String(s.subjectId),
          name: s.name,
          questions: s.questions,
          marksPerQuestion: s.marksPerQuestion ?? 1,
          negativeMarksPerQuestion: s.negativeMarksPerQuestion ?? 0,
          sectionalCutoff: s.sectionalCutoff,
          timeAllottedMinutes: s.timeAllottedMinutes,
        })),`
);

// 7. onSubmit payload mapping
content = content.replace(
  `      const payload = {
        ...restValues,
        duration: Number(values.duration) || 0,
        totalMarks: Number(values.totalMarks),
        passingMarks: Number(values.passingMarks),
        negativeMarks: Number(values.negativeMarks),
        companyId: profile.companyId,`,
  `      const computedTotalMarks = (values.subjects || []).reduce((acc, s) => acc + (Number(s.questions) * Number(s.marksPerQuestion)), 0);
      const payload = {
        ...restValues,
        duration: Number(values.duration) || 0,
        totalMarks: computedTotalMarks,
        passingMarks: Number(values.passingMarks),
        negativeMarks: Number(values.negativeMarks),
        companyId: profile.companyId,`
);

// 8. onSubmit subjects mapping
content = content.replace(
  `        subjects: values.subjects?.map((s) => ({
          name: s.name,
          questions: Number(s.questions),
          marksPerQuestion: Number(s.marksPerQuestion),
          negativeMarksPerQuestion: s.negativeMarksPerQuestion != null ? Number(s.negativeMarksPerQuestion) : undefined,
          sectionalCutoff: values.sectionalCutoffEnabled && s.sectionalCutoff != null && s.sectionalCutoff !== '' ? Number(s.sectionalCutoff) : null,
          timeAllottedMinutes: s.timeAllottedMinutes != null && s.timeAllottedMinutes !== '' ? Number(s.timeAllottedMinutes) : null,
        })),`,
  `        subjects: values.subjects?.map((s) => ({
          subjectId: s.subjectId,
          name: s.name,
          questions: Number(s.questions),
          marksPerQuestion: Number(s.marksPerQuestion),
          negativeMarksPerQuestion: s.negativeMarksPerQuestion != null ? Number(s.negativeMarksPerQuestion) : 0,
          sectionalCutoff: values.sectionalCutoffEnabled && s.sectionalCutoff != null && s.sectionalCutoff !== '' ? Number(s.sectionalCutoff) : null,
          timeAllottedMinutes: s.timeAllottedMinutes != null && s.timeAllottedMinutes !== '' ? Number(s.timeAllottedMinutes) : null,
        })),`
);

// 9. totalMarks input readonly
content = content.replace(
  `              <FormField
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
              />`,
  `              <FormField
                control={form.control}
                name='totalMarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Marks</FormLabel>
                    <FormControl>
                      <Input type='number' {...field} readOnly className='opacity-70' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />`
);

// 10. Subject Select field and hidden name field
content = content.replace(
  `                  <FormField
                    control={form.control}
                    name={\`subjects.\${index}.name\`}
                    render={({ field }) => (
                      <FormItem className='flex-1 min-w-50'>
                        <FormControl>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-sm text-muted-foreground w-4'>{index + 1}.</span>
                            <Input placeholder='Enter Subject Name' {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />`,
  `                  <FormField
                    control={form.control}
                    name={\`subjects.\${index}.subjectId\`}
                    render={({ field }) => (
                      <FormItem className='flex-1 min-w-50'>
                        <FormControl>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-sm text-muted-foreground w-4'>{index + 1}.</span>
                            <Select
                              value={field.value || ''}
                              onValueChange={(val) => {
                                field.onChange(val);
                                const selectedSubj = subjectListRes?.data?.subjects?.find((s: any) => s._id === val);
                                if (selectedSubj) {
                                  form.setValue(\`subjects.\${index}.name\`, selectedSubj.name || selectedSubj.subjectName || '');
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {subjectListRes?.data?.subjects?.map((subj: any) => (
                                  <SelectItem key={subj._id} value={subj._id}>
                                    {subj.name || subj.subjectName || 'Unnamed'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={\`subjects.\${index}.name\`}
                    render={({ field }) => (
                      <input type="hidden" {...field} readOnly />
                    )}
                  />`
);

// 12. Update append initial state
content = content.replace(
  `onClick={() => append({ name: '', questions: '', marksPerQuestion: 1, negativeMarksPerQuestion: 0, timeAllottedMinutes: '' })}`,
  `onClick={() => append({ subjectId: '', name: '', questions: '', marksPerQuestion: 1, negativeMarksPerQuestion: 0, timeAllottedMinutes: '' })}`
);

fs.writeFileSync(p, content, 'utf8');
console.log("Safe refactor completed successfully.");
