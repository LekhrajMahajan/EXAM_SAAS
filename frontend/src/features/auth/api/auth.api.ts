import axios from 'axios';
import { api } from '../utils/axios';
import type { AuthResponse, User } from '../types';
import type { LoginFormData, ForgotPasswordFormData, ResetPasswordFormData } from '../schemas/auth.schema';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.post<{ success: boolean; data: { user: any; accessToken: string; refreshToken: string } }>('/auth/login', data);
  const { user, accessToken, refreshToken } = response.data.data;
  return {
    user: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      companyId: user.companyId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    token: accessToken,
    refreshToken,
  };
};

export const getProfile = async (): Promise<User> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await api.get<{ success: boolean; data: any }>('/auth/me');
  const user = response.data.data;
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    permissions: user.permissions || [],
    companyId: user.companyId,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const forgotPassword = async (data: ForgotPasswordFormData): Promise<void> => {
  await api.post('/auth/forgot-password', data);
};

export const resetPassword = async (token: string, data: ResetPasswordFormData): Promise<void> => {
  const payload = { ...data, token };
  await api.post(`/auth/reset-password`, payload);
};

// Uses a raw axios instance to avoid interceptor loops
export const refreshToken = async (token: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/refresh-token`, {
    refreshToken: token,
  });
  return response.data;
};


