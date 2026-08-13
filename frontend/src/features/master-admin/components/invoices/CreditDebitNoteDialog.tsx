import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useGenerateCreditNote, useGenerateDebitNote } from "../../hooks/invoice.hooks";
import type { Invoice } from "../../types/invoice.types";

interface CreditDebitNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  type: "credit" | "debit";
}

export const CreditDebitNoteDialog: React.FC<CreditDebitNoteDialogProps> = ({
  isOpen,
  onClose,
  invoice,
  type,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState("");

  const creditNoteMutation = useGenerateCreditNote();
  const debitNoteMutation = useGenerateDebitNote();

  const isPending = creditNoteMutation.isPending || debitNoteMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "credit") {
      await creditNoteMutation.mutateAsync({
        id: invoice._id,
        payload: { amount, reason },
      });
    } else {
      await debitNoteMutation.mutateAsync({
        id: invoice._id,
        payload: { amount, reason },
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate {type === "credit" ? "Credit" : "Debit"} Note</DialogTitle>
          <DialogDescription>
            For Invoice: {invoice.invoiceNumber} (Total: ${invoice.grandTotal.toFixed(2)})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max={type === "credit" ? invoice.grandTotal : undefined}
              required
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              required
              minLength={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Reason for ${type} note...`}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || amount <= 0 || !reason}>
              {isPending ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
