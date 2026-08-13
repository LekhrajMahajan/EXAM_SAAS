import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { useSeatAllocationStore } from '@/stores/candidate/seatAllocation.store';
import { AddSeatAllocationModal } from '@/features/center/components/AddSeatAllocationModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { ViewCandidateModal } from '@/features/company/candidate/components/ViewCandidateModal';
import { useExamStore } from '@/stores/exam/exam.store';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export const AssignCandidateSeatAllocationPage = () => {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string>('');
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { allocations, fetchAllocations, isLoading } = useSeatAllocationStore();
  const { exams, fetchExams } = useExamStore();

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  useEffect(() => {
    if (selectedExam) {
      fetchAllocations(selectedExam, user?.centerId);
    }
  }, [selectedExam, fetchAllocations, user?.centerId]);

  // Group allocations by lab
  const groupedAllocations = allocations.reduce((acc, allocation) => {
    const labId = allocation.labId?._id || 'unassigned';
    if (!acc[labId]) {
      acc[labId] = {
        labName: allocation.labId?.labName || 'Unknown Lab',
        examName: allocation.examId?.examTitle || allocation.examName,
        candidates: []
      };
    }
    // Push the populated candidate object if it exists, otherwise fallback to the allocation itself (for backward compatibility if needed)
    acc[labId].candidates.push(allocation.candidateId || allocation);
    return acc;
  }, {} as Record<string, { labName: string; examName: string; candidates: any[] }>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Assign Candidate Seat Allocation</h2>
          <p className="text-sm text-gray-300">Manage candidate seat allocations for labs</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Add Seat Allocation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seat Allocations</CardTitle>
          <div className="mt-4 max-w-sm">
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger>
                <SelectValue placeholder="Select an Exam" />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(exams) && exams.map((exam) => (
                  <SelectItem key={exam._id} value={exam._id}>
                    {exam.examTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedExam ? (
            <div className="text-center py-10 text-gray-500">
              Please select an exam to view seat allocations.
            </div>
          ) : isLoading ? (
            <div className="text-center py-10">Loading...</div>
          ) : Object.keys(groupedAllocations).length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No seat allocations found for this exam.
            </div>
          ) : (
            <Accordion type="multiple" className="w-full space-y-4">
              {Object.entries(groupedAllocations).map(([labId, data]) => (
                <AccordionItem key={labId} value={labId} className="border rounded-md overflow-hidden bg-background">
                  <AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center text-base font-semibold text-left flex-wrap gap-2">
                      <span className="text-primary">{data.examName}</span>
                      <span className="text-muted-foreground font-normal ml-2 mr-2">|</span>
                      <span className="text-muted-foreground font-normal">Lab: {data.labName}</span>
                      <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary whitespace-nowrap">
                        {data.candidates.length} Candidates
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-0">
                    <div className="overflow-x-auto border-t">
                      <Table>
                        <TableHeader className="bg-muted/30">
                          <TableRow>
                            <TableHead>Application No</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>DOB</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...data.candidates]
                            .sort((a, b) => (a.applicationNo || '').localeCompare((b.applicationNo || ''), undefined, { numeric: true }))
                            .map(candidate => (
                              <TableRow key={candidate._id}>
                                <TableCell className="font-medium">{candidate.applicationNo}</TableCell>
                                <TableCell>{candidate.candidateFullName}</TableCell>
                                <TableCell>{candidate.gender}</TableCell>
                                <TableCell>{candidate.dateOfBirth}</TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedCandidate(candidate);
                                      setIsViewModalOpen(true);
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2 text-blue-500" /> View
                                  </Button>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <AddSeatAllocationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          if (selectedExam) fetchAllocations(selectedExam, user?.centerId);
        }}
      />

      <ViewCandidateModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedCandidate(null);
        }}
        candidate={selectedCandidate}
      />
    </div>
  );
};
