export type SessionStatus = 'Scheduled' | 'Running' | 'Completed' | 'Cancelled' | 'Postponed';
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Not Marked';
export type OmrStatus = 'Pending' | 'Scanned' | 'Processed' | 'Rejected' | 'Recheck';
export type EvaluationStatus = 'Pending' | 'In Progress' | 'Completed' | 'Reviewed';
export type InvigilatorDutyStatus = 'Assigned' | 'Present' | 'Absent' | 'Replaced';
export type MaterialStatus = 'Pending Distribution' | 'Distributed' | 'Returned' | 'Partial Return';

export interface OfflineExamStats {
  scheduledExams: number;
  runningExams: number;
  completedExams: number;
  presentCandidates: number;
  absentCandidates: number;
  omrPending: number;
  omrProcessed: number;
  evaluationPending: number;
}

export interface OfflineSession {
  id: string;
  sessionCode: string;
  exam: string;
  subject: string;
  center: string;

  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  status: SessionStatus;
  totalCandidates: number;
  presentCount: number;
  roomCount: number;
  invigilatorCount: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  candidateName: string;
  rollNumber: string;
  applicationNumber: string;
  room: string;
  seatNumber: string;
  status: AttendanceStatus;
  markedAt?: string;
  markedBy?: string;
}

export interface SeatAllocation {
  id: string;
  sessionId: string;
  building: string;
  floor: string;
  room: string;
  benchNumber: number;
  seatNumber: string;
  candidateName: string;
  rollNumber: string;
  isOccupied: boolean;
}

export interface Invigilator {
  id: string;
  name: string;
  employeeId: string;
  designation: string;
  sessionId: string;
  room: string;
  dutyStatus: InvigilatorDutyStatus;
  reportTime: string;
}

export interface ExamMaterial {
  id: string;
  sessionId: string;
  materialType: 'Question Paper' | 'Answer Booklet' | 'OMR Sheet' | 'Rough Sheet';
  totalQuantity: number;
  distributedQuantity: number;
  returnedQuantity: number;
  status: MaterialStatus;
}

export interface OmrBatch {
  id: string;
  batchCode: string;
  sessionId: string;
  exam: string;
  totalSheets: number;
  pendingSheets: number;
  processedSheets: number;
  rejectedSheets: number;
  status: OmrStatus;
  uploadedAt?: string;
  processedAt?: string;
}

export interface EvaluationSheet {
  id: string;
  sessionId: string;
  candidateName: string;
  rollNumber: string;
  subject: string;
  evaluatorName: string;
  marksObtained?: number;
  maxMarks: number;
  status: EvaluationStatus;
  evaluatedAt?: string;
}

export interface OfflineResult {
  id: string;
  sessionId: string;
  candidateName: string;
  rollNumber: string;
  exam: string;
  subject: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  result: 'Pass' | 'Fail' | 'Absent' | 'Withheld';
}
