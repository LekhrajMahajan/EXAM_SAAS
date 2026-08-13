import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import type { DocumentData } from './DocumentCard'
import { ApproveDialog } from './ApproveDialog'
import { RejectDialog } from './RejectDialog'

interface VerificationPanelProps {
  candidate: {
    applicationNumber: string
    name: string
    exam: string
    category: string
    status: string
  }
  documents: DocumentData[]
  selectedDocument: DocumentData | null
  onSelectDocument: (doc: DocumentData) => void
  onVerifyAction: (id: string, action: 'approve' | 'reject' | 'reupload', data?: any) => void
}

export function VerificationPanel ({
  candidate,
  documents,
  selectedDocument,
  onSelectDocument,
  onVerifyAction,
}: VerificationPanelProps) {
  const pendingDocs = documents.filter((d) => d.status === 'Pending')
  const verifiedDocs = documents.filter((d) => d.status === 'Verified')
  const rejectedDocs = documents.filter((d) => d.status === 'Rejected')

  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reuploadOpen, setReuploadOpen] = useState(false)

  return (
    <div className='flex flex-col h-full space-y-4'>
      {/* Candidate Info */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle>Candidate Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-y-2 text-sm'>
            <div className='text-gray-500'>App No:</div>
            <div className='font-medium'>{candidate.applicationNumber}</div>

            <div className='text-gray-500'>Name:</div>
            <div className='font-medium'>{candidate.name}</div>

            <div className='text-gray-500'>Exam:</div>
            <div className='font-medium'>{candidate.exam}</div>

            <div className='text-gray-500'>Category:</div>
            <div className='font-medium'>{candidate.category}</div>

            <div className='text-gray-500'>Status:</div>
            <div>
              <Badge variant='outline'>{candidate.status}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Summary */}
      <Card className='flex-1 overflow-hidden flex flex-col'>
        <CardHeader className='pb-3'>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            <div className='flex gap-2 mt-1'>
              <Badge variant='secondary' className='bg-blue-100 text-blue-700'>
                {pendingDocs.length} Pending
              </Badge>
              <Badge variant='secondary' className='bg-green-100 text-green-700'>
                {verifiedDocs.length} Verified
              </Badge>
              <Badge variant='secondary' className='bg-red-100 text-red-700'>
                {rejectedDocs.length} Rejected
              </Badge>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className='flex-1 overflow-y-auto p-0'>
          <div className='divide-y'>
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${
                  selectedDocument?.id === doc.id
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'border-l-4 border-transparent'
                }`}
                onClick={() => onSelectDocument(doc)}
              >
                <div>
                  <p className='text-sm font-medium'>{doc.name}</p>
                  <p className='text-xs text-gray-500'>{doc.uploadDate}</p>
                </div>
                <div>
                  {doc.status === 'Pending' && (
                    <div className='w-2 h-2 rounded-full bg-blue-500' title='Pending' />
                  )}
                  {doc.status === 'Verified' && (
                    <div className='w-2 h-2 rounded-full bg-green-500' title='Verified' />
                  )}
                  {doc.status === 'Rejected' && (
                    <div className='w-2 h-2 rounded-full bg-red-500' title='Rejected' />
                  )}
                  {doc.status === 'Re-upload Requested' && (
                    <div
                      className='w-2 h-2 rounded-full bg-orange-500'
                      title='Re-upload Requested'
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Document Actions */}
      {selectedDocument && selectedDocument.status === 'Pending' && (
        <Card className='border-blue-200 bg-blue-50'>
          <CardContent className='p-4 flex flex-col gap-2'>
            <h4 className='font-semibold text-sm mb-2 text-center'>Verification Actions</h4>
            <Button
              className='w-full bg-green-600 hover:bg-green-700'
              onClick={() => setApproveOpen(true)}
            >
              Approve Document
            </Button>
            <div className='flex gap-2'>
              <Button variant='destructive' className='flex-1' onClick={() => setRejectOpen(true)}>
                Reject
              </Button>
              <Button
                variant='outline'
                className='flex-1 bg-card'
                onClick={() => setReuploadOpen(true)}
              >
                Re-upload
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedDocument && (
        <>
          <ApproveDialog
            open={approveOpen}
            onOpenChange={setApproveOpen}
            documentName={selectedDocument.name}
            onConfirm={(data) => onVerifyAction(selectedDocument.id, 'approve', data)}
          />
          <RejectDialog
            open={rejectOpen}
            onOpenChange={setRejectOpen}
            documentName={selectedDocument.name}
            onConfirm={(data) => onVerifyAction(selectedDocument.id, 'reject', data)}
          />
          <RejectDialog
            open={reuploadOpen}
            onOpenChange={setReuploadOpen}
            documentName={selectedDocument.name}
            isReupload={true}
            onConfirm={(data) => onVerifyAction(selectedDocument.id, 'reupload', data)}
          />
        </>
      )}
    </div>
  )
}
