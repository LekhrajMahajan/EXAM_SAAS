import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

interface RemarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (remarks: string) => void;
  action: 'Hold' | 'Rejected';
}

export function RemarksDialog({ open, onOpenChange, onConfirm, action }: RemarksDialogProps) {
  const [remarks, setRemarks] = useState('');

  const handleConfirm = () => {
    if (remarks.trim()) {
      onConfirm(remarks);
      setRemarks('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reason for {action === 'Hold' ? 'Hold' : 'Rejection'}</DialogTitle>
          <DialogDescription>
            Please provide a mandatory remark explaining why the candidate is being {action === 'Hold' ? 'placed on hold' : 'rejected'}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="E.g., Identity proof unreadable, name mismatch..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!remarks.trim()} variant={action === 'Rejected' ? 'destructive' : 'default'}>
            Confirm {action}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
