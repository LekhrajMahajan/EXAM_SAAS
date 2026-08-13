import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { DocumentStatusBadge, type DocumentStatus } from './DocumentStatusBadge';

interface RemarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  status: DocumentStatus;
  remarks: string;
  verifiedBy?: string;
  date?: string;
}

export function RemarksDialog({ open, onOpenChange, documentName, status, remarks, verifiedBy, date }: RemarksDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Document Remarks</DialogTitle>
          <DialogDescription>
            Details for <strong>{documentName}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center pb-2 border-b">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <DocumentStatusBadge status={status} />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-500">Remarks / Reason</span>
            <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-100 text-gray-700 whitespace-pre-wrap">
              {remarks || 'No remarks provided.'}
            </p>
          </div>
          {(verifiedBy || date) && (
            <div className="text-xs text-gray-500 flex justify-between pt-2">
              {verifiedBy && <span>Action by: {verifiedBy}</span>}
              {date && <span>Date: {date}</span>}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
