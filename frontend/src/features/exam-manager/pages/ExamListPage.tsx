import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Lock } from 'lucide-react';
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
} from '@/shared/components/ui/dialog';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { examApi } from '../api/exam.api';
import type { Exam } from '../api/exam.api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const ExamListPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Dynamic display status: prefer server-computed, fallback to client-side
  const getDisplayStatus = useCallback((exam: Exam): string => {
    // If server already computed it, use that
    if (exam.displayStatus) return exam.displayStatus;

    // Client-side fallback
    if ((exam as any).isResultPublished) return 'RESULT_GENERATED';
    if (['COMPLETED', 'CANCELLED', 'ARCHIVED', 'EXAM_ENDED', 'RESULT_GENERATED'].includes(exam.status)) return exam.status;

    if (exam.status === 'ACTIVE' || exam.status === 'EXAM_STARTED') {
      try {
        const examDate = new Date(exam.examDate);
        const [startH, startM] = (exam.startTime || '').split(':').map(Number);
        if (isNaN(startH) || isNaN(startM)) return exam.status;
        const startDT = new Date(examDate);
        startDT.setHours(startH, startM, 0, 0);

        const [endH, endM] = (exam.endTime || '').split(':').map(Number);
        if (!isNaN(endH) && !isNaN(endM)) {
          const endDT = new Date(examDate);
          endDT.setHours(endH, endM, 0, 0);
          if (now >= endDT) return 'EXAM_ENDED';
          if (now >= startDT) return 'EXAM_STARTED';
        } else {
          if (now >= startDT) return 'EXAM_STARTED';
        }
      } catch {
        // fallback
      }
    }
    return exam.status;
  }, [now]);

  // Check if exam is in an editable state (only ACTIVE/DRAFT before start)
  const isEditable = useCallback((exam: Exam): boolean => {
    if (exam.examCode === 'STAFFSELF' || exam.examCode === 'STAFFSELE') return true;
    const ds = getDisplayStatus(exam);
    return ['ACTIVE', 'DRAFT'].includes(ds);
  }, [getDisplayStatus]);

  // Status badge config
  const getStatusBadge = useCallback((exam: Exam) => {
    const ds = getDisplayStatus(exam);
    const config: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: 'ACTIVE', className: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
      DRAFT: { label: 'DRAFT', className: 'bg-slate-500 hover:bg-slate-600 text-white' },
      EXAM_STARTED: { label: 'EXAM STARTED', className: 'bg-amber-600 hover:bg-amber-700 text-white' },
      EXAM_ENDED: { label: 'EXAM ENDED', className: 'bg-red-600 hover:bg-red-700 text-white' },
      COMPLETED: { label: 'COMPLETED', className: 'bg-slate-600 hover:bg-slate-700 text-white' },
      RESULT_GENERATED: { label: 'RESULT GENERATED', className: 'bg-purple-600 hover:bg-purple-700 text-white' },
      CANCELLED: { label: 'CANCELLED', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
      INACTIVE: { label: 'INACTIVE', className: 'bg-gray-400 hover:bg-gray-500 text-white' },
    };
    const c = config[ds] || { label: ds, className: 'bg-slate-500 text-white' };
    return c;
  }, [getDisplayStatus]);

  // Re-check every 30 seconds so badges update live when exam time arrives
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        const res = await examApi.delete(id);
        if (res.success) {
          toast({ title: 'Success', description: 'Exam deleted successfully', variant: 'success' });
          fetchExams();
        }
      } catch {
        toast({ title: 'Error', description: 'Failed to delete exam', variant: 'destructive' });
      }
    }
  };

  const fetchExams = async () => {
    try {
      setIsLoading(true);
      const res = await examApi.getAll({ search, limit: 50 });
      if (res.success) {
        setExams(res.data.exams || []);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to fetch exams', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
          <p className="text-muted-foreground">Manage all your examinations</p>
        </div>
        {user?.role !== 'Company Admin' && (
          <Button onClick={() => navigate('new')}>
            <Plus className="mr-2 h-4 w-4" /> Create Exam
          </Button>
        )}
      </div>

      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                className="pl-9"
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
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Loading exams...
                      </TableCell>
                    </TableRow>
                  ) : exams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No exams found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    exams.map((exam) => (
                      <TableRow key={exam._id}>
                        <TableCell className="font-medium">{exam.examCode}</TableCell>
                        <TableCell>{exam.examTitle}</TableCell>
                        <TableCell>{new Date(exam.examDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{exam.examMode}</Badge>
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const badge = getStatusBadge(exam);
                            return (
                              <Badge variant="default" className={badge.className}>
                                {badge.label}
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setSelectedExam(exam);
                            setIsViewDialogOpen(true);
                          }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user?.role !== 'Company Admin' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={!isEditable(exam)}
                                title={!isEditable(exam) ? 'Editing is disabled for this exam state' : 'Edit exam'}
                                onClick={() => navigate(`${exam._id}/edit`)}
                              >
                                {!isEditable(exam) ? (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Edit className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                disabled={!isEditable(exam)}
                                title={!isEditable(exam) ? 'Deletion is disabled for this exam state' : 'Delete exam'}
                                onClick={() => handleDelete(exam._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
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

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-800 text-slate-50">
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">{selectedExam.examTitle}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Code</p>
                  <p className="font-medium">{selectedExam.examCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedExam.examCategory || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{selectedExam.examType || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mode</p>
                  <p className="font-medium">{selectedExam.examMode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedExam.examDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{selectedExam.startTime} - {selectedExam.endTime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{selectedExam.duration} mins</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Marks</p>
                  <p className="font-medium">{selectedExam.totalMarks}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Passing Marks</p>
                  <p className="font-medium">{selectedExam.passingMarks}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Negative Marks</p>
                  <p className="font-medium">{selectedExam.negativeMarks}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-medium">{selectedExam.language}</p>
                </div>
              </div>
              
              {selectedExam.instructions && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Instructions</p>
                  <div className="p-3 bg-slate-800 rounded-md text-sm whitespace-pre-wrap">
                    {selectedExam.instructions}
                  </div>
                </div>
              )}

              {selectedExam.subjects && selectedExam.subjects.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Subjects</p>
                  <div className="rounded-md border border-slate-800">
                    <Table>
                      <TableHeader className="bg-slate-900">
                        <TableRow>
                          <TableHead>Subject Name</TableHead>
                          <TableHead className="text-right">Questions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedExam.subjects.map((sub, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{sub.name}</TableCell>
                            <TableCell className="text-right">{sub.questions}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
