import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { StatCard } from '@/features/company/components/dashboard/StatCard';
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
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
  rawExamDate?: string;
  fullExamDetails?: any;
}

export const AssignedExamsPage: React.FC = () => {
  const [examsList, setExamsList] = useState<AssignedExam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<AssignedExam | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [examTypeFilter, setExamTypeFilter] = useState('All Type Exam');
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchExams = async () => {
      const targetCenterId = id || user?.centerId;
      if (!targetCenterId) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const res = await api.get(`/import-center-assign-exam/assigned-exams/center/${targetCenterId}`);
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
            facilities: item.examId?.facilities || [],
            rawExamDate: item.examId?.examDate,
            fullExamDetails: item.examId
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
  }, [user?.centerId, id]);

  const filteredExams = examsList.filter((e) => {
    const term = searchQuery.toLowerCase();
    const examMatch = e.examName ? e.examName.toLowerCase().includes(term) : false;
    const centerMatch = e.centerName ? e.centerName.toLowerCase().includes(term) : false;
    const searchMatch = examMatch || centerMatch;

    if (!searchMatch) return false;
    if (examTypeFilter === 'All Type Exam') return true;

    let isEnded = false;
    if (e.rawExamDate && e.endTime !== 'TBD') {
      const endDateTime = new Date(e.rawExamDate);
      const [hours, minutes] = e.endTime.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        endDateTime.setHours(hours, minutes, 0, 0);
        if (endDateTime < new Date()) {
          isEnded = true;
        }
      }
    }

    if (examTypeFilter === 'Active Exam') return !isEnded;
    if (examTypeFilter === 'Ended Exam') return isEnded;

    return true;
  });

  const totalAssignedCandidates = examsList.reduce((acc, e) => acc + (e.assignedCandidatesCount || 0), 0);
  const activeShifts = examsList.filter(e => e.status === 'Live' || e.status === 'Assigned & Active').length;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-6 animate-in fade-in duration-300">
      {/* Master Admin Styled Banner - Olive #2D3E2C with #E4FD97 Text */}
      <div className="flex items-stretch gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="h-auto px-4 bg-card hover:bg-muted border border-border shadow-xl rounded-xl shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div className="flex-1 bg-card text-primary rounded-xl p-6 shadow-xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl border border-border text-primary mt-1">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                Assigned Exam Drives & Candidate Roster
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed font-medium">
                View authorized online examination drives, total candidate rosters allocated by Company Admin, shift timings, and venue instructions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Exams"
          value={examsList.length}
          icon={FileText}
          accent="slate"
        />
        <StatCard
          title="Assigned Candidates"
          value={totalAssignedCandidates.toLocaleString()}
          icon={Users}
          accent="slate"
        />
        <StatCard
          title="Active Exam Shifts"
          value={activeShifts}
          icon={Calendar}
          accent="slate"
        />
        <StatCard
          title="Status Sync"
          value={examsList.length === 0 ? 'Awaiting Drive' : 'Synchronous'}
          icon={ShieldCheck}
          accent="amber"
        />
      </div>

      {/* Search Bar */}
      {examsList.length > 0 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-background/60 p-4 rounded-xl border border-border">
          <div className="flex items-center gap-4 flex-1 w-full max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search exam title, candidate roster, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background text-foreground pl-9 pr-4 py-2 text-sm rounded-lg border border-border focus:outline-none focus:border-[#E4FD97]"
              />
            </div>
            <select
              value={examTypeFilter}
              onChange={(e) => setExamTypeFilter(e.target.value)}
              className="bg-background text-foreground py-2 px-4 text-sm rounded-lg border border-border focus:outline-none focus:border-[#E4FD97] cursor-pointer"
            >
              <option value="All Type Exam">All Type Exam</option>
              <option value="Active Exam">Active Exam</option>
              <option value="Ended Exam">Ended Exam</option>
            </select>
          </div>
        </div>
      )}

      {/* Dynamic List or Empty State */}
      {isLoading ? (
        <Card className="bg-background/50 border-border backdrop-blur-md">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <h3 className="text-xl font-bold text-foreground">Loading Assigned Exams...</h3>
          </CardContent>
        </Card>
      ) : filteredExams.length === 0 ? (
        <Card className="bg-background/50 border-border backdrop-blur-md">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground mb-2">
              <Info className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">No Exam Drives Assigned Yet</h3>
            <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
              When the <span className="text-primary font-semibold">Company Admin</span> schedules an examination and assigns candidate rosters to this center location, the exam title, total candidates allocated, date, shift timings, and venue details will automatically populate here in real-time.
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
            <Card key={exam.id} className="bg-card border-border hover:border-border transition-all shadow-xl flex flex-col justify-between overflow-hidden">
              <div>
                {/* Top Banner */}
                <div className="bg-background p-4 border-b border-border flex justify-between items-center">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#E4FD97] text-[#2D3E2C] border border-[#2D3E2C]/20">
                    {exam.examCode || 'EXAM-DRIVE'}
                  </span>
                  <div className="flex gap-2 items-center">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-[#E4FD97] px-2 py-0.5 bg-[#2D3E2C] border border-[#2D3E2C]/20 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {exam.status || 'Assigned & Active'}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-[#E4FD97]/10"
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
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {exam.examName || 'Online Recruitment Test Drive'}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs font-medium text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 text-red-400" />
                      <span>{exam.centerName} {exam.city ? `• ${exam.city}` : ''}</span>
                    </div>
                    {exam.address && (
                      <p className="text-xs text-muted-foreground mt-1 border-l-2 border-border pl-2">
                        {exam.address}
                      </p>
                    )}
                  </div>

                  {/* Date & Shift Specs */}
                  <div className="grid grid-cols-2 gap-3 bg-background/80 p-3.5 rounded-xl border border-border">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary" /> Start
                      </span>
                      <p className="text-sm font-bold text-primary mt-1">
                        {exam.examDate}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {exam.startTime !== 'TBD' ? exam.startTime : '09:00 AM'}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" /> End
                      </span>
                      <p className="text-sm font-bold text-primary mt-1">
                        {exam.examDate}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-medium">
                        {exam.endTime !== 'TBD' ? exam.endTime : '12:00 PM'}
                      </p>
                    </div>
                  </div>

                  {/* Facilities */}
                  {exam.facilities && exam.facilities.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Required Exam Infrastructure:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exam.facilities.map((f, i) => (
                          <span key={i} className="text-[11px] font-semibold bg-muted text-foreground/80 px-2 py-0.5 rounded border border-border">
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </div>

              <div className="bg-background px-5 py-3 border-t border-border flex justify-between items-center">
                <span className="text-xs text-muted-foreground italic">
                  Allocated by Company Admin
                </span>
                {!id && (
                  <Button
                    onClick={() => navigate(`/dashboard/center-manager/labs`)}
                    className="bg-background hover:bg-primary/20 text-foreground hover:text-primary font-semibold text-xs py-1.5 px-3 rounded-lg border border-border transition-colors"
                  >
                    Configure Labs &rarr;
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Exam Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl bg-card text-foreground border-border shadow-2xl rounded-xl max-h-[85vh] flex flex-col p-6">
          <DialogHeader className="border-b border-border pb-4 shrink-0">
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Info className="w-5 h-5 text-primary" />
              </div>
              Exam Details
            </DialogTitle>
          </DialogHeader>

          {selectedExam && selectedExam.fullExamDetails && (
            <div className="space-y-5 mt-2 flex-1 overflow-y-auto pr-2">

              {/* ── Basic Information ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Basic Information</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Title</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.examTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Code</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.examCode}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.examCategory || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.examType || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mode</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.examMode || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Language</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.language || '-'}</p>
                  </div>
                  {selectedExam.fullExamDetails.difficulty && (
                    <div>
                      <p className="text-xs text-muted-foreground">Difficulty</p>
                      <p className="font-medium text-sm">{selectedExam.fullExamDetails.difficulty}</p>
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
                    <p className="font-medium text-sm">{new Date(selectedExam.fullExamDetails.examDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.duration} mins</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Start Time</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.startTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Time</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.endTime}</p>
                  </div>
                  {selectedExam.fullExamDetails.shift && (
                    <div>
                      <p className="text-xs text-muted-foreground">Shift</p>
                      <p className="font-medium text-sm">{selectedExam.fullExamDetails.shift}</p>
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
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Positive Marks</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.passingMarks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Negative Marks</p>
                    <p className="font-medium text-sm">{selectedExam.fullExamDetails.negativeMarks ?? '-'}</p>
                  </div>
                </div>
              </div>

              {/* ── Shuffle Options ── */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Shuffle Options</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedExam.fullExamDetails.shuffleSubjects ? 'bg-[#2D3E2C]' : 'bg-slate-300'}`} />
                    <span className="text-sm">Shuffle Subjects: <strong>{selectedExam.fullExamDetails.shuffleSubjects ? 'On' : 'Off'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${selectedExam.fullExamDetails.shuffleQuestions ? 'bg-[#2D3E2C]' : 'bg-slate-300'}`} />
                    <span className="text-sm">Shuffle Questions: <strong>{selectedExam.fullExamDetails.shuffleQuestions ? 'On' : 'Off'}</strong></span>
                  </div>
                </div>
              </div>

              {/* ── Proctoring & Anti-Cheat ── */}
              {selectedExam.fullExamDetails.securitySettings && (
                (() => {
                  const activeSettings = [
                    { label: 'Face Monitoring', enabled: selectedExam.fullExamDetails.securitySettings.faceDetectionEnabled, value: selectedExam.fullExamDetails.securitySettings.faceDetectionLimit, unit: 'sec' },
                    { label: 'Multiple / Wrong Faces', enabled: selectedExam.fullExamDetails.securitySettings.multipleFacesEnabled, value: selectedExam.fullExamDetails.securitySettings.multipleFacesLimit, unit: 'sec' },
                    { label: 'Proctoring Warning Limit', enabled: selectedExam.fullExamDetails.securitySettings.proctoringWarningEnabled, value: selectedExam.fullExamDetails.securitySettings.proctoringWarningLimit, unit: 'warnings' },
                    { label: 'Tab Switching Prevention', enabled: selectedExam.fullExamDetails.securitySettings.tabSwitchingEnabled, value: null, unit: '' },
                    { label: 'Browser Lock', enabled: selectedExam.fullExamDetails.securitySettings.browserLock, value: null, unit: '' },
                    { label: 'Full Screen Mode', enabled: selectedExam.fullExamDetails.securitySettings.fullScreenMode, value: null, unit: '' },
                    { label: 'Copy/Paste Allowed', enabled: selectedExam.fullExamDetails.securitySettings.copyPasteAllowed, value: null, unit: '' },
                    { label: 'Right Click Disabled', enabled: selectedExam.fullExamDetails.securitySettings.rightClickDisabled, value: null, unit: '' },
                    { label: 'Developer Tools Blocked', enabled: selectedExam.fullExamDetails.securitySettings.developerToolsBlocked, value: null, unit: '' },
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

              {/* ── Exam Paper Subjects ── */}
              {selectedExam.fullExamDetails.subjects && selectedExam.fullExamDetails.subjects.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">Exam Paper Subjects</p>
                  <div className="rounded-md border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm">
                      <thead className="bg-[#2D3E2C] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium">Subject Name</th>
                          <th className="px-4 py-2 text-right font-medium">Questions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedExam.fullExamDetails.subjects.map((sub: any, idx: number) => (
                          <tr key={idx} className="border-t border-slate-200 dark:border-slate-800">
                            <td className="px-4 py-2">{sub.name}</td>
                            <td className="px-4 py-2 text-right">{sub.questions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Summary/Count */}
              <div className="bg-muted/30 p-4 rounded-xl border border-border flex justify-between items-center shadow-sm">
                 <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Assigned Candidates</h4>
                    <p className="text-lg font-bold text-foreground mt-1">{selectedExam.assignedCandidatesCount}</p>
                 </div>
                 <div className="text-right">
                    <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                    <p className="text-lg font-bold text-primary mt-1">{selectedExam.status}</p>
                 </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={() => setIsViewModalOpen(false)}
              className="border-border hover:bg-muted font-medium"
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

