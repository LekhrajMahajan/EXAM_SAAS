import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { topicApi, type Topic } from '@/features/exam-manager/api/topic.api';
import { examApi } from '@/features/exam-manager/api/exam.api';

export const CompanySubjectTopicsPage = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<string>('ALL');

  // Track which exam groups are expanded (by exam._id)
  const [expandedExams, setExpandedExams] = useState<Set<string>>(new Set());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const getDisplayStatus = React.useCallback((exam: any) => {
    if (exam.displayStatus) return exam.displayStatus;
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

  const getStatusBadgeConfig = (status?: string) => {
    if (!status) return { label: 'UNKNOWN', className: 'bg-slate-500 text-white' };
    const s = status.toUpperCase();
    const config: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: 'ACTIVE', className: 'bg-[#4A5D23] hover:bg-[#3d4d1d] text-white' },
      DRAFT: { label: 'DRAFT', className: 'bg-slate-500 hover:bg-slate-600 text-white' },
      EXAM_STARTED: { label: 'EXAM STARTED', className: 'bg-amber-600 hover:bg-amber-700 text-white' },
      EXAM_ENDED: { label: 'EXAM ENDED', className: 'bg-red-600 hover:bg-red-700 text-white' },
      COMPLETED: { label: 'COMPLETED', className: 'bg-slate-600 hover:bg-slate-700 text-white' },
      RESULT_GENERATED: { label: 'RESULT GENERATED', className: 'bg-purple-600 hover:bg-purple-700 text-white' },
      CANCELLED: { label: 'CANCELLED', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
      INACTIVE: { label: 'INACTIVE', className: 'bg-gray-400 hover:bg-gray-500 text-white' },
    };
    return config[s] || { label: s.replace(/_/g, ' '), className: 'bg-slate-500 text-white' };
  };

  const toggleExam = (examId: string) => {
    setExpandedExams(prev => {
      const next = new Set(prev);
      if (next.has(examId)) {
        next.delete(examId);
      } else {
        next.add(examId);
      }
      return next;
    });
  };

  useEffect(() => {
    let ignore = false;
    const loadTopics = async () => {
      try {
        const res = await topicApi.getAll({ search, limit: 1000 });
        if (!ignore && res.success) {
          setTopics(res.data.topics || []);
        }
      } catch (error) {
        if (!ignore) console.error('Failed to fetch topics', error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    void loadTopics();
    return () => { ignore = true; };
  }, [search]);

  useEffect(() => {
    let ignore = false;
    const loadExams = async () => {
      try {
        const res = await examApi.getAll({ limit: 100 });
        if (!ignore && res.success) {
          setExams(res.data.exams || []);
        }
      } catch (error) {
        if (!ignore) console.error('Failed to fetch exams', error);
      }
    };
    void loadExams();
    return () => { ignore = true; };
  }, []);

  const groupedData = React.useMemo(() => {
    const examGroups: { exam: any, subjects: { subjectName: string, topics: Topic[] }[] }[] = [];
    const usedTopicIds = new Set<string>();

    exams.forEach(exam => {
      const examSubjects: { subjectName: string, topics: Topic[] }[] = [];
      if (exam.subjects) {
        exam.subjects.forEach((sub: any) => {
          const subjectTopics = topics.filter(t => {
            const tExamId = (t.examId as any)?._id || t.examId;
            const matchesExam = tExamId?.toString() === exam._id?.toString();
            const tSubName = t.subjectId?.subjectName || t.subjectName;
            const matchesSubject = tSubName === sub.name;
            return matchesExam && matchesSubject;
          });
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

  // Apply exam filter
  const filteredExamGroups = selectedExamId === 'ALL'
    ? groupedData.examGroups
    : groupedData.examGroups.filter(({ exam }) => exam._id === selectedExamId);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Subject Topics</h1>
          <p className="text-muted-foreground">View topics assigned to subjects by the Exam Manager</p>
        </div>
      </div>

      {/* Search + Exam Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            className="pl-9 bg-background border-border"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsLoading(true);
            }}
          />
        </div>

        {/* Exam Filter Dropdown */}
        <Select value={selectedExamId} onValueChange={setSelectedExamId}>
          <SelectTrigger className="w-full sm:w-64 bg-background border-border text-foreground">
            <SelectValue placeholder="All Exams" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="ALL" className="text-foreground">
              All Exams
            </SelectItem>
            {exams.map(exam => (
              <SelectItem key={exam._id} value={exam._id} className="text-foreground">
                {exam.examName || exam.examTitle || 'Unnamed Exam'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground">Loading topics...</div>
      ) : (
        <div className="space-y-4">
          {filteredExamGroups.map(({ exam, subjects }) => {
            const isExpanded = expandedExams.has(exam._id);
            return (
              <Card key={exam._id} className="bg-card border-border overflow-hidden shadow-sm">
                {/* Clickable Header */}
                <button
                  type="button"
                  onClick={() => toggleExam(exam._id)}
                  className="w-full p-6 border-b border-border bg-muted/40 hover:bg-muted/70 transition-colors flex justify-between items-center text-left"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-foreground">{exam.examName || exam.examTitle}</h2>
                      {exam && (
                        <ExamStatusBadge exam={exam} className="text-[10px] py-0 h-5" />
                      )}
                    </div>
                    {exam.description && (
                      <p className="text-sm text-muted-foreground mt-1">{exam.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Badge className="bg-primary/10 text-primary border border-primary/20 font-medium">
                      {subjects.length} Subjects
                    </Badge>
                    <div className="h-8 w-8 rounded-lg border border-border bg-background flex items-center justify-center shadow-sm">
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      }
                    </div>
                  </div>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {subjects.map(({ subjectName, topics: subjectTopics }, idx) => (
                        <Card key={idx} className="bg-background border-border shadow-sm">
                          <div className="p-4 border-b border-border flex justify-between items-center">
                            <h3 className="font-medium text-foreground">{subjectName}</h3>
                            <Badge variant="outline" className="text-xs text-primary border-primary/30 bg-primary/5">
                              {subjectTopics.length} Topics
                            </Badge>
                          </div>
                          <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {subjectTopics.length > 0 ? (
                                subjectTopics.map(t => (
                                  <Badge
                                    key={t._id}
                                    variant="secondary"
                                    className="bg-[#f0fce0] text-[#3a5a1a] border border-[#c8e89a] font-normal px-2.5 py-1 hover:bg-[#e2f7c0] transition-colors"
                                  >
                                    {t.topicName}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground italic">No topics assigned</span>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {groupedData.otherTopics.length > 0 && selectedExamId === 'ALL' && (
            <Card className="bg-card border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-muted/40">
                <h2 className="text-xl font-semibold text-foreground">Other Subjects</h2>
                <p className="text-sm text-muted-foreground mt-1">Topics not associated with any exam&apos;s subjects</p>
              </div>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2">
                  {groupedData.otherTopics.map(t => (
                    <Badge
                      key={t._id}
                      variant="secondary"
                      className="bg-[#f0fce0] text-[#3a5a1a] border border-[#c8e89a] font-normal px-2.5 py-1"
                    >
                      {t.topicName} {t.subjectName ? `(${t.subjectName})` : ''}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {filteredExamGroups.length === 0 && groupedData.otherTopics.length === 0 && (
            <div className="text-center p-12 text-muted-foreground border border-border rounded-lg bg-muted/20">
              No topics found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
