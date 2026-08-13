import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Users, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { apiClient } from '@/core/api/http/axios-client';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';

const ExamAttendanceList = ({ exam, centerId }: { exam: any, centerId: string }) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchExamAttendance = async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      try {
        const examId = exam._id || exam.id;
        
        const [candidatesRes, attendanceRes, importedAllocationsRes] = await Promise.all([
          apiClient.get('/candidates', { params: { examId, centerId, limit: 1000 } }).catch(() => null),
          apiClient.get(`/attendance/exam/${examId}`).catch(() => null),
          apiClient.get(`/import-candidate/allocations/${examId}`).catch(() => null)
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

  if (isLoading) {
    return (
      <div className="py-8 text-center text-slate-400 flex flex-col items-center">
        <Loader2 className="h-6 w-6 animate-spin mb-2 text-primary" />
        Loading candidates...
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500">
        No candidates found for this exam.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-t border-slate-800">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
          <tr>
            <th className="px-4 py-3">Application No</th>
            <th className="px-4 py-3">Roll No</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 text-right">Attendance Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {candidates.map((candidate) => {
            const status = getAttendanceStatus(candidate._id || candidate.id);
            const isPresent = status === 'PRESENT';
            
            return (
              <tr key={candidate._id || candidate.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 text-slate-300">
                  {candidate.applicationNo || 'N/A'}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {candidate.rollNo || 'N/A'}
                </td>
                <td className="px-4 py-3 text-slate-200">
                  {candidate.candidateFullName || candidate.fullName || (`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Unknown')}
                </td>
                <td className="px-4 py-3 text-right">
                  {isPresent ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified / Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
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
  const [exams, setExams] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Assigned Candidate Attendance
          </h1>
          <p className="text-slate-400 mt-2">
            View the candidates assigned to your center and track their attendance.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-400">Loading exams...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-12 border border-slate-800 rounded-lg bg-slate-900/50">
          <AlertCircle className="h-12 w-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-300 font-medium">No exams assigned.</p>
          <p className="text-slate-500 text-sm mt-1">There are currently no exams assigned to your center.</p>
        </div>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Exam Attendance</CardTitle>
            <CardDescription>Click on an exam to view candidates and their live verified status.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {exams.map((exam) => (
                <AccordionItem key={exam._id || exam.id} value={exam._id || exam.id} className="border border-slate-800 rounded-md overflow-hidden bg-slate-900/80">
                  <AccordionTrigger className="px-4 hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center text-base font-semibold text-left">
                      <span className="text-primary">{exam.examTitle || exam.title || exam.name || 'Unknown Exam'}</span>
                      {exam.examCode && <span className="ml-2 text-slate-500 font-normal text-sm">({exam.examCode})</span>}
                      {exam.examDate && <span className="ml-4 text-slate-400 font-normal text-sm bg-slate-800 px-2 py-0.5 rounded">Date: {new Date(exam.examDate).toLocaleDateString()}</span>}
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
