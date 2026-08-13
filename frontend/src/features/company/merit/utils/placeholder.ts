import type { MeritRecord, MeritStatistics, MeritHistoryRecord } from '../types';

export const DUMMY_MERIT_STATS: MeritStatistics = {
  totalMeritLists: 15,
  publishedMeritLists: 12,
  pendingMeritLists: 3,
  candidatesRanked: 14520,
  topRank: 1,
  lastRank: 14520,
  categoryMeritCount: {
    'General': 5000,
    'OBC': 4520,
    'SC': 3000,
    'ST': 2000
  }
};

export const DUMMY_MERIT_RECORDS: MeritRecord[] = [
  {
    id: 'MER-001',
    applicationNumber: 'APP-2026-001',
    candidateName: 'Jane Smith',
    exam: 'Spring Admissions Test 2026',
    subject: 'All Subjects',
    category: 'General',
    state: 'California',
    city: 'San Francisco',
    center: 'SF Test Center 1',
    shift: 'Morning',
    marksObtained: 295,
    totalMarks: 300,
    percentage: 98.33,
    ranks: {
      overallRank: 1,
      stateRank: 1,
      cityRank: 1,
      categoryRank: 1
    },
    status: 'Published',
    publishStatus: 'Published',
    generatedAt: '2026-08-20 10:00:00',
    publishedAt: '2026-08-21 09:00:00'
  },
  {
    id: 'MER-002',
    applicationNumber: 'APP-2026-045',
    candidateName: 'John Doe',
    exam: 'Spring Admissions Test 2026',
    subject: 'All Subjects',
    category: 'OBC',
    state: 'New York',
    city: 'New York City',
    center: 'NYC Test Center 3',
    shift: 'Morning',
    marksObtained: 288,
    totalMarks: 300,
    percentage: 96.00,
    ranks: {
      overallRank: 12,
      stateRank: 2,
      cityRank: 1,
      categoryRank: 1
    },
    status: 'Generated',
    publishStatus: 'Scheduled',
    generatedAt: '2026-08-20 10:00:00'
  },
  {
    id: 'MER-003',
    applicationNumber: 'APP-2026-102',
    candidateName: 'Alice Johnson',
    exam: 'Spring Admissions Test 2026',
    subject: 'All Subjects',
    category: 'SC',
    state: 'Texas',
    city: 'Austin',
    center: 'Austin Test Center',
    shift: 'Evening',
    marksObtained: 275,
    totalMarks: 300,
    percentage: 91.66,
    ranks: {
      overallRank: 45,
      stateRank: 5,
      cityRank: 2,
      categoryRank: 4
    },
    status: 'Generated',
    publishStatus: 'Draft',
    generatedAt: '2026-08-20 10:00:00'
  }
];

export const DUMMY_MERIT_HISTORY: MeritHistoryRecord[] = [
  {
    id: 'HIST-001',
    jobId: 'MERIT-JOB-1234',
    action: 'Generation',
    exam: 'Spring Admissions Test 2026',
    subject: 'All Subjects',
    category: 'All Categories',
    triggeredBy: 'Admin User',
    timestamp: '2026-08-20 10:00:00',
    status: 'Success',
    recordsProcessed: 14520
  },
  {
    id: 'HIST-002',
    jobId: 'MERIT-JOB-1235',
    action: 'Publishing',
    exam: 'Winter Eligibility Test 2025',
    subject: 'All Subjects',
    category: 'General',
    triggeredBy: 'System Auto',
    timestamp: '2026-01-25 08:00:00',
    status: 'Success',
    recordsProcessed: 5000
  }
];

export const DUMMY_CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
export const DUMMY_MERIT_TYPES = ['Overall', 'Category-wise', 'State-wise'];
export const DUMMY_TIE_BREAKERS = ['Subject 1 Score', 'Subject 2 Score', 'Age (Older preferred)', 'Application Date'];
export const DUMMY_EXAMS = ['Spring Admissions Test 2026', 'Winter Eligibility Test 2025', 'State Medical Entrance 2026'];
