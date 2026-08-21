/*
|--------------------------------------------------------------------------
| Analytics Period
|--------------------------------------------------------------------------
*/

export enum AnalyticsPeriod {
  TODAY = "TODAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| Analytics Category
|--------------------------------------------------------------------------
*/

export enum AnalyticsCategory {
  CANDIDATE = "CANDIDATE",
  EXAM = "EXAM",
  RESULT = "RESULT",
  ATTENDANCE = "ATTENDANCE",
  COMPANY = "COMPANY",
  BRANCH = "BRANCH",
  CENTER = "CENTER",
  QUESTION = "QUESTION",
  PAPER = "PAPER",
  EMPLOYEE = "EMPLOYEE",
  SYSTEM = "SYSTEM",
  QUEUE = "QUEUE",
  NOTIFICATION = "NOTIFICATION",
  ASSIGNMENT = "ASSIGNMENT",
  FINANCE = "FINANCE",
  LIVE_MONITORING = "LIVE_MONITORING",
  TRUST_SCORE = "TRUST_SCORE",
  HEATMAPS = "HEATMAPS",
}

/*
|--------------------------------------------------------------------------
| Chart Type
|--------------------------------------------------------------------------
*/

export enum ChartType {
  LINE = "LINE",
  BAR = "BAR",
  PIE = "PIE",
  DOUGHNUT = "DOUGHNUT",
  DONUT = "DONUT",
  AREA = "AREA",
  RADAR = "RADAR",
  HEATMAP = "HEATMAP",
  STACKED_BAR = "STACKED_BAR",
  TIMELINE = "TIMELINE",
  COMPARISON = "COMPARISON",
}

/*
|--------------------------------------------------------------------------
| Analytics Filter & Drill Down Parameters
|--------------------------------------------------------------------------
*/

export interface IAnalyticsFilter {
  period?: AnalyticsPeriod;
  startDate?: Date | string;
  endDate?: Date | string;
  companyId?: string;
  centerId?: string;
  examId?: string;
  subjectId?: string;
  shiftId?: string;
  roomId?: string;
  department?: string;
  role?: string;
  employeeId?: string;
  candidateId?: string;
  status?: string;
  verification?: string;
  attendanceStatus?: string;
  minTrustScore?: number;
  maxTrustScore?: number;
  search?: string;
  [key: string]: unknown;
}

/*
|--------------------------------------------------------------------------
| Chart Dataset
|--------------------------------------------------------------------------
*/

export interface IChartDataset {
  label: string;
  data: (number | Record<string, unknown>)[];
  backgroundColor?: string[] | string;
  borderColor?: string[] | string;
  borderWidth?: number;
  fill?: boolean;
  [key: string]: unknown;
}

/*
|--------------------------------------------------------------------------
| Analytics Chart
|--------------------------------------------------------------------------
*/

export interface IAnalyticsChart {
  type: ChartType | string;
  labels: string[];
  datasets: IChartDataset[];
  title?: string;
  description?: string;
  options?: Record<string, unknown>;
}

/*
|--------------------------------------------------------------------------
| Export Request DTO
|--------------------------------------------------------------------------
*/

export interface IAnalyticsExportRequest {
  category: AnalyticsCategory | string;
  format: "PDF" | "EXCEL" | "CSV" | "PRINT" | "EMAIL";
  filter?: IAnalyticsFilter;
  recipients?: string[];
  includeCharts?: boolean;
  notes?: string;
}

/*
|--------------------------------------------------------------------------
| Dashboard Personalization DTO
|--------------------------------------------------------------------------
*/

export interface IPersonalizationDTO {
  favoriteWidgets?: string[];
  savedFilters?: Array<{
    id: string;
    name: string;
    filter: Record<string, unknown>;
    isDefault: boolean;
  }>;
  customDashboard?: Array<{
    widgetId: string;
    position: number;
    w: number;
    h: number;
    visible: boolean;
    colSpan?: number;
  }>;
  compactMode?: boolean;
  defaultLandingPage?: string;
  refreshInterval?: number;
}
