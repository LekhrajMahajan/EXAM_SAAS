export type VerificationStatus = 'Verified' | 'Pending' | 'Failed' | 'Expired';
export type DownloadStatus = 'Downloaded' | 'Not Downloaded';

export interface CertificateRecord {
  id: string;
  certificateNumber: string;
  applicationNumber: string;
  candidateName: string;
  exam: string;
  certificateType: string;
  center: string;
  issueDate: string;
  expiryDate?: string;
  verificationStatus: VerificationStatus;
  downloadStatus: DownloadStatus;
  remarks?: string;
  score?: number;
  grade?: string;
  rank?: number;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  thumbnail: string;
  isDefault: boolean;
}

export interface CertificateStatistics {
  totalCertificates: number;
  generatedCertificates: number;
  downloadedCertificates: number;
  verifiedCertificates: number;
  pendingCertificates: number;
  expiredCertificates: number;
}

export interface CertificateHistoryRecord {
  id: string;
  jobId: string;
  action: 'Generation' | 'Download' | 'Verification';
  entity: string; // Candidate Name, or Batch name
  triggeredBy: string;
  timestamp: string;
  status: 'Success' | 'Failed';
  details?: string;
}
