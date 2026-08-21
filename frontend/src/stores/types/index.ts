// Types for all Zustand stores

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  roleId: string;
  avatarUrl?: string;
  centerId?: string;
  companyId?: string;
  subscriptionPlan?: string | null;
  subscriptionEndDate?: string | Date | null;
  planFeatures?: Record<string, boolean>;
  planId?: string | null;
  subscriptionId?: string | null;
  paymentStatus?: string | null;
  onboardingCompleted?: boolean;
  role?: string;
  companyStatus?: string | boolean;
  isDeleted?: boolean;
  permissionVersion?: number;
  featureVersion?: number;
  sessionId?: string;
  enabledFeatures?: Record<string, unknown>;
  usageLimits?: Record<string, unknown>;
  forcePasswordChange?: boolean;
  centerSetupStatus?: string;
  centerSetupCurrentStep?: number;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  density: 'compact' | 'comfortable' | 'standard';
  fontSize: 'small' | 'medium' | 'large';
}
