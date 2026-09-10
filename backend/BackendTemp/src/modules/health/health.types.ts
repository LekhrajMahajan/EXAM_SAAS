/*
|--------------------------------------------------------------------------
| Health Status
|--------------------------------------------------------------------------
*/

export enum HealthStatus {
  HEALTHY = "HEALTHY",

  DEGRADED = "DEGRADED",

  UNHEALTHY = "UNHEALTHY",
}

/*
|--------------------------------------------------------------------------
| Health Component
|--------------------------------------------------------------------------
*/

export enum HealthComponent {
  APPLICATION = "APPLICATION",

  DATABASE = "DATABASE",

  REDIS = "REDIS",

  QUEUE = "QUEUE",

  STORAGE = "STORAGE",

  SMTP = "SMTP",

  SMS = "SMS",

  PUSH_NOTIFICATION = "PUSH_NOTIFICATION",
}

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

export interface IHealthCheck {
  component: HealthComponent;

  status: HealthStatus;

  message?: string;

  responseTime?: number;
}

/*
|--------------------------------------------------------------------------
| System Information
|--------------------------------------------------------------------------
*/

export interface ISystemInformation {
  uptime: number;

  nodeVersion: string;

  platform: string;

  environment: string;

  cpuUsage: NodeJS.CpuUsage;

  memoryUsage: NodeJS.MemoryUsage;
}
