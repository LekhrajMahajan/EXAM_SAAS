import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";

interface RetryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function RetryDialog({ open, onOpenChange, onConfirm }: RetryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Retry Biometric Capture</DialogTitle>
          <DialogDescription>
            Are you sure you want to discard the current capture and retry? Ensure the candidate is positioned correctly and lighting is adequate.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { onConfirm(); onOpenChange(false); }}>Confirm Retry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
