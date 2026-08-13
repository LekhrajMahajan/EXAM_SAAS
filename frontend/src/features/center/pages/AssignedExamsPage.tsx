import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { 
  Building2, 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Info,
  Eye,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import api from '@/services/api';

// Dummy data for assigned exams (representing what Company Admin assigns)
interface AssignedExam {
  id: string;
  examName: string;
  examCode: string;
  centerName: string;
  city: string;
  address: string;
  assignedCandidatesCount: number;
  examDate: string;
  shiftTime: string;
  startTime: string;
  endTime: string;
  status: string;
  facilities: string[];
}

export const AssignedExamsPage: React.FC = () => {
  const [examsList, setExamsList] = useState<AssignedExam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<AssignedExam | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchExams = async () => {
      if (!user?.centerId) return;
      try {
        setIsLoading(true);
        const res = await api.get(`/import-center-assign-exam/assigned-exams/center/${user.centerId}`);
        if (res.data?.success) {
          const mapped = res.data.data.map((item: any) => ({
            id: item.id,
            examName: item.examId?.examName || item.examId?.examTitle,
            examCode: item.examId?.examCode || 'N/A',
            centerName: item.venueDetails?.centerName || 'Center',
            city: item.venueDetails?.city || '',
            address: item.venueDetails?.address || '',
            assignedCandidatesCount: item.assignedCandidatesCount,
            examDate: item.examId?.examDate ? new Date(item.examId.examDate).toLocaleDateString() : 'TBD',
            shiftTime: item.examId?.shiftId?.shiftName || item.examId?.shiftTime || 'TBD',
            startTime: item.examId?.shiftId?.startTime || item.examId?.startTime || 'TBD',
            endTime: item.examId?.shiftId?.endTime || item.examId?.endTime || 'TBD',
            status: item.status,
            facilities: item.examId?.facilities || []
          }));
          setExamsList(mapped);
        }
      } catch (error) {
        console.error('Error fetching assigned exams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [user?.centerId]);

  const filteredExams = examsList.filter((e) => {
    const term = searchQuery.toLowerCase();
    const examMatch = e.examName ? e.examName.toLowerCase().includes(term) : false;
    const centerMatch = e.centerName ? e.centerName.toLowerCase().includes(term) : false;
    return examMatch || centerMatch;
  });

  const totalAssignedCandidates = examsList.reduce((acc, e) => acc + (e.assignedCandidatesCount || 0), 0);
  const activeShifts = examsList.filter(e => e.status === 'Live' || e.status === 'Assigned & Active').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 animate-in fade-in duration-300">
      {/* Master Admin Styled Banner - Olive #2D3E2C with #E4FD97 Text */}
      <div className="bg-[#2D3E2C] text-[#E4FD97] rounded-xl p-6 shadow-xl border border-[#E4FD97]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#E4FD97]/15 rounded-xl border border-[#E4FD97]/30 text-[#E4FD97] mt-1">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Assigned Exam Drives & Candidate Roster
            </h1>
            <p className="text-sm text-[#E4FD97]/90 mt-1 max-w-2xl leading-relaxed font-medium">
              View authorized online examination drives, total candidate rosters allocated by Company Admin, shift timings, and venue instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Exams</p>
              <p className="text-3xl font-black text-white mt-1">{examsList.length}</p>
            </div>
            <div className="p-3 bg-[#E4FD97]/10 text-[#E4FD97] rounded-xl border border-[#E4FD97]/20">
              <FileText className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Candidates</p>
              <p className="text-3xl font-black text-emerald-400 mt-1">{totalAssignedCandidates.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Exam Shifts</p>
              <p className="text-3xl font-black text-blue-400 mt-1">{activeShifts}</p>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md text-white shadow-lg">
          <CardContent className="p-5 flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Sync</p>
              <p className="text-lg font-black text-amber-300 mt-2">
                {examsList.length === 0 ? 'Awaiting Drive' : 'Synchronous'}
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      {examsList.length > 0 && (
        <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search exam title, candidate roster, or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-700 focus:outline-none focus:border-[#E4FD97]"
            />
          </div>
          <Button 
            onClick={() => navigate('/dashboard/center-manager/labs')}
            className="bg-[#E4FD97] hover:bg-[#c2eb5c] text-[#2D3E2C] font-bold py-2 px-4 rounded-lg flex items-center gap-2 text-xs shadow-md"
          >
            <ExternalLink className="w-4 h-4" /> View Center Labs
          </Button>
        </div>
      )}

      {/* Dynamic List or Empty State */}
      {isLoading ? (
        <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-md">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-[#E4FD97] animate-spin" />
            <h3 className="text-xl font-bold text-white">Loading Assigned Exams...</h3>
          </CardContent>
        </Card>
      ) : filteredExams.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-md">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-2">
              <Info className="w-8 h-8 text-[#E4FD97]" />
            </div>
            <h3 className="text-xl font-bold text-white">No Exam Drives Assigned Yet</h3>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              When the <span className="text-[#E4FD97] font-semibold">Company Admin</span> schedules an examination and assigns candidate rosters to this center location, the exam title, total candidates allocated, date, shift timings, and venue details will automatically populate here in real-time.
            </p>
            <div className="pt-4">
              <Button 
                onClick={() => navigate('/dashboard/center-manager/labs')}
                className="bg-[#E4FD97] hover:bg-[#d0ed76] text-[#2D3E2C] font-bold px-6 py-2.5 rounded-lg shadow-md flex items-center gap-2 text-xs"
              >
                Configure Center Labs in Advance <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <Card key={exam.id} className="bg-slate-900/90 border-slate-800 hover:border-slate-700 transition-all shadow-xl flex flex-col justify-between overflow-hidden">
              <div>
                {/* Top Banner */}
                <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#E4FD97]/15 text-[#E4FD97] border border-[#E4FD97]/30">
                    {exam.examCode || 'EXAM-DRIVE'}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {exam.status || 'Assigned & Active'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-slate-400 hover:text-[#E4FD97] hover:bg-[#E4FD97]/10"
                      onClick={() => {
                        setSelectedExam(exam);
                        setIsViewModalOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-5 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-[#E4FD97] transition-colors leading-snug">
                      {exam.examName || 'Online Recruitment Test Drive'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>{exam.centerName} {exam.city ? `• ${exam.city}` : ''}</span>
                    </div>
                    {exam.address && (
                      <p className="text-xs text-slate-500 mt-1 border-l-2 border-slate-800 pl-2">
                        {exam.address}
                      </p>
                    )}
                  </div>

                  {/* Date & Shift Specs */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-400" /> Start
                      </span>
                      <p className="text-sm font-bold text-emerald-300 mt-1">
                        {exam.examDate}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {exam.startTime !== 'TBD' ? exam.startTime : '09:00 AM'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" /> End
                      </span>
                      <p className="text-sm font-bold text-blue-300 mt-1">
                        {exam.examDate}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {exam.endTime !== 'TBD' ? exam.endTime : '12:00 PM'}
                      </p>
                    </div>
                  </div>

                  {/* Facilities */}
                  {exam.facilities && exam.facilities.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Required Exam Infrastructure:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exam.facilities.map((f, i) => (
                          <span key={i} className="text-[11px] font-semibold bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400 italic">
                  Allocated by Company Admin
                </span>
                <Button
                  onClick={() => navigate(`/dashboard/center-manager/labs`)}
                  className="bg-slate-900 hover:bg-[#E4FD97] text-slate-200 hover:text-[#2D3E2C] font-semibold text-xs py-1.5 px-3 rounded-lg border border-slate-700 transition-colors"
                >
                  Configure Labs →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Exam Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-[#1e222d] text-slate-200 border-[#2b303b]">
          <DialogHeader className="border-b border-[#2b303b] pb-4">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-indigo-400" />
              Exam Details
            </DialogTitle>
          </DialogHeader>

          {selectedExam && (
            <div className="space-y-6 py-4">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Exam Title</h4>
                  <p className="text-base font-semibold text-white mt-1">{selectedExam.examName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400">Exam Code</h4>
                  <p className="text-base font-semibold text-white mt-1">{selectedExam.examCode}</p>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="bg-[#13161c] p-4 rounded-lg border border-[#2b303b] grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400">Date</h4>
                    <p className="text-sm font-medium text-white mt-1">{selectedExam.examDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Clock className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400">Shift Time</h4>
                    <p className="text-sm font-medium text-white mt-1">{selectedExam.shiftTime}</p>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Requirements & Facilities
                </h4>
                {selectedExam.facilities && selectedExam.facilities.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {selectedExam.facilities.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#13161c] border border-[#2b303b] p-2.5 rounded-md">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm text-slate-300">{req}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500 italic">No specific requirements mentioned.</p>
                )}
              </div>

              {/* Summary/Count */}
              <div className="bg-[#13161c] p-4 rounded-lg border border-[#2b303b] flex justify-between items-center">
                 <div>
                    <h4 className="text-sm font-medium text-slate-400">Candidates</h4>
                    <p className="text-lg font-bold text-white mt-1">{selectedExam.assignedCandidatesCount}</p>
                 </div>
                 <div className="text-right">
                    <h4 className="text-sm font-medium text-slate-400">Status</h4>
                    <p className="text-lg font-bold text-emerald-400 mt-1">{selectedExam.status}</p>
                 </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-[#2b303b]">
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="border-[#2b303b] hover:bg-[#252a36]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AssignedExamsPage;
