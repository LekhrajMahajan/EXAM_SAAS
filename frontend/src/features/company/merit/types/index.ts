export type MeritStatus = 'Generated' | 'Draft' | 'Published' | 'Withheld';
export type PublishStatus = 'Draft' | 'Scheduled' | 'Published';

export interface RankInfo {
  overallRank: number;
  categoryRank?: number;
  stateRank?: number;
  cityRank?: number;
}

export interface MeritRecord {
  id: string;
  applicationNumber: string;
  candidateName: string;
  exam: string;
  subject: string;
  category: string;
  state: string;
  city: string;
  center: string;
  shift: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  ranks: RankInfo;
  status: MeritStatus;
  publishStatus: PublishStatus;
  remarks?: string;
  generatedAt?: string;
  publishedAt?: string;
}

export interface MeritStatistics {
  totalMeritLists: number;
  publishedMeritLists: number;
  pendingMeritLists: number;
  candidatesRanked: number;
  topRank: number;
  lastRank: number;
  categoryMeritCount: Record<string, number>;
}

export interface MeritHistoryRecord {
  id: string;
  jobId: string;
  action: 'Generation' | 'Publishing';
  exam: string;
  subject: string;
  category: string;
  triggeredBy: string;
  timestamp: string;
  status: 'Success' | 'In Progress' | 'Failed';
  recordsProcessed: number;
}
