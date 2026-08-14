import React, { useState, useEffect, useMemo, useCallback } from "react";
import { StaffHeader } from "../../staff/components/StaffHeader";
import { StaffFilters } from "../../staff/components/StaffFilters";
import { StaffTable } from "../../staff/components/StaffTable";
import { StaffViewDialog } from "../../staff/components/StaffViewDialog";
import { StaffEditDialog } from "../../staff/components/StaffEditDialog";
import { Button } from "@/shared/components/ui/button";
import { Plus, RefreshCw, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useStaffList } from "../../staff/hooks/staff.hooks";
import { staffApi } from "../../staff/api/staff.api";
import { examApi } from "@/features/exam-manager/api/exam.api";
import { apiClient } from '@/core/api/http/axios-client';

import type { Staff } from "../../staff/types/staff.types";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { StaffForm } from "../../staff/components/StaffForm";
import { Card, CardContent } from "@/shared/components/ui/card";

export const PaperSettersManagementPage = () => {
  const [viewedStaff, setViewedStaff] = useState<Staff | null>(null);
  const [editedStaff, setEditedStaff] = useState<Staff | null>(null);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createExamId, setCreateExamId] = useState<string | null>(null);
  
  const [exams, setExams] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isExamsLoading, setIsExamsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // We fetch a larger limit to ensure we have all paper setters for grouping
  const { data: response, isLoading: isStaffLoading, refetch: refetchStaff } = useStaffList({ page: 1, limit: 1000, role: "PAPER_SETTER" });
  
  const fetchData = useCallback(async () => {
    try {
      const examRes = await examApi.getAll({ limit: 1000 });
      
      if (examRes.success) {
        setExams(examRes.data.exams || []);
      }
      try {
        const assignmentRes = await apiClient.get('/staff-assignments', { params: { limit: 1000, role: 'PAPER_SETTER' } });
        const resData = assignmentRes.data?.data;
        const assignmentList = Array.isArray(resData) ? resData : (resData?.data || []);
        setAssignments(assignmentList);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        setAssignments([]);
      }
    } catch (error) {
      console.error("Failed to fetch exams/assignments", error);
    } finally {
      setIsExamsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      await fetchData();
    };
    initFetch();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsExamsLoading(true);
    refetchStaff();
    fetchData();
  };

  const rawData = response?.data;
  const staffList: Staff[] = Array.isArray(rawData) ? rawData : (rawData as any)?.data || [];
  const filteredList = staffList.filter(s => s.role === 'PAPER_SETTER' || (s.roles && s.roles.includes('PAPER_SETTER')));

  // Group staff by examId
  const staffByExam = useMemo(() => {
    const map: Record<string, Staff[]> = {};
    
    // Create a lookup for staff assignment to exam
    const staffExamMap: Record<string, string> = {};
    assignments.forEach(a => {
      if (a.employeeId && a.examId) {
        const empId = typeof a.employeeId === 'string' ? a.employeeId : a.employeeId._id;
        const exmId = typeof a.examId === 'string' ? a.examId : a.examId._id;
        staffExamMap[empId] = exmId;
      }
    });

    filteredList.forEach(staff => {
      const staffId = staff.id || staff._id;
      if (staffId) {
        const examId = staffExamMap[staffId];
        if (examId) {
          if (!map[examId]) map[examId] = [];
          map[examId].push(staff);
        } else {
          // Unassigned
          if (!map['unassigned']) map['unassigned'] = [];
          map['unassigned'].push(staff);
        }
      }
    });
    return map;
  }, [filteredList, assignments]);

  const filteredExams = useMemo(() => {
    if (!searchQuery) return exams;
    const lowerQuery = searchQuery.toLowerCase();
    return exams.filter(exam => {
      const examNameMatch = (exam.examTitle || '').toLowerCase().includes(lowerQuery) || (exam.examCode || '').toLowerCase().includes(lowerQuery);
      
      const examStaff = staffByExam[exam._id] || [];
      const staffMatch = examStaff.some(staff => 
        (staff.firstName || '').toLowerCase().includes(lowerQuery) ||
        (staff.lastName || '').toLowerCase().includes(lowerQuery) ||
        (staff.email || '').toLowerCase().includes(lowerQuery) ||
        (staff.employeeCode || '').toLowerCase().includes(lowerQuery)
      );

      return examNameMatch || staffMatch;
    });
  }, [exams, searchQuery, staffByExam]);

  const getFilteredStaffForExam = useCallback((examId: string) => {
    const staff = staffByExam[examId] || [];
    if (!searchQuery) return staff;
    
    const exam = exams.find(e => e._id === examId);
    if (exam && ((exam.examTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) || (exam.examCode || '').toLowerCase().includes(searchQuery.toLowerCase()))) {
        return staff;
    }

    const lowerQuery = searchQuery.toLowerCase();
    return staff.filter(s => 
      (s.firstName || '').toLowerCase().includes(lowerQuery) ||
      (s.lastName || '').toLowerCase().includes(lowerQuery) ||
      (s.email || '').toLowerCase().includes(lowerQuery) ||
      (s.employeeCode || '').toLowerCase().includes(lowerQuery)
    );
  }, [staffByExam, searchQuery, exams]);

  const filteredUnassigned = useMemo(() => {
    const unassigned = staffByExam['unassigned'] || [];
    if (!searchQuery) return unassigned;
    const lowerQuery = searchQuery.toLowerCase();
    return unassigned.filter(staff => 
      (staff.firstName || '').toLowerCase().includes(lowerQuery) ||
      (staff.lastName || '').toLowerCase().includes(lowerQuery) ||
      (staff.email || '').toLowerCase().includes(lowerQuery) ||
      (staff.employeeCode || '').toLowerCase().includes(lowerQuery)
    );
  }, [staffByExam, searchQuery]);

  const [expandedExams, setExpandedExams] = useState<Record<string, boolean>>({});

  const toggleExpand = (examId: string) => {
    setExpandedExams(prev => ({ ...prev, [examId]: !prev[examId] }));
  };

  const handleToggleStatus = async (staff: Staff) => {
    try {
      const staffId = staff.id || staff._id;
      if (!staffId) return;
      const newStatus = staff.status.toUpperCase() === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await staffApi.updateStatus(staffId, newStatus);
      toast({ title: 'Status Updated', description: `Paper Setter status changed to ${newStatus}.`, variant: 'success' });
      handleRefresh();
    } catch (err) {
      toast({ title: 'Update Failed', description: 'Could not update paper setter status.', variant: 'destructive' });
    }
  };

  const handleDelete = async (staff: Staff) => {
    if (confirm(`Are you sure you want to delete ${staff.firstName} ${staff.lastName}? This will permanently remove their access.`)) {
      try {
        const staffId = staff.id || staff._id;
        if (!staffId) return;
        await staffApi.delete(staffId);
        toast({ title: 'Paper Setter Deleted', description: 'Paper Setter has been removed successfully.', variant: 'success' });
        handleRefresh();
      } catch (err) {
        toast({ title: 'Delete Failed', description: 'Could not delete paper setter.', variant: 'destructive' });
      }
    }
  };

  const isLoading = isStaffLoading || isExamsLoading;

  return (
    <div className="space-y-6 p-6">
      <StaffHeader
        title="Paper Setters Management"
        description="Manage your paper setters, view their assignments, and create new ones."
        actions={
          <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        }
      />

      <StaffFilters 
        hideRoleFilter 
        hideDepartmentFilter 
        hideBranchFilter 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search exams or staff..."
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64 border rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExams.map(exam => {
            const examId = exam._id;
            const isExpanded = expandedExams[examId];
            const examStaff = getFilteredStaffForExam(examId);
            
            return (
              <Card key={examId} className="overflow-hidden border-slate-800 bg-slate-900/50">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors" 
                  onClick={() => toggleExpand(examId)}
                >
                  <div className="flex items-center">
                    {isExpanded ? <ChevronDown className="w-5 h-5 mr-3 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 mr-3 text-muted-foreground" />}
                    <h3 className="text-lg font-semibold">{exam.examTitle || exam.examCode}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                      {examStaff.length}/5 Setters
                    </span>
                    <Button
                      size="sm"
                      disabled={examStaff.length >= 5}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCreateExamId(examId);
                        setIsCreateOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Create Paper Setter
                    </Button>
                  </div>
                </div>
                
                {isExpanded && (
                  <CardContent className="p-0 border-t border-slate-800">
                    {examStaff.length > 0 ? (
                      <div className="border-0 border-transparent">
                        <StaffTable 
                          staffList={examStaff} 
                          onView={setViewedStaff}
                          onEdit={setEditedStaff}
                          onToggleStatus={handleToggleStatus}
                          onDelete={handleDelete}
                          variant="paper-setter"
                        />
                      </div>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground border-b border-slate-800/50">
                        No paper setters assigned to this exam.
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
          
          {filteredExams.length === 0 && (
            <div className="p-8 text-center border rounded-md border-slate-800 text-muted-foreground bg-slate-900/50">
              No exams found matching your search.
            </div>
          )}
          
          {/* Unassigned Staff */}
          {filteredUnassigned && filteredUnassigned.length > 0 && (
             <Card className="overflow-hidden border-slate-800 bg-slate-900/50 opacity-80">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors" 
                  onClick={() => toggleExpand('unassigned')}
                >
                  <div className="flex items-center">
                    {expandedExams['unassigned'] ? <ChevronDown className="w-5 h-5 mr-3 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 mr-3 text-muted-foreground" />}
                    <h3 className="text-lg font-semibold text-amber-500/80">Unassigned / Pending</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                      {filteredUnassigned.length} Setters
                    </span>
                  </div>
                </div>
                
                {expandedExams['unassigned'] && (
                  <CardContent className="p-0 border-t border-slate-800">
                    <div className="border-0 border-transparent">
                      <StaffTable 
                        staffList={filteredUnassigned} 
                        onView={setViewedStaff}
                        onEdit={setEditedStaff}
                        onToggleStatus={handleToggleStatus}
                        onDelete={handleDelete}
                        variant="paper-setter"
                      />
                    </div>
                  </CardContent>
                )}
             </Card>
          )}
        </div>
      )}

      <StaffViewDialog 
        staff={viewedStaff}
        isOpen={!!viewedStaff}
        onClose={() => setViewedStaff(null)}
      />

      <StaffEditDialog
        staff={editedStaff}
        isOpen={!!editedStaff}
        onClose={() => setEditedStaff(null)}
        onSuccess={() => {
          setEditedStaff(null);
          handleRefresh();
        }}
      />

      <Dialog open={isCreateOpen} onOpenChange={(open) => {
        setIsCreateOpen(open);
        if (!open) setCreateExamId(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Paper Setter</DialogTitle>
            <DialogDescription>
              Register a new paper setter and assign their exam.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <StaffForm 
              initialValues={{ role: "PAPER_SETTER", examId: createExamId }}
              fixedRole={true}
              onSuccess={() => {
                setIsCreateOpen(false);
                setCreateExamId(null);
                handleRefresh();
              }} 
              onCancel={() => {
                setIsCreateOpen(false);
                setCreateExamId(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
