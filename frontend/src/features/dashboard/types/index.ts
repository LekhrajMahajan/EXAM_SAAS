export type DashboardRole =
  | 'Master Admin'
  | 'Company Admin'
  | 'Exam Manager'
  | 'Center Manager'
  | 'Observer'
  | 'Paper Setter'
  | 'Paper Reviewer'
  | 'Technical Team'
  | 'Candidate';

export interface StatItem {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  iconName: string;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'slate';
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  iconName?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface TaskItem {
  id: string;
  title: string;
  assignedTo?: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ChartData {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface QuickAction {
  id: string;
  label: string;
  path: string;
  iconName: string;
  colorScheme: string;
}

export interface WidgetConfig {
  id: string;
  type: 'statistics' | 'chart' | 'activity' | 'calendar' | 'tasks' | 'notifications' | 'quickActions' | 'summary';
  title: string;
  width: 'full' | 'half' | 'third' | 'two-thirds';
  isVisible: boolean;
  order: number;
}

export interface DashboardConfig {
  role: DashboardRole;
  widgets: WidgetConfig[];
}
