import type { SettingsStatistics, Integration, ApiKey, BackupRecord, FeatureFlag, UpdateLog } from '../types';

export const DUMMY_SETTINGS_STATS: SettingsStatistics = {
  totalSettings: 124,
  activeIntegrations: 4,
  configuredServices: 12,
  pendingChanges: 0,
};

export const DUMMY_INTEGRATIONS: Integration[] = [
  {
    id: 'INT-001',
    name: 'Stripe',
    category: 'Payment',
    description: 'Process exam registration fees and bulk payments securely.',
    logo: 'https://placehold.co/100x100/e2e8f0/475569?text=Stripe',
    status: 'Connected',
    lastSync: '2026-08-01 10:00 AM'
  },
  {
    id: 'INT-002',
    name: 'Twilio',
    category: 'SMS',
    description: 'Send OTPs and exam reminders via SMS globally.',
    logo: 'https://placehold.co/100x100/e2e8f0/475569?text=Twilio',
    status: 'Disconnected'
  },
  {
    id: 'INT-003',
    name: 'AWS S3',
    category: 'Storage',
    description: 'Cloud storage for candidate documents and system backups.',
    logo: 'https://placehold.co/100x100/e2e8f0/475569?text=AWS',
    status: 'Connected',
    lastSync: '2026-08-01 11:30 AM'
  },
  {
    id: 'INT-004',
    name: 'SendGrid',
    category: 'Email',
    description: 'High deliverability transactional email service.',
    logo: 'https://placehold.co/100x100/e2e8f0/475569?text=SendGrid',
    status: 'Error',
    lastSync: '2026-07-29 09:15 AM'
  }
];

export const DUMMY_API_KEYS: ApiKey[] = [
  {
    id: 'KEY-001',
    name: 'Mobile App Sync',
    prefix: 'pk_live_8f92...',
    createdAt: '2026-01-15',
    expiresAt: '2027-01-15',
    lastUsed: '2026-08-02 08:30 AM',
    status: 'Active'
  },
  {
    id: 'KEY-002',
    name: 'Legacy Partner Portal',
    prefix: 'pk_test_a1b2...',
    createdAt: '2025-06-10',
    expiresAt: '2026-06-10',
    lastUsed: '2026-06-09 11:00 AM',
    status: 'Expired'
  },
  {
    id: 'KEY-003',
    name: 'BI Dashboard Reader',
    prefix: 'sk_live_99zx...',
    createdAt: '2026-07-20',
    expiresAt: 'Never',
    lastUsed: '2026-08-02 12:45 PM',
    status: 'Active'
  }
];

export const DUMMY_BACKUPS: BackupRecord[] = [
  {
    id: 'BAK-1092',
    type: 'Automated',
    timestamp: '2026-08-02 02:00 AM',
    size: '14.2 GB',
    status: 'Completed',
    initiatedBy: 'System'
  },
  {
    id: 'BAK-1091',
    type: 'Manual',
    timestamp: '2026-08-01 14:30 PM',
    size: '14.1 GB',
    status: 'Completed',
    initiatedBy: 'John Doe (Admin)'
  },
  {
    id: 'BAK-1090',
    type: 'Automated',
    timestamp: '2026-08-01 02:00 AM',
    size: '14.0 GB',
    status: 'Failed',
    initiatedBy: 'System'
  }
];

export const DUMMY_FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'FF-001',
    name: 'AI Proctoring v2',
    description: 'Enable the new machine learning model for detecting suspicious behavior in exams.',
    status: 'Beta'
  },
  {
    id: 'FF-002',
    name: 'Dark Mode (Admin Panel)',
    description: 'Allow administrators to toggle dark mode in the dashboard.',
    status: 'Enabled'
  },
  {
    id: 'FF-003',
    name: 'Legacy Result Processing',
    description: 'Use the old algorithm for calculating percentiles (Deprecation pending).',
    status: 'Disabled',
    requiresRestart: true
  }
];

export const DUMMY_RECENT_UPDATES: UpdateLog[] = [
  { id: 'LOG-1', setting: 'Password Policy (Min Length)', changedBy: 'Admin Team', timestamp: '2 hours ago' },
  { id: 'LOG-2', setting: 'Stripe API Key', changedBy: 'Finance Dept', timestamp: 'Yesterday' },
  { id: 'LOG-3', setting: 'AI Proctoring Flag', changedBy: 'System Auto', timestamp: '3 days ago' },
];
