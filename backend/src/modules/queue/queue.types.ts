/*
|--------------------------------------------------------------------------
| Queue Type
|--------------------------------------------------------------------------
*/

export enum QueueType {
  EMAIL = "EMAIL",

  SMS = "SMS",

  WHATSAPP = "WHATSAPP",

  PDF = "PDF",

  QR = "QR",

  REPORT = "REPORT",

  NOTIFICATION = "NOTIFICATION",

  CUSTOM = "CUSTOM",

  BACKUP = "BACKUP",
}

/*
|--------------------------------------------------------------------------
| Queue Status
|--------------------------------------------------------------------------
*/

export enum QueueStatus {
  WAITING = "WAITING",

  ACTIVE = "ACTIVE",

  COMPLETED = "COMPLETED",

  FAILED = "FAILED",

  DELAYED = "DELAYED",

  PAUSED = "PAUSED",

  REMOVED = "REMOVED",
}

/*
|--------------------------------------------------------------------------
| Job Options
|--------------------------------------------------------------------------
*/

export interface IQueueJobOptions {
  delay?: number;

  priority?: number;

  attempts?: number;

  removeOnComplete?: boolean;

  removeOnFail?: boolean;

  backoff?: {
    type: "fixed" | "exponential";

    delay: number;
  };
}

/*
|--------------------------------------------------------------------------
| Queue Job
|--------------------------------------------------------------------------
*/

export interface IQueueJob {
  queue: QueueType;

  name: string;

  data: Record<string, unknown>;

  options?: IQueueJobOptions;
}
