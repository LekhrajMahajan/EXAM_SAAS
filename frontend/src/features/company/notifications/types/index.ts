export interface NotificationStatistics {
  totalNotifications: number;
  unreadNotifications: number;
  scheduledNotifications: number;
  deliveredNotifications: number;
  failedNotifications: number;
}

export type DeliveryMethod = 'In-App' | 'Email' | 'SMS' | 'Push';
export type NotificationPriority = 'Low' | 'Normal' | 'High' | 'Urgent';
export type NotificationStatus = 'Delivered' | 'Pending' | 'Failed' | 'Scheduled' | 'Draft';
export type NotificationCategory = 'System' | 'Exam' | 'Result' | 'Marketing' | 'Alert';

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  priority: NotificationPriority;
  category: NotificationCategory;
  audience: string;
  status: NotificationStatus;
  methods: DeliveryMethod[];
  createdBy: string;
  createdDate: string;
  scheduledFor?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
  priority: NotificationPriority;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  method: DeliveryMethod;
  subject?: string;
  bodyPreview: string;
  variables: string[];
  lastUpdated: string;
}

export interface PreferenceSettings {
  examAlerts: boolean;
  resultUpdates: boolean;
  marketingEmails: boolean;
  systemAnnouncements: boolean;
}
