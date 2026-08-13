import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/user/user.store';
import { topicApi } from '../api/topic.api';
import { subjectApi } from '../api/subject.api';
import { chapterApi } from '../api/chapter.api';
import { examApi } from '../api/exam.api';
import type { Topic } from '../api/topic.api';
import type { Subject } from '../api/subject.api';
import type { AxiosError } from 'axios';
import { useFieldArray } from 'react-hook-form';

const formSchema = z.object({
  examId: z.string().min(1, "Exam is required"),
  category: z.string().min(1, "Category is required"),
  subjects: z.array(z.object({
    subjectName: z.string().min(1, "Subject is required"),
    subjectCode: z.string().min(1, "Subject Code is required"),
    topics: z.string().min(1, "Topics are required"),
  })).min(1, "At least one subject is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof formSchema>;

export const TopicManagementPage = () => {
  const { toast } = useToast();
  const profile = useUserStore((state) => state.profile);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subjectsList, setSubjectsList] = useState<Subject[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      examId: '',
      category: '',
      subjects: [{ subjectName: '', subjectCode: '', topics: '' }],
      description: '',
    },
  });

  const watchSubjects = form.watch('subjects');
  const endOfListRef = useRef<HTMLDivElement>(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects"
  });

  const fetchTopics = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await topicApi.getAll({ search, limit: 50 });
      if (res.success) {
        setTopics(res.data.topics || []);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch topics', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [search, toast]);

  const watchExamId = form.watch('examId');

  useEffect(() => {
    if (watchExamId) {
      const selectedExam = exams.find(e => e._id === watchExamId);
      if (selectedExam && selectedExam.subjects) {
        setSubjectsList(selectedExam.subjects.map((s: any) => ({
          _id: s.name,
          subjectName: s.name,
        } as Subject)));
      } else {
        setSubjectsList([]);
      }
    } else {
      setSubjectsList([]);
    }
  }, [watchExamId, exams]);

  const fetchExams = useCallback(async () => {
    try {
      const res = await examApi.getAll({ limit: 100 });
      if (res.success) {
        setExams(res.data.exams || []);
      }
    } catch (error) {
      // Handle error quietly
    }
  }, []);

  useEffect(() => {
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditAll = (exam: any, subjects: any[]) => {
    setEditingExamId(exam._id);
    
    const formSubjects = subjects.map(sub => {
      const matchingSub = subjectsList.find(s => s.subjectName === sub.subjectName);
      return {
        subjectName: matchingSub ? matchingSub._id : sub.subjectName,
        subjectCode: sub.topics.length > 0 ? sub.topics[0].topicCode.split('-')[0] : '',
        topics: sub.topics.map((t: any) => t.topicName).join(', ')
      };
    });

    if (formSubjects.length === 0) {
      formSubjects.push({ subjectName: '', subjectCode: '', topics: '' });
    }

    form.reset({
      examId: exam._id,
      category: exam.examCategory || '',
      subjects: formSubjects,
      description: exam.description || ''
    });

    setIsDialogOpen(true);
  };

  const handleRemoveAll = async (exam: any, subjects: any[]) => {
    if (confirm(`Are you sure you want to remove all topics for "${exam.examName || exam.examTitle}"?`)) {
      try {
        const topicsToDelete = subjects.flatMap(s => s.topics);
        await Promise.all(topicsToDelete.map(t => topicApi.delete(t._id)));
        toast({ title: 'Success', description: 'All topics removed successfully', variant: 'success' });
        fetchTopics();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to remove some topics', variant: 'destructive' });
      }
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (!profile?.companyId) {
        toast({ title: 'Error', description: 'Company ID not found', variant: 'destructive' });
        return;
      }
      
      const companyId = profile.companyId;
      const now = Date.now();

      if (editingExamId) {
        const existingExamGroup = groupedData.examGroups.find(g => g.exam._id === editingExamId);
        const existingTopics = existingExamGroup ? existingExamGroup.subjects.flatMap(s => s.topics) : [];
        const topicNamesToKeep = new Set<string>();
        const newTopicsToCreate = [];

        for (const block of values.subjects) {
          if (!block.subjectName || !block.topics) continue;
          
          const matchingSub = subjectsList.find(s => s._id === block.subjectName);
          const actualSubjectName = matchingSub ? matchingSub.subjectName : block.subjectName;
          const topicNames = block.topics.split(',').map(t => t.trim()).filter(t => t.length > 0);
          
          let count = 1;
          for (const topicName of topicNames) {
            const existingTopic = existingTopics.find(t => {
              const tSubId = t.subjectId?._id || t.subjectId;
              const tSubName = t.subjectId?.subjectName || t.subjectName;
              return (tSubId === block.subjectName || tSubName === actualSubjectName) && t.topicName === topicName;
            });
            
            if (existingTopic) {
              topicNamesToKeep.add(existingTopic._id);
            } else {
              const payload: any = {
                companyId,
                subjectName: actualSubjectName,
                topicName,
                topicCode: block.subjectCode ? `${block.subjectCode}-${count}` : `TOPIC-${now}-${count}`,
                topicNumber: count,
                displayOrder: count,
                description: values.description
              };
              if (/^[0-9a-fA-F]{24}$/.test(block.subjectName)) {
                payload.subjectId = block.subjectName;
              }
              newTopicsToCreate.push(payload);
            }
            count++;
          }
        }

        const topicsToDelete = existingTopics.filter(t => !topicNamesToKeep.has(t._id));
        await Promise.all(topicsToDelete.map(t => topicApi.delete(t._id)));
        await Promise.all(newTopicsToCreate.map(payload => topicApi.create(payload)));
      } else {
        const payloads = [];
        for (const block of values.subjects) {
          if (!block.subjectName || !block.topics) continue;
          
          const matchingSub = subjectsList.find(s => s._id === block.subjectName);
          const actualSubjectName = matchingSub ? matchingSub.subjectName : block.subjectName;
          
          const topicNames = block.topics.split(',').map(t => t.trim()).filter(t => t.length > 0);
          let count = 1;
          for (const topicName of topicNames) {
             const payload: any = {
               companyId,
               subjectName: actualSubjectName,
               topicName,
               topicCode: block.subjectCode ? `${block.subjectCode}-${count}` : `TOPIC-${now}-${count}`,
               topicNumber: count,
               displayOrder: count,
               description: values.description
             };
             if (/^[0-9a-fA-F]{24}$/.test(block.subjectName)) {
               payload.subjectId = block.subjectName;
             }
             payloads.push(payload);
             count++;
          }
        }
        await Promise.all(payloads.map(p => topicApi.create(p)));
      }
      
      toast({ title: 'Success', description: editingExamId ? 'Topics updated successfully' : 'Topics created successfully', variant: 'success' });
      setIsDialogOpen(false);
      setEditingExamId(null);
      form.reset();
      fetchTopics();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to process topics', 
        variant: 'destructive' 
      });
    }
  };

  const groupedData = React.useMemo(() => {
    const examGroups: { exam: any, subjects: { subjectName: string, topics: Topic[] }[] }[] = [];
    const usedTopicIds = new Set<string>();

    exams.forEach(exam => {
      const examSubjects: { subjectName: string, topics: Topic[] }[] = [];
      if (exam.subjects) {
        exam.subjects.forEach((sub: any) => {
          const subjectTopics = topics.filter(t => 
            t.subjectId?.subjectName === sub.name || 
            t.subjectName === sub.name
          );
          subjectTopics.forEach(t => usedTopicIds.add(t._id));
          examSubjects.push({
            subjectName: sub.name,
            topics: subjectTopics
          });
        });
      }
      examGroups.push({
        exam,
        subjects: examSubjects
      });
    });

    const otherTopics = topics.filter(t => !usedTopicIds.has(t._id));

    return { examGroups, otherTopics };
  }, [exams, topics]);

  const handleDeleteTopic = async (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      try {
        await topicApi.delete(id);
        toast({ title: 'Success', description: 'Topic deleted successfully', variant: 'success' });
        fetchTopics();
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete topic', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Topics</h1>
          <p className="text-muted-foreground">Manage topics for chapters</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingExamId(null);
            form.reset({
              examId: '',
              category: '',
              subjects: [{ subjectName: '', subjectCode: '', topics: '' }],
              description: '',
            });
          }
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-50 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingExamId ? 'Edit Topics' : 'Create New Topic'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="examId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Exam</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              <SelectValue placeholder="Select Exam" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exams.map((exam) => (
                              <SelectItem key={exam._id} value={exam._id}>
                                {exam.examName || exam.examTitle}
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Science" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-slate-700 rounded-md bg-slate-800/50 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Subject {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-400"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.subjectName`}
                          render={({ field: fProps }) => (
                            <FormItem>
                              <FormLabel>Subject Name</FormLabel>
                              <Select onValueChange={fProps.onChange} defaultValue={fProps.value} disabled={!watchExamId}>
                                <FormControl>
                                  <SelectTrigger className="bg-slate-900 border-slate-700">
                                    <SelectValue placeholder="Select Subject" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjectsList
                                    .filter(
                                      (sub) =>
                                        !watchSubjects?.some(
                                          (ws, i) => ws.subjectName === sub._id && i !== index
                                        )
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
                                <Input placeholder="e.g. SUB-01" className="bg-slate-900 border-slate-700" {...fProps} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`subjects.${index}.topics`}
                          render={({ field: fProps }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Topics (Comma Separated)</FormLabel>
                              <FormControl>
                                <Input placeholder="Topic 1, Topic 2, Topic 3" className="bg-slate-900 border-slate-700" {...fProps} />
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
                    type="button"
                    variant="outline"
                    className="w-full border-dashed border-slate-700"
                    onClick={() => {
                      append({ subjectName: '', subjectCode: '', topics: '' });
                      setTimeout(() => {
                        endOfListRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Subject
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Description..." className="bg-slate-800 border-slate-700" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingExamId ? 'Save Changes' : 'Create Topic'}</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            className="pl-9 bg-slate-800 border-slate-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading topics...</div>
      ) : (
        <div className="space-y-8">
          {groupedData.examGroups.map(({ exam, subjects }) => (
            <Card key={exam._id} className="bg-slate-900/40 border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/60 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">{exam.examName || exam.examTitle}</h2>
                  {exam.description && <p className="text-sm text-slate-400 mt-1">{exam.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                    {subjects.length} Subjects
                  </Badge>
                  <Button variant="outline" size="sm" className="h-8 border-slate-700 text-slate-300" onClick={() => handleEditAll(exam, subjects)}>
                    Edit All
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 border-slate-700 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => handleRemoveAll(exam, subjects)}>
                    Remove All
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {subjects.map(({ subjectName, topics: subjectTopics }, idx) => (
                    <Card key={idx} className="bg-slate-900 border-slate-800 shadow-sm">
                      <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-slate-200">{subjectName}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs bg-slate-800/50">
                          {subjectTopics.length} Topics
                        </Badge>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {subjectTopics.length > 0 ? (
                            subjectTopics.map(t => (
                              <Badge key={t._id} variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-normal px-2.5 py-1">
                                {t.topicName}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-slate-500 italic">No topics assigned</span>
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
            <Card className="bg-slate-900/40 border-slate-800 overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/60">
                <h2 className="text-xl font-semibold text-slate-100">Other Subjects</h2>
                <p className="text-sm text-slate-400 mt-1">Topics not associated with any exam&apos;s subjects</p>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {groupedData.otherTopics.map(t => (
                    <Badge key={t._id} variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 font-normal px-2.5 py-1">
                      {t.topicName} {t.subjectName ? `(${t.subjectName})` : ''}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {groupedData.examGroups.length === 0 && groupedData.otherTopics.length === 0 && (
            <div className="text-center p-12 text-slate-500 border border-slate-800 rounded-lg bg-slate-900/20">
              No topics found. Create a topic to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
