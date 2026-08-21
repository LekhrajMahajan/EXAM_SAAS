import type { NotificationStatistics, NotificationRecord, Announcement, NotificationTemplate } from '../types';

export const DUMMY_NOTIF_STATS: NotificationStatistics = {
  totalNotifications: 15420,
  unreadNotifications: 842,
  scheduledNotifications: 15,
  deliveredNotifications: 14500,
  failedNotifications: 63,
};

export const DUMMY_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'NOTIF-101',
    title: 'Server Maintenance Scheduled',
    description: 'The platform will be down for maintenance this Saturday from 2 AM to 4 AM UTC.',
    priority: 'Urgent',
    category: 'System',
    audience: 'All Users',
    status: 'Delivered',
    methods: ['In-App', 'Email'],
    createdBy: 'Admin System',
    createdDate: '2026-08-01 10:00 AM'
  },
  {
    id: 'NOTIF-102',
    title: 'UPSC Prelims Results Published',
    description: 'The results for the UPSC Prelims Mock Test 4 have been published to your dashboard.',
    priority: 'High',
    category: 'Result',
    audience: 'Candidates (UPSC Batch)',
    status: 'Delivered',
    methods: ['In-App', 'Email', 'Push'],
    createdBy: 'Exam Coordinator',
    createdDate: '2026-08-02 11:30 AM'
  },
  {
    id: 'NOTIF-103',
    title: 'OTP for Verification',
    description: 'Your OTP is 492011. Valid for 5 minutes.',
    priority: 'High',
    category: 'System',
    audience: 'John Doe',
    status: 'Failed',
    methods: ['SMS'],
    createdBy: 'Auth System',
    createdDate: '2026-08-02 02:15 PM'
  },
  {
    id: 'NOTIF-104',
    title: 'Admit Cards Available',
    description: 'Please download your admit card for the upcoming Midterms.',
    priority: 'Normal',
    category: 'Exam',
    audience: 'Specific Centers (Mumbai)',
    status: 'Scheduled',
    methods: ['In-App', 'Email', 'SMS'],
    createdBy: 'Registrar Office',
    createdDate: '2026-08-02 09:00 AM',
    scheduledFor: '2026-08-05 08:00 AM'
  },
  {
    id: 'NOTIF-105',
    title: 'Summer Discount on Mock Tests',
    description: 'Get 50% off on all mock test series this weekend.',
    priority: 'Low',
    category: 'Marketing',
    audience: 'All Candidates',
    status: 'Draft',
    methods: ['Email', 'Push'],
    createdBy: 'Marketing Team',
    createdDate: '2026-08-03 10:00 AM'
  }
];

export const DUMMY_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'Welcome to Practice Exam Pro 2.0',
    content: 'We have completely revamped our UI for a better testing experience. Check out the new dashboard!',
    publishDate: '2026-07-01',
    isActive: true,
    priority: 'Normal'
  },
  {
    id: 'ANN-002',
    title: 'Important: Changes to Exam Policy',
    content: 'Starting next month, negative marking will be standardized across all internal tests.',
    publishDate: '2026-08-01',
    expiryDate: '2026-09-01',
    isActive: true,
    priority: 'High'
  }
];

export const DUMMY_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'TPL-001',
    name: 'Welcome Email',
    method: 'Email',
    subject: 'Welcome to Practice Exam Pro, {{NAME}}!',
    bodyPreview: '<html><body><h1>Welcome {{NAME}}</h1><p>Your login ID is {{USER_ID}}...</p></body></html>',
    variables: ['NAME', 'USER_ID', 'LOGIN_LINK'],
    lastUpdated: '2026-01-15'
  },
  {
    id: 'TPL-002',
    name: 'OTP SMS',
    method: 'SMS',
    bodyPreview: 'Your OTP is {{OTP}}. Valid for {{MINS}} minutes. Do not share.',
    variables: ['OTP', 'MINS'],
    lastUpdated: '2026-03-20'
  },
  {
    id: 'TPL-003',
    name: 'Result Published Push',
    method: 'Push',
    subject: 'Results are out!',
    bodyPreview: '{{EXAM_NAME}} results have been published. Tap to view your score.',
    variables: ['EXAM_NAME'],
    lastUpdated: '2026-05-10'
  }
];
