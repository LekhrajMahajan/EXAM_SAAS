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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { examApi } from '../api/exam.api';
import type { Exam } from '../api/exam.api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { getDisplayStatus } from '@/shared/utils/exam-status';
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge';

export const ExamListPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [examNameFilter, setExamNameFilter] = useState('ALL');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Dynamic display status: prefer server-computed, fallback to client-side
  const getDisplayStatusMemoized = useCallback((exam: Exam): string => {
    return getDisplayStatus(exam, now);
  }, [now]);

  // Check if exam is in an editable state (only ACTIVE/DRAFT before start)
  // Exception: RESERVEBA (RBI), STAFFSELF, STAFFSELE can be edited anytime
  const isEditable = useCallback((exam: Exam): boolean => {
    if (['STAFFSELF', 'STAFFSELE', 'RESERVEBA'].includes(exam.examCode)) {
      return true;
    }
    return ['ACTIVE', 'DRAFT'].includes(getDisplayStatusMemoized(exam));
  }, [getDisplayStatusMemoized]);

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

  const filteredExams = exams.filter(exam => {
    if (modeFilter !== 'ALL' && exam.examMode !== modeFilter) return false;
    if (statusFilter !== 'ALL' && getDisplayStatusMemoized(exam) !== statusFilter) return false;
    if (examNameFilter !== 'ALL' && (exam._id || (exam as any).id) !== examNameFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exams</h1>
          <p className="text-muted-foreground">Manage all your examinations</p>
        </div>
        {user?.role !== 'Company Admin' && (
          <Button variant="outline" className="hover:bg-[#2D3E2C] hover:text-white dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C]" onClick={() => navigate('new')}>
            <Plus className="mr-2 h-4 w-4" /> Create Exam
          </Button>
        )}
      </div>

      <Card className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                className="pl-9 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select value={examNameFilter} onValueChange={setExamNameFilter}>
              <SelectTrigger className="w-[200px] bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-200">
                <SelectValue placeholder="All Exams" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Exams</SelectItem>
                {exams.map(exam => (
                  <SelectItem key={exam._id} value={exam._id}>
                    {exam.examTitle || (exam as any).examName || 'Unnamed Exam'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-[150px] bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-200">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Modes</SelectItem>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="OFFLINE">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="EXAM_STARTED">Exam Started</SelectItem>
                <SelectItem value="PENDING_RESULT_GENERATE">Pending Result Generate</SelectItem>
                <SelectItem value="PENDING_PUBLISH_RESULT">Pending Publish Result</SelectItem>
                <SelectItem value="RESULT_PUBLISHED">Result Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
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
                  ) : filteredExams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No exams found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExams.map((exam) => (
                      <TableRow key={exam._id}>
                        <TableCell className="font-medium">{exam.examCode}</TableCell>
                        <TableCell>{exam.examTitle}</TableCell>
                        <TableCell>{new Date(exam.examDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{exam.examMode}</Badge>
                        </TableCell>
                        <TableCell>
                          <ExamStatusBadge exam={exam} />
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
        <DialogContent className="sm:max-w-[650px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Exam Details</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <div className="space-y-5 mt-2 max-h-[75vh] overflow-y-auto pr-2">

              {/* ── Basic Information ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Basic Information</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Title</p>
                    <p className="font-medium text-sm">{selectedExam.examTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Code</p>
                    <p className="font-medium text-sm">{selectedExam.examCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium text-sm">{selectedExam.examCategory || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium text-sm">{selectedExam.examType || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mode</p>
                    <p className="font-medium text-sm">{selectedExam.examMode || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Language</p>
                    <p className="font-medium text-sm">{selectedExam.language || '-'}</p>
                  </div>
                  {selectedExam.difficulty && (
                    <div>
                      <p className="text-xs text-muted-foreground">Difficulty</p>
                      <p className="font-medium text-sm">{selectedExam.difficulty}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Schedule & Timing ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Schedule &amp; Timing</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Exam Date</p>
                    <p className="font-medium text-sm">{new Date(selectedExam.examDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium text-sm">{selectedExam.duration} mins</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Start Time</p>
                    <p className="font-medium text-sm">{selectedExam.startTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Time</p>
                    <p className="font-medium text-sm">{selectedExam.endTime}</p>
                  </div>
                  {selectedExam.shift && (
                    <div>
                      <p className="text-xs text-muted-foreground">Shift</p>
                      <p className="font-medium text-sm">{selectedExam.shift}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Marking Scheme ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Marking Scheme</p>
                <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Marks</p>
                    <p className="font-medium text-sm">{selectedExam.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Positive Marks</p>
                    <p className="font-medium text-sm">{selectedExam.passingMarks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Negative Marks</p>
                    <p className="font-medium text-sm">{selectedExam.negativeMarks ?? '-'}</p>
                  </div>
                </div>
              </div>

              {/* ── Shuffle Options ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Shuffle Options</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedExam.shuffleSubjects ? 'bg-[#2D3E2C]' : 'bg-slate-300'}`} />
                    <span className="text-sm">Shuffle Subjects: <strong>{selectedExam.shuffleSubjects ? 'On' : 'Off'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedExam.shuffleQuestions ? 'bg-[#2D3E2C]' : 'bg-slate-300'}`} />
                    <span className="text-sm">Shuffle Questions: <strong>{selectedExam.shuffleQuestions ? 'On' : 'Off'}</strong></span>
                  </div>
                </div>
              </div>

              {/* ── Proctoring & Anti-Cheat ── */}
              {selectedExam.securitySettings && (
                (() => {
                  const activeSettings = [
                    { label: 'Face Monitoring', enabled: selectedExam.securitySettings!.faceDetectionEnabled, value: selectedExam.securitySettings!.faceDetectionLimit, unit: 'sec' },
                    { label: 'Multiple / Wrong Faces', enabled: selectedExam.securitySettings!.multipleFacesEnabled, value: selectedExam.securitySettings!.multipleFacesLimit, unit: 'sec' },
                    { label: 'Proctoring Warning Limit', enabled: selectedExam.securitySettings!.proctoringWarningEnabled, value: selectedExam.securitySettings!.proctoringWarningLimit, unit: 'warnings' },
                    { label: 'Tab Switching Prevention', enabled: selectedExam.securitySettings!.tabSwitchingEnabled, value: null, unit: '' },
                    { label: 'Browser Lock', enabled: selectedExam.securitySettings!.browserLock, value: null, unit: '' },
                    { label: 'Full Screen Mode', enabled: selectedExam.securitySettings!.fullScreenMode, value: null, unit: '' },
                    { label: 'Copy/Paste Allowed', enabled: selectedExam.securitySettings!.copyPasteAllowed, value: null, unit: '' },
                    { label: 'Right Click Disabled', enabled: selectedExam.securitySettings!.rightClickDisabled, value: null, unit: '' },
                    { label: 'Developer Tools Blocked', enabled: selectedExam.securitySettings!.developerToolsBlocked, value: null, unit: '' },
                  ].filter(item => item.enabled === true);

                  if (activeSettings.length === 0) return null;

                  return (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Proctoring &amp; Anti-Cheat Settings</p>
                      <div className="grid grid-cols-1 gap-y-2 text-sm">
                        {activeSettings.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-muted/40 rounded px-3 py-2">
                            <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                            <div className="flex items-center gap-2">
                              {item.value !== null && item.value !== undefined && (
                                <span className="text-xs text-muted-foreground">{item.value} {item.unit}</span>
                              )}
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#2D3E2C]/10 text-[#2D3E2C] dark:bg-[#2D3E2C]/30 dark:text-slate-200 border border-[#2D3E2C]/30">
                                ON
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              )}

              {/* ── Instructions ── */}
              {selectedExam.instructions && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Instructions</p>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-md text-sm whitespace-pre-wrap">
                    {selectedExam.instructions}
                  </div>
                </div>
              )}

              {/* ── Subjects ── */}
              {selectedExam.subjects && selectedExam.subjects.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Exam Paper Subjects</p>
                  <div className="rounded-md border border-slate-200 dark:border-slate-800">
                    <Table>
                      <TableHeader className="bg-[#2D3E2C] [&_th]:text-white">
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
