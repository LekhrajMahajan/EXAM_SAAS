import type { 
  LiveCandidate, 
  LiveCenter, 
  LiveObserver, 
  ViolationRecord, 
  ActivityLogRecord, 
  MonitoringStats 
} from '../types';

export const DUMMY_MONITORING_STATS: MonitoringStats = {
  activeExams: 3,
  activeCandidates: 1450,
  completedCandidates: 320,
  disconnectedCandidates: 15,
  violations: 42,
  onlineCenters: 24,
  offlineCenters: 1,
  observersOnline: 48
};

export const DUMMY_LIVE_CANDIDATES: LiveCandidate[] = [
  {
    id: 'CAND-001',
    applicationNumber: 'APP-2026-001',
    name: 'John Doe',
    exam: 'Spring Admissions Test 2026',
    center: 'New York City Test Center',
    room: 'Hall A',
    seatNumber: '45',
    elapsedTime: '01:25:30',
    connectionStatus: 'Online',
    status: 'In Progress',
    cameraStatus: true,
    microphoneStatus: true,
    fullscreenStatus: true,
    warningCount: 0
  },
  {
    id: 'CAND-002',
    applicationNumber: 'APP-2026-045',
    name: 'Jane Smith',
    exam: 'Spring Admissions Test 2026',
    center: 'New York City Test Center',
    room: 'Hall B',
    seatNumber: '12',
    elapsedTime: '00:45:10',
    connectionStatus: 'Poor Connection',
    status: 'In Progress',
    cameraStatus: true,
    microphoneStatus: false,
    fullscreenStatus: true,
    warningCount: 1
  },
  {
    id: 'CAND-003',
    applicationNumber: 'APP-2026-102',
    name: 'Alice Johnson',
    exam: 'Spring Admissions Test 2026',
    center: 'Boston Test Center',
    room: 'Lab 1',
    seatNumber: '05',
    elapsedTime: '01:30:00',
    connectionStatus: 'Offline',
    status: 'Disconnected',
    cameraStatus: false,
    microphoneStatus: false,
    fullscreenStatus: false,
    warningCount: 3
  }
];

export const DUMMY_LIVE_CENTERS: LiveCenter[] = [
  {
    id: 'CTR-001',
    name: 'New York City Test Center',
    activeCandidates: 450,
    completedCandidates: 120,
    networkHealth: 98,
    deviceHealth: 100,
    status: 'Online'
  },
  {
    id: 'CTR-002',
    name: 'Boston Test Center',
    activeCandidates: 300,
    completedCandidates: 80,
    networkHealth: 75,
    deviceHealth: 95,
    status: 'Poor Connection'
  },
  {
    id: 'CTR-003',
    name: 'Chicago Test Center',
    activeCandidates: 0,
    completedCandidates: 0,
    networkHealth: 0,
    deviceHealth: 0,
    status: 'Offline'
  }
];

export const DUMMY_LIVE_OBSERVERS: LiveObserver[] = [
  {
    id: 'OBS-001',
    name: 'Robert Proctor',
    assignedCenter: 'New York City Test Center',
    assignedCandidatesCount: 50,
    status: 'Online',
    incidentReportsCount: 2
  },
  {
    id: 'OBS-002',
    name: 'Sarah Watcher',
    assignedCenter: 'Boston Test Center',
    assignedCandidatesCount: 45,
    status: 'Online',
    incidentReportsCount: 0
  }
];

export const DUMMY_VIOLATIONS: ViolationRecord[] = [
  {
    id: 'VIO-001',
    candidateName: 'Alice Johnson',
    applicationNumber: 'APP-2026-102',
    type: 'Tab Switch',
    timestamp: '2026-08-15 09:45:12',
    severity: 'Medium',
    status: 'Unresolved',
    center: 'Boston Test Center'
  },
  {
    id: 'VIO-002',
    candidateName: 'John Doe',
    applicationNumber: 'APP-2026-001',
    type: 'Multiple Faces Detected',
    timestamp: '2026-08-15 10:05:30',
    severity: 'Critical',
    status: 'Resolved',
    center: 'New York City Test Center'
  }
];

export const DUMMY_ACTIVITY_LOGS: ActivityLogRecord[] = [
  {
    id: 'LOG-001',
    candidateName: 'Jane Smith',
    action: 'Microphone disconnected',
    timestamp: '2026-08-15 09:30:00',
    severity: 'Warning',
    remarks: 'Audio stream lost'
  },
  {
    id: 'LOG-002',
    candidateName: 'John Doe',
    action: 'Started Exam',
    timestamp: '2026-08-15 09:00:00',
    severity: 'Info',
    remarks: 'Candidate successfully authenticated'
  }
];
