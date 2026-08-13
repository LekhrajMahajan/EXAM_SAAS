import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, Eye, MessageSquare } from 'lucide-react';
import { DocumentStatusBadge, type DocumentStatus } from './DocumentStatusBadge';
import { DocumentPreview } from './DocumentPreview';
import { RemarksDialog } from './RemarksDialog';
import { ApproveDialog } from './ApproveDialog';
import { RejectDialog } from './RejectDialog';

export interface DocumentData {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  url: string;
  uploadDate: string;
  status: DocumentStatus;
  verifiedBy?: string;
  remarks?: string;
}

interface DocumentCardProps {
  document: DocumentData;
  onVerifyAction?: (id: string, action: 'approve' | 'reject' | 'reupload', data?: any) => void;
  showActions?: boolean;
}

export function DocumentCard({ document, onVerifyAction, showActions = true }: DocumentCardProps) {
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reuploadOpen, setReuploadOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
        <div className="h-48 bg-gray-100 relative group border-b">
          <DocumentPreview url={document.url} type={document.type} className="w-full h-full rounded-none" />
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="icon" variant="secondary" title="View Full Screen">
              <Eye className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="secondary" title="Download">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h4 className="font-semibold text-sm truncate" title={document.name}>{document.name}</h4>
            <DocumentStatusBadge status={document.status} className="shrink-0" />
          </div>
          
          <div className="text-xs text-gray-500 space-y-1">
            <p>Uploaded: {document.uploadDate}</p>
            {document.verifiedBy && <p>Verified by: {document.verifiedBy}</p>}
          </div>

          {document.remarks && (
            <Button 
              variant="link" 
              className="h-auto p-0 text-xs mt-2 flex items-center gap-1 text-primary"
              onClick={() => setRemarksOpen(true)}
            >
              <MessageSquare className="w-3 h-3" />
              View Remarks
            </Button>
          )}
        </CardContent>

        {showActions && document.status === 'Pending' && (
          <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setApproveOpen(true)}>Approve</Button>
            <Button size="sm" variant="destructive" className="flex-1" onClick={() => setRejectOpen(true)}>Reject</Button>
            <Button size="sm" variant="outline" className="w-full" onClick={() => setReuploadOpen(true)}>Re-upload</Button>
          </CardFooter>
        )}
      </Card>

      <RemarksDialog 
        open={remarksOpen} 
        onOpenChange={setRemarksOpen}
        documentName={document.name}
        status={document.status}
        remarks={document.remarks || ''}
        verifiedBy={document.verifiedBy}
      />

      <ApproveDialog
        open={approveOpen}
        onOpenChange={setApproveOpen}
        documentName={document.name}
        onConfirm={(data) => onVerifyAction?.(document.id, 'approve', data)}
      />

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        documentName={document.name}
        onConfirm={(data) => onVerifyAction?.(document.id, 'reject', data)}
      />

      <RejectDialog
        open={reuploadOpen}
        onOpenChange={setReuploadOpen}
        documentName={document.name}
        isReupload={true}
        onConfirm={(data) => onVerifyAction?.(document.id, 'reupload', data)}
      />
    </>
  );
}
