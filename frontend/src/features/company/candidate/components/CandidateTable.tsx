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
import { Eye, Edit, Trash2, Send, Check, Loader2, User } from 'lucide-react'
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
import { getDisplayStatus } from '@/shared/utils/exam-status'
import { ExamStatusBadge } from '@/shared/components/badges/ExamStatusBadge'

interface CandidateTableProps {
  candidates: ImportedCandidate[]
}

export const CandidateTable = ({ candidates }: CandidateTableProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<ImportedCandidate | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [unmatchedCenters, setUnmatchedCenters] = useState<string[]>([])
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false)
  const [sendingStates, setSendingStates] = useState<Record<string, boolean>>({})
  const { deleteCandidate, sendToCenter, fetchImportedCandidates } = useCandidateImportStore()

  const handleSendToCenter = async (examId: string, e: React.MouseEvent, groupKey: string) => {
    e.stopPropagation()
    setSendingStates(prev => ({ ...prev, [groupKey]: true }))
    
    // Simulate 2 sec loader
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const result = await sendToCenter(examId)
    if (result.success) {
      if (result.data?.unmatchedCenters?.length > 0) {
        setUnmatchedCenters(result.data.unmatchedCenters)
        setIsWarningModalOpen(true)
      } else {
        toast({ title: 'Success', description: `${result.data?.sentCount || 0} candidates sent successfully.` })
      }
      fetchImportedCandidates(false) // Silent fetch so table doesn't disappear
    }
    setSendingStates(prev => ({ ...prev, [groupKey]: false }))
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
              const dynamicColumnKeys = Array.from(new Set(examCandidates.flatMap(c => Object.keys(c.dynamicFields || {}))));

              const hasUnsentCandidates = examCandidates.some(c => !c.isSentToCenter);

              return (
                <AccordionItem
                  key={examName}
                  value={examName}
                  className='border border-border rounded-md overflow-hidden bg-card shadow-sm'
                >
                  <AccordionTrigger className='px-4 hover:bg-muted/50 transition-colors'>
                    <div className='flex flex-1 items-center text-base font-semibold text-left pr-4'>
                      {populatedExam && getDisplayStatus(populatedExam) && (
                        <ExamStatusBadge exam={populatedExam} className="mr-3 h-6" />
                      )}
                      {examName}
                      <span className='ml-3 rounded-full bg-[#E4FD97] px-2.5 py-0.5 text-xs font-medium text-[#2D3E2C] whitespace-nowrap'>
                        {examCandidates.length} Candidates
                      </span>
                      <Button
                        size="sm"
                        variant="default"
                        className={`ml-auto shadow-sm ${
                          !populatedExam?._id || (!hasUnsentCandidates && !sendingStates[examName])
                            ? 'opacity-70 cursor-not-allowed pointer-events-none'
                            : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (populatedExam?._id && hasUnsentCandidates && !sendingStates[examName]) {
                            handleSendToCenter(populatedExam._id, e, examName);
                          }
                        }}
                        disabled={sendingStates[examName] || (!hasUnsentCandidates && !sendingStates[examName])}
                      >
                        {sendingStates[examName] ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : !hasUnsentCandidates ? (
                          <>
                            <Check className='mr-2 h-4 w-4' />
                            Sended
                          </>
                        ) : (
                          <>
                            <Send className='mr-2 h-4 w-4' />
                            Send to Center
                          </>
                        )}
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pt-0 pb-0 bg-background'>
                    <div className='overflow-x-auto border-t border-border'>
                      <Table>
                        <TableHeader className='bg-muted/10'>
                          <TableRow>
                            <TableHead className="w-12">Photo</TableHead>
                            <TableHead>Candidate ID</TableHead>
                            <TableHead>Application No</TableHead>
                            <TableHead>Full Name</TableHead>
                            <TableHead>DOB</TableHead>
                            <TableHead>Aadhaar No.</TableHead>
                            {dynamicColumnKeys.map(col => (
                              <TableHead key={col} className='capitalize'>
                                {col.replace(/([A-Z])/g, ' $1').trim()}
                              </TableHead>
                            ))}
                            <TableHead className='text-right'>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {examCandidates.map((candidate) => (
                            <TableRow key={candidate._id}>
                              <TableCell>
                                {candidate.candidatePhoto ? (
                                  <img
                                    src={candidate.candidatePhoto}
                                    alt={candidate.candidateFullName}
                                    className='w-12 h-12 rounded-full object-cover border-2 border-border shrink-0 shadow-sm'
                                  />
                                ) : (
                                  <div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border shrink-0 shadow-sm'>
                                    <User className='w-6 h-6 text-muted-foreground' />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className='font-medium'>{candidate.candidateId}</TableCell>
                              <TableCell>{candidate.applicationNo}</TableCell>
                              <TableCell>{candidate.candidateFullName}</TableCell>
                              <TableCell>{candidate.dateOfBirth}</TableCell>
                              <TableCell>{candidate.aadharNumber}</TableCell>
                              {dynamicColumnKeys.map(col => (
                                <TableCell key={col}>
                                  {candidate.dynamicFields?.[col] || '—'}
                                </TableCell>
                              ))}
                              <TableCell className='text-right space-x-2 whitespace-nowrap'>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleView(candidate)}
                                  title='View'
                                  className='text-[#4A5D23] hover:text-[#4A5D23] hover:bg-[#4A5D23]/10 transition-colors'
                                >
                                  <Eye className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleEdit(candidate)}
                                  title='Edit'
                                  className='text-[#4A5D23] hover:text-[#4A5D23] hover:bg-[#4A5D23]/10 transition-colors'
                                >
                                  <Edit className='h-4 w-4' />
                                </Button>
                                <Button
                                  variant='ghost'
                                  size='icon'
                                  onClick={() => handleDelete(candidate._id)}
                                  title='Delete'
                                  className='text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors'
                                >
                                  <Trash2 className='h-4 w-4' />
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
