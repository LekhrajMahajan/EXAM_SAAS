import { Schema, model, models } from "mongoose";
import {
  ICompanySettings,
  IBrandingSettings,
  ISMTPSettings,
  ISecuritySettings,
  INotificationSettings,
  IAuditSettings,
  IStorageSettings,
  ITenantSystemSettings,
} from "./company-settings.types";

// 1. CompanySettings
const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
    companyLogo: { type: String, default: "" },
    companyName: { type: String, required: true },
    legalName: { type: String, default: "" },
    companyCode: { type: String, required: true },
    companyEmail: { type: String, required: true },
    supportEmail: { type: String, default: "" },
    phone: { type: String, required: true },
    alternatePhone: { type: String, default: "" },
    website: { type: String, default: "" },
    timezone: { type: String, default: "UTC" },
    currency: { type: String, default: "USD" },
    language: { type: String, default: "en" },
    country: { type: String, default: "" },
    state: { type: String, default: "" },
    district: { type: String, default: "" },
    city: { type: String, default: "" },
    pincode: { type: String, default: "" },
    address: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 2. BrandingSettings
const BrandingSettingsSchema = new Schema<IBrandingSettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
    primaryColor: { type: String, default: "#3b82f6" },
    secondaryColor: { type: String, default: "#1e40af" },
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    companyLogo: { type: String, default: "" },
    loginLogo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    isEnabled: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 3. SMTPSettings
const SMTPSettingsSchema = new Schema<ISMTPSettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
    host: { type: String, default: "" },
    port: { type: Number, default: 587 },
    username: { type: String, default: "" },
    password: { type: String, default: "" },
    encryption: { type: String, enum: ["TLS", "SSL", "NONE"], default: "TLS" },
    senderName: { type: String, default: "" },
    senderEmail: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 4. SecuritySettings
const SecuritySettingsSchema = new Schema<ISecuritySettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
    sessionTimeout: { type: Number, default: 30 },
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireNumbers: { type: Boolean, default: true },
      requireSpecialChars: { type: Boolean, default: true },
      requireUppercase: { type: Boolean, default: true },
    },
    ipWhitelist: [{ type: String }],
    twoFactorAuthRequired: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 5. NotificationSettings
const NotificationSettingsSchema = new Schema<INotificationSettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
    emailNotificationsEnabled: { type: Boolean, default: true },
    smsNotificationsEnabled: { type: Boolean, default: false },
    pushNotificationsEnabled: { type: Boolean, default: true },
    emailTemplates: { type: [Schema.Types.Mixed], default: [] },
    notificationTemplates: { type: [Schema.Types.Mixed], default: [] },
    certificateTemplates: { type: [Schema.Types.Mixed], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 6. AuditSettings
const AuditSettingsSchema = new Schema<IAuditSettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
    logAllQueries: { type: Boolean, default: false },
    logLogins: { type: Boolean, default: true },
    logDataModifications: { type: Boolean, default: true },
    logSecurityEvents: { type: Boolean, default: true },
    retentionDays: { type: Number, default: 90 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 7. StorageSettings
const StorageSettingsSchema = new Schema<IStorageSettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
    allocatedStorageMB: { type: Number, default: 5120 }, // 5GB default
    usedStorageMB: { type: Number, default: 0 },
    rootFolderStructure: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

// 8. TenantSystemSettings
const TenantSystemSettingsSchema = new Schema<ITenantSystemSettings>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", required: true, unique: true, index: true },
    academicYear: { type: String, default: "2026-2027" },
    financialYear: { type: String, default: "2026-2027" },
    dateFormat: { type: String, default: "YYYY-MM-DD" },
    timeFormat: { type: String, enum: ["12H", "24H"], default: "24H" },
    weekStart: { type: String, enum: ["Monday", "Sunday", "Saturday"], default: "Monday" },
    sessionTimeout: { type: Number, default: 30 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

export const CompanySettings = models.CompanySettings || model<ICompanySettings>("CompanySettings", CompanySettingsSchema);
export const BrandingSettings = models.BrandingSettings || model<IBrandingSettings>("BrandingSettings", BrandingSettingsSchema);
export const SMTPSettings = models.SMTPSettings || model<ISMTPSettings>("SMTPSettings", SMTPSettingsSchema);
export const SecuritySettings = models.SecuritySettings || model<ISecuritySettings>("SecuritySettings", SecuritySettingsSchema);
export const NotificationSettings = models.NotificationSettings || model<INotificationSettings>("NotificationSettings", NotificationSettingsSchema);
export const AuditSettings = models.AuditSettings || model<IAuditSettings>("AuditSettings", AuditSettingsSchema);
export const StorageSettings = models.StorageSettings || model<IStorageSettings>("StorageSettings", StorageSettingsSchema);
export const TenantSystemSettings = models.TenantSystemSettings || model<ITenantSystemSettings>("TenantSystemSettings", TenantSystemSettingsSchema);
