import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { CheckCircle2, ShieldCheck, FileCheck, XCircle, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verificationChecklistSchema, type VerificationChecklist as ChecklistType } from '../schemas/verification-schemas';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { RemarksDialog } from './RemarksDialog';
import { cn } from '@/utils/cn';

interface VerificationChecklistProps {
  isActive: boolean;
  onComplete: (data: ChecklistType) => void;
}

export function VerificationChecklist({ isActive, onComplete }: VerificationChecklistProps) {
  const [remarksDialogOpen, setRemarksDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'Hold' | 'Rejected' | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ChecklistType>({
    resolver: zodResolver(verificationChecklistSchema),
    defaultValues: {
      admitCardVerified: false,
      photoMatched: false,
      identityVerified: false,
      documentVerified: false,
      status: 'Verified'
    }
  });

  const admitCardVerified = watch('admitCardVerified');
  const photoMatched = watch('photoMatched');
  const identityVerified = watch('identityVerified');
  const documentVerified = watch('documentVerified');

  const onValidSubmit = (data: ChecklistType) => {
    data.status = 'Verified';
    onComplete(data);
  };

  const handleActionWithRemarks = (action: 'Hold' | 'Rejected') => {
    setPendingAction(action);
    setRemarksDialogOpen(true);
  };

  const confirmActionWithRemarks = (remarks: string) => {
    const data = {
      admitCardVerified,
      photoMatched,
      identityVerified,
      documentVerified,
      remarks,
      status: pendingAction!
    };
    onComplete(data as ChecklistType);
    setRemarksDialogOpen(false);
  };

  if (!isActive) return null;

  return (
    <>
      <Card className="border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Verification Checklist
          </CardTitle>
          <CardDescription>Complete the mandatory checks to allow entry.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6">
            
            <div className="space-y-4 border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="chk-admit" 
                  checked={admitCardVerified}
                  onCheckedChange={(c) => setValue('admitCardVerified', c as boolean, { shouldValidate: true })}
                  className={cn("mt-1 w-5 h-5", errors.admitCardVerified && "border-red-500")}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="chk-admit" className="text-sm font-medium text-slate-900 cursor-pointer flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-slate-500" /> Admit Card Verified
                  </Label>
                  <p className="text-sm text-slate-500">Physical copy matches system record.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="chk-photo" 
                  checked={photoMatched}
                  onCheckedChange={(c) => setValue('photoMatched', c as boolean, { shouldValidate: true })}
                  className={cn("mt-1 w-5 h-5", errors.photoMatched && "border-red-500")}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="chk-photo" className="text-sm font-medium text-slate-900 cursor-pointer flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-500" /> Face / Photo Matched
                  </Label>
                  <p className="text-sm text-slate-500">Candidate physically matches the system photo.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="chk-id" 
                  checked={identityVerified}
                  onCheckedChange={(c) => setValue('identityVerified', c as boolean, { shouldValidate: true })}
                  className={cn("mt-1 w-5 h-5", errors.identityVerified && "border-red-500")}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="chk-id" className="text-sm font-medium text-slate-900 cursor-pointer flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-500" /> Identity Verified
                  </Label>
                  <p className="text-sm text-slate-500">Original ID proof checked and matches details.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" size="lg" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Allow Entry
              </Button>
              <Button type="button" size="lg" variant="outline" className="flex-1 bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" onClick={() => handleActionWithRemarks('Hold')}>
                <AlertCircle className="w-4 h-4 mr-2" /> Place on Hold
              </Button>
              <Button type="button" size="lg" variant="outline" className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100" onClick={() => handleActionWithRemarks('Rejected')}>
                <XCircle className="w-4 h-4 mr-2" /> Reject Entry
              </Button>
            </div>
            
            {Object.keys(errors).length > 0 && (
              <p className="text-sm text-red-500 text-center font-medium mt-2">
                All mandatory checks must be completed to allow entry.
              </p>
            )}

          </form>
        </CardContent>
      </Card>

      <RemarksDialog 
        open={remarksDialogOpen} 
        onOpenChange={setRemarksDialogOpen}
        onConfirm={confirmActionWithRemarks}
        action={pendingAction || 'Hold'}
      />
    </>
  );
}
