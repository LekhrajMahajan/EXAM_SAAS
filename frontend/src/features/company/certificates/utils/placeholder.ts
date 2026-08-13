import type { CertificateRecord, CertificateTemplate, CertificateStatistics, CertificateHistoryRecord } from '../types';

export const DUMMY_CERT_STATS: CertificateStatistics = {
  totalCertificates: 25000,
  generatedCertificates: 24500,
  downloadedCertificates: 18200,
  verifiedCertificates: 5400,
  pendingCertificates: 500,
  expiredCertificates: 0,
};

export const DUMMY_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'CERT-001',
    certificateNumber: 'CERT-2026-99182',
    applicationNumber: 'APP-2026-001',
    candidateName: 'Jane Smith',
    exam: 'Spring Admissions Test 2026',
    certificateType: 'Merit Certificate',
    center: 'SF Test Center 1',
    issueDate: '2026-08-25',
    verificationStatus: 'Verified',
    downloadStatus: 'Downloaded',
    score: 295,
    grade: 'A+',
    rank: 1
  },
  {
    id: 'CERT-002',
    certificateNumber: 'CERT-2026-99183',
    applicationNumber: 'APP-2026-045',
    candidateName: 'John Doe',
    exam: 'Spring Admissions Test 2026',
    certificateType: 'Participation Certificate',
    center: 'NYC Test Center 3',
    issueDate: '2026-08-25',
    verificationStatus: 'Pending',
    downloadStatus: 'Not Downloaded',
    score: 288,
    grade: 'A'
  },
  {
    id: 'CERT-003',
    certificateNumber: 'CERT-2026-99184',
    applicationNumber: 'APP-2026-102',
    candidateName: 'Alice Johnson',
    exam: 'Winter Eligibility Test 2025',
    certificateType: 'Eligibility Certificate',
    center: 'Austin Test Center',
    issueDate: '2026-02-10',
    expiryDate: '2028-02-10',
    verificationStatus: 'Failed',
    downloadStatus: 'Downloaded',
    score: 275,
    grade: 'B+',
    remarks: 'Signature mismatch detected during verification.'
  }
];

export const DUMMY_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Standard Academic Merit',
    type: 'Merit Certificate',
    description: 'A formal template with university borders, ribbon seal, and QR code placement at the bottom left.',
    thumbnail: 'https://placehold.co/400x300/e2e8f0/475569?text=Merit+Template',
    isDefault: true
  },
  {
    id: 'TPL-002',
    name: 'Modern Participation',
    type: 'Participation Certificate',
    description: 'A sleek, modern design without rankings, focused on participation and completion.',
    thumbnail: 'https://placehold.co/400x300/f1f5f9/64748b?text=Participation+Template',
    isDefault: false
  },
  {
    id: 'TPL-003',
    name: 'Gov Eligibility Format',
    type: 'Eligibility Certificate',
    description: 'Strict, compliant layout required for state and government eligibility exams with watermarks.',
    thumbnail: 'https://placehold.co/400x300/f8fafc/94a3b8?text=Eligibility+Template',
    isDefault: false
  }
];

export const DUMMY_CERT_HISTORY: CertificateHistoryRecord[] = [
  {
    id: 'HIST-C-001',
    jobId: 'CERT-GEN-101',
    action: 'Generation',
    entity: 'Spring Admissions Test 2026 (Batch)',
    triggeredBy: 'System Auto',
    timestamp: '2026-08-25 02:00:00',
    status: 'Success',
    details: 'Generated 14,520 certificates automatically.'
  },
  {
    id: 'HIST-C-002',
    jobId: 'CERT-VER-99182',
    action: 'Verification',
    entity: 'Jane Smith (CERT-2026-99182)',
    triggeredBy: 'Public Portal User',
    timestamp: '2026-08-26 14:30:00',
    status: 'Success',
    details: 'QR Code signature verified successfully.'
  },
  {
    id: 'HIST-C-003',
    jobId: 'CERT-VER-99184',
    action: 'Verification',
    entity: 'Alice Johnson (CERT-2026-99184)',
    triggeredBy: 'HR Verifier',
    timestamp: '2026-08-27 10:15:00',
    status: 'Failed',
    details: 'Cryptographic signature mismatch.'
  }
];

export const DUMMY_EXAMS = ['Spring Admissions Test 2026', 'Winter Eligibility Test 2025', 'State Medical Entrance 2026'];
export const DUMMY_CERT_TYPES = ['Merit Certificate', 'Participation Certificate', 'Eligibility Certificate', 'Score Card'];
