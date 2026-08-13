import type { ImportExportStatistics, ImportExportJob, ErrorRecord, FieldMapping, TemplateConfig } from '../types';

export const DUMMY_STATS: ImportExportStatistics = {
  totalImports: 1450,
  totalExports: 820,
  successfulImports: 1390,
  failedImports: 60,
  pendingJobs: 3,
  completedJobs: 2267,
};

export const DUMMY_JOBS: ImportExportJob[] = [
  {
    id: 'JOB-9001',
    type: 'Import',
    module: 'Candidates',
    fileName: 'batch_2026_candidates.csv',
    status: 'Processing',
    progress: 45,
    totalRecords: 10000,
    processedRecords: 4500,
    successRecords: 4480,
    errorRecords: 20,
    createdBy: 'Admin User',
    createdAt: '2026-10-25 10:00:00',
  },
  {
    id: 'JOB-9002',
    type: 'Export',
    module: 'Results',
    fileName: 'Q3_Exam_Results.pdf',
    status: 'Pending',
    progress: 0,
    totalRecords: 5000,
    processedRecords: 0,
    successRecords: 0,
    errorRecords: 0,
    createdBy: 'Exam Controller',
    createdAt: '2026-10-25 10:15:00',
    format: 'PDF',
  },
  {
    id: 'JOB-8999',
    type: 'Import',
    module: 'QuestionBank',
    fileName: 'math_questions_v2.xlsx',
    status: 'Completed',
    progress: 100,
    totalRecords: 500,
    processedRecords: 500,
    successRecords: 500,
    errorRecords: 0,
    createdBy: 'SME Math',
    createdAt: '2026-10-24 14:00:00',
    completedAt: '2026-10-24 14:05:00',
  },
  {
    id: 'JOB-8998',
    type: 'Import',
    module: 'Employees',
    fileName: 'new_hires_oct.csv',
    status: 'Partial Success',
    progress: 100,
    totalRecords: 50,
    processedRecords: 50,
    successRecords: 45,
    errorRecords: 5,
    createdBy: 'HR Admin',
    createdAt: '2026-10-24 11:00:00',
    completedAt: '2026-10-24 11:01:00',
  },
  {
    id: 'JOB-8997',
    type: 'Export',
    module: 'MeritList',
    fileName: 'final_merit_list.xlsx',
    status: 'Completed',
    progress: 100,
    totalRecords: 1200,
    processedRecords: 1200,
    successRecords: 1200,
    errorRecords: 0,
    createdBy: 'System',
    createdAt: '2026-10-23 18:00:00',
    completedAt: '2026-10-23 18:02:00',
    format: 'Excel',
  },
  {
    id: 'JOB-8996',
    type: 'Import',
    module: 'Centers',
    fileName: 'center_capacity_update.csv',
    status: 'Failed',
    progress: 15,
    totalRecords: 200,
    processedRecords: 30,
    successRecords: 0,
    errorRecords: 30,
    createdBy: 'Admin User',
    createdAt: '2026-10-23 15:00:00',
    completedAt: '2026-10-23 15:00:10',
  }
];

export const DUMMY_ERRORS: ErrorRecord[] = [
  {
    id: 'ERR-1',
    jobId: 'JOB-8998',
    rowNumber: 12,
    data: 'John Doe, john@test, +12345',
    errorType: 'Validation',
    errorMessage: 'Invalid email format provided.',
  },
  {
    id: 'ERR-2',
    jobId: 'JOB-8998',
    rowNumber: 25,
    data: 'Jane Smith, jane@example.com, ',
    errorType: 'Missing Field',
    errorMessage: 'Phone number is required.',
  },
  {
    id: 'ERR-3',
    jobId: 'JOB-8996',
    rowNumber: 2,
    data: 'Center A, New York, 500A',
    errorType: 'Invalid Format',
    errorMessage: 'Capacity must be a valid integer.',
  },
  {
    id: 'ERR-4',
    jobId: 'JOB-8996',
    rowNumber: 3,
    data: 'Center B, Boston, 200',
    errorType: 'Duplicate',
    errorMessage: 'Center code already exists in the system.',
  }
];

export const DUMMY_MAPPINGS: FieldMapping[] = [
  { sourceField: 'first_name', destinationField: 'firstName', isMapped: true, isRequired: true },
  { sourceField: 'last_name', destinationField: 'lastName', isMapped: true, isRequired: true },
  { sourceField: 'email_address', destinationField: 'email', isMapped: true, isRequired: true },
  { sourceField: 'phone_num', destinationField: 'phone', isMapped: true, isRequired: false },
  { sourceField: 'dob', destinationField: 'dateOfBirth', isMapped: true, isRequired: false },
  { sourceField: 'addr_line1', destinationField: '', isMapped: false, isRequired: false },
];

export const DUMMY_TEMPLATES: TemplateConfig[] = [
  {
    id: 'TPL-1',
    module: 'Candidates',
    name: 'Bulk Candidate Import',
    description: 'Template for uploading large batches of new candidates.',
    format: 'CSV',
    requiredFields: ['firstName', 'lastName', 'email', 'mobile']
  },
  {
    id: 'TPL-2',
    module: 'QuestionBank',
    name: 'MCQ Import Template',
    description: 'Excel template for multiple choice questions with options and correct answers.',
    format: 'Excel',
    requiredFields: ['questionText', 'optionA', 'optionB', 'optionC', 'optionD', 'correctOption']
  },
  {
    id: 'TPL-3',
    module: 'Centers',
    name: 'Center Capacity Update',
    description: 'Template to update physical exam centers and their seating capacity.',
    format: 'CSV',
    requiredFields: ['centerCode', 'capacity']
  }
];
