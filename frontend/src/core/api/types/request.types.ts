export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  [key: string]: any;
}

export interface StandardQueryParams extends PaginationParams, SortParams, FilterParams {}

export interface BulkOperationPayload<T = string> {
  ids: T[];
  action: 'delete' | 'approve' | 'reject' | 'publish' | 'archive';
  metadata?: Record<string, any>;
}
