import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { apiClient } from '@/core/api/http/axios-client';
import { useAuth } from '@/features/auth/hooks';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Search, UserCheck, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export const EntryCheckerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applicationNo, setApplicationNo] = useState('');
  const [candidateData, setCandidateData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [centerName, setCenterName] = useState<string>('');
  const [assignedExams, setAssignedExams] = useState<string[]>([]);

  React.useEffect(() => {
    if (user?.centerId) {
      apiClient.get(`/centers/${user.centerId}`)
        .then(res => {
          if (res.data?.data?.centerName) {
            setCenterName(res.data.data.centerName);
          }
        })
        .catch(err => console.error("Failed to fetch center info", err));
        
      apiClient.get('/entry-checker/my-assignments')
        .then(res => {
          if (res.data?.data?.examNames) {
            setAssignedExams(res.data.data.examNames);
          }
        })
        .catch(err => console.error("Failed to fetch assigned exams", err));
    }
  }, [user?.centerId]);

  const handleSearch = async () => {
    if (!applicationNo.trim()) {
      setError("Please enter an Application Number");
      return;
    }
    
    setLoading(true);
    setError(null);
    setCandidateData(null);
    setVerifySuccess(false);

    try {
      const response = await apiClient.get(`/entry-checker/search-candidate/${applicationNo}`);
      if (response.data.success) {
        setCandidateData(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Candidate not found or not assigned to this center.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!candidateData) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/entry-checker/verify-candidate', {
        candidateId: candidateData.candidate._id,
        seatAllocationId: candidateData.seatAllocation._id
      });

      if (response.data.success) {
        setVerifySuccess(true);
        setCandidateData((prev: any) => ({
          ...prev,
          attendanceStatus: 'PRESENT'
        }));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to verify candidate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Welcome, Entry Checker</h1>
        </div>
        {centerName && (
          <p className="text-red-500 font-semibold mt-2 ml-11 text-sm">
            Center: <span className="text-foreground font-medium">{centerName}</span>
          </p>
        )}
        {assignedExams.length > 0 && (
          <p className="text-red-500 font-semibold mt-1 ml-11 text-sm">
            Assigned Exam: <span className="text-foreground font-medium">{assignedExams.join(', ')}</span>
          </p>
        )}
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-muted-foreground" />
            Candidate Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <Input 
              placeholder="Enter Candidate Application Number..." 
              value={applicationNo}
              onChange={(e) => setApplicationNo(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading} className="w-32 gap-2">
              <Search className="h-4 w-4" />
              {loading ? "..." : "Search"}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-md">
              {error}
            </div>
          )}

          {verifySuccess && (
            <div className="p-4 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-md flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-5 w-5" />
              Candidate Verified Successfully!
            </div>
          )}

          {candidateData && (
            <div className="border border-border rounded-lg p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="h-32 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden shrink-0 border border-border">
                  {(candidateData.isImported ? candidateData.candidate.candidatePhoto : candidateData.candidate.photo) ? (
                    <img src={candidateData.isImported ? candidateData.candidate.candidatePhoto : candidateData.candidate.photo} alt="Candidate" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-slate-400" />
                  )}
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Application No.</p>
                    <p className="font-semibold">{candidateData.candidate.applicationNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-semibold">
                      {candidateData.isImported 
                        ? candidateData.candidate.candidateFullName 
                        : `${candidateData.candidate.firstName} ${candidateData.candidate.lastName}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DOB</p>
                    <p className="font-semibold">
                      {candidateData.isImported
                        ? candidateData.candidate.dateOfBirth
                        : (candidateData.candidate.dob ? new Date(candidateData.candidate.dob).toLocaleDateString() : 'N/A')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-semibold">{candidateData.candidate.gender || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <p className="text-sm text-muted-foreground">Exam Name</p>
                    <p className="font-medium">
                      {candidateData.isImported
                        ? (candidateData.seatAllocation?.examId?.examTitle || candidateData.candidate.examName || 'N/A')
                        : (candidateData.seatAllocation?.examId?.examName || 'N/A')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Lab/Room</p>
                    <p className="font-medium">
                      {candidateData.isImported
                        ? (candidateData.seatAllocation?.labId?.labName || 'N/A')
                        : (candidateData.seatAllocation?.examRoomId?.roomName || 'N/A')}
                    </p>
                  </div>
              </div>

              <Accordion type="single" collapsible className="w-full mt-4 border-t border-border pt-4">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2">
                    <h3 className="text-lg font-semibold text-primary">View Full Details</h3>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 pt-4">
                      {/* Personal Details */}
                      <div>
                        <h4 className="font-semibold border-b pb-2 mb-4">Personal Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><p className="text-sm text-muted-foreground">Full Name</p><p className="font-medium">{candidateData.isImported ? candidateData.candidate.candidateFullName : (`${candidateData.candidate.firstName || ''} ${candidateData.candidate.lastName || ''}`.trim() || "-")}</p></div>
                          <div><p className="text-sm text-muted-foreground">Father&apos;s Name</p><p className="font-medium">{candidateData.candidate.fatherName || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Mother&apos;s Name</p><p className="font-medium">{candidateData.candidate.motherName || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Date of Birth</p><p className="font-medium">{candidateData.isImported ? candidateData.candidate.dateOfBirth : (candidateData.candidate.dob ? new Date(candidateData.candidate.dob).toLocaleDateString() : 'N/A')}</p></div>
                          <div><p className="text-sm text-muted-foreground">Gender</p><p className="font-medium">{candidateData.candidate.gender || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Category</p><p className="font-medium">{candidateData.candidate.category || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">PwD Status</p><p className="font-medium">{candidateData.candidate.pwdStatus || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">PwD Type</p><p className="font-medium">{candidateData.candidate.pwdType || "-"}</p></div>
                        </div>
                      </div>

                      {/* Application & Exam Details */}
                      <div>
                        <h4 className="font-semibold border-b pb-2 mb-4">Application & Exam Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><p className="text-sm text-muted-foreground">Candidate ID</p><p className="font-medium">{candidateData.candidate.candidateId || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Application No</p><p className="font-medium">{candidateData.candidate.applicationNo || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Roll/Seat No</p><p className="font-medium">{candidateData.candidate.rollNo || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Exam Name</p><p className="font-medium">{candidateData.isImported ? (candidateData.seatAllocation?.examId?.examTitle || candidateData.candidate.examName) : (candidateData.seatAllocation?.examId?.examName || 'N/A')}</p></div>
                          <div><p className="text-sm text-muted-foreground">Organization</p><p className="font-medium">{candidateData.candidate.organization || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Exam Code</p><p className="font-medium">{candidateData.candidate.examCode || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Notification No</p><p className="font-medium">{candidateData.candidate.notificationNo || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Post Name</p><p className="font-medium">{candidateData.candidate.postName || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Paper/Subject</p><p className="font-medium">{candidateData.candidate.paperSubject || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Exam Stage</p><p className="font-medium">{candidateData.candidate.examStage || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Exam Date</p><p className="font-medium">{candidateData.candidate.examDate || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Shift</p><p className="font-medium">{candidateData.candidate.shift || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Reporting Time</p><p className="font-medium">{candidateData.candidate.reportingTime || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Gate Closing</p><p className="font-medium">{candidateData.candidate.gateClosingTime || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Exam Start</p><p className="font-medium">{candidateData.candidate.examStartTime || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Duration</p><p className="font-medium">{candidateData.candidate.duration || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Exam Mode</p><p className="font-medium">{candidateData.candidate.examMode || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Language</p><p className="font-medium">{candidateData.candidate.language || "-"}</p></div>
                        </div>
                      </div>

                      {/* Center Details */}
                      <div>
                        <h4 className="font-semibold border-b pb-2 mb-4">Center Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div><p className="text-sm text-muted-foreground">Center Name</p><p className="font-medium">{candidateData.candidate.centerName || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Centre Code</p><p className="font-medium">{candidateData.candidate.centreCode || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">City</p><p className="font-medium">{candidateData.candidate.city || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">District</p><p className="font-medium">{candidateData.candidate.district || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">State</p><p className="font-medium">{candidateData.candidate.state || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">PIN</p><p className="font-medium">{candidateData.candidate.pin || "-"}</p></div>
                          <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Full Address</p><p className="font-medium">{candidateData.candidate.fullCentreAddress || "-"}</p></div>
                          <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Landmark</p><p className="font-medium">{candidateData.candidate.landmark || "-"}</p></div>
                          <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Nearest Railway</p><p className="font-medium">{candidateData.candidate.nearestRailwayStation || "-"}</p></div>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div>
                        <h4 className="font-semibold border-b pb-2 mb-4">Additional Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><p className="text-sm text-muted-foreground">Scribe Details</p><p className="font-medium whitespace-pre-wrap">{candidateData.candidate.scribeDetails || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Physical Test</p><p className="font-medium whitespace-pre-wrap">{candidateData.candidate.physicalTestDetails || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Photo ID Instructions</p><p className="font-medium whitespace-pre-wrap">{candidateData.candidate.photoIdInstructions || "-"}</p></div>
                          <div><p className="text-sm text-muted-foreground">Important Instructions</p><p className="font-medium whitespace-pre-wrap">{candidateData.candidate.importantInstructions || "-"}</p></div>
                          <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Candidate Declaration</p><p className="font-medium whitespace-pre-wrap">{candidateData.candidate.candidateDeclaration || "-"}</p></div>
                          <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Biometric Info</p><p className="font-medium whitespace-pre-wrap">{candidateData.candidate.biometricInfo || "-"}</p></div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleVerify} 
                  disabled={loading || candidateData.attendanceStatus === 'PRESENT' || verifySuccess}
                  className="bg-primary hover:bg-primary/90 text-white min-w-[200px]"
                >
                  {candidateData.attendanceStatus === 'PRESENT' ? 'Already Verified' : 'Verify Candidate'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
