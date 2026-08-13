import type { AxiosResponse } from 'axios';

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Transform response data if needed, or simply pass through
  // In a typical enterprise app, we might extract response.data if it matches a standard envelope
  
  // Example: if backend sends { success: true, data: { ... } }
  // we could return just the standardized envelope here.
  
  return response;
};
