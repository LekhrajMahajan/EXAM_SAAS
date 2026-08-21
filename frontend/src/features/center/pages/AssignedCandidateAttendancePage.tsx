import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Users, AlertCircle, Loader2, CheckCircle2, XCircle, Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { apiClient } from '@/core/api/http/axios-client';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

const ExamAttendanceList = ({ exam, centerId }: { exam: any, centerId: string }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [candidateLogins, setCandidateLogins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchExamAttendance = async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      try {
        const examId = exam._id || exam.id;
        
        const [candidatesRes, attendanceRes, importedAllocationsRes, loginsRes] = await Promise.all([
          apiClient.get('/candidates', { params: { examId, centerId, limit: 1000 } }).catch(() => null),
          apiClient.get(`/attendance/exam/${examId}`).catch(() => null),
          apiClient.get(`/import-candidate/allocations/${examId}`).catch(() => null),
          apiClient.get(`/attendance/exam/${examId}/logins`).catch(() => null)
        ]);
        
        if (!isMounted) return;

        let fetchedCandidates: any[] = [];
        if (candidatesRes?.data?.data) {
          const p = candidatesRes.data.data;
          fetchedCandidates = Array.isArray(p) ? p : (p.docs || p.candidates || p.data || []);
        }

        if (importedAllocationsRes?.data?.data) {
          const allocations = importedAllocationsRes.data.data;
          const importedCandidates = allocations
            .filter((alloc: any) => alloc.centerId === centerId || alloc.centerId?._id === centerId)
            .map((alloc: any) => alloc.candidateId)
            .filter(Boolean);
          fetchedCandidates = [...fetchedCandidates, ...importedCandidates];
        }

        // Deduplicate candidates by applicationNo
        const uniqueCandidates = Array.from(new Map(fetchedCandidates.map(item => [item.applicationNo, item])).values());
        setCandidates(uniqueCandidates);

        if (attendanceRes?.data?.data) {
          const a = attendanceRes.data.data;
          const fetchedAttendance = Array.isArray(a) ? a : (a.docs || a.items || a.data || []);
          setAttendance(fetchedAttendance);
        }

        if (loginsRes?.data?.data) {
          setCandidateLogins(loginsRes.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchExamAttendance();
    
    // Poll every 5 seconds for dynamic updates
    const intervalId = setInterval(() => {
      fetchExamAttendance(false); // Pass false to avoid showing loading spinner on background polls
    }, 5000);

    return () => { 
      isMounted = false; 
      clearInterval(intervalId);
    };
  }, [exam, centerId]);

  const getAttendanceStatus = (candidateId: string) => {
    const record = attendance.find(a => {
      const aCandidateId = (a.candidateId?._id || a.candidateId || a.candidateAssignmentId?._id || a.candidateAssignmentId)?.toString();
      const aCandidate = (a.candidate?._id || a.candidate)?.toString();
      const targetId = candidateId?.toString();
      
      return aCandidateId === targetId || aCandidate === targetId;
    });

    if (record && (record.attendanceStatus === 'PRESENT' || record.attendanceStatus === 'COMPLETED')) {
      return 'PRESENT';
    }
    return 'ABSENT';
  };

  const getSessionStatus = (candidateId: string) => {
    const record = candidateLogins.find(l => (l.candidateId?._id || l.candidateId)?.toString() === candidateId?.toString());
    if (!record) return { status: 'NOT_STARTED', label: '-', color: 'text-muted-foreground' };
    
    if (record.status === 'ACTIVE') {
      return { status: 'ACTIVE', label: 'Logged in', color: 'text-emerald-500 font-medium' };
    } else if (record.status === 'EXPIRED' || record.status === 'LOGGED_OUT') {
      return { status: 'LOGGED_OUT', label: 'Logged out', color: 'text-rose-500 font-medium' };
    }
    return { status: record.status, label: record.status, color: 'text-muted-foreground' };
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-muted-foreground flex flex-col items-center">
        <Loader2 className="h-6 w-6 animate-spin mb-2 text-primary" />
        Loading candidates...
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No candidates found for this exam.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-t border-border">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
          <tr>
            <th className="px-4 py-3">Application No</th>
            <th className="px-4 py-3">Roll No</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Session Status</th>
            <th className="px-4 py-3 text-right">Attendance Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {candidates.map((candidate) => {
            const status = getAttendanceStatus(candidate._id || candidate.id);
            const isPresent = status === 'PRESENT';
            
            return (
              <tr key={candidate._id || candidate.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 text-muted-foreground">
                  {candidate.applicationNo || 'N/A'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {candidate.rollNo || 'N/A'}
                </td>
                <td className="px-4 py-3 text-foreground font-medium">
                  {candidate.candidateFullName || candidate.fullName || (`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Unknown')}
                </td>
                <td className={`px-4 py-3 ${getSessionStatus(candidate._id || candidate.id).color}`}>
                  {getSessionStatus(candidate._id || candidate.id).label}
                </td>
                <td className="px-4 py-3 text-right">
                  {isPresent ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified / Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-600 border border-rose-500/20">
                      <XCircle className="h-3.5 w-3.5" />
                      Absent
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const AssignedCandidateAttendancePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exams, setExams] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamId, setSelectedExamId] = useState<string>('ALL');
  
  const user = useAuthStore(state => state.user);
  const centerId = user?.centerId || user?.referenceId || '';
  const resolvedCenterId = id || centerId;

  useEffect(() => {
    const fetchExams = async () => {
      if (!resolvedCenterId) {
        setExams([]);
        setIsLoading(false);
        return;
      }
      
      try {
        const [nativeRes, importedRes] = await Promise.all([
          apiClient.get('/center-assign-candidate-attendance', {
            params: { centerId: resolvedCenterId }
          }).catch(() => null),
          apiClient.get(`/import-center-assign-exam/assigned-exams/center/${resolvedCenterId}`)
            .catch(() => null)
        ]);
        
        let allExams: any[] = [];
        
        if (nativeRes?.data?.data) {
          const payload = nativeRes.data.data;
          const examsArray = Array.isArray(payload) ? payload : (payload.docs || payload.exams || payload.data || []);
          allExams = [...allExams, ...examsArray];
        }

        if (importedRes?.data?.data) {
          const importedExams = importedRes.data.data.map((record: any) => record.examId).filter(Boolean);
          allExams = [...allExams, ...importedExams];
        }

        // Deduplicate exams by _id
        const uniqueExams = Array.from(new Map(allExams.map(item => [item._id || item.id, item])).values());
        setExams(uniqueExams);
      } catch (error) {
        console.error('Failed to fetch exams', error);
        toast.error('Failed to load exams');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, [resolvedCenterId]);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = (exam.examTitle || exam.title || exam.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSelect = selectedExamId === 'ALL' || (exam._id || exam.id) === selectedExamId;
    return matchesSearch && matchesSelect;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-stretch gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-auto px-4 bg-card hover:bg-muted border border-border shadow-xl rounded-xl shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-1">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <div className="p-3 bg-[#E4FD97] rounded-xl text-[#2D3E2C] mt-1 shrink-0">
                <Users className="h-8 w-8" />
              </div>
              Assigned Candidate Attendance
            </h1>
            <p className="text-muted-foreground mt-2">
              View the candidates assigned to your center and track their attendance.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search exams..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full bg-background"
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedExamId} onValueChange={setSelectedExamId}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Exams" />
            </SelectTrigger>
            <SelectContent className="bg-background border-border">
              <SelectItem value="ALL">All Exams</SelectItem>
              {exams.map((exam) => (
                <SelectItem key={exam._id || exam.id} value={exam._id || exam.id}>
                  {exam.examTitle || exam.title || exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading exams...</p>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="text-center py-12 border border-border rounded-lg bg-muted/50">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium">No exams found.</p>
          <p className="text-muted-foreground text-sm mt-1">There are currently no exams matching your criteria.</p>
        </div>
      ) : (
        <Card className="bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle>Exam Attendance</CardTitle>
            <CardDescription>Click on an exam to view candidates and their live verified status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {filteredExams.map((exam) => (
                <AccordionItem key={exam._id || exam.id} value={exam._id || exam.id} className="border border-border rounded-md overflow-hidden bg-background">
                  <AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center text-base font-semibold text-left">
                      <span className="text-primary">{exam.examTitle || exam.title || exam.name || 'Unknown Exam'}</span>
                      {exam.examCode && <span className="ml-2 bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20 px-2 py-0.5 rounded font-mono font-bold text-xs">{exam.examCode}</span>}
                      {exam.examDate && <span className="ml-4 text-muted-foreground font-normal text-sm bg-muted px-2 py-0.5 rounded">Date: {new Date(exam.examDate).toLocaleDateString()}</span>}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-0">
                     <ExamAttendanceList exam={exam} centerId={resolvedCenterId as string} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
