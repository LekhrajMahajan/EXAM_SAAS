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
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { manualReviewSchema, type ManualReviewForm } from '../schemas/biometric-schemas';

interface ManualReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (remarks: string) => void;
}

export function ManualReviewDialog({ open, onOpenChange, onConfirm }: ManualReviewDialogProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ManualReviewForm>({
    resolver: zodResolver(manualReviewSchema)
  });

  const onSubmit = (data: ManualReviewForm) => {
    onConfirm(data.remarks);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { onOpenChange(val); if(!val) reset(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Manual Review Override</DialogTitle>
            <DialogDescription>
              You are about to manually override a failed biometric check. This action will be logged. Please provide a mandatory reason.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="remarks">Remarks / Reason for Override</Label>
              <Textarea
                id="remarks"
                placeholder="E.g., Candidate wearing bandages, system error, lighting too poor..."
                className={`min-h-[100px] ${errors.remarks ? 'border-red-500' : ''}`}
                {...register('remarks')}
              />
              {errors.remarks && <p className="text-sm text-red-500">{errors.remarks.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
              Confirm Override
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
