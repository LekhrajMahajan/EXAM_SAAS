import React, { useEffect, useState, useCallback } from 'react';
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
import { examApi } from '../api/exam.api';
import { examShiftApi } from '../api/exam-shift.api';
import type { Exam } from '../api/exam.api';
import type { ExamShift } from '../api/exam-shift.api';
import { AxiosError } from 'axios';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const formSchema = z.object({
  examId: z.string().min(1, "Exam is required"),
  shiftCode: z.string().min(1),
  shiftName: z.string().min(2),
  shiftNumber: z.union([z.string(), z.number()]).transform(v => Number(v)),
  reportingTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
  gateClosingTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
  startTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(timeRegex, "Invalid time format (HH:mm)"),
  duration: z.union([z.string(), z.number()]).transform(v => Number(v)),
});

type FormValues = {
  examId: string;
  shiftCode: string;
  shiftName: string;
  shiftNumber: string | number;
  reportingTime: string;
  gateClosingTime: string;
  startTime: string;
  endTime: string;
  duration: string | number;
};

export const ExamSchedulingPage = () => {
  const { toast } = useToast();
  const profile = useUserStore((state) => state.profile);
  const [shifts, setShifts] = useState<ExamShift[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>('all');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      examId: '',
      shiftCode: '',
      shiftName: '',
      shiftNumber: 1,
      reportingTime: '',
      gateClosingTime: '',
      startTime: '',
      endTime: '',
      duration: 120,
    },
  });

  const fetchExams = useCallback(async () => {
    try {
      const res = await examApi.getAll({ limit: 100 });
      if (res.success) {
        setExams(res.data.exams || []);
      }
    } catch (error) {
      // Handle silently
    }
  }, []);

  const fetchShifts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = {
        search,
        limit: 50,
        ...(selectedExamId !== 'all' ? { examId: selectedExamId } : {})
      };
      const res = await examShiftApi.getAll(params);
      if (res.success) {
        setShifts(res.data.examShifts || []);
      }
    } catch (error: unknown) {
      toast({ title: 'Error', description: 'Failed to fetch shifts', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedExamId, toast]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

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

      await examShiftApi.create(payload);
      
      toast({ title: 'Success', description: 'Exam shift created successfully', variant: 'success' });
      setIsDialogOpen(false);
      form.reset();
      fetchShifts();
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to create shift', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exam Scheduling & Shifts</h1>
          <p className="text-muted-foreground">Manage exam dates and shifts</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Shift
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-slate-50">
            <DialogHeader>
              <DialogTitle>Create New Exam Shift</DialogTitle>
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
                              <SelectValue placeholder="Select an Exam" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {exams.map((exam) => (
                              <SelectItem key={exam._id} value={exam._id}>
                                {exam.examTitle}
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
                    name="shiftCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. S1" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shiftName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Morning Shift" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shiftNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shift Number</FormLabel>
                        <FormControl>
                          <Input type="number" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reportingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reporting Time (HH:mm)</FormLabel>
                        <FormControl>
                          <Input placeholder="08:00" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gateClosingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gate Closing Time (HH:mm)</FormLabel>
                        <FormControl>
                          <Input placeholder="08:30" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time (HH:mm)</FormLabel>
                        <FormControl>
                          <Input placeholder="09:00" className="bg-slate-800 border-slate-700" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time (HH:mm)</FormLabel>
                        <FormControl>
                          <Input placeholder="11:00" className="bg-slate-800 border-slate-700" {...field} />
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
                        <FormLabel>Duration (Minutes)</FormLabel>
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
                  <Button type="submit">Create Shift</Button>
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
                placeholder="Search shifts..."
                className="pl-9 bg-slate-800 border-slate-700"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-64">
              <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Filter by Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {exams.map((exam) => (
                    <SelectItem key={exam._id} value={exam._id}>
                      {exam.examTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow>
                    <TableHead>Shift</TableHead>
                    <TableHead>Reporting</TableHead>
                    <TableHead>Gate Close</TableHead>
                    <TableHead>Timing</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Loading shifts...
                      </TableCell>
                    </TableRow>
                  ) : shifts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        No shifts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    shifts.map((shift) => (
                      <TableRow key={shift._id}>
                        <TableCell>
                          <div className="font-medium">{shift.shiftCode}</div>
                          <div className="text-xs text-muted-foreground">{shift.shiftName}</div>
                        </TableCell>
                        <TableCell>{shift.reportingTime}</TableCell>
                        <TableCell>{shift.gateClosingTime}</TableCell>
                        <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                        <TableCell>{shift.duration} min</TableCell>
                        <TableCell>
                          <Badge variant={shift.status === 'ACTIVE' ? 'success' : 'secondary'}>
                            {shift.status}
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
