import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGenerateCreditNote } from "../../hooks/invoice.hooks";
import type { Invoice } from "../../types/invoice.types";
import { RefreshCw } from "lucide-react";

interface CreditNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  availableBalance: number;
}

const creditNoteSchema = z.object({
  amount: z.number().positive("Amount must be greater than zero"),
  reason: z.string().min(5, "Reason must be at least 5 characters"),
  remarks: z.string().optional(),
  effectiveDate: z.string().min(1, "Effective Date is required"),
});

type CreditNoteFormValues = z.infer<typeof creditNoteSchema>;

export const CreditNoteDialog: React.FC<CreditNoteDialogProps> = ({
  isOpen,
  onClose,
  invoice,
  availableBalance,
}) => {
  const { mutate: generateCreditNote, isPending } = useGenerateCreditNote();
  
  const form = useForm<CreditNoteFormValues>({
    resolver: zodResolver(creditNoteSchema),
    defaultValues: {
      amount: availableBalance,
      reason: "",
      remarks: "",
      effectiveDate: new Date().toISOString().split("T")[0],
    },
  });

  // Re-sync default balance if invoice changes
  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: availableBalance,
        reason: "",
        remarks: "",
        effectiveDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen, availableBalance, form]);

  const onSubmit = (values: CreditNoteFormValues) => {
    if (values.amount > availableBalance) {
        form.setError("amount", { message: "Amount cannot exceed available balance" });
        return;
    }
    
    generateCreditNote(
      {
        id: invoice._id,
        payload: {
          amount: values.amount,
          reason: values.reason,
          remarks: values.remarks,
          effectiveDate: new Date(values.effectiveDate).toISOString(),
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Generate Credit Note</DialogTitle>
          <DialogDescription>
            Create a credit note linked to invoice {invoice.invoiceNumber}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg mb-4 text-sm">
          <div>
            <span className="text-slate-500 block">Invoice Number</span>
            <span className="font-medium">{invoice.invoiceNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Company</span>
            <span className="font-medium">{invoice.companyId?.companyName || "N/A"}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Invoice Total</span>
            <span className="font-medium">₹{invoice.grandTotal.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Available Balance</span>
            <span className="font-medium text-emerald-600">₹{availableBalance.toFixed(2)}</span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Credit Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...form.register("amount", { valueAsNumber: true })}
                placeholder="0.00"
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-red-500">{form.formState.errors.amount.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="effectiveDate">Effective Date *</Label>
              <Input
                id="effectiveDate"
                type="date"
                {...form.register("effectiveDate")}
              />
              {form.formState.errors.effectiveDate && (
                <p className="text-xs text-red-500">{form.formState.errors.effectiveDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason *</Label>
            <Input
              id="reason"
              {...form.register("reason")}
              placeholder="e.g. Overcharged on specific items"
            />
            {form.formState.errors.reason && (
              <p className="text-xs text-red-500">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              {...form.register("remarks")}
              placeholder="Internal notes or detailed explanation..."
              rows={3}
            />
            {form.formState.errors.remarks && (
              <p className="text-xs text-red-500">{form.formState.errors.remarks.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              Generate Credit Note
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
