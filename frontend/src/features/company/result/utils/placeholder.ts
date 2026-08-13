import type { CandidateResult, ResultStatistics, ResultHistoryRecord } from '../types';

export const DUMMY_RESULT_STATS: ResultStatistics = {
  totalResults: 15420,
  publishedResults: 12100,
  pendingResults: 3300,
  failedResults: 20,
  averageScore: 68.5,
  highestScore: 99.2,
  lowestScore: 12.0,
  passPercentage: 82.4
};

export const DUMMY_CANDIDATE_RESULTS: CandidateResult[] = [
  {
    id: 'RES-001',
    applicationNumber: 'APP-2026-001',
    candidateName: 'John Doe',
    exam: 'Spring Admissions Test 2026',
    subject: 'General Knowledge',
    shift: 'Morning',
    center: 'New York City Test Center',
    marksObtained: 85,
    totalMarks: 100,
    percentage: 85.0,
    grade: 'A',
    rank: 145,
    status: 'Generated',
    publishStatus: 'Draft',
    generatedAt: '2026-08-16 14:30:00'
  },
  {
    id: 'RES-002',
    applicationNumber: 'APP-2026-045',
    candidateName: 'Jane Smith',
    exam: 'Spring Admissions Test 2026',
    subject: 'General Knowledge',
    shift: 'Morning',
    center: 'New York City Test Center',
    marksObtained: 92,
    totalMarks: 100,
    percentage: 92.0,
    grade: 'A+',
    rank: 12,
    status: 'Published',
    publishStatus: 'Published',
    generatedAt: '2026-08-16 14:30:00',
    publishedAt: '2026-08-17 10:00:00'
  },
  {
    id: 'RES-003',
    applicationNumber: 'APP-2026-102',
    candidateName: 'Alice Johnson',
    exam: 'Spring Admissions Test 2026',
    subject: 'General Knowledge',
    shift: 'Evening',
    center: 'Boston Test Center',
    marksObtained: 35,
    totalMarks: 100,
    percentage: 35.0,
    grade: 'F',
    status: 'Generated',
    publishStatus: 'Scheduled',
    remarks: 'Failed to meet minimum passing criteria.',
    generatedAt: '2026-08-16 15:00:00'
  }
];

export const DUMMY_RESULT_HISTORY: ResultHistoryRecord[] = [
  {
    id: 'HIST-001',
    jobId: 'JOB-9921',
    action: 'Generation',
    exam: 'Spring Admissions Test 2026',
    subject: 'General Knowledge',
    triggeredBy: 'Admin User',
    timestamp: '2026-08-16 14:30:00',
    status: 'Success',
    recordsProcessed: 5420
  },
  {
    id: 'HIST-002',
    jobId: 'JOB-9922',
    action: 'Publishing',
    exam: 'Winter Eligibility Test 2025',
    subject: 'All Subjects',
    triggeredBy: 'System Auto',
    timestamp: '2026-01-20 08:00:00',
    status: 'Success',
    recordsProcessed: 12000
  }
];

// Reusable mock options for selects
export const DUMMY_EXAMS = [
  'Spring Admissions Test 2026',
  'Winter Eligibility Test 2025',
  'Medical Entrance Mock'
];

export const DUMMY_SUBJECTS = [
  'General Knowledge',
  'Mathematics',
  'Physics',
  'Chemistry'
];

export const DUMMY_SHIFTS = [
  'Morning',
  'Afternoon',
  'Evening'
];
