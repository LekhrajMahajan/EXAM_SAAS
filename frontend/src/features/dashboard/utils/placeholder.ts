import type { StatItem, ActivityItem, TaskItem, NotificationItem, QuickAction, ChartData } from '../types';

export const DUMMY_STATS: Record<string, StatItem[]> = {
  'Master Admin': [
    { id: '1', label: 'Total Companies', value: '1,245', change: '+12% this month', trend: 'up', iconName: 'Building2', colorScheme: 'indigo' },
    { id: '2', label: 'Active Subscriptions', value: '98%', change: 'Steady', trend: 'neutral', iconName: 'CreditCard', colorScheme: 'emerald' },
    { id: '3', label: 'Total Users', value: '45.2K', change: '+5K this week', trend: 'up', iconName: 'Users', colorScheme: 'sky' },
    { id: '4', label: 'System Alerts', value: '3', change: 'Needs attention', trend: 'down', iconName: 'AlertTriangle', colorScheme: 'rose' },
  ],
  'Company Admin': [
    { id: '1', label: 'Total Exams', value: '142', change: '+5 upcoming', trend: 'up', iconName: 'BookOpen', colorScheme: 'indigo' },
    { id: '2', label: 'Registered Candidates', value: '12,500', change: '+12% this month', trend: 'up', iconName: 'Users', colorScheme: 'sky' },
    { id: '3', label: 'Active Centers', value: '45', change: 'Across 12 branches', trend: 'neutral', iconName: 'Building2', colorScheme: 'emerald' },
    { id: '4', label: 'Pending Approvals', value: '8', change: 'Papers/Results', trend: 'down', iconName: 'Clock', colorScheme: 'amber' },
  ],
};

export const DUMMY_ACTIVITIES: ActivityItem[] = [
  { id: '1', title: 'New Exam Created', description: 'SSC CGL Tier 1 was created by Exam Manager.', timestamp: '10 mins ago', type: 'info', iconName: 'PlusCircle' },
  { id: '2', title: 'Payment Received', description: 'Subscription renewed for Company X.', timestamp: '1 hour ago', type: 'success', iconName: 'CheckCircle' },
  { id: '3', title: 'Server Load High', description: 'Database CPU utilization at 85%.', timestamp: '2 hours ago', type: 'warning', iconName: 'AlertTriangle' },
  { id: '4', title: 'Login Failed', description: 'Failed login attempt from IP 192.168.1.1.', timestamp: '3 hours ago', type: 'error', iconName: 'XCircle' },
];

export const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  { id: '1', title: 'Exam Starting Soon', message: 'IBPS PO starts in 30 minutes.', timestamp: 'Just now', isRead: false, priority: 'high' },
  { id: '2', title: 'Paper Approved', message: 'Math Set A was approved by reviewer.', timestamp: '2 hours ago', isRead: true, priority: 'medium' },
  { id: '3', title: 'New Candidate Registration', message: '150 new candidates registered today.', timestamp: '5 hours ago', isRead: true, priority: 'low' },
];

export const DUMMY_TASKS: TaskItem[] = [
  { id: '1', title: 'Review Physics Question Paper', assignedTo: 'Dr. Sharma', dueDate: '2026-10-22', status: 'Pending', priority: 'high' },
  { id: '2', title: 'Allocate Invigilators for SSC', assignedTo: 'Observer Team', dueDate: '2026-10-24', status: 'In Progress', priority: 'medium' },
  { id: '3', title: 'Generate Merit List for RRB', assignedTo: 'Result Manager', dueDate: '2026-10-25', status: 'Pending', priority: 'high' },
  { id: '4', title: 'Update Dashboard Settings', assignedTo: 'Admin', dueDate: '2026-10-20', status: 'Completed', priority: 'low' },
];

export const DUMMY_CHARTS: Record<string, ChartData> = {
  examTrend: {
    id: 'exam-trend',
    title: 'Exam Registration Trend',
    type: 'line',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Registrations', data: [1200, 1900, 3000, 5000, 2000, 3000], color: 'indigo' }]
  },
  revenueSummary: {
    id: 'revenue-summary',
    title: 'Revenue by Module',
    type: 'doughnut',
    labels: ['Subscriptions', 'Exam Fees', 'Add-ons'],
    datasets: [{ label: 'Revenue', data: [60, 30, 10] }]
  }
};

export const DUMMY_QUICK_ACTIONS: Record<string, QuickAction[]> = {
  'Master Admin': [
    { id: '1', label: 'Create Company', path: '/master-admin/companies/new', iconName: 'Plus', colorScheme: 'indigo' },
    { id: '2', label: 'Manage Centers', path: '/company/centers', iconName: 'Building2', colorScheme: 'emerald' },
    { id: '3', label: 'View Reports', path: '/company/reports', iconName: 'BarChart2', colorScheme: 'sky' },
    { id: '4', label: 'Add Staff', path: '/company/staff/create', iconName: 'UserPlus', colorScheme: 'amber' },
  ],
  'Company Admin': [
    { id: '1', label: 'Create Exam', path: '/company/exams/create', iconName: 'Plus', colorScheme: 'indigo' },
    { id: '2', label: 'Manage Centers', path: '/company/centers', iconName: 'Building2', colorScheme: 'emerald' },
    { id: '3', label: 'View Reports', path: '/company/reports', iconName: 'BarChart2', colorScheme: 'sky' },
    { id: '4', label: 'Add Staff', path: '/company/staff/create', iconName: 'UserPlus', colorScheme: 'amber' },
  ]
};
