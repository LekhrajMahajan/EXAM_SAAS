import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useExamStore } from '@/stores/exam/exam.store';
import { useCandidateImportStore, type ImportedCandidate } from '@/stores/candidate/candidateImport.store';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

interface SendToCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SendToCenterModal = ({ isOpen, onClose, onSuccess }: SendToCenterModalProps) => {
  const [selectedExam, setSelectedExam] = useState<string>('');
  const { exams, fetchExams } = useExamStore();
  const { importedCandidates, sendToCenter, isLoading } = useCandidateImportStore();
  const { toast } = useToast();

  const filteredCandidates = importedCandidates.filter(c => 
    c.examId?._id === selectedExam && (!c.isSentToCenter || !c.centerId)
  );

  useEffect(() => {
    if (isOpen) {
      fetchExams();
    }
  }, [isOpen, fetchExams]);

  const handleClose = () => {
    setSelectedExam('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedExam) return;
    
    const success = await sendToCenter(selectedExam);
    if (success) {
      toast({
        title: "Success",
        description: "Candidates for the selected exam have been sent to the center successfully.",
        variant: "success",
      });
      onSuccess();
      handleClose();
    } else {
      toast({
        title: "Error",
        description: "Failed to send candidates to the center. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Candidates to Center</DialogTitle>
          <DialogDescription>
            Select an exam to send its candidates to the respective center for lab allocation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 min-w-0">
          <div className="space-y-2 min-w-0">
            <label className="text-sm font-medium">Select Exam</label>
            <div className="w-full min-w-0 flex flex-col">
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger className="w-full min-w-0 truncate">
                  <SelectValue placeholder="Select Exam" className="truncate" />
                </SelectTrigger>
                <SelectContent className="max-w-[460px] truncate">
                  {Array.isArray(exams) && exams.map((exam) => (
                    <SelectItem key={exam._id} value={exam._id}>
                      <span className="block truncate">
                        {exam.examCode ? `${exam.examCode} - ${exam.examTitle}` : exam.examTitle}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedExam && filteredCandidates.length > 0 && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Candidates to be Sent</label>
                <div className="text-sm text-gray-500">
                  Total: {filteredCandidates.length}
                </div>
              </div>
              <div className="border rounded-md">
                <ScrollArea className="h-[250px]">
                  <div className="divide-y">
                    {filteredCandidates.map((candidate: ImportedCandidate) => (
                      <div key={candidate._id} className="flex flex-col p-3 hover:bg-gray-50">
                        <p className="text-sm font-medium">{candidate.candidateFullName}</p>
                        <p className="text-xs text-gray-500">App No: {candidate.applicationNo} | Roll No: {candidate.rollNo || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {selectedExam && filteredCandidates.length === 0 && (
            <div className="p-4 text-center text-gray-500 border rounded-md mt-4">
              No new candidates found for this exam.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedExam || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? 'Sending...' : 'Send to Center'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
