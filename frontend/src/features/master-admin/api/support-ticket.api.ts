import api from "@/services/api";

export interface TicketFilters {
  companyId?: string;
  priority?: string;
  status?: string;
  category?: string;
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const supportTicketApi = {
  getStatistics: () => api.get('/support-tickets/statistics').then((res) => res.data),
  
  getAll: (params?: TicketFilters) => api.get('/support-tickets', { params }).then((res) => res.data),
  
  getById: (id: string) => api.get(`/support-tickets/${id}`).then((res) => res.data),
  
  create: (data: any) => api.post('/support-tickets', data).then((res) => res.data),
  
  updateStatus: (id: string, status: string) => api.patch(`/support-tickets/${id}/status`, { status }).then((res) => res.data),
  
  assign: (id: string, assigneeId: string) => api.patch(`/support-tickets/${id}/assign`, { assigneeId }).then((res) => res.data),
  
  addMessage: (id: string, data: { message: string; isInternalNote?: boolean; attachments?: any[] }) => 
    api.post(`/support-tickets/${id}/messages`, data).then((res) => res.data),
    
  delete: (id: string) => api.delete(`/support-tickets/${id}`).then((res) => res.data),
};
