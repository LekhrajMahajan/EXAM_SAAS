export interface AuditStatistics {
  totalLogs: number;
  todayEvents: number;
  failedLogins: number;
  securityIncidents: number;
  apiRequests: number;
  examEvents: number;
  systemEvents: number;
}

export type AuditSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AuditStatus = 'Success' | 'Failure' | 'Warning' | 'Info';
export type AuditModule = 'Authentication' | 'Security' | 'Exam' | 'Result' | 'System' | 'API' | 'User Management';

export interface AuditRecord {
  id: string;
  timestamp: string;
  userName: string;
  role: string;
  module: AuditModule;
  action: string;
  description: string;
  status: AuditStatus;
  severity: AuditSeverity;
  ipAddress: string;
  device: string;
  browser: string;
  os: string;
}

export interface ApiLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  responseStatus: number;
  executionTimeMs: number;
  requestSizeKb: number;
  responseSizeKb: number;
  ipAddress: string;
  userAgent: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  module: AuditModule;
  user: string;
  severity: AuditSeverity;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  user: string;
  ipAddress: string;
  description: string;
  severity: 'High' | 'Critical';
  status: 'Resolved' | 'Investigating' | 'Open';
}
