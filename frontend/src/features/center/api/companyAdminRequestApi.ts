import { apiClient } from '@/core/api/http/axios-client';

const BASE = '/centers/admin-requests';

export const companyAdminRequestApi = {
  // ── Center Manager ──────────────────────────────────────────────
  /** Get all incoming requests for the logged-in center manager's center */
  getIncomingRequests: () =>
    apiClient.get(`${BASE}/incoming`),

  /** Get a single request by ID */
  getById: (id: string) =>
    apiClient.get(`${BASE}/${id}`),

  /** Upload documents for a request */
  uploadDocuments: (
    requestId: string,
    documents: { documentType: string; fileName: string; fileUrl: string; fileSize?: string }[]
  ) =>
    apiClient.put(`${BASE}/${requestId}/upload-documents`, { documents }),

  // ── Company Admin ─────────────────────────────────────────────
  /** Get all outgoing requests sent by this company */
  getOutgoingRequests: () =>
    apiClient.get(`${BASE}/outgoing`),

  /** Create a new request to an existing center */
  createRequest: (payload: {
    centerId: string;
    companyId?: string;
    shiftRates?: any[];
    mouFileUrl?: string;
    mouFileName?: string;
  }) => apiClient.post(`${BASE}`, payload),

  /** Approve a single document */
  approveDocument: (requestId: string, docId: string) =>
    apiClient.patch(`${BASE}/${requestId}/documents/${docId}/approve`),

  /** Reject a single document */
  rejectDocument: (requestId: string, docId: string, rejectionReason: string, adminRejectRemarks?: string) =>
    apiClient.patch(`${BASE}/${requestId}/documents/${docId}/reject`, { rejectionReason, adminRejectRemarks }),

  /** Approve the full request */
  approveRequest: (requestId: string) =>
    apiClient.patch(`${BASE}/${requestId}/approve`),

  /** Reject the full request */
  rejectRequest: (requestId: string, remarks: string) =>
    apiClient.patch(`${BASE}/${requestId}/reject`, { remarks }),

  /** Check if a center exists globally by email or name */
  findExistingCenter: (params: { email?: string; centerName?: string }) =>
    apiClient.get(`${BASE}/find-existing`, { params }),

  // ── File Upload ────────────────────────────────────────────────
  /** Upload a single file to the file storage and get a URL back */
  uploadFile: async (file: File): Promise<{ fileUrl: string; fileName: string; fileSize: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data?.data || res.data;
  },
};
