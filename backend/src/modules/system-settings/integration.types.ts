export enum IntegrationCategory {
  PAYMENT = "PAYMENT",
  STORAGE = "STORAGE",
  EMAIL = "EMAIL",
  SMS = "SMS",
  OAUTH = "OAUTH",
  WEBHOOK = "WEBHOOK",
  THIRD_PARTY = "THIRD_PARTY",
  IMPORT_EXPORT = "IMPORT_EXPORT",
}

export enum IntegrationProvider {
  STRIPE = "STRIPE",
  RAZORPAY = "RAZORPAY",
  PAYPAL = "PAYPAL",
  AWS_S3 = "AWS_S3",
  CLOUDINARY = "CLOUDINARY",
  SMTP = "SMTP",
  SENDGRID = "SENDGRID",
  TWILIO = "TWILIO",
  MSG91 = "MSG91",
  GOOGLE = "GOOGLE",
  MICROSOFT = "MICROSOFT",
  AZURE = "AZURE",
  FIREBASE = "FIREBASE",
  OPENAI = "OPENAI",
  CUSTOM_REST = "CUSTOM_REST",
  CUSTOM_WEBHOOK = "CUSTOM_WEBHOOK",
}

export enum IntegrationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DEPRECATED = "DEPRECATED",
  FAILED = "FAILED",
}

export enum IntegrationEnvironment {
  DEVELOPMENT = "DEVELOPMENT",
  STAGING = "STAGING",
  PRODUCTION = "PRODUCTION",
}

export enum IntegrationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum AuthType {
  NONE = "NONE",
  BASIC = "BASIC",
  BEARER_TOKEN = "BEARER_TOKEN",
  API_KEY = "API_KEY",
  OAUTH2 = "OAUTH2",
  CUSTOM = "CUSTOM",
}

export interface IRestApiConfig {
  baseUrl: string;
  authType: AuthType;
  headers?: Record<string, string>;
  token?: string; // encrypted
  apiKey?: string; // encrypted
  secret?: string; // encrypted
  requestTimeout?: number;
  retryPolicy?: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

export interface IWebhookConfig {
  url: string;
  secret?: string; // encrypted
  authType: AuthType;
  token?: string; // encrypted
  retryEnabled: boolean;
  maxRetries: number;
  signatureVerification: boolean;
  deadLetterQueueEnabled: boolean;
}

export interface IOAuthConfig {
  clientId: string; // encrypted
  clientSecret: string; // encrypted
  redirectUrl: string;
  scopes: string[];
  refreshToken?: string; // encrypted
  accessToken?: string; // encrypted
  tokenExpiry?: Date;
}

export interface IHealthStatus {
  connectionStatus: "ONLINE" | "OFFLINE" | "DEGRADED";
  lastSync?: Date;
  responseTimeMs?: number;
  failureCount: number;
  successCount: number;
  errorLogs?: Array<{
    timestamp: Date;
    message: string;
    code?: string;
  }>;
}

export interface ISecurityConfig {
  credentialEncryption: boolean;
  secretRotationEnabled: boolean;
  certificateValidation: boolean;
  tlsEnforced: boolean;
  allowedDomains: string[];
}

export interface ISyncConfig {
  syncType: "EXTERNAL" | "MANUAL" | "SCHEDULED";
  cronExpression?: string;
  conflictResolution: "OVERWRITE" | "IGNORE" | "MERGE";
  retryFailedJobs: boolean;
}

export interface IIntegration {
  _id?: string;
  name: string;
  provider: IntegrationProvider | string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  environment: IntegrationEnvironment;
  priority: IntegrationPriority;
  
  description?: string;
  
  restApi?: IRestApiConfig;
  webhook?: IWebhookConfig;
  oauth?: IOAuthConfig;
  sync?: ISyncConfig;
  security?: ISecurityConfig;
  health: IHealthStatus;

  createdBy: any;
  updatedBy: any;
  createdAt?: Date;
  updatedAt?: Date;
}
