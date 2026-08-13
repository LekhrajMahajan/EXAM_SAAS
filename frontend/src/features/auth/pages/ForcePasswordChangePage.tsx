import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user/user.store';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { z } from 'zod';
import { authService } from '../services/auth.service';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { toast } from 'react-hot-toast';
import apiClient from '@/core/api/http/axios-client';

const forcePasswordChangeSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForcePasswordChangeFormData = z.infer<typeof forcePasswordChangeSchema>;

export const ForcePasswordChangePage = () => {
  const navigate = useNavigate();
  const profile = useUserStore((state) => state.profile);
  const { clearAuth } = useAuthStore();
  const [errorMsg, setErrorMsg] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useReactHookForm<ForcePasswordChangeFormData>({
    resolver: zodResolver(forcePasswordChangeSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ForcePasswordChangeFormData) => {
      const response = await apiClient.patch('/auth/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      
      // Update local forcePasswordChange state to false
      useUserStore.setState((state) => ({
        profile: state.profile ? { ...state.profile, forcePasswordChange: false } : null
      }));

      // Redirect based on user role
      if (profile?.role === 'MASTER_ADMIN') {
        navigate('/master-admin/dashboard', { replace: true });
      } else if (profile?.role === 'Company Admin' || profile?.role === 'COMPANY_ADMIN') {
        navigate('/company/dashboard', { replace: true });
      } else if (profile?.role === 'Branch Manager' || profile?.role === 'BRANCH_MANAGER') {
        navigate('/dashboard/branch-manager', { replace: true });
      } else if (profile?.role === 'Center Manager' || profile?.role === 'CENTER_MANAGER') {
        if (profile?.centerSetupStatus !== 'ACTIVE') {
          navigate('/center/onboarding-wizard', { replace: true });
        } else {
          navigate('/dashboard/center-manager', { replace: true });
        }
      } else {
        navigate('/dashboard', { replace: true });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || 'Failed to change password');
    },
  });

  const onSubmit = (data: ForcePasswordChangeFormData) => {
    setErrorMsg('');
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl shadow-lg border">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Action Required</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For security reasons, you must change your password before continuing.
          </p>
        </div>

        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  {...register('oldPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.oldPassword && (
                <p className="text-xs text-destructive">{errors.oldPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Change Password
          </Button>
          <Button 
            type="button" 
            variant="outline"
            className="w-full mt-3"
            onClick={() => {
              clearAuth();
              useUserStore.getState().clearUser();
              navigate('/auth/login', { replace: true });
            }}
          >
            Back to Login
          </Button>
        </form>
      </div>
    </div>
  );
};
