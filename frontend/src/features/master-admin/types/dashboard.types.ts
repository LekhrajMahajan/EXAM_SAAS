export enum DashboardPeriod {
  TODAY = "TODAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  YEAR = "YEAR",
  CUSTOM = "CUSTOM",
}

export interface DashboardFilter {
  period?: DashboardPeriod;
  startDate?: string;
  endDate?: string;
  companyId?: string;
  centerId?: string;
}

export interface DashboardOverview {
  period: string;
  totalCandidates: number;
  totalExams: number;
  totalResults: number;
  totalAttendance: number;
  activeExams: number;
  
  // Master Admin Overview
  companies: number;
  activeCompanies: number;
  pendingCompanies: number;
  suspendedCompanies: number;
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  todaysRevenue: number;
  monthlyRevenue: number;
  openSupportTickets: number;
}

export interface IChartSeries {
  name: string;
  data: number[];
}

export interface IChartData {
  labels: string[];
  series: IChartSeries[];
}

export interface IDashboardCharts {
  companyGrowth: IChartData;
  subscriptionTrend: IChartData;
  revenueTrend: IChartData;
  companyStatusDistribution: IChartData;
}

export interface DashboardCard {
  title: string;
  value: number;
  icon?: string;
  color?: string;
  change?: number;
}

export interface CompanyStatistics {
  companies: number;
  activeCompanies: number;
  inactiveCompanies: number;
}

export interface EmployeeStatistics {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
}

export interface SystemHealth {
  server: string;
  database: string;
  redis: string;
  queue: string;
  storage: string;
  uptime: number;
  memoryUsage: unknown;
  nodeVersion: string;
}
