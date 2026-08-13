import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/auth.schema';
// Note: We don't have useResetPasswordMutation implemented in our snippet, 
// but we will mock its usage here following the pattern.
import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ResetPasswordForm: React.FC<{ token: string }> = ({ token }) => {
  const navigate = useNavigate();
  // const mutation = useResetPasswordMutation();
  const isPending = false; // mutation.isPending
  const isError = false; // mutation.isError
  
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token }
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    // mutation.mutate(data, { onSuccess: () => navigate('/auth/login') });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          Failed to reset password. The link may have expired.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">New Password</label>
        <input 
          {...register('newPassword')}
          type="password" 
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
        <input 
          {...register('confirmPassword')}
          type="password" 
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
      </div>

      <Button 
        type="submit" 
        variant="default" 
        className="w-full justify-center"
        disabled={isPending}
      >
        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Reset Password
      </Button>
    </form>
  );
};
