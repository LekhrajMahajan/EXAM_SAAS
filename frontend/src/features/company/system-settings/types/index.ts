export interface SettingsStatistics {
  totalSettings: number;
  activeIntegrations: number;
  configuredServices: number;
  pendingChanges: number;
}

export interface Integration {
  id: string;
  name: string;
  category: 'Payment' | 'SMS' | 'Email' | 'Storage';
  description: string;
  logo: string;
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  expiresAt: string;
  lastUsed: string;
  status: 'Active' | 'Revoked' | 'Expired';
}

export interface BackupRecord {
  id: string;
  type: 'Manual' | 'Automated';
  timestamp: string;
  size: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  initiatedBy: string;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  status: 'Enabled' | 'Disabled' | 'Beta';
  requiresRestart?: boolean;
}

export interface UpdateLog {
  id: string;
  setting: string;
  changedBy: string;
  timestamp: string;
}
