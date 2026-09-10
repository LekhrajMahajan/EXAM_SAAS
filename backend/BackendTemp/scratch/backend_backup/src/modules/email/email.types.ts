/*
|--------------------------------------------------------------------------
| Email Provider
|--------------------------------------------------------------------------
*/

export enum EmailProvider {
  SMTP = "SMTP",

  MAILTRAP = "MAILTRAP",

  SENDGRID = "SENDGRID",

  AWS_SES = "AWS_SES",

  RESEND = "RESEND",

  BREVO = "BREVO",
}

/*
|--------------------------------------------------------------------------
| Email Template
|--------------------------------------------------------------------------
*/

export enum EmailTemplate {
  OTP = "OTP",

  WELCOME = "WELCOME",

  PASSWORD_RESET = "PASSWORD_RESET",

  ACCOUNT_VERIFICATION = "ACCOUNT_VERIFICATION",

  EXAM_SCHEDULE = "EXAM_SCHEDULE",

  ADMIT_CARD = "ADMIT_CARD",

  RESULT = "RESULT",

  CERTIFICATE = "CERTIFICATE",

  EXAM_REMINDER = "EXAM_REMINDER",

  BULK_NOTIFICATION = "BULK_NOTIFICATION",

  CUSTOM = "CUSTOM",
}

/*
|--------------------------------------------------------------------------
| Email Priority
|--------------------------------------------------------------------------
*/

export enum EmailPriority {
  LOW = "LOW",

  NORMAL = "NORMAL",

  HIGH = "HIGH",
}

/*
|--------------------------------------------------------------------------
| Attachment
|--------------------------------------------------------------------------
*/

export interface IEmailAttachment {
  filename: string;

  path?: string;
  
  content?: Buffer | string;

  contentType?: string;
}

/*
|--------------------------------------------------------------------------
| Send Email
|--------------------------------------------------------------------------
*/

export interface ISendEmail {
  to: string | string[];

  cc?: string[];

  bcc?: string[];

  subject: string;

  html: string;

  text?: string;

  template?: EmailTemplate;

  attachments?: IEmailAttachment[];

  priority?: EmailPriority;

  provider?: EmailProvider;

  metadata?: Record<string, unknown>;
}
