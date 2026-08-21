export type Role = 
  | 'Master Admin'
  | 'Company Admin'
  | 'Government Authority'
  | 'State Manager'
  | 'City Manager'
  | 'Branch Manager'
  | 'Center Manager'
  | 'Technical Manager'
  | 'Paper Reviewer'
  | 'Entry Checker'
  | 'Biometric Verifier'
  | 'Observer'
  | 'Candidate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role | string;
  roleId?: string;
  permissions: string[];
  avatarUrl?: string;
  idleTimeout?: number;
  paymentStatus?: string;
  forcePasswordChange?: boolean;
  branchId?: string;
  branchSetupStatus?: string;
  branchSetupCurrentStep?: number;
  centerId?: string;
  centerSetupStatus?: string;
  centerSetupCurrentStep?: number;
  referenceId?: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
