import React, { useEffect, useState, useMemo } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Loader2, Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { examApi, type Exam } from '@/features/exam-manager/api/exam.api';
import { apiClient } from '@/core/api/http/axios-client';
import { toast } from 'react-hot-toast';
import { getDisplayStatus } from '@/shared/utils/exam-status';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

interface ExamWithStats extends Exam {
  candidateCount?: number | string;
  isResultGenerated?: boolean;
}

export function GenerateResultsPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamWithStats[]>([]);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchExams = async () => {
      setIsLoadingExams(true);
      try {
        const response = await examApi.getAll({ limit: 100 });
        const allExams = response.data?.exams || [];
        
        const endedExams = allExams.filter((ex: Exam) => {
          const status = getDisplayStatus(ex);
          return ['PENDING_RESULT_GENERATE', 'PENDING_PUBLISH_RESULT', 'RESULT_PUBLISHED', 'COMPLETED', 'EXAM_ENDED'].includes(status);
        });

        const examsWithFlags = endedExams.map((ex: Exam) => {
          return {
            ...ex,
            isResultGenerated: false, // will be updated dynamically below
            candidateCount: 'Loading...'
          };
        });

        setExams(examsWithFlags);

        // Fetch dashboard stats to dynamically check if results exist
        examsWithFlags.forEach(async (ex: ExamWithStats) => {
            try {
                const dashRes = await apiClient.get('/results/dashboard', { params: { examId: ex._id } });
                const hasResults = dashRes.data?.data?.totalCandidates > 0;
                
                setExams(prev => prev.map(p => p._id === ex._id ? { 
                  ...p, 
                  isResultGenerated: hasResults
                } : p));
            } catch (e) {
                // error handling
            }
        });

      } catch (error) {
        console.error('Failed to fetch exams:', error);
        toast.error('Failed to load exams.');
      } finally {
        setIsLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch { return dateStr; }
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return 'N/A';
    try {
      if (/^\d{2}:\d{2}$/.test(timeStr)) {
        const [h, m] = timeStr.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}:${String(m).padStart(2, '0')} ${period}`;
      }
      return new Date(timeStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch { return timeStr; }
  };

  const handleGenerate = async (examId: string) => {
    setGeneratingId(examId);
    try {
      const response = await apiClient.post('/results/generate', {
        examId,
        negativeMarking: true,
        forceRegenerate: true,
      }, {
        timeout: 300000,
      });
      
      if (response.data?.data?.generated === false) {
        toast.error(response.data?.data?.message || 'No submitted candidates found for evaluation.');
        return;
      }
      
      const count = response.data?.data?.generatedCount || 0;
      if (count > 0) {
        toast.success(`Results generated successfully for ${count} candidate(s)!`);
        setExams(prev => prev.map(ex => ex._id === examId ? { ...ex, isResultGenerated: true } : ex));
      } else {
        toast.error('No submitted candidates found for evaluation.');
      }
    } catch (error: any) {
      console.error('Failed to generate results:', error);
      toast.error(error.response?.data?.message || 'Failed to generate results.');
    } finally {
      setGeneratingId(null);
    }
  };

  const filteredAndSortedExams = useMemo(() => {
    let result = exams;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ex => 
        (ex.examTitle || '').toLowerCase().includes(query) || 
        (ex.examCode || '').toLowerCase().includes(query)
      );
    }

    if (filterStatus === 'pending') {
      result = result.filter(ex => !ex.isResultGenerated);
    } else if (filterStatus === 'generated') {
      result = result.filter(ex => ex.isResultGenerated);
    }

    result = [...result].sort((a, b) => {
      if (a.isResultGenerated === b.isResultGenerated) {
        return new Date(b.examDate).getTime() - new Date(a.examDate).getTime();
      }
      return a.isResultGenerated ? 1 : -1;
    });

    return result;
  }, [exams, searchQuery, filterStatus]);

  return (
    <div className="space-y-4 max-w-6xl mx-auto pt-4">
      <PageHeader 
        className="pb-2"
        title={
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full w-8 h-8 -ml-2 hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span>Pending Generate Results</span>
          </div>
        }
        description="Process submitted answer scripts and compute scores based on evaluation criteria." 
      />

      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-56 h-10">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  <SelectItem value="pending">Pending Result Generate</SelectItem>
                  <SelectItem value="generated">Result Generated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[40%]">Exam Name</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingExams ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        Loading exams...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedExams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                      No exams found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedExams.map((exam) => (
                    <TableRow key={exam._id} className={exam.isResultGenerated ? "bg-muted/10" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{exam.examTitle}</span>
                          <span className="text-xs text-muted-foreground">{exam.examCode}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm capitalize">{exam.shift?.replace('_', ' ').toLowerCase() || 'N/A'}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{formatDate(exam.examDate)}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {exam.isResultGenerated ? (
                          <Button 
                            variant="outline" 
                            disabled 
                            className="bg-muted text-muted-foreground w-36"
                          >
                            Result generated
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleGenerate(exam._id)}
                            disabled={generatingId !== null} 
                            className="bg-[#2D3E2C] text-secondary hover:bg-[#2D3E2C]/90 w-36"
                          >
                            {generatingId === exam._id ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            {generatingId === exam._id ? 'Generating...' : 'Generate result'}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
