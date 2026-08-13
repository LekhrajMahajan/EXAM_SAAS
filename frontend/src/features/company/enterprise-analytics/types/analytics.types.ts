export type AnalyticsPeriod = 'TODAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' | 'CUSTOM';

export type ChartType = 'LINE' | 'BAR' | 'PIE' | 'DOUGHNUT' | 'AREA' | 'HEATMAP' | 'STACKED_BAR';

export interface AnalyticsFilter {
  period?: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
  companyId?: string;
  branchId?: string;
  centerId?: string;
  department?: string;
  role?: string;
  search?: string;
}

export interface OrganizationHealth {
  score: number;
  status: 'OPTIMAL' | 'GOOD' | 'ATTENTION' | 'CRITICAL';
  uptime: number;
  systemHealth: string;
}

export interface TodaysOperations {
  upcomingExams: number;
  runningExams: number;
  completedExams: number;
  todayAttendancePercentage: number;
  staffUtilizationRate: number;
}

export interface RevenueSummary {
  monthlyRevenue: number;
  quarterlyRevenue: number;
  yearlyRevenue: number;
  growthPercentage: number;
}

export interface AlertsAndNotifications {
  pendingApprovals: number;
  criticalAlertsCount: number;
  auditSummaryCount: number;
  unreadNotifications: number;
}

export interface LiveActivities {
  connectedCandidates: number;
  activeExamsMonitored: number;
  averageTrustScore: number;
}

export interface ExecutiveDashboardData {
  period: AnalyticsPeriod;
  organizationHealth: OrganizationHealth;
  todaysOperations: TodaysOperations;
  infrastructureHealth: {
    branchHealthAverage: number;
    centerReadinessIndex: number;
    activeCenters: number;
  };
  revenueSummary: RevenueSummary;
  alertsAndNotifications: AlertsAndNotifications;
  liveActivities: LiveActivities;
  detailedData?: {
    candidates?: Record<string, unknown>;
    exams?: Record<string, unknown>;
    attendance?: Record<string, unknown>;
    branches?: Record<string, unknown>;
    centers?: Record<string, unknown>;
    employees?: Record<string, unknown>;
    assignments?: Record<string, unknown>;
    finance?: Record<string, unknown>;
    live?: Record<string, unknown>;
    trust?: Record<string, unknown>;
  };
}

export interface HeatmapItem {
  id: string;
  name: string;
  value?: number;
  occupancyRate?: number;
  readiness?: number;
  trust?: number;
  status?: string;
  lat?: number;
  lng?: number;
}

export interface HeatmapsData {
  branchHeatmap: HeatmapItem[];
  centerHeatmap: HeatmapItem[];
  attendanceHeatmap: Array<{ day: string; morningShift: number; afternoonShift: number; eveningShift: number }>;
  violationHeatmap: Array<{ hour: string; tabSwitch: number; faceMismatch: number; audioAnomalies: number }>;
  performanceHeatmap: Array<{ department: string; efficiency: number; errorRate: number }>;
  infrastructureHeatmap: Array<{ item: string; health: number; verification: string }>;
  trustHeatmap: Array<{ zone: string; averageScore: number; riskIndex: string }>;
  examLoadHeatmap: Array<{ shift: string; loadPercentage: number; concurrentCandidates: number }>;
}

export interface GlobalSearchResult {
  query: string;
  resultsCount: number;
  branches: Array<{ type: string; id: string; name: string; code: string; subtitle: string }>;
  centers: Array<{ type: string; id: string; name: string; code: string; subtitle: string }>;
  exams: Array<{ type: string; id: string; name: string; code: string; subtitle: string }>;
  employees: Array<{ type: string; id: string; name: string; code: string; subtitle: string }>;
  candidates: Array<{ type: string; id: string; name: string; code: string; subtitle: string }>;
}

export interface DashboardPersonalization {
  favoriteWidgets: string[];
  savedFilters: Array<{ id: string; name: string; filter: Record<string, unknown>; isDefault: boolean }>;
  customDashboard: Array<{ widgetId: string; position: number; w: number; h: number; visible: boolean; colSpan?: number }>;
  compactMode: boolean;
  defaultLandingPage: string;
  refreshInterval: number;
}
