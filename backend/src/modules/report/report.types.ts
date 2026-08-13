/*
|--------------------------------------------------------------------------
| Report Type
|--------------------------------------------------------------------------
*/

export enum ReportType {
  CANDIDATE = "CANDIDATE",

  EXAM = "EXAM",

  RESULT = "RESULT",

  ATTENDANCE = "ATTENDANCE",

  BIOMETRIC = "BIOMETRIC",

  CENTER = "CENTER",

  BRANCH = "BRANCH",

  COMPANY = "COMPANY",

  LIVE_MONITORING = "LIVE_MONITORING",

  ACTIVITY_LOG = "ACTIVITY_LOG",

  AUDIT_LOG = "AUDIT_LOG",

  TRUST_SCORE = "TRUST_SCORE",

  CERTIFICATE = "CERTIFICATE",

  CUSTOM = "CUSTOM",

  FINANCIAL = "FINANCIAL",

  SECURITY = "SECURITY",

  MASTER = "MASTER",
}

/*
|--------------------------------------------------------------------------
| Report Status
|--------------------------------------------------------------------------
*/

export enum ReportStatus {
  PENDING = "PENDING",

  PROCESSING = "PROCESSING",

  COMPLETED = "COMPLETED",

  FAILED = "FAILED",
}

/*
|--------------------------------------------------------------------------
| Report Format
|--------------------------------------------------------------------------
*/

export enum ReportFormat {
  PDF = "PDF",

  EXCEL = "EXCEL",

  CSV = "CSV",

  JSON = "JSON",
}

/*
|--------------------------------------------------------------------------
| Report Visibility
|--------------------------------------------------------------------------
*/

export enum ReportVisibility {
  PRIVATE = "PRIVATE",

  COMPANY = "COMPANY",

  PUBLIC = "PUBLIC",
}

/*
|--------------------------------------------------------------------------
| Report Filters
|--------------------------------------------------------------------------
*/

export interface IReportFilter {
  startDate?: Date;

  endDate?: Date;

  companyId?: string;

  branchId?: string;

  centerId?: string;

  examId?: string;

  candidateId?: string;

  employeeId?: string;

  status?: string;
}

/*
|--------------------------------------------------------------------------
| Generate Report
|--------------------------------------------------------------------------
*/

export interface IGenerateReport {
  reportType: ReportType;

  reportName: string;

  format: ReportFormat;

  visibility?: ReportVisibility;

  filters?: IReportFilter;

  metadata?: Record<string, unknown>;
}
