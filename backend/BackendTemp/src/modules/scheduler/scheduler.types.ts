/*
|--------------------------------------------------------------------------
| Scheduler Job
|--------------------------------------------------------------------------
*/

export enum SchedulerJob {
  RESULT_PUBLISH = "RESULT_PUBLISH",

  EXAM_REMINDER = "EXAM_REMINDER",

  EMAIL = "EMAIL",

  SMS = "SMS",

  PUSH_NOTIFICATION = "PUSH_NOTIFICATION",

  REPORT = "REPORT",

  CERTIFICATE = "CERTIFICATE",

  CACHE_CLEANUP = "CACHE_CLEANUP",

  FILE_CLEANUP = "FILE_CLEANUP",

  ACTIVITY_LOG_CLEANUP = "ACTIVITY_LOG_CLEANUP",

  AUDIT_LOG_CLEANUP = "AUDIT_LOG_CLEANUP",

  DATABASE_BACKUP = "DATABASE_BACKUP",

  HEALTH_CHECK = "HEALTH_CHECK",

  ANALYTICS = "ANALYTICS",

  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| Scheduler Status
|--------------------------------------------------------------------------
*/

export enum SchedulerStatus {
  ACTIVE = "ACTIVE",

  PAUSED = "PAUSED",

  STOPPED = "STOPPED",
}

/*
|--------------------------------------------------------------------------
| Scheduler Frequency
|--------------------------------------------------------------------------
*/

export enum SchedulerFrequency {
  ONCE = "ONCE",

  MINUTELY = "MINUTELY",

  HOURLY = "HOURLY",

  DAILY = "DAILY",

  WEEKLY = "WEEKLY",

  MONTHLY = "MONTHLY",

  YEARLY = "YEARLY",

  CRON = "CRON",
}

/*
|--------------------------------------------------------------------------
| Scheduler Payload
|--------------------------------------------------------------------------
*/

export interface ISchedulerJob {
  name: SchedulerJob;

  frequency: SchedulerFrequency;

  cronExpression?: string;

  enabled: boolean;

  payload?: Record<string, unknown>;
}
