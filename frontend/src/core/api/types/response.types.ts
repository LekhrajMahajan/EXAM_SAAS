export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  message?: string;
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

export interface ApiErrorResponse {
  success: boolean;
  error: {
    code: string;
    message: string;
    details?: any;
    traceId?: string;
  };
}
