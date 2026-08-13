import React, { useEffect, useState } from 'react';
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
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/stores/user/user.store';
import { subjectApi } from '../api/subject.api';
import type { Subject } from '../api/subject.api';
import type { AxiosError } from 'axios';

const formSchema = z.object({
  subjectCode: z.string().min(2).max(20),
  subjectName: z.string().min(3).max(150),
  subjectShortName: z.string().min(2).max(20),
  description: z.string().optional(),
  language: z.string().default('English'),
  duration: z.union([z.string(), z.number()]).transform(v => Number(v)),
  totalMarks: z.union([z.string(), z.number()]).transform(v => Number(v)),
  passingMarks: z.union([z.string(), z.number()]).transform(v => Number(v)),
  negativeMarking: z.boolean().default(false),
  negativeMarks: z.union([z.string(), z.number()]).transform(v => Number(v)).optional(),
});

type FormValues = {
  subjectCode: string;
  subjectName: string;
  subjectShortName: string;
  description?: string;
  language?: string;
  duration: string | number;
  totalMarks: string | number;
  passingMarks: string | number;
  negativeMarking: boolean;
  negativeMarks?: string | number;
};

export const SubjectManagementPage = () => {
  const { toast } = useToast();
  const profile = useUserStore((state) => state.profile);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      subjectCode: '',
      subjectName: '',
      subjectShortName: '',
      description: '',
      language: 'English',
      duration: 60,
      totalMarks: 100,
      passingMarks: 35,
      negativeMarking: false,
      negativeMarks: 0,
    },
  });

  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const res = await subjectApi.getAll({ search, limit: 50 });
      if (res.success) {
        setSubjects(res.data.subjects || []);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch subjects', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubjects();
    }, 0);
    return () => clearTimeout(timer);
  }, [search]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (!profile?.companyId) {
        toast({ title: 'Error', description: 'Company ID not found', variant: 'destructive' });
        return;
      }
      
      const payload = {
        ...values,
        companyId: profile.companyId,
      };

      await subjectApi.create(payload);
      
      toast({ title: 'Success', description: 'Subject created successfully', variant: 'success' });
      setIsDialogOpen(false);
      form.reset();
      fetchSubjects();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to create subject', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">Manage subjects for exams</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-800 text-slate-50">
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subjectCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MATH101" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subjectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Mathematics" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subjectShortName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. MATH" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. English" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Mins)</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passingMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passing Marks</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="negativeMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Negative Marks</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Subject</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects..."
                className="pl-9 bg-slate-800 border-slate-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Short Name</TableHead>
                    <TableHead>Marks (Pass/Total)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading subjects...
                      </TableCell>
                    </TableRow>
                  ) : subjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No subjects found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subjects.map((subject) => (
                      <TableRow key={subject._id}>
                        <TableCell className="font-medium">{subject.subjectCode}</TableCell>
                        <TableCell>{subject.subjectName}</TableCell>
                        <TableCell>{subject.subjectShortName}</TableCell>
                        <TableCell>{subject.passingMarks} / {subject.totalMarks}</TableCell>
                        <TableCell>
                          <Badge variant={subject.status === 'ACTIVE' ? 'success' : 'secondary'}>
                            {subject.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
