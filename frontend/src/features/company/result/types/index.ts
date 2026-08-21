export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F' | 'N/A';
export type ResultStatus = 'Pending' | 'Generated' | 'Failed' | 'Published' | 'Withheld';
export type PublishStatus = 'Draft' | 'Scheduled' | 'Published';

export interface CandidateResult {
  id: string;
  applicationNumber: string;
  candidateName: string;
  exam: string;
  examObj?: any;
  subject: string;
  shift: string;
  center: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: Grade;
  rank?: number;
  status: ResultStatus;
  publishStatus: PublishStatus;
  remarks?: string;
  generatedAt?: string;
  publishedAt?: string;
}

export interface ResultStatistics {
  totalResults: number;
  publishedResults: number;
  pendingResults: number;
  failedResults: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
}

export interface ResultHistoryRecord {
  id: string;
  jobId: string;
  action: 'Generation' | 'Publishing';
  exam: string;
  subject: string;
  triggeredBy: string;
  timestamp: string;
  status: 'Success' | 'In Progress' | 'Failed';
  recordsProcessed: number;
}
