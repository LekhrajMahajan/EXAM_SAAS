import { apiClient } from '@/core/api/http/axios-client';

export interface ImportPayload {
  type: string;
  file: File;
  options?: Record<string, any>;
}

export const importExportApi = {
  importData: async (data: ImportPayload) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('file', data.file);
    if (data.options) {
      formData.append('options', JSON.stringify(data.options));
    }
    
    const response = await apiClient.post('/import-export/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getTemplate: async (type: string) => {
    const response = await apiClient.get(`/import-export/templates/${type}`, {
      responseType: 'blob',
    });
    return response.data;
  }
};
