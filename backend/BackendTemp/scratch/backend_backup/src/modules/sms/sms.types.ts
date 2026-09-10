/*
|--------------------------------------------------------------------------
| SMS Provider
|--------------------------------------------------------------------------
*/

export enum SmsProvider {
  TWILIO = "TWILIO",

  MSG91 = "MSG91",

  FAST2SMS = "FAST2SMS",

  TEXTLOCAL = "TEXTLOCAL",

  AWS_SNS = "AWS_SNS",

  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| SMS Template
|--------------------------------------------------------------------------
*/

export enum SmsTemplate {
  OTP = "OTP",

  WELCOME = "WELCOME",

  PASSWORD_RESET = "PASSWORD_RESET",

  ACCOUNT_VERIFICATION = "ACCOUNT_VERIFICATION",

  EXAM_SCHEDULE = "EXAM_SCHEDULE",

  EXAM_REMINDER = "EXAM_REMINDER",

  ADMIT_CARD = "ADMIT_CARD",

  RESULT = "RESULT",

  CERTIFICATE = "CERTIFICATE",

  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| SMS Priority
|--------------------------------------------------------------------------
*/

export enum SmsPriority {
  LOW = "LOW",

  NORMAL = "NORMAL",

  HIGH = "HIGH",
}

/*
|--------------------------------------------------------------------------
| SMS Status
|--------------------------------------------------------------------------
*/

export enum SmsStatus {
  PENDING = "PENDING",

  QUEUED = "QUEUED",

  SENT = "SENT",

  DELIVERED = "DELIVERED",

  FAILED = "FAILED",
}

/*
|--------------------------------------------------------------------------
| Send SMS
|--------------------------------------------------------------------------
*/

export interface ISendSms {
  phone: string | string[];

  message: string;

  template?: SmsTemplate;

  provider?: SmsProvider;

  priority?: SmsPriority;

  metadata?: Record<string, unknown>;
}

/*
|--------------------------------------------------------------------------
| Send OTP
|--------------------------------------------------------------------------
*/

export interface ISendOtpSms {
  phone: string;

  otp: string;

  expiry?: number;
}
