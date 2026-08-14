import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useCenterLabStore } from '../store/useCenterLabStore';
import { useSeatAllocationStore } from '@/stores/candidate/seatAllocation.store';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { ScrollArea } from '@/shared/components/ui/scroll-area';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

interface AddSeatAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddSeatAllocationModal = ({ isOpen, onClose, onSuccess }: AddSeatAllocationModalProps) => {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedLab, setSelectedLab] = useState<string>('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [assignedExams, setAssignedExams] = useState<Record<string, any>[]>([]);
  const { user } = useAuthStore();
  
  const { labsList, fetchLabs } = useCenterLabStore();
  const { unassignedCandidates, fetchUnassignedCandidates, assignLab, isLoading } = useSeatAllocationStore();

  useEffect(() => {
    if (isOpen) {
      const fetchAssignedActiveExams = async () => {
        if (!user?.centerId) return;
        try {
          const res = await api.get(`/import-center-assign-exam/assigned-exams/center/${user.centerId}`);
          if (res.data?.success) {
            const activeExams = res.data.data
              .filter((item: any) => item.examId?.status === 'ACTIVE')
              .map((item: any) => item.examId);
            setAssignedExams(activeExams);
          }
        } catch (error) {
          console.error('Error fetching assigned exams:', error);
        }
      };

      fetchAssignedActiveExams();
      fetchLabs(); // Should fetch labs
    }
  }, [isOpen, user?.centerId, fetchLabs]);

  const handleClose = () => {
    setSelectedExam('');
    setSelectedLab('');
    setSelectedCandidates([]);
    onClose();
  };

  useEffect(() => {
    if (selectedExam) {
      fetchUnassignedCandidates(selectedExam, user?.centerId);
    }
  }, [selectedExam, fetchUnassignedCandidates, user?.centerId]);

  const labs = Array.isArray(labsList) ? labsList : [];
  const currentLab = labs.find(lab => lab.id === selectedLab);
  
  // Capacity check
  const isOverCapacity = currentLab ? selectedCandidates.length > currentLab.seatingCapacity : false;
  const isFull = currentLab ? selectedCandidates.length === currentLab.seatingCapacity : false;

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === unassignedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      // If we are selecting all, we need to respect capacity. Let's just select up to capacity.
      if (currentLab) {
        const availableSlots = currentLab.seatingCapacity;
        setSelectedCandidates(unassignedCandidates.slice(0, availableSlots).map(c => c._id));
      } else {
        setSelectedCandidates(unassignedCandidates.map(c => c._id));
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedExam || !selectedLab || selectedCandidates.length === 0) return;
    
    if (isOverCapacity) {
      alert("You cannot select more candidates than the lab's capacity.");
      return;
    }

    const success = await assignLab(selectedExam, selectedLab, selectedCandidates);
    if (success) {
      onSuccess();
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Seat Allocation</DialogTitle>
          <DialogDescription>
            Assign unassigned candidates to a lab for an exam.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Exam</label>
              <Select value={selectedExam} onValueChange={(val) => {
                setSelectedExam(val);
                setSelectedCandidates([]);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  {assignedExams.map((exam) => (
                    <SelectItem key={exam._id} value={exam._id}>
                      {exam.examTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Lab/Class</label>
              <Select value={selectedLab} onValueChange={setSelectedLab}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Lab" />
                </SelectTrigger>
                <SelectContent>
                  {labs.map((lab) => (
                    <SelectItem key={lab.id} value={lab.id}>
                      {lab.labName} (Cap: {lab.seatingCapacity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedExam && selectedLab && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Select Candidates</label>
                <div className="text-sm text-gray-500">
                  Selected: {selectedCandidates.length} / {currentLab?.seatingCapacity}
                </div>
              </div>

              {isOverCapacity && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Capacity exceeded! Please deselect some candidates.
                </div>
              )}

              {isFull && !isOverCapacity && (
                <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-center text-sm">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Lab is full. Please assign the remaining candidates to another lab.
                </div>
              )}

              <div className="border rounded-md">
                <div className="flex items-center p-3 border-b bg-muted/50">
                  <Checkbox 
                    checked={selectedCandidates.length > 0 && selectedCandidates.length === (currentLab ? Math.min(unassignedCandidates.length, currentLab.seatingCapacity) : unassignedCandidates.length)}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="ml-3 text-sm font-medium">Select All (up to capacity)</span>
                </div>
                <ScrollArea className="h-[300px]">
                  {unassignedCandidates.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No unassigned candidates found for this exam.
                    </div>
                  ) : (
                    <div className="divide-y">
                      {unassignedCandidates.map((candidate) => (
                        <div key={candidate._id} className="flex items-center p-3 transition-colors hover:bg-muted/50">
                          <Checkbox 
                            checked={selectedCandidates.includes(candidate._id)}
                            onCheckedChange={() => handleCandidateToggle(candidate._id)}
                            disabled={!selectedCandidates.includes(candidate._id) && isFull}
                          />
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium">{candidate.candidateFullName}</p>
                            <p className="text-xs text-muted-foreground">App No: {candidate.applicationNo} | Roll No: {candidate.rollNo || 'N/A'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedExam || !selectedLab || selectedCandidates.length === 0 || isOverCapacity || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Allocating...' : 'Seat Allocation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
