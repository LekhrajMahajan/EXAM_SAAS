import apiClient from '../http/axios-client';
import type { ApiResponse, PaginatedResponse } from '../types/response.types';
import type { StandardQueryParams, BulkOperationPayload } from '../types/request.types';

export class BaseApiService<T> {
  constructor(protected readonly endpoint: string) {}

  async list(params?: StandardQueryParams): Promise<PaginatedResponse<T>> {
    const response = await apiClient.get<PaginatedResponse<T>>(this.endpoint, { params });
    return response.data;
  }

  async getById(id: string | number): Promise<ApiResponse<T>> {
    const response = await apiClient.get<ApiResponse<T>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(this.endpoint, data);
    return response.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<ApiResponse<T>> {
    const response = await apiClient.put<ApiResponse<T>>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  async delete(id: string | number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async approve(id: string | number, metadata?: any): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(`${this.endpoint}/${id}/approve`, metadata);
    return response.data;
  }

  async publish(id: string | number): Promise<ApiResponse<T>> {
    const response = await apiClient.post<ApiResponse<T>>(`${this.endpoint}/${id}/publish`);
    return response.data;
  }

  async bulkOperation(payload: BulkOperationPayload<string | number>): Promise<ApiResponse<any>> {
    const response = await apiClient.post<ApiResponse<any>>(`${this.endpoint}/bulk`, payload);
    return response.data;
  }
}
