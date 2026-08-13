import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface RejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, remarks: string) => Promise<void>;
  companyName: string;
}

export const RejectionDialog = ({ isOpen, onClose, onSubmit, companyName }: RejectionDialogProps) => {
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(reason, remarks);
    } finally {
      setIsSubmitting(false);
      setReason("");
      setRemarks("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject Company Application</DialogTitle>
          <DialogDescription>
            You are about to reject the application for <strong>{companyName}</strong>. Please provide a reason.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Rejection Reason <span className="text-red-500">*</span></Label>
            <Input 
              id="reason" 
              placeholder="e.g., Invalid GST Document" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Additional Remarks (Optional)</Label>
            <textarea 
              id="remarks" 
              className="w-full min-h-[100px] p-3 rounded-md border bg-slate-50 text-sm"
              placeholder="Provide more context..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={!reason.trim() || isSubmitting}>
              {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
