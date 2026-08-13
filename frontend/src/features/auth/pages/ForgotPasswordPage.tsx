import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { forgotPasswordSchema } from '../schemas/auth.schema';
import type { ForgotPasswordFormData } from '../schemas/auth.schema';
import { forgotPassword } from '../api/auth.api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export const ForgotPasswordPage = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useReactHookForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const resetMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error: any) => {
      setErrorMsg(error.message || 'Failed to request password reset. Please try again.');
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    setErrorMsg('');
    resetMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl shadow-lg border">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
            EP
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Reset Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
          <p className="mt-4 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-2 rounded border border-amber-200 dark:border-amber-900">
            Note: This feature is only available for Company Administrators. Other roles must contact their admin to reset passwords.
          </p>
        </div>

        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {isSubmitted ? (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              If an account exists with that email, a password reset link has been sent.
            </AlertDescription>
          </Alert>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="admin@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <Button 
                type="submit" 
                className="w-full flex justify-center py-2.5" 
                disabled={resetMutation.isPending}
              >
                {resetMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Send Reset Link
              </Button>
            </div>
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/auth/login" className="text-sm font-medium text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
