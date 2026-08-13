import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/ui/form';
import { Textarea } from '@/shared/components/ui/textarea';

const approveSchema = z.object({
  remarks: z.string().optional(),
});

type ApproveFormValues = z.infer<typeof approveSchema>;

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: ApproveFormValues) => void;
  documentName: string;
}

export function ApproveDialog({ open, onOpenChange, onConfirm, documentName }: ApproveDialogProps) {
  const form = useForm<ApproveFormValues>({
    resolver: zodResolver(approveSchema),
    defaultValues: {
      remarks: '',
    },
  });

  const onSubmit = (data: ApproveFormValues) => {
    onConfirm(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Document</DialogTitle>
          <DialogDescription>
            Are you sure you want to approve <strong>{documentName}</strong>?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any approval remarks..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">Approve</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
