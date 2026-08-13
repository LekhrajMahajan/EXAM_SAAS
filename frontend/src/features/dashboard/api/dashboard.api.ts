import { apiClient } from '@/core/api/http/axios-client';
import type { StatItem, ActivityItem, NotificationItem, QuickAction } from '../types';

export interface DashboardCardsResponse {
  upcomingExams: number;
  activeExams: number;
  completedExams: number;
  pendingApprovals: number;
}

export interface CompanyDashboardStats {
  totalBranches: number;
  totalCenters: number;
  totalEmployees: number;
  totalCandidates: number;
  activeExams: number;
  pendingApprovals: number;
  activities: Array<{ id: string | number; action: string; entity: string; time: string }>;
  notifications: Array<{ id: string | number; title: string; message: string; isRead: boolean; time: string }>;
}

export interface RoleDashboardStats {
  stats: StatItem[];
  quickActions: QuickAction[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  unreadCount: number;
  pendingApprovals?: number;
  totalBranches?: number;
  totalCenters?: number;
  totalEmployees?: number;
  totalCandidates?: number;
  activeExams?: number;
  totalStaff?: number;
  systemHealth?: { server: string; database: string; uptime: number };
  [key: string]: unknown;
}

const extractItems = (res: PromiseSettledResult<unknown>, itemKey = 'items'): unknown[] => {
  if (res.status === 'fulfilled' && res.value) {
    const val = res.value as { data?: { data?: Record<string, unknown> | unknown[]; items?: unknown[] } };
    const data = val.data?.data || val.data;
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && itemKey in data && Array.isArray((data as Record<string, unknown>)[itemKey])) {
      return (data as Record<string, unknown>)[itemKey] as unknown[];
    }
  }
  return [];
};

