import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { loginSchema } from '../schemas/auth.schema';
import type { LoginFormData } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { useAuthStore as useGlobalAuthStore } from '@/stores/auth/auth.store';
import { useUserStore } from '@/stores/user/user.store';
import { usePermissionStore } from '@/stores/permissions/permission.store';
import { useAuthStore as useFeatureAuthStore } from '../store/useAuthStore';
import { tokenStorage } from '../storage/token.storage';
import { usePublicSettings } from '@/features/master-admin/hooks/system-settings.hooks';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Label } from '@/shared/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useGlobalAuthStore((state) => state.login);
  const setProfile = useUserStore((state) => state.setProfile);
  const setPermissions = usePermissionStore((state) => state.setPermissions);
  const featureSetTokens = useFeatureAuthStore((state) => state.setTokens);
  const featureSetUser = useFeatureAuthStore((state) => state.setUser);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { data: orgSettings } = usePublicSettings();
  const loginLogo = orgSettings?.data?.find(s => s.key === "LOGO_LOGIN")?.value;
  const primaryLogo = orgSettings?.data?.find(s => s.key === "LOGO_PRIMARY")?.value;
  const shortName = orgSettings?.data?.find(s => s.key === "ORG_SHORT_NAME")?.value || "EP";
  const orgName = orgSettings?.data?.find(s => s.key === "ORG_NAME")?.value || "ExamGuard Pro";

  const { register, handleSubmit, formState: { errors }, setValue } = useReactHookForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      // 1. Perform login
      const loginRes = await authService.login(data);
      
      // 2. Store tokens so next API calls have auth
      tokenStorage.setTokens({
        accessToken: loginRes.data.accessToken,
        refreshToken: loginRes.data.refreshToken,
        expiresIn: 3600
      });
      
      // We do not need to call setTokens here, auth store handles it in onSuccess

      // 3. Fetch full profile (User, Role, Permissions, Company)
      const profileRes = await authService.getProfile();
      return { 
        loginRes: loginRes.data,
        profileRes: profileRes.data 
      };
    },
    onSuccess: ({ loginRes, profileRes }) => {
      // Check for pending/rejected company approval
      if (profileRes.role === 'COMPANY_ADMIN' || profileRes.role === 'Company Admin') {
        if (profileRes.approvalStatus === 'PENDING' || profileRes.approvalStatus === 'UNDER_REVIEW') {
          setErrorMsg('Your company registration is pending approval. You will receive an email once approved.');
          authService.logout();
          return;
        }
        if (profileRes.approvalStatus === 'REJECTED') {
          setErrorMsg('Your company registration was rejected. Please contact support.');
          authService.logout();
          return;
        }
      }

      // Set user profile
      setProfile({
        id: profileRes.id,
        name: profileRes.name,
        email: profileRes.email,
        roleId: profileRes.role,
        role: profileRes.role, // Some components check `profile.role` directly
        companyId: profileRes.companyId,
        subscriptionPlan: profileRes.subscriptionPlan,
        paymentStatus: profileRes.paymentStatus,
        subscriptionEndDate: profileRes.subscriptionEndDate,
        planFeatures: profileRes.planFeatures,
        forcePasswordChange: profileRes.forcePasswordChange,
        branchId: profileRes.branchId,
        centerId: profileRes.centerId,
        branchSetupStatus: profileRes.branchSetupStatus,
        branchSetupCurrentStep: profileRes.branchSetupCurrentStep,
        centerSetupStatus: profileRes.centerSetupStatus,
        centerSetupCurrentStep: profileRes.centerSetupCurrentStep,
      });

      // Set permissions
      setPermissions({
        roles: profileRes.role ? [profileRes.role] : [],
        permissions: profileRes.permissions || [],
      });

      // Set global auth state
      login({
        accessToken: loginRes.accessToken,
        refreshToken: loginRes.refreshToken
      });

      // Sync legacy feature store for Navbar/Sidebar components
      featureSetTokens(loginRes.accessToken, loginRes.refreshToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      featureSetUser(profileRes as any, profileRes.permissions || []);
      
      // Determine redirection
      if (profileRes.role === 'MASTER_ADMIN') {
        navigate('/master-admin/dashboard', { replace: true });
      } else if (profileRes.role === 'Company Admin' || profileRes.role === 'COMPANY_ADMIN') {
        if (!profileRes.subscriptionPlan) {
          navigate('/company/subscription', { replace: true }); // Redirect to subscription selection if no active plan
        } else {
          const defaultPath = '/company/dashboard';
          navigate(from === '/' || from === '/auth/login' ? defaultPath : from, { replace: true });
        }
      } else if (profileRes.role === 'Branch Manager' || profileRes.role === 'BRANCH_MANAGER') {
        navigate('/dashboard/branch-manager', { replace: true });
      } else if (profileRes.role === 'Center Manager' || profileRes.role === 'CENTER_MANAGER') {
        if (profileRes.centerSetupStatus !== 'ACTIVE') {
          navigate('/center/onboarding-wizard', { replace: true });
        } else {
          navigate('/dashboard/center-manager', { replace: true });
        }
      } else {
        navigate(from === '/' ? '/dashboard' : from, { replace: true });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setErrorMsg(error?.response?.data?.message || error.message || 'Login failed. Please try again.');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMsg('');
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-background p-8 rounded-xl shadow-lg border">
        <div className="text-center">
          {loginLogo || primaryLogo ? (
            <img 
              src={(loginLogo || primaryLogo) as string} 
              alt={orgName as string} 
              className="mx-auto h-16 w-auto object-contain mb-4" 
            />
          ) : (
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
              {(shortName as string).substring(0, 2).toUpperCase()}
            </div>
          )}
          <h2 className="text-3xl font-bold tracking-tight">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and password to access the dashboard
          </p>
        </div>

        {errorMsg && (
          <Alert variant="destructive">
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

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
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <div className="text-sm">
                  <Link to="/auth/forgot-password" className="font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Checkbox 
              id="remember-me" 
              onCheckedChange={(checked) => setValue('rememberMe', checked === true)} 
            />
            <Label htmlFor="remember-me" className="ml-2 text-sm font-normal">
              Remember me
            </Label>
          </div>

          <div>
            <Button 
              type="submit" 
              className="w-full flex justify-center py-2.5" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-sm mt-6">
            <Link to="/masteradmin/auth/login" className="text-primary font-medium hover:underline">
              Master Admin Login
            </Link>
            <Link to="/auth/candidate-login" className="text-primary font-medium hover:underline">
              Candidate Login
            </Link>
          </div>
          
          <div className="text-center text-sm mt-6">
            <span className="text-muted-foreground">If you haven&apos;t registered, register here. </span>
            <Link to="/auth/register-company" className="text-primary font-medium hover:underline">
              Register Company
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
