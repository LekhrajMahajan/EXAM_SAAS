import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Eye,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Upload,
  ChevronRight,
  User,
  Phone,
  Mail,
  BadgeCheck,
  Loader2,
  X,
  Download,
  Inbox,
  IndianRupee,
} from 'lucide-react'
import { companyAdminRequestApi } from '../api/companyAdminRequestApi'
import { toast } from 'react-hot-toast'
import { MasterAdminStatCard as StatCard } from '@/features/master-admin/components/cards/MasterAdminStatCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type RequestStatus = 'PENDING' | 'PENDING_DOCUMENTS' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'

interface RequestDocument {
  _id: string
  documentType: string
  isMandatory: boolean
  fileName: string
  fileUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  rejectionReason?: string
}

interface AdminRequest {
  _id: string
  companyId: { _id: string; companyName: string; email: string; logo?: string }
  companyAdminId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  centerId: { _id: string; centerName: string }
  mouFileUrl?: string
  mouFileName?: string
  shiftRates: { shiftName: string; pricePerCandidate: number; candidateCapacity: number }[]
  documents: RequestDocument[]
  status: RequestStatus
  adminRejectRemarks?: string
  createdAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: 'Pending — Upload Required',
    color: 'text-[#E4FD97]',
    bg: 'bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 border-0',
    icon: <Clock className='w-4 h-4' />,
  },
  PENDING_DOCUMENTS: {
    label: 'Pending Documents — Reupload Required',
    color: 'text-[#E4FD97]',
    bg: 'bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 border-0',
    icon: <AlertTriangle className='w-4 h-4' />,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'text-[#2D3E2C] dark:text-white',
    bg: 'bg-[#2D3E2C]/5 dark:bg-slate-700/50 border border-[#2D3E2C]/30 dark:border-slate-600',
    icon: <Eye className='w-4 h-4' />,
  },
  APPROVED: {
    label: 'Approved — Connected',
    color: 'text-[#2D3E2C] dark:text-[#E4FD97]',
    bg: 'bg-[#E4FD97] dark:bg-[#E4FD97]/10 border border-[#E4FD97]/50',
    icon: <CheckCircle2 className='w-4 h-4' />,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20',
    icon: <XCircle className='w-4 h-4' />,
  },
}

const REQUIRED_DOC_TYPES = [
  'Signed MOU',
  'PAN Card',
  'GST Certificate',
  'Aadhaar Card',
  'Cancelled Cheque',
]

// ─── Document Upload Modal ────────────────────────────────────────────────────

