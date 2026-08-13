import type { ApiResponse, PaginatedResponse } from '../types/response.types';

export class ApiMapper {
  static mapResponse<T>(data: any): ApiResponse<T> {
    return {
      success: true,
      data: data as T,
      message: 'Operation successful'
    };
  }

  static mapPaginatedResponse<T>(data: any[], meta: any): PaginatedResponse<T> {
    return {
      success: true,
      data: data as T[],
      meta: {
        totalItems: meta.totalItems || data.length,
        itemCount: data.length,
        itemsPerPage: meta.itemsPerPage || 10,
        totalPages: meta.totalPages || 1,
        currentPage: meta.currentPage || 1
      }
    };
  }
  
  static mapError(error: any) {
    return {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An unexpected error occurred',
        details: error.details
      }
    };
  }
}
