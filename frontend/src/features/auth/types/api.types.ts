export interface AuthResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginResponseData {
  user: {
    userId: string;
    email: string;
    name: string;
    role: string;
    forcePasswordChange?: boolean;
    branchId?: string;
    branchSetupStatus?: string;
    branchSetupCurrentStep?: number;
    centerId?: string;
    centerSetupStatus?: string;
    centerSetupCurrentStep?: number;
  };
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponseData {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId?: string;
  subscriptionPlan?: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | null;
  subscriptionStartDate?: string | null;
  subscriptionEndDate?: string | null;
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  planFeatures?: Record<string, boolean>;
  approvalStatus?: string;
  forcePasswordChange?: boolean;
  onboardingCompleted?: boolean;
  branchId?: string;
  branchSetupStatus?: string;
  branchSetupCurrentStep?: number;
  centerId?: string;
  centerSetupStatus?: string;
  centerSetupCurrentStep?: number;
  // Backend returns extended user data here
  permissions?: string[];
}
