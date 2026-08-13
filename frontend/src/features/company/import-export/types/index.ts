export type DataModule = 'Candidates' | 'Employees' | 'Subjects' | 'QuestionBank' | 'MeritList' | 'Results' | 'Centers';
export type JobStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Partial Success';
export type JobType = 'Import' | 'Export';
export type ExportFormat = 'CSV' | 'Excel' | 'JSON' | 'PDF';

export interface ImportExportStatistics {
  totalImports: number;
  totalExports: number;
  successfulImports: number;
  failedImports: number;
  pendingJobs: number;
  completedJobs: number;
}

export interface ImportExportJob {
  id: string;
  type: JobType;
  module: DataModule;
  fileName: string;
  status: JobStatus;
  progress: number;
  totalRecords: number;
  processedRecords: number;
  successRecords: number;
  errorRecords: number;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  format?: ExportFormat;
}

export interface ErrorRecord {
  id: string;
  jobId: string;
  rowNumber: number;
  data: string;
  errorType: 'Validation' | 'Duplicate' | 'Missing Field' | 'Invalid Format';
  errorMessage: string;
}

export interface FieldMapping {
  sourceField: string;
  destinationField: string;
  isMapped: boolean;
  isRequired: boolean;
}

export interface TemplateConfig {
  id: string;
  module: DataModule;
  name: string;
  description: string;
  format: 'CSV' | 'Excel';
  requiredFields: string[];
}
