import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { UploadCloud, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { examApi } from '@/features/exam-manager/api/exam.api';
import type { Exam } from '@/features/exam-manager/api/exam.api';
import api from '@/services/api';
import { getDisplayStatus } from '@/shared/utils/exam-status';

interface ImportReport {
  successCount: number
  errorCount: number
  errors: string[]
}

export function ImportCandidateModalPrivate({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [open, setOpen] = useState(false)
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [exams, setExams] = useState<Exam[]>([])
  const [selectedExamId, setSelectedExamId] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingExams, setIsLoadingExams] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<ImportReport | null>(null)

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoadingExams(true)
        const res = await examApi.getAll({ limit: 100, status: 'ACTIVE' })
        if (res.success) {
          const activeExams = res.data.exams.filter(
            (exam: Exam) => getDisplayStatus(exam) === 'ACTIVE'
          );
          setExams(activeExams)
          if (activeExams.length === 1) {
            setSelectedExamId(activeExams[0]._id)
          }
        }
      } catch (err) {
        console.error('Failed to fetch exams:', err)
      } finally {
        setIsLoadingExams(false)
      }
    }

    if (open) {
      fetchExams()
    }
  }, [open])

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setZipFile(e.target.files[0])
      setError(null)
      setReport(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedExamId) {
      setError('Please select an Exam.')
      return
    }
    if (!zipFile) {
      setError('Please select a ZIP file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', zipFile)
    formData.append('examId', selectedExamId)

    setIsUploading(true)
    setError(null)
    setReport(null)

    try {
      const response = await api.post('/import-candidate/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.data.success) {
        const data = response.data.data as ImportReport
        setReport(data)
        if (data.errorCount === 0) {
          setTimeout(() => {
            setOpen(false)
            setZipFile(null)
            setSelectedExamId('')
            setReport(null)
            onSuccess?.()
          }, 3000)
        } else {
          onSuccess?.()
        }
      } else {
        setError(response.data.message)
      }
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during import.'
      const axiosErr = err as { response?: { data?: { message?: string } } }
      setError(axiosErr?.response?.data?.message || msg)
    } finally {
      setIsUploading(false)
    }
  }

  const resetState = () => {
    setZipFile(null)
    setSelectedExamId('')
    setError(null)
    setReport(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) resetState()
      }}
    >
      <DialogTrigger asChild>
        <Button size='sm' className='bg-background text-[#2D3E2C] dark:text-slate-200 border border-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-white'>
          <UploadCloud className='w-4 h-4 mr-2' />
          Import Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Import Candidates via ZIP</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4 overflow-hidden'>
          {/* Exam Select */}
          <div className='space-y-2 min-w-0'>
            <Label htmlFor='exam-select-private'>Select Exam</Label>
            <Select onValueChange={(val) => setSelectedExamId(val)} value={selectedExamId}>
              <SelectTrigger id='exam-select-private' className='w-full overflow-hidden'>
                <div className='flex-1 text-left truncate pr-2'>
                  <SelectValue
                    placeholder={isLoadingExams ? 'Loading exams...' : 'Select an exam'}
                  />
                </div>
              </SelectTrigger>
              <SelectContent className='max-w-[90vw] sm:max-w-md'>
                {exams.map((exam) => (
                  <SelectItem key={exam._id} value={exam._id} className='break-words whitespace-normal'>
                    {exam.examTitle} ({exam.examCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Single ZIP Upload */}
          <div className='grid w-full items-center gap-1.5'>
            <Label htmlFor='zip-file-private'>
              Upload ZIP File (.zip)
            </Label>
            <Input
              id='zip-file-private'
              type='file'
              accept='.zip'
              onChange={handleZipChange}
              disabled={isUploading}
            />
          </div>

          {/* Instructions */}
          <div className='text-sm text-muted-foreground bg-muted/50 p-3 rounded-md max-h-[230px] overflow-y-auto'>
            <p className='font-semibold mb-1 text-foreground'>📦 ZIP File Structure:</p>
            <div className='bg-muted rounded p-2 font-mono text-xs mb-3 space-y-0.5'>
              <p>candidates.zip</p>
              <p className='pl-3'>├── candidates.xlsx <span className='text-muted-foreground font-sans'>(candidate data)</span></p>
              <p className='pl-3'>├── 1023.jpg <span className='text-muted-foreground font-sans'>(Candidate ID = 1023)</span></p>
              <p className='pl-3'>├── 1024.png</p>
              <p className='pl-3'>└── 1025.jpeg</p>
            </div>
            <p className='font-medium mb-1'>Photo Rules:</p>
            <ul className='list-disc list-inside space-y-0.5 text-xs mb-3'>
              <li>Photo filename must exactly match the <strong>Candidate ID</strong></li>
              <li>Supported formats: <code>.jpg</code>, <code>.jpeg</code>, <code>.png</code></li>
              <li>Optional fields in Excel can be left blank</li>
            </ul>
            <p className='font-medium mb-1'>Required Excel Columns:</p>
            <ul className='list-disc list-inside space-y-0.5 text-xs'>
              <li>Candidate ID / Registration No.</li>
              <li>Application No.</li>
              <li>Center Name / Address Location</li>
              <li>Exam Name</li>
              <li>Candidate Full Name</li>
              <li>Father&apos;s Name</li>
              <li>Mother&apos;s Name</li>
              <li>Date of Birth</li>
              <li>Gender</li>
              <li>Aadhaar No.</li>
            </ul>
            <p className='font-medium mb-1 mt-3'>Optional Excel Columns:</p>
            <ul className='list-disc list-inside space-y-0.5 text-xs text-muted-foreground'>
              <li>Organization/Exam Body</li>
              <li>Exam Code</li>
              <li>Advertisement/Notification No.</li>
              <li>Roll/Seat No.</li>
              <li>Category</li>
              <li>Post Name</li>
              <li>Paper/Subject</li>
              <li>Exam Stage</li>
              <li>Exam Date</li>
              <li>Shift</li>
              <li>Reporting Time</li>
              <li>Gate Closing Time</li>
              <li>Exam Start Time</li>
              <li>Duration</li>
              <li>Exam Mode</li>
              <li>Centre Code</li>
              <li>Full Centre Address</li>
              <li>City, District, State, PIN, Landmark, Nearest Railway Station</li>
              <li>Language</li>
              <li>Scribe Details</li>
              <li>Physical Test Details</li>
              <li>Photo ID Instructions</li>
              <li>Important Instructions</li>
              <li>Candidate Declaration</li>
              <li>Biometric/Verification Info</li>
              <li>Candidate Signature</li>
              <li>PwD Status, PwD Type</li>
            </ul>
          </div>

          {/* Error */}
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Import Report */}
          {report && (
            <div className='space-y-2'>
              <Alert className='bg-emerald-500/15 text-emerald-700 border-emerald-500/30'>
                <CheckCircle2 className='h-4 w-4 text-emerald-600' />
                <AlertTitle>Import Complete</AlertTitle>
                <AlertDescription>
                  <strong>{report.successCount}</strong> candidate(s) imported successfully.
                  {report.errorCount > 0 && (
                    <span className='text-orange-600 ml-1'><strong>{report.errorCount}</strong> skipped.</span>
                  )}
                </AlertDescription>
              </Alert>
              {report.errors.length > 0 && (
                <div className='bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-md p-3 max-h-[140px] overflow-y-auto'>
                  <p className='text-xs font-semibold text-orange-700 dark:text-orange-400 mb-1 flex items-center gap-1'>
                    <XCircle className='h-3.5 w-3.5' /> Skipped rows:
                  </p>
                  <ul className='space-y-0.5'>
                    {report.errors.map((e, idx) => (
                      <li key={idx} className='text-xs text-orange-600 dark:text-orange-400'>{e}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!zipFile || !selectedExamId || isUploading}
            className='bg-[#2D3E2C] hover:bg-[#3d5038] text-white border border-[#2D3E2C]'
          >
            {isUploading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isUploading ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
