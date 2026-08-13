import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subjectSchema, type SubjectFormData } from '../schemas/subjectSchema';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useCreateSubject, useUpdateSubject } from '../hooks/subject.hooks';

interface SubjectFormProps {
  initialData?: Partial<SubjectFormData>;
  isEditing?: boolean;
  subjectId?: string;
}

export function SubjectForm({ initialData, isEditing = false, subjectId }: SubjectFormProps) {
  const navigate = useNavigate();
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject(subjectId || '');

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: initialData?.name || '',
      code: initialData?.code || '',
      description: initialData?.description || '',
      examType: initialData?.examType || '',
      language: initialData?.language || 'English',
      durationMinutes: initialData?.durationMinutes || 60,
      totalQuestions: initialData?.totalQuestions || 50,
      totalMarks: initialData?.totalMarks || 100,
      passingMarks: initialData?.passingMarks || 40,
      negativeMarking: initialData?.negativeMarking || false,
      negativeMarksPerQuestion: initialData?.negativeMarksPerQuestion || 0,
      displayOrder: initialData?.displayOrder || 0,
      category: initialData?.category || 'Competitive',
      status: initialData?.status || 'Active',
    }
  });

  const watchNegativeMarking = watch('negativeMarking');
  const watchCategory = watch('category');
  const watchStatus = watch('status');

  const onSubmit = async (data: SubjectFormData) => {
    try {
      if (isEditing && subjectId) {
        await updateSubjectMutation.mutateAsync(data);
      } else {
        await createSubjectMutation.mutateAsync(data);
      }
      navigate('/company/subjects');
    } catch {
      // handled by mutation error toast
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-10">
      
      {/* General Information */}
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
          <CardDescription>Basic details about the subject.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name <span className="text-red-500">*</span></Label>
              <Input id="name" placeholder="e.g. Advanced Mathematics" {...register('name')} />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Subject Code <span className="text-red-500">*</span></Label>
              <Input id="code" placeholder="e.g. MATH-101" {...register('code')} />
              {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea 
                id="description" 
                placeholder="Brief description of the subject..." 
                className="min-h-[100px]"
                {...register('description')} 
              />
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Category <span className="text-red-500">*</span></Label>
              <Select value={watchCategory} onValueChange={(val: SubjectFormData['category']) => setValue('category', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Competitive">Competitive</SelectItem>
                  <SelectItem value="University">University</SelectItem>
                  <SelectItem value="School">School</SelectItem>
                  <SelectItem value="Recruitment">Recruitment</SelectItem>
                  <SelectItem value="Certification">Certification</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language <span className="text-red-500">*</span></Label>
              <Input id="language" placeholder="e.g. English, Hindi" {...register('language')} />
              {errors.language && <p className="text-xs text-red-500">{errors.language.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examination Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Examination Rules & Structure</CardTitle>
          <CardDescription>Configure the default rules and markings for exams under this subject.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type <span className="text-red-500">*</span></Label>
              <Input id="examType" placeholder="e.g. Multiple Choice" {...register('examType')} />
              {errors.examType && <p className="text-xs text-red-500">{errors.examType.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (Minutes) <span className="text-red-500">*</span></Label>
              <Input id="durationMinutes" type="number" min={1} {...register('durationMinutes', { valueAsNumber: true })} />
              {errors.durationMinutes && <p className="text-xs text-red-500">{errors.durationMinutes.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalQuestions">Total Questions <span className="text-red-500">*</span></Label>
              <Input id="totalQuestions" type="number" min={1} {...register('totalQuestions', { valueAsNumber: true })} />
              {errors.totalQuestions && <p className="text-xs text-red-500">{errors.totalQuestions.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks <span className="text-red-500">*</span></Label>
              <Input id="totalMarks" type="number" min={1} {...register('totalMarks', { valueAsNumber: true })} />
              {errors.totalMarks && <p className="text-xs text-red-500">{errors.totalMarks.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingMarks">Passing Marks <span className="text-red-500">*</span></Label>
              <Input id="passingMarks" type="number" min={1} {...register('passingMarks', { valueAsNumber: true })} />
              {errors.passingMarks && <p className="text-xs text-red-500">{errors.passingMarks.message}</p>}
            </div>

            <div className="space-y-2 flex flex-col justify-center">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="negativeMarking" className="cursor-pointer">Negative Marking</Label>
                <Switch 
                  id="negativeMarking" 
                  checked={watchNegativeMarking}
                  onCheckedChange={(val) => setValue('negativeMarking', val)}
                />
              </div>
            </div>

            {watchNegativeMarking && (
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <Label htmlFor="negativeMarksPerQuestion">Negative Marks Per Question <span className="text-red-500">*</span></Label>
                <Input 
                  id="negativeMarksPerQuestion" 
                  type="number" 
                  step="0.01"
                  min={0.01} 
                  {...register('negativeMarksPerQuestion', { valueAsNumber: true })} 
                />
                {errors.negativeMarksPerQuestion && <p className="text-xs text-red-500">{errors.negativeMarksPerQuestion.message}</p>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Status & Settings</CardTitle>
          <CardDescription>Manage visibility and active status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input id="displayOrder" type="number" min={0} {...register('displayOrder', { valueAsNumber: true })} />
              {errors.displayOrder && <p className="text-xs text-red-500">{errors.displayOrder.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Status <span className="text-red-500">*</span></Label>
              <Select value={watchStatus} onValueChange={(val: SubjectFormData['status']) => setValue('status', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 bg-gray-50 p-4 border-t sticky bottom-0 z-10 rounded-md">
        <Button type="button" variant="outline" onClick={() => navigate('/company/subjects')} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Subject' : 'Create Subject'}
        </Button>
      </div>
    </form>
  );
}
