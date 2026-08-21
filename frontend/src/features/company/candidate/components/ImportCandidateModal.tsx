import React, { useState } from 'react'
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
import { UploadCloud, Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import api from '@/services/api'

export function ImportCandidateModal () {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setError(null)
      setSuccessMsg(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an Excel file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setIsUploading(true)
    setError(null)
    setSuccessMsg(null)

    try {
      const response = await api.post('/import-candidate/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setSuccessMsg(response.data.message)
        setTimeout(() => {
          setOpen(false)
          setFile(null)
          setSuccessMsg(null)
          // Optional: trigger refresh
        }, 2000)
      } else {
        setError(response.data.message)
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'An unexpected error occurred during import.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val)
        if (!val) {
          setFile(null)
          setError(null)
          setSuccessMsg(null)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size='sm'>
          <UploadCloud className='w-4 h-4 mr-2' />
          Import Candidate
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Import Candidates via Excel</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid w-full max-w-sm items-center gap-1.5'>
            <Label htmlFor='excel-file'>Upload Excel File (.xlsx, .csv)</Label>
            <Input
              id='excel-file'
              type='file'
              accept='.xlsx, .xls, .csv'
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>

          <div className='text-sm text-muted-foreground bg-muted/50 p-3 rounded-md max-h-[250px] overflow-y-auto'>
            <p className='font-medium mb-1'>Required Columns:</p>
            <ul className='list-disc list-inside space-y-1 mb-4'>
              <li>Candidate ID / Registration No.</li>
              <li>Application No.</li>
              <li>Center Name / Address Location</li>
              <li>Exam Name</li>
              <li>Candidate Full Name</li>
              <li>Mother&apos;s Name</li>
              <li>Date of Birth</li>
              <li>Gender</li>
            </ul>
            <p className='font-medium mb-1'>Optional Columns:</p>
            <ul className='list-disc list-inside space-y-1 text-xs opacity-80'>
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
              <li>City</li>
              <li>District</li>
              <li>State</li>
              <li>PIN</li>
              <li>Landmark</li>
              <li>Nearest Railway Station</li>
              <li>Language</li>
              <li>Scribe Details</li>
              <li>Physical Test Details</li>
              <li>Photo ID Instructions</li>
              <li>Important Instructions</li>
              <li>Candidate Declaration</li>
              <li>Biometric/Verification Info</li>
            </ul>
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMsg && (
            <Alert className='bg-[#61B246]/15 text-[#E4FD97] border-[#61B246]/30'>
              <FileSpreadsheet className='h-4 w-4 text-[#61B246]!' />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading} className='bg-[#2D3E2C] hover:bg-[#3d5038] text-white border border-[#2D3E2C]'>
            {isUploading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
