export enum ReportType {
  CANDIDATE = 'CANDIDATE',
  EXAM = 'EXAM',
  RESULT = 'RESULT',
  ATTENDANCE = 'ATTENDANCE',
  BIOMETRIC = 'BIOMETRIC',
  CENTER = 'CENTER',
  BRANCH = 'BRANCH',
  COMPANY = 'COMPANY',
  LIVE_MONITORING = 'LIVE_MONITORING',
  ACTIVITY_LOG = 'ACTIVITY_LOG',
  AUDIT_LOG = 'AUDIT_LOG',
  TRUST_SCORE = 'TRUST_SCORE',
  CERTIFICATE = 'CERTIFICATE',
  CUSTOM = 'CUSTOM',
  FINANCIAL = 'FINANCIAL',
  SECURITY = 'SECURITY',
  MASTER = 'MASTER',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON',
}

export enum ReportVisibility {
  PRIVATE = 'PRIVATE',
  COMPANY = 'COMPANY',
  PUBLIC = 'PUBLIC',
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  companyId?: string;
  branchId?: string;
  centerId?: string;
  examId?: string;
  candidateId?: string;
  employeeId?: string;
  status?: string;
}

export interface Report {
  _id: string;
  reportType: ReportType;
  reportName: string;
  status: ReportStatus;
  format: ReportFormat;
  visibility: ReportVisibility;
  generatedBy: any; // Can be string or populated object
  companyId?: string;
  branchId?: string;
  centerId?: string;
  examId?: string;
  fileId?: string;
  generatedAt: string;
  completedAt?: string;
  filters?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  error?: string;
  favorites?: string[];
  downloadCount?: number;
  isScheduled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportsResponse {
  data: Report[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  success: boolean;
  message: string;
}

export interface DashboardStatsResponse {
  data: {
    totalReports: number;
    generatedToday: number;
    scheduledReports: number;
    favoriteReports: number;
    downloadsToday: number;
    failedReports: number;
    pendingReports: number;
  };
  success: boolean;
}

export interface StatisticsResponse {
  data: {
    reportsByModule: { module: string; count: number }[];
    reportsByDay: { date: string; count: number }[];
    topDownloaded: Report[];
  };
  success: boolean;
}