export const dashboardApi = {
  /**
   * Primary: Role-specific dashboard stats from the new endpoint.
   * Returns real stats, activities, notifications, quickActions per role.
   */
  getRoleDashboardStats: async (): Promise<RoleDashboardStats> => {
    try {
      const res = await apiClient.get('/dashboard/role-stats');
      const data = res.data?.data || res.data;
      return {
        stats: data.stats || [],
        quickActions: data.quickActions || [],
        activities: (data.activities || []).map((a: Record<string, unknown>, i: number) => ({
          id: String(a.id || i),
          title: String(a.title || 'Activity'),
          description: String(a.description || ''),
          timestamp: String(a.timestamp || 'Recently'),
          type: (a.type as 'info' | 'success' | 'warning' | 'error') || 'info',
          iconName: String(a.iconName || 'Activity'),
        })),
        notifications: (data.notifications || []).map((n: Record<string, unknown>, i: number) => ({
          id: String(n.id || i),
          title: String(n.title || 'Notification'),
          message: String(n.message || ''),
          timestamp: String(n.timestamp || 'Today'),
          isRead: Boolean(n.isRead),
          priority: (n.priority as 'low' | 'medium' | 'high') || 'medium',
        })),
        unreadCount: Number(data.unreadCount || 0),
        pendingApprovals: Number(data.pendingApprovals || 0),
        totalBranches: Number(data.totalBranches || 0),
        totalCenters: Number(data.totalCenters || 0),
        totalEmployees: Number(data.totalEmployees || 0),
        totalCandidates: Number(data.totalCandidates || 0),
        activeExams: Number(data.activeExams || 0),
        totalStaff: Number(data.totalStaff || 0),
        systemHealth: data.systemHealth,
      };
    } catch {
      return { stats: [], quickActions: [], activities: [], notifications: [], unreadCount: 0 };
    }
  },

  /**
   * Legacy: Exam manager cards from overview endpoint.
   */
  getExamManagerCards: async (): Promise<DashboardCardsResponse> => {
    try {
      const response = await apiClient.get('/dashboard/overview');
      return {
        upcomingExams: response.data.upcomingExams || 0,
        activeExams: response.data.activeExams || 0,
        completedExams: response.data.completedExams || 0,
        pendingApprovals: response.data.pendingApprovals || 0,
      };
    } catch {
      return { upcomingExams: 0, activeExams: 0, completedExams: 0, pendingApprovals: 0 };
    }
  },

  /**
   * Company admin aggregate data (branches, centers, employees, candidates).
   */
  getCompanyDashboardData: async (): Promise<CompanyDashboardStats> => {
    try {
      const res = await apiClient.get('/dashboard/role-stats');
      const data = res.data?.data || res.data;
      if (data && (data.totalBranches !== undefined || data.totalCenters !== undefined || data.totalEmployees !== undefined || data.stats !== undefined)) {
        const activities = (data.activities || []).map((a: Record<string, unknown>, i: number) => ({
          id: String(a.id || i),
          action: String(a.action || a.title || 'Activity'),
          entity: String(a.entity || a.description || 'Record'),
          time: String(a.time || a.timestamp || 'Recently'),
        }));

        const notifications = (data.notifications || []).map((n: Record<string, unknown>, i: number) => ({
          id: String(n.id || i),
          title: String(n.title || 'Notice'),
          message: String(n.message || ''),
          isRead: Boolean(n.isRead),
          time: String(n.time || n.timestamp || 'Today'),
        }));

        return {
          totalBranches: Number(data.totalBranches || 0),
          totalCenters: Number(data.totalCenters || 0),
          totalEmployees: Number(data.totalEmployees || 0),
          totalCandidates: Number(data.totalCandidates || 0),
          activeExams: Number(data.activeExams || 0),
          pendingApprovals: Number(data.pendingApprovals || 0),
          activities,
          notifications,
        };
      }
    } catch {
      // Fallback to individual calls if endpoint fails
    }

    const [branchesRes, centersRes, employeesRes, candidatesRes, examsRes, activityRes, notificationsRes] = await Promise.allSettled([
      apiClient.get('/branches', { params: { limit: 1, page: 1 } }),
      apiClient.get('/centers', { params: { limit: 1, page: 1 } }),
      apiClient.get('/employees', { params: { limit: 1, page: 1 } }),
      apiClient.get('/candidates', { params: { limit: 1, page: 1 } }),
      apiClient.get('/exams', { params: { limit: 1, page: 1, status: 'ACTIVE' } }),
      apiClient.get('/activity-logs', { params: { limit: 5, page: 1 } }),
      apiClient.get('/notifications', { params: { limit: 5, page: 1 } }),
    ]);

    const extractTotal = (res: PromiseSettledResult<unknown>): number => {
      if (res.status === 'fulfilled' && res.value) {
        const val = res.value as { data?: { data?: { total?: number; meta?: { total?: number }; items?: unknown[]; length?: number }; total?: number; meta?: { total?: number }; items?: unknown[]; length?: number } };
        const data = val.data?.data || val.data;
        if (!data) return 0;
        return data.total ?? data.meta?.total ?? (Array.isArray((data as Record<string, unknown>).items) ? ((data as Record<string, unknown>).items as unknown[]).length : (Array.isArray(data) ? (data as unknown[]).length : 0));
      }
      return 0;
    };

    const rawActivities = extractItems(activityRes);
    const activities = rawActivities.slice(0, 5).map((raw, i) => {
      const item = raw as Record<string, unknown>;
      return {
        id: String(item.id || item._id || i),
        action: String(item.action || item.type || 'Activity'),
        entity: String(item.description || item.entityName || 'Record'),
        time: item.createdAt ? new Date(String(item.createdAt)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
      };
    });

    const rawNotifications = extractItems(notificationsRes);
    const notifications = rawNotifications.slice(0, 5).map((raw, i) => {
      const item = raw as Record<string, unknown>;
      return {
        id: String(item.id || item._id || i),
        title: String(item.title || item.type || 'Notice'),
        message: String(item.message || item.content || ''),
        isRead: Boolean(item.isRead),
        time: item.createdAt ? new Date(String(item.createdAt)).toLocaleDateString() : 'Today',
      };
    });

    return {
      totalBranches: extractTotal(branchesRes),
      totalCenters: extractTotal(centersRes),
      totalEmployees: extractTotal(employeesRes),
      totalCandidates: extractTotal(candidatesRes),
      activeExams: extractTotal(examsRes),
      pendingApprovals: 0,
      activities,
      notifications,
    };
  },
};
