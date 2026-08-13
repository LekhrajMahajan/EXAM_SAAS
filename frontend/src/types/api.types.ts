// src/types/api.types.ts
// Generic API response envelope types.

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T = unknown> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ApiError {
  success: false
  message: string
  statusCode: number
  errors?: Record<string, string[]>
  timestamp: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}
