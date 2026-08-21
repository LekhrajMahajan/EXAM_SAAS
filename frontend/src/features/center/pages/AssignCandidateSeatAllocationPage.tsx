import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Plus, Eye, Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
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
  const [selectedExam, setSelectedExam] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
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

  // Group allocations by exam and then by lab
  const groupedAllocations = allocations.reduce((acc, allocation) => {
    const candidate = (allocation.candidateId || allocation) as any;
    
    const searchLower = searchTerm.toLowerCase();
    if (
      searchTerm && 
      !(candidate.candidateFullName?.toLowerCase().includes(searchLower) || candidate.applicationNo?.toLowerCase().includes(searchLower))
    ) {
      return acc;
    }

    const examId = allocation.examId?._id || allocation.examId || 'unassigned_exam';
    const examName = allocation.examId?.examTitle || allocation.examName || 'Unknown Exam';
    const labId = allocation.labId?._id || 'unassigned_lab';
    const labName = allocation.labId?.labName || 'Unknown Lab';

    if (!acc[examId]) {
      acc[examId] = {
        examName,
        labs: {}
      };
    }

    if (!acc[examId].labs[labId]) {
      acc[examId].labs[labId] = {
        labName,
        candidates: []
      };
    }

    acc[examId].labs[labId].candidates.push(candidate);
    return acc;
  }, {} as Record<string, { examName: string; labs: Record<string, { labName: string; candidates: any[] }> }>);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Assign Candidate Seat Allocation</h2>
          <p className="text-muted-foreground mt-2">Manage candidate seat allocations for labs</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/20">
          <Plus className="mr-2 h-4 w-4" /> Add Seat Allocation
        </Button>
      </div>

      <Card className="bg-card border-border shadow-xl">
        <CardHeader>
          <CardTitle>Seat Allocations</CardTitle>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search candidates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full bg-background"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={selectedExam} onValueChange={setSelectedExam}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Exams</SelectItem>
                  {Array.isArray(exams) && exams.map((exam) => (
                    <SelectItem key={exam._id} value={exam._id}>
                      {exam.examTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              {Object.entries(groupedAllocations).map(([examId, examData]) => (
                <AccordionItem key={examId} value={examId} className="border rounded-md overflow-hidden bg-background">
                  <AccordionTrigger className="px-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center text-base font-semibold text-left">
                      <span className="text-primary">{examData.examName}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-2 px-4 bg-muted/10">
                    <Accordion type="multiple" className="w-full space-y-3 mt-2">
                      {Object.entries(examData.labs).map(([labId, labData]) => (
                        <AccordionItem key={labId} value={labId} className="border rounded-md bg-background">
                          <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center text-sm font-semibold text-left w-full">
                              <span className="text-muted-foreground">Lab: {labData.labName}</span>
                              <span className="ml-auto rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-[#2D3E2C] border border-[#2D3E2C]/20 whitespace-nowrap">
                                {labData.candidates.length} Candidates
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
                                  {[...labData.candidates]
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
                                            className="text-primary border-border hover:bg-primary/10 hover:text-primary hover:border-primary/50"
                                          >
                                            <Eye className="w-4 h-4 mr-2" /> View
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
