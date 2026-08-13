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

const rejectSchema = z.object({
  reason: z.string().min(5, 'Reason must be at least 5 characters long'),
});

type RejectFormValues = z.infer<typeof rejectSchema>;

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: RejectFormValues) => void;
  documentName: string;
  isReupload?: boolean;
}

export function RejectDialog({ open, onOpenChange, onConfirm, documentName, isReupload = false }: RejectDialogProps) {
  const form = useForm<RejectFormValues>({
    resolver: zodResolver(rejectSchema),
    defaultValues: {
      reason: '',
    },
  });

  const onSubmit = (data: RejectFormValues) => {
    onConfirm(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isReupload ? 'Request Re-upload' : 'Reject Document'}</DialogTitle>
          <DialogDescription>
            {isReupload 
              ? <>Please provide a reason why <strong>{documentName}</strong> needs to be re-uploaded.</>
              : <>Are you sure you want to reject <strong>{documentName}</strong>? Please provide a reason.</>
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter the reason..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive">
                {isReupload ? 'Request Re-upload' : 'Reject'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
