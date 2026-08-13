import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion'
import { Button } from '@/shared/components/ui/button'
import { Eye, Edit, Trash2, Send } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import type { ImportedCandidate } from '../../../../stores/candidate/candidateImport.store'
import { ViewCandidateModal } from './ViewCandidateModal'
import { EditCandidateModal } from './EditCandidateModal'
import { useCandidateImportStore } from '../../../../stores/candidate/candidateImport.store'
import { toast } from '@/hooks/use-toast'

interface CandidateTableProps {
  candidates: ImportedCandidate[]
}

export const CandidateTable = ({ candidates }: CandidateTableProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<ImportedCandidate | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [unmatchedCenters, setUnmatchedCenters] = useState<string[]>([])
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const { deleteCandidate, sendToCenter, fetchImportedCandidates } = useCandidateImportStore()

  const handleSendToCenter = async (examId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const result = await sendToCenter(examId)
    if (result.success) {
      if (result.data?.unmatchedCenters?.length > 0) {
        setUnmatchedCenters(result.data.unmatchedCenters)
        setIsWarningModalOpen(true)
      } else {
        toast({ title: 'Success', description: `${result.data?.sentCount || 0} candidates sent successfully.` })
      }
      fetchImportedCandidates()
    }
  }

  const handleView = (candidate: ImportedCandidate) => {
    setSelectedCandidate(candidate)
    setIsViewModalOpen(true)
  }

  const handleEdit = (candidate: ImportedCandidate) => {
    setSelectedCandidate(candidate)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (candidateId: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      const success = await deleteCandidate(candidateId)
      if (success) {
        toast({ title: 'Candidate deleted successfully' })
      } else {
        toast({ title: 'Failed to delete candidate', variant: 'destructive' })
      }
    }
  }

  // Group candidates by examName
  const groupedCandidates = candidates.reduce((acc, candidate) => {
    const examName = candidate.examName || 'Unknown Exam'
    if (!acc[examName]) {
      acc[examName] = []
    }
    acc[examName].push(candidate)
    return acc
  }, {} as Record<string, ImportedCandidate[]>)

  const examNames = Object.keys(groupedCandidates)

  const getExamStatus = (exam: any) => {
    if (!exam) return null;
    
    if (exam.isResultPublished) {
      return { label: 'Result Published', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
    
    if (exam.examDate && exam.endTime) {
      const examDate = new Date(exam.examDate);
      // Try parsing HH:mm from endTime
      if (exam.endTime.includes(':')) {
        const [hours, minutes] = exam.endTime.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
          examDate.setHours(hours, minutes, 0, 0);
          const now = new Date();
          if (now > examDate) {
            return { label: 'Pending Result', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
          }
        }
      }
    }
    
    return { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  return (
    <>
      <div className='rounded-md border bg-card p-4'>
        {candidates.length === 0 ? (
          <div className='flex h-24 items-center justify-center text-muted-foreground'>
            No imported candidates found.
          </div>
        ) : (
          <Accordion type='multiple' className='w-full space-y-4'>
            {examNames.map((examName) => {
              const examCandidates = groupedCandidates[examName]
              const populatedExam = examCandidates[0]?.examId
              const status = getExamStatus(populatedExam)

              return (
                <AccordionItem
                  key={examName}
                  value={examName}
                  className='border rounded-md overflow-hidden bg-background'
                >
                  <AccordionTrigger className='px-4 hover:bg-muted/50 transition-colors'>
                    <div className='flex items-center text-base font-semibold text-left'>
                      {status && (
                        <span className={`mr-3 rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap ${status.color}`}>
                          {status.label}
                        </span>
                      )}
                      {examName}
                      <span className='ml-3 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary whitespace-nowrap'>
                        {examCandidates.length} Candidates
                      </span>
                      <div
                        role='button'
                        className={`ml-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white ${!populatedExam?._id ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (populatedExam?._id) handleSendToCenter(populatedExam._id, e);
                        }}
                      >
                        <Send className='mr-2 h-4 w-4' />
                        Send to Center
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pt-0 pb-0'>
                    <div className='overflow-x-auto border-t'>
                      <Table>
                        <TableHeader className='bg-muted/30'>
                          <TableRow>
                            <TableHead>Candidate ID</TableHead>
                            <TableHead>Application No</TableHead>
                            <TableHead>Center Name</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>Mother&apos:s Name</TableHead>
                            <TableHead>DOB</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {examCandidates.map((candidate) => (
                            <TableRow key={candidate._id}>
                              <TableCell className='font-medium'>{candidate.candidateId}</TableCell>
                              <TableCell>{candidate.applicationNo}</TableCell>
                              <TableCell>{candidate.centerName}</TableCell>
                              <TableCell>{candidate.candidateFullName}</TableCell>
                              <TableCell>{candidate.motherName}</TableCell>
                              <TableCell>{candidate.dateOfBirth}</TableCell>
                              <TableCell>{candidate.gender}</TableCell>
                              <TableCell className='text-right space-x-2 whitespace-nowrap'>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleView(candidate)}
                                  title='View'
                                >
                                  <Eye className='h-4 w-4 text-blue-500' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleEdit(candidate)}
                                  title='Edit'
                                >
                                  <Edit className='h-4 w-4 text-yellow-500' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleDelete(candidate._id)}
                                  title='Delete'
                                >
                                  <Trash2 className='h-4 w-4 text-red-500' />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        )}
      </div>

      <ViewCandidateModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        candidate={selectedCandidate}
      />

      <EditCandidateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        candidate={selectedCandidate}
      />

      <Dialog open={isWarningModalOpen} onOpenChange={setIsWarningModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Unmatched Centers Found</DialogTitle>
            <DialogDescription>
              The following centers were found in the uploaded candidate list but are not registered (or are not active) in your Company&apos;s Branches & Centers page. Candidates associated with these centers have <b>NOT</b> been sent.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto mt-4 p-4 rounded-md border bg-red-50 text-red-900 text-sm">
            <ul className="list-disc pl-5 space-y-1">
              {unmatchedCenters.map((center, index) => (
                <li key={index}>{center}</li>
              ))}
            </ul>
          </div>
          <DialogFooter className="mt-6">
            <Button onClick={() => setIsWarningModalOpen(false)}>Acknowledge</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
