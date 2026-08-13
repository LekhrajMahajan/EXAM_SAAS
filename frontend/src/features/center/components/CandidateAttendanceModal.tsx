import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { apiClient } from '@/core/api/http/axios-client';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';

interface CandidateAttendanceModalProps {
  exam: Record<string, any>;
  centerId: string;
  onClose: () => void;
}

export const CandidateAttendanceModal: React.FC<CandidateAttendanceModalProps> = ({ exam, centerId, onClose }) => {
  const [candidates, setCandidates] = useState<Record<string, any>[]>([]);
  const [attendance, setAttendance] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!exam._id && !exam.id) return;
      
      setIsLoading(true);
      try {
        const examId = exam._id || exam.id;
        
        // Fetch candidates assigned to this exam & center
        const candidatesRes = await apiClient.get('/candidates', {
          params: { examId, centerId, limit: 1000 }
        });
        
        let fetchedCandidates: Record<string, any>[] = [];
        if (candidatesRes.data && candidatesRes.data.data) {
          const p = candidatesRes.data.data;
          fetchedCandidates = Array.isArray(p) ? p : (p.docs || p.candidates || p.data || []);
        }
        setCandidates(fetchedCandidates);

        // Fetch attendance records for this exam
        try {
          const attendanceRes = await apiClient.get(`/attendance/exam/${examId}`);
          if (attendanceRes.data && attendanceRes.data.data) {
            const a = attendanceRes.data.data;
            const fetchedAttendance = Array.isArray(a) ? a : (a.docs || a.items || a.data || []);
            setAttendance(fetchedAttendance);
          }
        } catch (attError) {
          console.error("Could not fetch attendance records", attError);
        }
        
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [exam, centerId]);

  // Merge candidate list with their attendance status
  const getAttendanceStatus = (candidateId: string) => {
    // Find the attendance record for this candidate
    // Attendance schema has candidateId as reference, or candidate object if populated
    const record = attendance.find(a => {
      const aCandidateId = typeof a.candidateId === 'object' ? a.candidateId?._id : a.candidateId;
      const aCandidate = typeof a.candidate === 'object' ? a.candidate?._id : a.candidate;
      return aCandidateId === candidateId || aCandidate === candidateId;
    });

    if (record && record.attendanceStatus === 'PRESENT') {
      return 'PRESENT';
    }
    // Also consider COMPLETED as PRESENT for display purposes
    if (record && record.attendanceStatus === 'COMPLETED') {
      return 'PRESENT';
    }
    
    return 'ABSENT';
  };

  const filteredCandidates = candidates.filter(c => {
    if (!searchQuery) return true;
    const name = c.fullName || c.firstName || '';
    const code = c.candidateCode || c.applicationNo || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           code.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-slate-900 border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-100">
            Attendance List: {exam.examTitle || exam.title || 'Exam'}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            View the attendance status for candidates allocated to this center.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or candidate code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="border border-slate-800 rounded-md overflow-hidden bg-slate-900/50">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3">Candidate Code</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Application No</th>
                    <th className="px-4 py-3 text-right">Attendance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                        Fetching candidates...
                      </td>
                    </tr>
                  ) : filteredCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No candidates found for this exam and center.
                      </td>
                    </tr>
                  ) : (
                    filteredCandidates.map((candidate) => {
                      const status = getAttendanceStatus(candidate._id || candidate.id);
                      return (
                        <tr key={candidate._id || candidate.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-300">
                            {candidate.candidateCode || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-slate-200">
                            {candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Unknown'}
                          </td>
                          <td className="px-4 py-3 text-slate-400">
                            {candidate.applicationNo || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {status === 'PRESENT' ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                                Present
                              </Badge>
                            ) : (
                              <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-rose-500/20">
                                Absent
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
