import axios from 'axios';
import { ApiConfig } from '../config/api.config';
import { requestInterceptor, requestErrorInterceptor } from '../interceptors/request.interceptor';
import { responseInterceptor } from '../interceptors/response.interceptor';
import { errorHandler } from '../interceptors/error.handler';

export const apiClient = axios.create({
  baseURL: ApiConfig.baseURL,
  timeout: ApiConfig.timeout,
  headers: ApiConfig.headers,
});

// Attach interceptors
apiClient.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorHandler);

export default apiClient;
