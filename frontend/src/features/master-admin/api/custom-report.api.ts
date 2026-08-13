import { apiClient } from '@/core/api/http/axios-client';
import type { ApiResponse } from '@/types';

const BASE_URL = "/reports/custom";

export const getCustomReports = async (params?: any): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.get(BASE_URL, { params });
  return data;
};

export const getCustomReportById = async (id: string): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.get(`${BASE_URL}/${id}`);
  return data;
};

export const createCustomReport = async (payload: any): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.post(BASE_URL, payload);
  return data;
};

export const updateCustomReport = async ({ id, data: payload }: { id: string; data: any }): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.patch(`${BASE_URL}/${id}`, payload);
  return data;
};

export const deleteCustomReport = async (id: string): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.delete(`${BASE_URL}/${id}`);
  return data;
};

export const executeCustomReport = async (id: string, params?: any): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.post(`${BASE_URL}/${id}/execute`, null, { params });
  return data;
};

export const previewCustomReport = async (payload: any): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.post(`${BASE_URL}/preview`, payload);
  return data;
};

export const cloneCustomReport = async (id: string): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.post(`${BASE_URL}/${id}/clone`);
  return data;
};

export const getCustomReportMetadata = async (): Promise<ApiResponse<any>> => {
  const { data } = await apiClient.get(`${BASE_URL}/metadata`);
  return data;
};
