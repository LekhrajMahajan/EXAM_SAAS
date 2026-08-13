import mongoose, { Schema, Document } from "mongoose";
import { 
  IIntegration, 
  IntegrationCategory, 
  IntegrationProvider, 
  IntegrationStatus, 
  IntegrationEnvironment, 
  IntegrationPriority,
  AuthType
} from "./integration.types";

const RestApiSchema = new Schema({
  baseUrl: { type: String, required: true },
  authType: { type: String, enum: Object.values(AuthType), default: AuthType.NONE },
  headers: { type: Map, of: String },
  token: { type: String }, // Encrypted
  apiKey: { type: String }, // Encrypted
  secret: { type: String }, // Encrypted
  requestTimeout: { type: Number, default: 5000 },
  retryPolicy: {
    maxRetries: { type: Number, default: 3 },
    backoffMultiplier: { type: Number, default: 2 },
  }
}, { _id: false });

const WebhookSchema = new Schema({
  url: { type: String, required: true },
  secret: { type: String }, // Encrypted
  authType: { type: String, enum: Object.values(AuthType), default: AuthType.NONE },
  token: { type: String }, // Encrypted
  retryEnabled: { type: Boolean, default: true },
  maxRetries: { type: Number, default: 3 },
  signatureVerification: { type: Boolean, default: false },
  deadLetterQueueEnabled: { type: Boolean, default: false },
}, { _id: false });

const OAuthSchema = new Schema({
  clientId: { type: String, required: true }, // Encrypted
  clientSecret: { type: String, required: true }, // Encrypted
  redirectUrl: { type: String, required: true },
  scopes: [{ type: String }],
  refreshToken: { type: String }, // Encrypted
  accessToken: { type: String }, // Encrypted
  tokenExpiry: { type: Date },
}, { _id: false });

const SyncSchema = new Schema({
  syncType: { type: String, enum: ["EXTERNAL", "MANUAL", "SCHEDULED"], default: "MANUAL" },
  cronExpression: { type: String },
  conflictResolution: { type: String, enum: ["OVERWRITE", "IGNORE", "MERGE"], default: "OVERWRITE" },
  retryFailedJobs: { type: Boolean, default: true },
}, { _id: false });

const SecuritySchema = new Schema({
  credentialEncryption: { type: Boolean, default: true },
  secretRotationEnabled: { type: Boolean, default: false },
  certificateValidation: { type: Boolean, default: true },
  tlsEnforced: { type: Boolean, default: true },
  allowedDomains: [{ type: String }],
}, { _id: false });

const HealthSchema = new Schema({
  connectionStatus: { type: String, enum: ["ONLINE", "OFFLINE", "DEGRADED"], default: "OFFLINE" },
  lastSync: { type: Date },
  responseTimeMs: { type: Number, default: 0 },
  failureCount: { type: Number, default: 0 },
  successCount: { type: Number, default: 0 },
  errorLogs: [{
    timestamp: { type: Date, default: Date.now },
    message: { type: String },
    code: { type: String }
  }],
}, { _id: false });

const IntegrationSchema = new Schema(
  {
    name: { type: String, required: true },
    provider: { type: String, required: true },
    category: { type: String, enum: Object.values(IntegrationCategory), required: true },
    status: { type: String, enum: Object.values(IntegrationStatus), default: IntegrationStatus.INACTIVE },
    environment: { type: String, enum: Object.values(IntegrationEnvironment), default: IntegrationEnvironment.PRODUCTION },
    priority: { type: String, enum: Object.values(IntegrationPriority), default: IntegrationPriority.MEDIUM },
    
    description: { type: String },
    
    restApi: { type: RestApiSchema },
    webhook: { type: WebhookSchema },
    oauth: { type: OAuthSchema },
    sync: { type: SyncSchema },
    security: { type: SecuritySchema, default: () => ({}) },
    health: { type: HealthSchema, default: () => ({ connectionStatus: "OFFLINE", failureCount: 0, successCount: 0 }) },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

IntegrationSchema.index({ category: 1, environment: 1 });
IntegrationSchema.index({ provider: 1 });

export const Integration = mongoose.model<IIntegration & Document>(
  "Integration",
  IntegrationSchema
);
