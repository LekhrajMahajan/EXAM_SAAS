import { Document, Types } from "mongoose";

export interface ICompanySettings extends Document {
  companyId: Types.ObjectId;
  companyLogo?: string;
  companyName: string;
  legalName?: string;
  companyCode: string;
  companyEmail: string;
  supportEmail?: string;
  phone: string;
  alternatePhone?: string;
  website?: string;
  timezone: string;
  currency: string;
  language: string;
  country: string;
  state: string;
  district?: string;
  city: string;
  pincode?: string;
  address?: string;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBrandingSettings extends Document {
  companyId: Types.ObjectId;
  primaryColor: string;
  secondaryColor: string;
  theme: "light" | "dark" | "system";
  companyLogo?: string;
  loginLogo?: string;
  favicon?: string;
  isEnabled: boolean;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISMTPSettings extends Document {
  companyId: Types.ObjectId;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  encryption?: "TLS" | "SSL" | "NONE";
  senderName?: string;
  senderEmail?: string;
  isVerified: boolean;
  isEnabled: boolean;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISecuritySettings extends Document {
  companyId: Types.ObjectId;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    requireUppercase: boolean;
  };
  ipWhitelist?: string[];
  twoFactorAuthRequired?: boolean;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface INotificationSettings extends Document {
  companyId: Types.ObjectId;
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  emailTemplates?: any[];
  notificationTemplates?: any[];
  certificateTemplates?: any[];
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditSettings extends Document {
  companyId: Types.ObjectId;
  logAllQueries: boolean;
  logLogins: boolean;
  logDataModifications: boolean;
  logSecurityEvents: boolean;
  retentionDays: number;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorageSettings extends Document {
  companyId: Types.ObjectId;
  allocatedStorageMB: number;
  usedStorageMB: number;
  rootFolderStructure: string[];
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITenantSystemSettings extends Document {
  companyId: Types.ObjectId;
  academicYear: string;
  financialYear: string;
  dateFormat: string;
  timeFormat: "12H" | "24H";
  weekStart: "Monday" | "Sunday" | "Saturday";
  sessionTimeout: number;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}
