import { BaseApiService } from '@/core/api/services/base.service';
import apiClient from '@/core/api/http/axios-client';
import type { LoginFormData, ForgotPasswordFormData } from '../schemas/auth.schema';
import type { 
  AuthResponse, 
  LoginResponseData, 
  RefreshTokenResponseData,
  ProfileResponseData 
} from '../types/api.types';

export const normalizeRole = (role: string): string => {
  if (!role) return role;
  const roleMap: Record<string, string> = {
    'MASTER_ADMIN': 'Master Admin',
    'COMPANY_ADMIN': 'Company Admin',
    'BRANCH_MANAGER': 'Branch Manager',
    'CENTER_MANAGER': 'Center Manager',
    'EXAM_MANAGER': 'Exam Manager',
    'PAPER_SETTER': 'Paper Setter',
    'QUESTION_SETTER': 'Question Setter',
    'BIOMETRIC_VERIFIER': 'Biometric Verifier',
    'ENTRY_CHECKER': 'Entry Checker',
    'OBSERVER': 'Observer',
    'GOVT_AUTHORITY': 'Government Authority',
    'TECHNICAL_MANAGER': 'Technical Manager',
    'INVIGILATOR': 'Invigilator',
    'CANDIDATE': 'Candidate'
  };
  return roleMap[role] || role;
};

export class AuthenticationService extends BaseApiService<any> {
  constructor() {
    super('/auth');
  }

  async login(credentials: LoginFormData): Promise<AuthResponse<LoginResponseData>> {
    const res = await apiClient.post(`${this.endpoint}/login`, credentials);
    if (res.data?.data?.user?.role) {
      res.data.data.user.role = normalizeRole(res.data.data.user.role);
    }
    return res.data;
  }

  async logout(): Promise<AuthResponse<null>> {
    const res = await apiClient.post(`${this.endpoint}/logout`);
    return res.data;
  }

  async refresh(refreshToken: string): Promise<AuthResponse<RefreshTokenResponseData>> {
    const res = await apiClient.post(`${this.endpoint}/refresh-token`, { refreshToken });
    return res.data;
  }

  async getProfile(): Promise<AuthResponse<ProfileResponseData>> {
    const res = await apiClient.get(`${this.endpoint}/me`);
    if (res.data?.data?.role) {
      res.data.data.role = normalizeRole(res.data.data.role);
    }
    return res.data;
  }

  async forgotPassword(data: ForgotPasswordFormData): Promise<AuthResponse<null>> {
    const res = await apiClient.post(`${this.endpoint}/forgot-password`, data);
    return res.data;
  }
}

export const authService = new AuthenticationService();
