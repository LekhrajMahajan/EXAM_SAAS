import type { ReportStatistics, ReportRecord, ScheduledReport, ReportHistoryRecord } from '../types';

export const DUMMY_REPORT_STATS: ReportStatistics = {
  totalReports: 145,
  generatedReports: 890,
  scheduledReports: 12,
  downloadedReports: 1250,
};

export const DUMMY_REPORTS: ReportRecord[] = [
  {
    id: 'REP-001',
    name: 'Overall Exam Performance Summary',
    category: 'Exam',
    description: 'High-level aggregate performance metrics across all candidates for a specific exam.',
    lastGenerated: '2026-08-01 10:00 AM',
    format: 'Multiple',
    status: 'Ready'
  },
  {
    id: 'REP-002',
    name: 'Candidate Demographics',
    category: 'Candidate',
    description: 'Breakdown of candidates by state, category, age group, and gender.',
    lastGenerated: '2026-07-28 02:30 PM',
    format: 'Excel',
    status: 'Ready'
  },
  {
    id: 'REP-003',
    name: 'Center Attendance Log',
    category: 'Attendance',
    description: 'Detailed attendance records, including biometric verification statuses per center.',
    lastGenerated: '2026-08-05 08:45 AM',
    format: 'PDF',
    status: 'Ready'
  },
  {
    id: 'REP-004',
    name: 'Merit List Export',
    category: 'Merit',
    description: 'Official generated merit list rankings with category-wise cutoffs.',
    format: 'Excel',
    status: 'Generating'
  }
];

export const DUMMY_SCHEDULED_REPORTS: ScheduledReport[] = [
  {
    id: 'SCH-001',
    reportName: 'Weekly Attendance Summary',
    category: 'Attendance',
    frequency: 'Weekly',
    nextRun: '2026-08-10 00:00 AM',
    recipients: ['admin@company.com', 'hr@company.com'],
    format: 'PDF',
    status: 'Active'
  },
  {
    id: 'SCH-002',
    reportName: 'Monthly Revenue Reconciliation',
    category: 'Revenue',
    frequency: 'Monthly',
    nextRun: '2026-09-01 00:00 AM',
    recipients: ['finance@company.com'],
    format: 'Excel',
    status: 'Active'
  }
];

export const DUMMY_REPORT_HISTORY: ReportHistoryRecord[] = [
  {
    id: 'HIST-R-001',
    reportName: 'Candidate Demographics',
    action: 'Generated',
    triggeredBy: 'John Doe (Admin)',
    timestamp: '2026-08-05 09:12 AM',
    status: 'Success'
  },
  {
    id: 'HIST-R-002',
    reportName: 'Center Attendance Log',
    action: 'Scheduled Run',
    triggeredBy: 'System',
    timestamp: '2026-08-05 00:00 AM',
    status: 'Success'
  },
  {
    id: 'HIST-R-003',
    reportName: 'Overall Exam Performance Summary',
    action: 'Downloaded',
    triggeredBy: 'Jane Smith (Manager)',
    timestamp: '2026-08-04 14:30 PM',
    status: 'Success'
  }
];

export const DUMMY_EXAMS = ['Spring Admissions Test 2026', 'Winter Eligibility Test 2025'];
export const DUMMY_CENTERS = ['SF Test Center 1', 'NYC Test Center 3', 'Austin Test Center'];
