import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Plus, Users, ClipboardList, Trash2, ShieldCheck, CheckCircle2, MinusCircle, Pencil, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { apiClient } from '@/core/api/http/axios-client';
import { useCenterStaffStore } from '../store/useCenterStaffStore';
import { useAssignExamStaffStore } from '../store/useAssignExamStaffStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import toast from 'react-hot-toast';

const STAFF_ROLES = [
  'Supervisor',
  'Invigilator',
  'Biometric Coordinator',
  'Observer',
  'Security Lead',
  'Technical Support',
  'Center Superintendent',
  'Entry Checker'
];

export const AssignExamStaffPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { staffList, fetchStaff } = useCenterStaffStore();
  const { assignmentsList, fetchAssignments, addAssignment, deleteAssignment } = useAssignExamStaffStore();
  const user = useAuthStore(state => state.user);
  const centerId = user?.centerId || user?.referenceId || '';
  const resolvedCenterId = id || centerId;
  const isReadOnly = Boolean(id) && user?.role !== 'CENTER_MANAGER';
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<string>('');
  const [dynamicExams, setDynamicExams] = useState<Record<string, any>[]>([]);
  
  // State to hold role assignments for the current form
  // role -> staffId mapping
  const [roleAssignments, setRoleAssignments] = useState<Record<string, string>>({});
  
  // State to track which role is currently having staff added via the + button
  const [activeRoleSelection, setActiveRoleSelection] = useState<string | null>(null);
  const [existingStaffNames, setExistingStaffNames] = useState<Record<string, string>>({});

  // New state for reporting time
  const [reportingTime, setReportingTime] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr && !timeStr) return 'N/A';
    let formattedDate = '';
    let extractedTime = timeStr || '';

    if (dateStr) {
      if (dateStr.includes('T') && !timeStr) {
        const parts = dateStr.split('T');
        dateStr = parts[0];
        extractedTime = parts[1];
      }
      try {
        formattedDate = new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch (e) {
        formattedDate = dateStr;
      }
    }
    
    if (formattedDate && extractedTime) {
      return `${formattedDate}, ${extractedTime}`;
    }
    return `${formattedDate}${extractedTime}`.trim();
  };

  useEffect(() => {
    fetchStaff(resolvedCenterId as string);
    if (resolvedCenterId) {
      fetchAssignments(resolvedCenterId as string);

      apiClient.get(`/import-center-assign-exam/assigned-exams/center/${resolvedCenterId}`)
        .then(res => {
          if (res.data?.success) {
            const activeExams = res.data.data
              .filter((item: any) => item.examId?.status === 'ACTIVE')
              .map((item: any) => item.examId);
            setDynamicExams(activeExams);
          }
        }).catch(err => console.error("Failed to load exams", err));
    }
  }, [fetchStaff, fetchAssignments, resolvedCenterId]);

  const resetForm = () => {
    setSelectedExamId('');
    setRoleAssignments({});
    setActiveRoleSelection(null);
    setExistingStaffNames({});
    setReportingTime('');
    setIsEditing(false);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditAssignment = (assignment: any) => {
    resetForm();
    setSelectedExamId(assignment.examId);
    
    if (assignment.reportingTime) {
      try {
        const d = new Date(assignment.reportingTime);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        setReportingTime(`${yyyy}-${mm}-${dd}T${hh}:${min}`);
      } catch (e) {
        console.error("Failed to parse reporting time", e);
      }
    }

    const roles: Record<string, string> = {};
    const names: Record<string, string> = {};
    if (assignment.assignments) {
      assignment.assignments.forEach((a: any) => {
        const matchedRole = STAFF_ROLES.find(r => r.toLowerCase() === a.role?.toLowerCase()) || a.role;
        const staffIdStr = typeof a.staffId === 'object' && a.staffId !== null ? (a.staffId._id || a.staffId.id) : a.staffId;
        roles[matchedRole] = staffIdStr || 'unknown-id';
        if (a.staffName) names[matchedRole] = a.staffName;
      });
    }
    setRoleAssignments(roles);
    setExistingStaffNames(names);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAssignStaffToRole = (role: string, staffId: string) => {
    setRoleAssignments(prev => ({ ...prev, [role]: staffId }));
    setActiveRoleSelection(null);
  };

  const handleRemoveStaffFromRole = (role: string) => {
    setRoleAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[role];
      return newAssignments;
    });
  };

  const handleSaveAssignments = async () => {
    if (!selectedExamId || Object.keys(roleAssignments).length === 0) {
      toast.error('Please select an exam and assign at least one staff member.');
      return;
    }

    const exam = dynamicExams.find(e => e._id === selectedExamId || e.id === selectedExamId);
    
    const formattedAssignments = Object.entries(roleAssignments)
      .filter(([_, staffId]) => staffId && staffId !== 'unknown-id')
      .map(([role, staffId]) => {
      const staff = staffList.find(s => s.id === staffId || s.staffId === staffId || (s as any)._id === staffId);
      return {
        role,
        staffId: staff ? (staff as any)._id : staffId,
        staffName: staff ? staff.name : existingStaffNames[role] || 'Unknown',
        staffEmail: staff ? staff.email : ''
      };
    });

    try {
      await addAssignment(resolvedCenterId as string, {
        examId: selectedExamId,
        examName: exam ? (exam.examTitle || exam.title || exam.name) : 'Unknown Exam',
        reportingTime: reportingTime ? formatDateTime(reportingTime) : '',
        examStartDate: exam ? formatDateTime(exam.examDate || exam.startDate, exam.startTime) : '',
        examEndDate: exam ? formatDateTime(exam.examDate || exam.endDate, exam.endTime) : '',
        assignments: formattedAssignments
      });
      setIsModalOpen(false);
      resetForm();
      toast.success('Exam staff assigned successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to assign staff');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            Assigned Exam Staff
          </h1>
          <p className="text-slate-400 mt-2">
            Assign your center staff to specific exams assigned by the company admin.
          </p>
        </div>
        {!isReadOnly && (
          <Button 
            className="bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Assign Staff
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {assignmentsList.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-slate-700 rounded-lg bg-slate-900/50">
            <Users className="h-12 w-12 text-slate-500 mb-4" />
            <p className="text-slate-400 text-lg">No staff assigned to exams yet.</p>
            <p className="text-slate-500 text-sm mt-1">Click the &apos;Assign Staff&apos; button to start.</p>
          </div>
        ) : (
          assignmentsList.map((assignment) => (
            <Card key={assignment.id} className="bg-slate-900 border-slate-800 flex flex-col">
              <CardHeader className="border-b border-slate-800 pb-4 flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-medium text-white">{assignment.examName}</CardTitle>
                  <CardDescription className="text-slate-400 mt-1 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      Staff Assigned
                    </span>
                    {/* Checking active status (dynamically found or passed via assignment) */}
                    {dynamicExams.some(e => (e._id === assignment.examId || e.id === assignment.examId) && e.status === 'ACTIVE') || (assignment as any).examId?.status === 'ACTIVE' ? (
                      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-500/20">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-rose-500/20">
                        <XCircle className="h-3 w-3" />
                        INACTIVE
                      </span>
                    )}
                  </CardDescription>
                </div>
                {!isReadOnly && (
                  <div className="flex items-center gap-1 -mt-2 -mr-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-primary hover:bg-primary/10"
                      onClick={() => handleEditAssignment(assignment)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10"
                      onClick={() => assignment.id && deleteAssignment(assignment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <div className="space-y-3">
                  {assignment.assignments.map((staffRole, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded-md bg-slate-800/50 border border-slate-700/50">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{staffRole.role}</span>
                        <span className="text-sm font-medium text-slate-200 mt-0.5 flex items-center gap-1.5">
                          <ShieldCheck className="h-3 w-3 text-primary" />
                          {staffRole.staffName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[85vh] overflow-y-auto bg-slate-900 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {isEditing ? 'Edit Assign Exam Staff' : 'Assign Exam Staff'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-base mt-1">
              Select an exam and assign staff members to specific roles for it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Select Assigned Exam</label>
              <Select value={selectedExamId} onValueChange={setSelectedExamId} disabled={isEditing}>
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue placeholder="Choose an exam..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {(dynamicExams || [])
                    .filter(exam => {
                      if (isEditing && (exam._id === selectedExamId || exam.id === selectedExamId)) return true;
                      // Don't show exams that are already assigned
                      const isAlreadyAssigned = assignmentsList.some(a => a.examId === (exam._id || exam.id));
                      return !isAlreadyAssigned;
                    })
                    .map(exam => (
                    <SelectItem key={exam._id || exam.id} value={exam._id || exam.id} className="text-slate-200 focus:bg-slate-700">
                      {exam.examTitle || exam.title || exam.name} {exam.examCode || exam.code ? `(${exam.examCode || exam.code})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedExamId && (() => {
              const selectedExamData = dynamicExams.find(e => e._id === selectedExamId || e.id === selectedExamId);

              return (
                <React.Fragment>
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/80 p-5 border border-slate-700/60 rounded-lg shadow-inner">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-300">Reporting Date & Time</label>
                        <input 
                          type="datetime-local" 
                          value={reportingTime}
                          onChange={(e) => setReportingTime(e.target.value)}
                          className="w-full h-11 px-4 py-2 bg-slate-800 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/60 transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-3 flex flex-col justify-center bg-slate-800/50 p-3 rounded-md border border-slate-700/50">
                        <div className="flex justify-between items-center gap-3 border-b border-slate-700/50 pb-2">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Exam Start</span>
                          <span className="text-sm text-slate-200 font-bold text-right">{formatDateTime(selectedExamData?.examDate || selectedExamData?.startDate, selectedExamData?.startTime)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-3 pt-1">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Exam End</span>
                          <span className="text-sm text-slate-200 font-bold text-right">{formatDateTime(selectedExamData?.examDate || selectedExamData?.endDate, selectedExamData?.endTime)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    <label className="text-sm font-semibold text-slate-300">Add Staff by Role</label>
                
                    <div className="border border-slate-700/80 rounded-lg overflow-hidden bg-slate-900/60 shadow-inner">
                      {STAFF_ROLES.map((role, idx) => (
                        <div key={role} className={`p-4 flex items-center justify-between gap-4 transition-colors hover:bg-slate-800/40 ${idx !== STAFF_ROLES.length - 1 ? 'border-b border-slate-800/80' : ''}`}>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-semibold text-slate-200 truncate">{role}</span>
                            {roleAssignments[role] && (
                              <div className="relative inline-flex items-center w-fit mt-2 pr-2 group">
                                <span className="text-xs text-primary font-medium bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
                                  {staffList.find(s => s.id === roleAssignments[role] || s.staffId === roleAssignments[role] || (s as any)._id === roleAssignments[role])?.name || existingStaffNames[role] || 'Assigned'}
                                </span>
                                <MinusCircle 
                                  className="h-4 w-4 text-rose-500 bg-slate-900 rounded-full cursor-pointer hover:text-rose-400 absolute -top-1.5 -right-1.5 shadow-md opacity-80 group-hover:opacity-100 transition-opacity" 
                                  onClick={() => handleRemoveStaffFromRole(role)}
                                />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-shrink-0">
                            {activeRoleSelection === role ? (
                              <div className="w-56">
                                <Select 
                                  onValueChange={(val) => handleAssignStaffToRole(role, val)}
                                >
                                  <SelectTrigger className="h-9 text-sm bg-slate-800 border-slate-600 focus:ring-primary/50">
                                    <SelectValue placeholder="Select Staff..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-slate-700">
                                    {staffList.filter(s => s.role === role).length === 0 ? (
                                      <div className="p-3 text-sm text-slate-400 text-center">No staff found for this role</div>
                                    ) : (
                                      staffList
                                        .filter(s => s.role === role)
                                        .map(staff => (
                                          <SelectItem key={staff.id || staff.staffId} value={(staff.id || staff.staffId) as string} className="text-sm focus:bg-slate-700 py-2">
                                            {staff.name}
                                          </SelectItem>
                                        ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setActiveRoleSelection(role)}
                                className="h-9 px-4 text-sm font-medium bg-slate-800 border-slate-600 hover:bg-primary/20 hover:text-primary hover:border-primary/50 text-slate-300 transition-all shadow-sm"
                              >
                                Select
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </React.Fragment>
              );
            })()}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-300">
              Cancel
            </Button>
            <Button onClick={handleSaveAssignments} className="bg-primary hover:bg-primary/90 text-white">
              Assigned Exam Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignExamStaffPage;
