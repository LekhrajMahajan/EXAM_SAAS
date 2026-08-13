import type { AuditStatistics, AuditRecord, ApiLog, TimelineEvent, SecurityEvent } from '../types';

export const DUMMY_AUDIT_STATS: AuditStatistics = {
  totalLogs: 1245890,
  todayEvents: 14502,
  failedLogins: 142,
  securityIncidents: 12,
  apiRequests: 89045,
  examEvents: 4520,
  systemEvents: 85,
};

export const DUMMY_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-25 09:14:22',
    userName: 'Jane Doe',
    role: 'Admin',
    module: 'Authentication',
    action: 'Login',
    description: 'User successfully logged in',
    status: 'Success',
    severity: 'Low',
    ipAddress: '192.168.1.105',
    device: 'Desktop',
    browser: 'Chrome 118',
    os: 'Windows 11'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-25 09:20:11',
    userName: 'John Smith',
    role: 'Candidate',
    module: 'Authentication',
    action: 'Failed Login',
    description: 'Invalid password attempt',
    status: 'Failure',
    severity: 'Medium',
    ipAddress: '203.0.113.45',
    device: 'Mobile',
    browser: 'Safari 17',
    os: 'iOS 17'
  },
  {
    id: 'AUD-003',
    timestamp: '2026-10-25 09:35:00',
    userName: 'System Admin',
    role: 'Super Admin',
    module: 'Security',
    action: 'Role Permission Changed',
    description: 'Added "Manage Exams" permission to "Invigilator" role',
    status: 'Success',
    severity: 'High',
    ipAddress: '10.0.0.5',
    device: 'Desktop',
    browser: 'Firefox 119',
    os: 'macOS Sonoma'
  },
  {
    id: 'AUD-004',
    timestamp: '2026-10-25 10:00:00',
    userName: 'Exam Coordinator',
    role: 'Staff',
    module: 'Exam',
    action: 'Exam Published',
    description: 'Published "Midterm Biology 101"',
    status: 'Success',
    severity: 'Medium',
    ipAddress: '192.168.1.200',
    device: 'Desktop',
    browser: 'Edge 118',
    os: 'Windows 10'
  },
  {
    id: 'AUD-005',
    timestamp: '2026-10-25 10:15:33',
    userName: 'Unknown',
    role: 'None',
    module: 'API',
    action: 'Rate Limit Exceeded',
    description: 'Multiple failed requests to /api/auth/login',
    status: 'Warning',
    severity: 'High',
    ipAddress: '45.33.22.11',
    device: 'Unknown',
    browser: 'Unknown',
    os: 'Linux'
  }
];

export const DUMMY_API_LOGS: ApiLog[] = [
  {
    id: 'API-1001',
    timestamp: '2026-10-25 10:00:01.123',
    endpoint: '/api/v1/exams',
    method: 'GET',
    responseStatus: 200,
    executionTimeMs: 45,
    requestSizeKb: 1.2,
    responseSizeKb: 45.6,
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...'
  },
  {
    id: 'API-1002',
    timestamp: '2026-10-25 10:00:02.456',
    endpoint: '/api/v1/candidates/123/results',
    method: 'POST',
    responseStatus: 201,
    executionTimeMs: 120,
    requestSizeKb: 5.4,
    responseSizeKb: 0.8,
    ipAddress: '192.168.1.105',
    userAgent: 'PostmanRuntime/7.32.3'
  },
  {
    id: 'API-1003',
    timestamp: '2026-10-25 10:00:05.789',
    endpoint: '/api/v1/system/config',
    method: 'GET',
    responseStatus: 403,
    executionTimeMs: 12,
    requestSizeKb: 0.5,
    responseSizeKb: 0.2,
    ipAddress: '203.0.113.10',
    userAgent: 'Curl/8.1.2'
  }
];

export const DUMMY_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'SEC-001',
    timestamp: '2026-10-25 08:30:00',
    type: 'Multiple Failed Logins',
    user: 'admin@company.com',
    ipAddress: '45.33.22.11',
    description: '15 failed login attempts in 2 minutes',
    severity: 'High',
    status: 'Resolved'
  },
  {
    id: 'SEC-002',
    timestamp: '2026-10-25 10:15:00',
    type: 'Unauthorized API Access',
    user: 'Unknown',
    ipAddress: '104.22.33.44',
    description: 'Attempted to access /api/v1/admin/users without token',
    severity: 'Critical',
    status: 'Investigating'
  }
];

export const DUMMY_TIMELINE: TimelineEvent[] = [
  {
    id: 'TL-1',
    timestamp: '09:00 AM',
    title: 'System Startup',
    description: 'All services initialized successfully.',
    module: 'System',
    user: 'System',
    severity: 'Info'
  },
  {
    id: 'TL-2',
    timestamp: '09:15 AM',
    title: 'Exam Configuration Updated',
    description: 'Modified duration for "Q4 Assessment".',
    module: 'Exam',
    user: 'Jane Admin',
    severity: 'Low'
  },
  {
    id: 'TL-3',
    timestamp: '10:05 AM',
    title: 'Bulk Candidate Import',
    description: '500 candidates imported successfully.',
    module: 'User Management',
    user: 'John HR',
    severity: 'Medium'
  }
];
