export interface AppApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
  isOperational?: boolean;
}

export class ApiClientError extends Error implements AppApiError {
  constructor(
    public message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.isOperational = true;
  }
  isOperational = true;
}
