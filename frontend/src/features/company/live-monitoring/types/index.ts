export type MonitorStatus = 'Online' | 'Offline' | 'Poor Connection';
export type CandidateStatus = 'Waiting' | 'Exam Started' | 'In Progress' | 'Submitted' | 'Disconnected' | 'Completed';
export type ViolationSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ViolationType = 'Tab Switch' | 'Fullscreen Exit' | 'Face Detection Failed' | 'Multiple Faces Detected' | 'Network Disconnect' | 'Suspicious Activity';

export interface LiveCandidate {
  id: string;
  applicationNumber: string;
  name: string;
  exam: string;
  center: string;
  room: string;
  seatNumber: string;
  photoUrl?: string;
  elapsedTime: string; // e.g. "01:25:30"
  connectionStatus: MonitorStatus;
  status: CandidateStatus;
  cameraStatus: boolean;
  microphoneStatus: boolean;
  fullscreenStatus: boolean;
  warningCount: number;
}

export interface LiveCenter {
  id: string;
  name: string;
  activeCandidates: number;
  completedCandidates: number;
  networkHealth: number; // 0-100 percentage
  deviceHealth: number; // 0-100 percentage
  status: MonitorStatus;
}

export interface LiveObserver {
  id: string;
  name: string;
  assignedCenter: string;
  assignedCandidatesCount: number;
  status: MonitorStatus;
  incidentReportsCount: number;
}

export interface ViolationRecord {
  id: string;
  candidateName: string;
  applicationNumber: string;
  type: ViolationType;
  timestamp: string;
  severity: ViolationSeverity;
  status: 'Unresolved' | 'Resolved' | 'Ignored';
  center: string;
}

export interface ActivityLogRecord {
  id: string;
  candidateName: string;
  action: string;
  timestamp: string;
  severity: 'Info' | 'Warning' | 'Error';
  remarks: string;
}

export interface MonitoringStats {
  activeExams: number;
  activeCandidates: number;
  completedCandidates: number;
  disconnectedCandidates: number;
  violations: number;
  onlineCenters: number;
  offlineCenters: number;
  observersOnline: number;
}
