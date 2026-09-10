import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Eye, RefreshCw, Clock, CheckCircle2, XCircle,
  AlertTriangle, FileText, Loader2, X, Check, Inbox, Maximize,
} from 'lucide-react';
import { companyAdminRequestApi } from '@/features/center/api/companyAdminRequestApi';
import { toast } from 'react-hot-toast';
import { MasterAdminStatCard as StatCard } from '@/features/master-admin/components/cards/MasterAdminStatCard';

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = 'PENDING' | 'PENDING_DOCUMENTS' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';

interface RequestDocument {
  _id: string;
  documentType: string;
  isMandatory: boolean;
  fileName: string;
  fileUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

interface AdminRequest {
  _id: string;
  companyId: { _id: string; companyName: string; email: string };
  companyAdminId: { _id: string; firstName: string; lastName: string; email: string };
  centerId: {
    _id: string; centerName: string; email: string; phone: string;
    city: string; state: string; managerName?: string; centerCode?: string;
  };
  mouFileUrl?: string;
  shiftRates: { shiftName: string; pricePerCandidate: number; candidateCapacity: number }[];
  documents: RequestDocument[];
  status: RequestStatus;
  adminRejectRemarks?: string;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<RequestStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending Upload', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' },
  PENDING_DOCUMENTS: { label: 'Pending Documents', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' },
  UNDER_REVIEW: { label: 'Documents Uploaded — Under Review', color: 'text-[#2D3E2C] dark:text-white', bg: 'bg-[#2D3E2C]/5 dark:bg-slate-700/50 border-[#2D3E2C]/30 dark:border-slate-600' },
  APPROVED: { label: 'Approved', color: 'text-[#2D3E2C] dark:text-[#E4FD97]', bg: 'bg-[#2D3E2C]/10 dark:bg-slate-700/50 border-[#2D3E2C]/30 dark:border-slate-600' },
  REJECTED: { label: 'Rejected', color: 'text-red-700 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' },
};

// ─── Document Review Modal ────────────────────────────────────────────────────

function DocumentReviewModal({
  request,
  onClose,
  onRefresh,
}: {
  request: AdminRequest;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [processing, setProcessing] = useState<string | null>(null);
  const [rejectDocModal, setRejectDocModal] = useState<{ docId: string; docType: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveAllLoading, setApproveAllLoading] = useState(false);
  const [rejectAllModal, setRejectAllModal] = useState(false);
  const [rejectAllRemarks, setRejectAllRemarks] = useState('');
  const [viewedDocs, setViewedDocs] = useState<Set<string>>(new Set());

  const handleApproveDoc = async (docId: string) => {
    setProcessing(docId);
    try {
      await companyAdminRequestApi.approveDocument(request._id, docId);
      toast.success('Document approved');
      onRefresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve document');
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectDoc = async () => {
    if (!rejectDocModal || !rejectReason.trim()) {
      toast.error('Rejection reason is required');
      return;
    }
    setProcessing(rejectDocModal.docId);
    try {
      await companyAdminRequestApi.rejectDocument(request._id, rejectDocModal.docId, rejectReason);
      toast.success('Document rejected. Center manager will be notified to reupload.');
      setRejectDocModal(null);
      setRejectReason('');
      onRefresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject document');
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveAll = async () => {
    setApproveAllLoading(true);
    try {
      await companyAdminRequestApi.approveRequest(request._id);
      toast.success('🎉 Request approved! Center is now connected and center manager has been notified via email.');
      onClose();
      onRefresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve request');
    } finally {
      setApproveAllLoading(false);
    }
  };

  const handleRejectAll = async () => {
    if (!rejectAllRemarks.trim()) {
      toast.error('Please provide rejection remarks');
      return;
    }
    setProcessing('all');
    try {
      await companyAdminRequestApi.rejectRequest(request._id, rejectAllRemarks);
      toast.success('Request rejected. Center manager has been notified.');
      setRejectAllModal(false);
      onClose();
      onRefresh();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessing(null);
    }
  };

  const canReview = request.status === 'UNDER_REVIEW';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-700/50 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Review Center Documents</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Center: <span className="text-slate-900 dark:text-white font-medium">{request.centerId?.centerName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Center info */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40 p-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Center Name</p>
              <p className="text-slate-700 dark:text-slate-200 font-medium">{request.centerId?.centerName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Center Code</p>
              <p className="text-slate-700 dark:text-slate-200 font-medium">{request.centerId?.centerCode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Manager Name</p>
              <p className="text-slate-700 dark:text-slate-200">{request.centerId?.managerName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
              <p className="text-slate-700 dark:text-slate-200">{request.centerId?.city}, {request.centerId?.state}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
              <p className="text-slate-700 dark:text-slate-200">{request.centerId?.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
              <p className="text-slate-700 dark:text-slate-200">{request.centerId?.phone}</p>
            </div>
          </div>
          {/* Company Admin Details */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700/50 bg-[#F9F8F6] dark:bg-slate-800/40 p-4 grid grid-cols-2 gap-3 text-sm">
            <h3 className="col-span-2 text-xs font-bold text-[#2D3E2C] dark:text-[#E4FD97] uppercase tracking-wide mb-1 border-b border-slate-200 dark:border-slate-700/50 pb-2">Company Admin Details</h3>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admin Name</p>
              <p className="text-[#2D3E2C] dark:text-slate-200 font-bold">{request.companyAdminId?.firstName} {request.companyAdminId?.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
              <p className="text-[#2D3E2C] dark:text-slate-200 font-bold">{request.companyAdminId?.email}</p>
            </div>
            {/* MOU Download Button */}
            {request.mouFileUrl && (
              <div className="col-span-2 mt-2 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                <a
                  href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/files/proxy?url=${encodeURIComponent(request.mouFileUrl)}&download=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90 transition-colors text-xs font-bold border-0 border-transparent shadow-sm w-fit"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Download MOU PDF
                </a>
              </div>
            )}
          </div>
          {/* Documents Review */}
          {request.documents?.length > 0 ? (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                Uploaded Documents ({request.documents.length})
              </p>
              <div className="space-y-3">
                {request.documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-slate-900 dark:text-white font-medium truncate">{doc.documentType}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{doc.fileName}</p>
                        {doc.rejectionReason && (
                          <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{doc.rejectionReason}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* View file — backend streams inline (no download) */}
                      {doc.fileUrl && doc.fileUrl !== '' && (
                        <button
                          onClick={() => {
                            // Use backend proxy endpoint which streams Cloudinary file with Content-Disposition: inline
                            const proxyUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/files/proxy?url=${encodeURIComponent(doc.fileUrl)}`;
                            window.open(proxyUrl, '_blank', 'noopener,noreferrer');
                            setViewedDocs((prev) => new Set(prev).add(doc._id));
                          }}
                          className="p-1.5 rounded-lg bg-[#2D3E2C]/5 dark:bg-slate-700 hover:bg-[#2D3E2C]/10 dark:hover:bg-slate-600 text-[#2D3E2C] dark:text-[#E4FD97] transition-colors"
                          title="View document in browser"
                        >
                          <Maximize className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Status or actions */}
                      {doc.status === 'APPROVED' && (
                        <span className="text-xs text-[#2D3E2C] dark:text-[#E4FD97] font-medium flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Approved
                        </span>
                      )}
                      {doc.status === 'REJECTED' && (
                        <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> Rejected
                        </span>
                      )}

                      {canReview && doc.status === 'PENDING' && doc.fileUrl && doc.fileUrl !== '' && (
                        <>
                          <button
                            onClick={() => handleApproveDoc(doc._id)}
                            disabled={processing === doc._id || !viewedDocs.has(doc._id)}
                            className="px-3 py-1.5 rounded-lg bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-[#E4FD97] text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[70px] text-center"
                            title={viewedDocs.has(doc._id) ? "Approve this document" : "Please preview the document first"}
                          >
                            {processing === doc._id ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : "Accept"}
                          </button>
                          <button
                            onClick={() => setRejectDocModal({ docId: doc._id, docType: doc.documentType })}
                            disabled={!viewedDocs.has(doc._id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/40 text-red-600 dark:text-red-400 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[70px] text-center"
                            title={viewedDocs.has(doc._id) ? "Reject this document" : "Please preview the document first"}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Center manager has not uploaded documents yet.</p>
              <p className="text-xs mt-1">Status: {STATUS_CONFIG[request.status]?.label}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {canReview && (() => {
          const allDocsApproved = request.documents.length > 0 && request.documents.every(doc => doc.status === 'APPROVED');
          return (
            <div className="sticky bottom-0 bg-white dark:bg-[#0B132B] border-t border-slate-200 dark:border-slate-700/50 px-6 py-4 flex items-center justify-center gap-3">
              {allDocsApproved ? (
                <button
                  onClick={handleApproveAll}
                  disabled={approveAllLoading}
                  className="w-full px-4 py-2.5 bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-[#E4FD97] rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  {approveAllLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {approveAllLoading ? 'Approving...' : 'Approve & Connect Center'}
                </button>
              ) : (
                <button
                  onClick={() => setRejectAllModal(true)}
                  className="w-full px-4 py-2.5 bg-red-50 dark:bg-red-600/20 hover:bg-red-100 dark:hover:bg-red-600/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Request
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* Reject Doc Sub-Modal */}
      {rejectDocModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Reject: {rejectDocModal.docType}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Please explain why this document is being rejected.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Document is blurry, wrong document uploaded, signature missing..."
              className="w-full h-24 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white text-sm rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setRejectDocModal(null); setRejectReason(''); }}
                className="flex-1 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >Cancel</button>
              <button
                onClick={handleRejectDoc}
                disabled={processing !== null}
                className="flex-1 py-2 text-sm bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-sm"
              >
                {processing ? 'Rejecting...' : 'Reject Document'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject All Sub-Modal */}
      {rejectAllModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Reject Entire Request</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">This will reject the entire connection request and notify the center manager.</p>
            <textarea
              value={rejectAllRemarks}
              onChange={(e) => setRejectAllRemarks(e.target.value)}
              placeholder="Reason for rejecting this center's request..."
              className="w-full h-24 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-white text-sm rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectAllModal(false)}
                className="flex-1 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >Cancel</button>
              <button
                onClick={handleRejectAll}
                disabled={processing === 'all'}
                className="flex-1 py-2 text-sm bg-red-600 hover:bg-red-700 dark:hover:bg-red-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 shadow-sm"
              >
                {processing === 'all' ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export const CompanyAdminCenterRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewRequest, setReviewRequest] = useState<AdminRequest | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await companyAdminRequestApi.getOutgoingRequests();
      const fetchedRequests = res.data?.data || [];
      setRequests(fetchedRequests);
      setReviewRequest(prev => {
        if (prev) {
          return fetchedRequests.find((r: AdminRequest) => r._id === prev._id) || prev;
        }
        return null;
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchRequests]);

  return (
    <div className="p-6 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Center Connection Requests</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Track and manage your requests to connect with existing centers.
            </p>
          </div>
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 shadow-sm text-slate-700 dark:text-slate-300 rounded-xl text-sm transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Total Requests"
            value={requests.length}
            icon={Inbox}
            accent="slate"
          />
          <StatCard
            title="Awaiting Upload"
            value={requests.filter((r) => r.status === 'PENDING').length}
            icon={Clock}
            accent="amber"
          />
          <StatCard
            title="Under Review"
            value={requests.filter((r) => r.status === 'UNDER_REVIEW').length}
            icon={Eye}
            accent="blue"
          />
          <StatCard
            title="Approved"
            value={requests.filter((r) => r.status === 'APPROVED').length}
            icon={CheckCircle2}
            accent="green"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No Center Requests Sent</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm">
            When you try to add a center that already exists, a connection request is automatically sent and will appear here.
          </p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => {
            const sc = STATUS_CONFIG[req.status];
            const canReview = req.status === 'UNDER_REVIEW';

            return (
              <div
                key={req._id}
                className="bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 shadow-sm rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-secondary text-[#2D3E2C] flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{req.centerId?.centerName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {req.centerId?.city}, {req.centerId?.state} · {req.centerId?.email}
                        </p>
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                      {req.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {req.status === 'UNDER_REVIEW' && <Eye className="w-3.5 h-3.5" />}
                      {req.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                      {req.status === 'PENDING_DOCUMENTS' && <AlertTriangle className="w-3.5 h-3.5" />}
                      {sc.label}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Sent on {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {canReview && (
                      <button
                        onClick={() => setReviewRequest(req)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 rounded-xl text-sm text-[#E4FD97] shadow-sm transition-colors whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
                        Review Docs
                      </button>
                    )}
                    {!canReview && (
                      <button
                        onClick={() => setReviewRequest(req)}
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-xl text-sm text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewRequest && (
        <DocumentReviewModal
          request={reviewRequest}
          onClose={() => setReviewRequest(null)}
          onRefresh={fetchRequests}
        />
      )}
    </div>
  );
};

export default CompanyAdminCenterRequestsPage;
