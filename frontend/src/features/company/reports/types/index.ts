export interface ReportStatistics {
  totalReports: number;
  generatedReports: number;
  scheduledReports: number;
  downloadedReports: number;
}

export type ReportCategory = 'Exam' | 'Candidate' | 'Attendance' | 'Result' | 'Merit' | 'Center' | 'Revenue' | 'Audit';

export interface ReportRecord {
  id: string;
  name: string;
  category: ReportCategory;
  description: string;
  lastGenerated?: string;
  format: 'PDF' | 'Excel' | 'CSV' | 'Multiple';
  status: 'Ready' | 'Generating' | 'Failed';
}

export interface ScheduledReport {
  id: string;
  reportName: string;
  category: ReportCategory;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';
  nextRun: string;
  recipients: string[];
  format: 'PDF' | 'Excel' | 'CSV';
  status: 'Active' | 'Paused';
}

export interface ReportHistoryRecord {
  id: string;
  reportName: string;
  action: 'Generated' | 'Downloaded' | 'Scheduled Run';
  triggeredBy: string;
  timestamp: string;
  status: 'Success' | 'Failed';
  details?: string;
}

export interface FilterOptions {
  dateRange: { start: string; end: string } | null;
  exam: string;
  subject: string;
  branch: string;
  center: string;
  shift: string;
  candidateCategory: string;
  status: string;
}
