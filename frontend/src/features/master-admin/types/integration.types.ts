export enum IntegrationCategory {
  PAYMENT = "PAYMENT",
  STORAGE = "STORAGE",
  EMAIL = "EMAIL",
  SMS = "SMS",
  OAUTH = "OAUTH",
  WEBHOOK = "WEBHOOK",
}

export enum IntegrationStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ERROR = "ERROR",
  PENDING_SETUP = "PENDING_SETUP",
}

export interface IIntegration {
  _id: string;
  name: string;
  provider: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  
  restApi?: {
    baseUrl: string;
    apiKey?: string;
    secret?: string;
    token?: string;
    requestTimeout?: number;
  };
  
  health?: {
    connectionStatus: "ONLINE" | "OFFLINE" | "DEGRADED";
    lastSync?: string;
    successCount?: number;
    failureCount?: number;
    responseTimeMs?: number;
  };
  
  createdAt: string;
  updatedAt: string;
}