function DocumentUploadModal ({
  request,
  onClose,
  onSuccess,
}: {
  request: AdminRequest
  onClose: () => void
  onSuccess: () => void
}) {
  const isReupload = request.status === 'PENDING_DOCUMENTS'
  const rejectedDocs = request.documents.filter((d) => d.status === 'REJECTED')
  const docTypesToShow = isReupload ? rejectedDocs.map((d) => d.documentType) : REQUIRED_DOC_TYPES

  const [uploads, setUploads] = useState<
    Record<
      string,
      { file: File | null; uploading: boolean; url: string; fileName: string; fileSize: string }
    >
  >(
    Object.fromEntries(
      docTypesToShow.map((type) => [
        type,
        { file: null, uploading: false, url: '', fileName: '', fileSize: '' },
      ]),
    ),
  )
  const [submitting, setSubmitting] = useState(false)

  const handleFileChange = async (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploads((prev) => ({ ...prev, [docType]: { ...prev[docType], uploading: true, file } }))

    try {
      const result = await companyAdminRequestApi.uploadFile(file)
      setUploads((prev) => ({
        ...prev,
        [docType]: {
          ...prev[docType],
          uploading: false,
          url: result.fileUrl,
          fileName: result.fileName || file.name,
          fileSize: result.fileSize || `${(file.size / 1024).toFixed(0)} KB`,
        },
      }))
      toast.success(`${docType} uploaded successfully`)
    } catch {
      setUploads((prev) => ({ ...prev, [docType]: { ...prev[docType], uploading: false } }))
      toast.error(`Failed to upload ${docType}`)
    }
  }

  const handleSubmit = async () => {
    const docs = Object.entries(uploads)
      .filter(([, v]) => v.url)
      .map(([documentType, v]) => ({
        documentType,
        fileName: v.fileName,
        fileUrl: v.url,
        fileSize: v.fileSize,
      }))

    if (docs.length === 0) {
      toast.error('Please upload at least one document')
      return
    }

    // Check if all required docs (non-reupload mode) are uploaded
    if (!isReupload) {
      const missing = docTypesToShow.filter((t) => !uploads[t]?.url)
      if (missing.length > 0) {
        toast.error(`Please upload: ${missing.join(', ')}`)
        return
      }
    }

    setSubmitting(true)
    try {
      await companyAdminRequestApi.uploadDocuments(request._id, docs)
      toast.success('Documents submitted for review! Company admin will verify them shortly.')
      onSuccess()
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit documents')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
      <div className='bg-[#F9F8F6] dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl'>
        {/* Header */}
        <div className='sticky top-0 bg-[#F9F8F6] dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-700/50 px-6 py-4 flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-bold text-[#2D3E2C] dark:text-white'>
              {isReupload ? '🔄 Reupload Rejected Documents' : '📁 Upload Required Documents'}
            </h2>
            <p className='text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5'>
              <span className='text-[#2D3E2C] dark:text-emerald-400 font-bold'>{request.companyId?.companyName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Shift Rates info */}
        {request.shiftRates?.length > 0 && !isReupload && (
          <div className='mx-6 mt-4 p-4 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50'>
            <p className='text-sm font-bold text-[#2D3E2C] dark:text-slate-300 mb-3 flex items-center gap-2'>
              <span className='p-1.5 rounded-[4px] bg-secondary flex items-center justify-center leading-none text-base'><IndianRupee className="w-4 h-4" /></span>
              Proposed Shift Rates by Company Admin
            </p>
            <div className='space-y-1.5'>
              {request.shiftRates.map((s, i) => (
                <div key={i} className='flex items-center justify-between text-sm'>
                  <span className='font-medium text-slate-500 dark:text-slate-400'>{s.shiftName}</span>
                  <span className='text-[#2D3E2C] dark:text-emerald-400 font-bold'>
                    ₹{s.pricePerCandidate}/candidate · Max {s.candidateCapacity} candidates
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Admin rejection remarks if reupload */}
        {isReupload && request.adminRejectRemarks && (
          <div className='mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-700 dark:text-red-400'>
            <strong>Admin Remarks:</strong> {request.adminRejectRemarks}
          </div>
        )}

        {/* Document Upload Fields */}
        <div className='p-6 space-y-4'>
          {docTypesToShow.map((docType) => {
            const upload = uploads[docType]
            const rejectedDoc = rejectedDocs.find((d) => d.documentType === docType)

            return (
              <div key={docType} className='rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 p-4'>
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <p className='text-sm font-bold text-[#2D3E2C] dark:text-white'>{docType}</p>
                    {rejectedDoc?.rejectionReason && (
                      <p className='text-xs text-red-600 dark:text-red-400 mt-0.5'>
                        ❌ Rejected: {rejectedDoc.rejectionReason}
                      </p>
                    )}
                  </div>
                  {upload.url ? (
                    <span className='text-xs text-[#2D3E2C] dark:text-white flex items-center gap-1 font-bold'>
                      <CheckCircle2 className='w-3.5 h-3.5' /> Uploaded
                    </span>
                  ) : (
                    <span className='text-[11px] uppercase tracking-wide border border-[#2D3E2C] text-[#2D3E2C] rounded-[4px] px-2 py-0.5 font-bold'>Required</span>
                  )}
                </div>

                <label className='flex items-center gap-3 cursor-pointer'>
                  <div
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                      upload.url
                        ? 'border-[#2D3E2C]/30 bg-[#2D3E2C]/5 dark:border-slate-600 dark:bg-slate-700/50 text-[#2D3E2C] dark:text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0B132B] text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                    }`}
                  >
                    {upload.uploading ? (
                      <>
                        <Loader2 className='w-4 h-4 animate-spin' /> Uploading...
                      </>
                    ) : upload.url ? (
                      <>
                        <FileText className='w-4 h-4' /> {upload.fileName}
                      </>
                    ) : (
                      <>
                        <Upload className='w-4 h-4' /> Click to upload {docType}
                      </>
                    )}
                  </div>
                  <input
                    type='file'
                    className='hidden'
                    accept='.pdf,.jpg,.jpeg,.png'
                    onChange={(e) => handleFileChange(docType, e)}
                    disabled={upload.uploading}
                  />
                </label>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className='sticky bottom-0 bg-[#F9F8F6] dark:bg-[#0B132B] border-t border-slate-200 dark:border-slate-700/50 px-6 py-4 flex items-center gap-3 justify-end'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className='px-5 py-2.5 bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-secondary rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm'
          >
            {submitting ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Upload className='w-4 h-4' />
            )}
            {submitting
              ? 'Submitting...'
              : isReupload
              ? 'Resubmit Documents'
              : 'Submit Documents for Review'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Request Detail Modal (view) ─────────────────────────────────────────────

function RequestDetailModal ({
  request,
  onClose,
  onUpload,
}: {
  request: AdminRequest
  onClose: () => void
  onUpload: () => void
}) {
  const sc = STATUS_CONFIG[request.status] || STATUS_CONFIG.PENDING
  const canUpload = request.status === 'PENDING' || request.status === 'PENDING_DOCUMENTS'

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm'>
      <div className='bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl'>
        {/* Header */}
        <div className='sticky top-0 bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-700/50 px-6 py-4 flex items-center justify-between'>
          <h2 className='text-lg font-bold text-slate-900 dark:text-white'>Request Details</h2>
          <button
            onClick={onClose}
            className='text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-white p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6 space-y-5'>
          {/* Status */}
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${sc.bg} ${sc.color}`}
          >
            {sc.icon}
            {sc.label}
          </div>

          {/* Admin info */}
          <div className='rounded-xl border border-slate-200 dark:border-slate-700/50 bg-[#F9F8F6] dark:bg-slate-800/40 p-4 space-y-2'>
            <p className='text-xs font-bold text-[#2D3E2C] dark:text-slate-400 uppercase tracking-wide mb-3'>
              Company Admin Info
            </p>
            <div className='flex items-center gap-2 text-sm font-medium text-[#2D3E2C] dark:text-slate-300'>
              <User className='w-4 h-4 text-[#2D3E2C] dark:text-slate-400' />
              {request.companyAdminId?.firstName} {request.companyAdminId?.lastName}
            </div>
            <div className='flex items-center gap-2 text-sm font-medium text-[#2D3E2C] dark:text-slate-300'>
              <Mail className='w-4 h-4 text-[#2D3E2C] dark:text-slate-400' />
              {request.companyAdminId?.email}
            </div>
            {request.companyAdminId?.phone && (
              <div className='flex items-center gap-2 text-sm font-medium text-[#2D3E2C] dark:text-slate-300'>
                <Phone className='w-4 h-4 text-[#2D3E2C] dark:text-slate-400' />
                {request.companyAdminId.phone}
              </div>
            )}
            <div className='flex items-center gap-2 text-sm font-medium text-[#2D3E2C] dark:text-slate-300'>
              <Building2 className='w-4 h-4 text-[#2D3E2C] dark:text-slate-400' />
              {request.companyId?.companyName}
            </div>
          </div>

          {/* Shift Rates */}
          {request.shiftRates?.length > 0 && (
            <div className='rounded-xl border border-slate-200 dark:border-slate-700/50 bg-[#F9F8F6] dark:bg-slate-800/40 p-4'>
              <p className='text-xs font-bold text-[#2D3E2C] dark:text-slate-400 uppercase tracking-wide mb-3'>
                Proposed Shift Rates
              </p>
              {request.shiftRates.map((s, i) => (
                <div
                  key={i}
                  className='flex justify-between text-sm py-1.5 border-b border-slate-200 dark:border-slate-700/50 last:border-0'
                >
                  <span className='font-medium text-[#2D3E2C] dark:text-slate-400'>{s.shiftName}</span>
                  <span className='text-[#2D3E2C] dark:text-emerald-400 font-bold'>
                    ₹{s.pricePerCandidate}/candidate
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* MOU — Force download (stamp lagane ke liye) */}
          {request.mouFileUrl && (
            <button
              onClick={async () => {
                try {
                  const response = await fetch(request.mouFileUrl!, { mode: 'cors' });
                  const blob = await response.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = request.mouFileName || 'MOU_Document.pdf';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(blobUrl);
                } catch {
                  // Fallback: direct link with download hint
                  const link = document.createElement('a');
                  link.href = request.mouFileUrl!;
                  link.download = request.mouFileName || 'MOU_Document.pdf';
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
              className='flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90 text-sm font-bold transition-colors w-max cursor-pointer'
            >
              <Download className='w-4 h-4' />
              Download {request.mouFileName || 'MOU Document'}
            </button>
          )}

          {/* Documents status */}
          {request.documents?.length > 0 && (
            <div className='rounded-xl border border-slate-200 dark:border-slate-700/50 bg-[#F9F8F6] dark:bg-slate-800/40 p-4'>
              <p className='text-xs font-bold text-[#2D3E2C] dark:text-slate-400 uppercase tracking-wide mb-3'>
                Document Status
              </p>
              <div className='space-y-2'>
                {request.documents.map((doc) => (
                  <div key={doc._id} className='flex items-center justify-between text-sm'>
                    <span className='font-medium text-[#2D3E2C] dark:text-slate-400'>{doc.documentType}</span>
                    <span
                      className={
                        doc.status === 'APPROVED'
                          ? 'text-[#2D3E2C] dark:text-[#E4FD97] font-bold flex items-center gap-1.5'
                          : doc.status === 'REJECTED'
                          ? 'text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5'
                          : 'text-[#2D3E2C] dark:text-amber-400 font-bold flex items-center gap-1.5'
                      }
                    >
                      {doc.status === 'APPROVED'
                        ? <><CheckCircle2 className="w-4 h-4" /> Approved</>
                        : doc.status === 'REJECTED'
                        ? <><XCircle className="w-4 h-4" /> {`Rejected${doc.rejectionReason ? `: ${doc.rejectionReason}` : ''}`}</>
                        : <><Clock className="w-4 h-4" /> Pending</>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin rejection remarks */}
          {request.adminRejectRemarks && (
            <div className='p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-700 dark:text-red-400'>
              <strong>Admin Remarks:</strong> {request.adminRejectRemarks}
            </div>
          )}
        </div>

        {/* Footer */}
        {canUpload && (
          <div className='sticky bottom-0 bg-white dark:bg-[#0B132B] border-t border-slate-200 dark:border-slate-700/50 px-6 py-4'>
            <button
              onClick={() => {
                onClose()
                onUpload()
              }}
              className='w-full px-5 py-2.5 bg-[#2D3E2C] hover:bg-[#2D3E2C]/90 text-secondary rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm'
            >
              <Upload className='w-4 h-4' />
              {request.status === 'PENDING_DOCUMENTS'
                ? 'Reupload Rejected Documents'
                : 'Upload Required Documents'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export const CompanyAdminRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<AdminRequest | null>(null)
  const [uploadRequest, setUploadRequest] = useState<AdminRequest | null>(null)
  const navigate = useNavigate()

  const fetchRequests = useCallback(async () => {
    try {
      const res = await companyAdminRequestApi.getIncomingRequests()
      setRequests(res.data?.data || [])
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests()
    }, 0)
    return () => clearTimeout(timer)
  }, [fetchRequests])

  const handleRefresh = useCallback(() => {
    setLoading(true)
    fetchRequests()
  }, [fetchRequests])

  const pendingCount = requests.filter(
    (r) => r.status === 'PENDING' || r.status === 'PENDING_DOCUMENTS',
  ).length
  const approvedCount = requests.filter((r) => r.status === 'APPROVED').length

  return (
    <div className='p-6 text-slate-900 dark:text-white'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-slate-900 dark:text-white tracking-tight'>Company Admin Requests</h1>
            <p className='text-slate-500 dark:text-slate-400 mt-1'>
              Manage connection requests from company admins who want to use your center.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className='flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 shadow-sm text-slate-700 dark:text-slate-300 rounded-xl text-sm transition-colors'
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Summary Stats */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6'>
          <StatCard
            title='Total Requests'
            value={requests.length}
            icon={Inbox}
            accent='slate'
          />
          <StatCard
            title='Action Required'
            value={pendingCount}
            icon={AlertTriangle}
            accent='amber'
          />
          <StatCard
            title='Approved'
            value={approvedCount}
            icon={CheckCircle2}
            accent='green'
          />
          <StatCard
            title='Under Review'
            value={requests.filter((r) => r.status === 'UNDER_REVIEW').length}
            icon={Eye}
            accent='slate'
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className='flex items-center justify-center py-20'>
          <Loader2 className='w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400' />
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <div className='w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4'>
            <Inbox className='w-8 h-8 text-slate-500 dark:text-slate-400' />
          </div>
          <h3 className='text-lg font-semibold text-slate-900 dark:text-white'>No Requests Yet</h3>
          <p className='text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm'>
            When a Company Admin wants to use your center for their exams, their request will appear
            here.
          </p>
        </div>
      )}

      {/* Request Cards */}
      {!loading && requests.length > 0 && (
        <div className='space-y-4'>
          {requests.map((req) => {
            const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.PENDING
            const canUpload = req.status === 'PENDING' || req.status === 'PENDING_DOCUMENTS'

            return (
              <div
                key={req._id}
                className='bg-[#F9F8F6] dark:bg-[#0B132B] border border-slate-200 dark:border-slate-700/50 shadow-sm rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-all'
              >
                <div className='flex items-start justify-between gap-4'>
                  {/* Left Info */}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-3 mb-2'>
                      <div className='w-10 h-10 rounded-[4px] bg-secondary text-[#2D3E2C] flex items-center justify-center shrink-0'>
                        <Building2 className='w-5 h-5' />
                      </div>
                      <div>
                        <p className='font-bold text-slate-900 dark:text-white'>{req.companyId?.companyName}</p>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                          {req.companyAdminId?.firstName} {req.companyAdminId?.lastName} ·{' '}
                          {req.companyAdminId?.email}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold ${sc.bg} ${sc.color}`}
                    >
                      {sc.icon}
                      {sc.label}
                    </div>

                    {/* Shift rates summary */}
                    {req.shiftRates?.length > 0 && (
                      <div className='flex flex-wrap items-center gap-4 mt-2.5 text-[11px] font-medium text-slate-600 dark:text-slate-300'>
                        {req.shiftRates.map((rate, idx) => (
                          <div key={idx} className="flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5" />
                            {rate.pricePerCandidate}/candidate ({rate.shiftName})
                          </div>
                        ))}
                      </div>
                    )}

                    <div className='flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2.5'>
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex flex-col gap-2'>
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className='flex items-center justify-center gap-2 px-3 py-2 bg-[#2D3E2C] rounded-xl text-sm text-[#E4FD97] hover:bg-[#2D3E2C]/90 hover:text-secondary transition-colors whitespace-nowrap'
                    >
                      <Eye className='w-4 h-4' />
                      View
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpload={() => setUploadRequest(selectedRequest)}
        />
      )}

      {uploadRequest && (
        <DocumentUploadModal
          request={uploadRequest}
          onClose={() => setUploadRequest(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  )
}

export default CompanyAdminRequestsPage