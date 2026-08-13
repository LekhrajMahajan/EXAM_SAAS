import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { resetPasswordSchema } from '../schemas/auth.schema';
import type { ResetPasswordFormData } from '../schemas/auth.schema';
import { resetPassword } from '../api/auth.api';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export const ResetPasswordPage = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const { register, handleSubmit, formState: { errors } } = useReactHookForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: token || '', newPassword: '', confirmPassword: '' },
  });

  const resetMutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) => {
      if (!token) throw new Error('Reset token is missing or invalid.');
      return resetPassword(token, data);
    },
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => navigate('/auth/login'), 3000);
    },
    onError: (error: any) => {
      setErrorMsg(error.message || 'Failed to reset password. The link might be expired.');
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    setErrorMsg('');
    resetMutation.mutate(data);
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
        <Alert variant="destructive" className="max-w-md w-full bg-background">
          <AlertDescription>
            Invalid or missing reset token. Please request a new password reset link.
          </AlertDescription>
          <div className="mt-4">
            <Link to="/auth/forgot-password">
              <Button variant="outline" className="w-full">Go to Forgot Password</Button>
            </Link>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl shadow-lg border">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
            EP
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {isSuccess ? (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>
              Password has been successfully reset! Redirecting to login...
            </AlertDescription>
          </Alert>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register('newPassword')}
                    className={errors.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
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
                Reset Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
