import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paperBasicInfoSchema } from '../schemas/paper-schemas'
import type { PaperBasicInfo } from '../types'
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
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'

interface PaperFormProps {
  initialData?: Partial<PaperBasicInfo>
  onSubmit: (data: PaperBasicInfo) => void
}

export const PaperForm: React.FC<PaperFormProps> = ({ initialData, onSubmit }) => {
  const form = useForm<PaperBasicInfo>({
    resolver: zodResolver(paperBasicInfoSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      subject: initialData?.subject || '',
      examType: initialData?.examType || '',
      language: initialData?.language || 'English',
      instructions: initialData?.instructions || '',
      duration: initialData?.duration || 60,
      passingMarks: initialData?.passingMarks || 40,
      totalMarks: initialData?.totalMarks || 100,
      negativeMarking: initialData?.negativeMarking || false,
      negativeMarks: initialData?.negativeMarks || 0,
      status: initialData?.status || 'Draft',
    },
  })

  const watchNegativeMarking = form.watch('negativeMarking')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. Midterm Science Exam' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='code'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paper Code</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g. SCI101' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='subject'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select subject' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Science'>Science</SelectItem>
                        <SelectItem value='Mathematics'>Mathematics</SelectItem>
                        <SelectItem value='History'>History</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select exam type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Quiz'>Quiz</SelectItem>
                        <SelectItem value='Midterm'>Midterm</SelectItem>
                        <SelectItem value='Final'>Final</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select language' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='English'>English</SelectItem>
                        <SelectItem value='Spanish'>Spanish</SelectItem>
                        <SelectItem value='French'>French</SelectItem>
                      </SelectContent>
                    </Select>
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
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='totalMarks'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Marks</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex flex-col gap-4'>
                <FormField
                  control={form.control}
                  name='negativeMarking'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>Negative Marking</FormLabel>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {watchNegativeMarking && (
                  <FormField
                    control={form.control}
                    name='negativeMarks'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Negative Marks</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            step='0.1'
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name='instructions'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions for Candidates</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Write instructions...'
                      className='resize-none'
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-4'>
              <Button type='button' variant='outline'>
                Cancel
              </Button>
              <Button type='submit'>Save Basic Info</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
