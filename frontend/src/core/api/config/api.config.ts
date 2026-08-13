export const ApiConfig = {
  // Base URLs will eventually come from Vite env vars
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.placeholder.com/v1',
  
  // Standard timeouts
  timeout: 30000,
  
  // Default Headers
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Request ID generator (placeholder)
  generateRequestId: () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(7),
  
  // App Version (placeholder)
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Specific headers for multipart
  multipartHeaders: {
    'Content-Type': 'multipart/form-data',
  }
};
