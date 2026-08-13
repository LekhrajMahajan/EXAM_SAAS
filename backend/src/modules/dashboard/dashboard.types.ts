/*
|--------------------------------------------------------------------------
| Dashboard Period
|--------------------------------------------------------------------------
*/

export enum DashboardPeriod {
  TODAY = "TODAY",

  WEEK = "WEEK",

  MONTH = "MONTH",

  YEAR = "YEAR",

  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| Dashboard Widget
|--------------------------------------------------------------------------
*/

export enum DashboardWidget {
  EXAM = "EXAM",

  CANDIDATE = "CANDIDATE",

  RESULT = "RESULT",

  ATTENDANCE = "ATTENDANCE",

  LIVE_MONITORING = "LIVE_MONITORING",

  QUESTION_BANK = "QUESTION_BANK",

  COMPANY = "COMPANY",

  CENTER = "CENTER",

  EMPLOYEE = "EMPLOYEE",

  ACTIVITY = "ACTIVITY",

  QUEUE = "QUEUE",

  NOTIFICATION = "NOTIFICATION",

  SYSTEM = "SYSTEM",
}

/*
|--------------------------------------------------------------------------
| Dashboard Filter
|--------------------------------------------------------------------------
*/

export interface IDashboardFilter {
  period?: DashboardPeriod;

  startDate?: Date;

  endDate?: Date;

  companyId?: string;

  branchId?: string;

  centerId?: string;
}

/*
|--------------------------------------------------------------------------
| Dashboard Card
|--------------------------------------------------------------------------
*/

export interface IDashboardCard {
  title: string;

  value: number;

  icon?: string;

  color?: string;

  change?: number;
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
