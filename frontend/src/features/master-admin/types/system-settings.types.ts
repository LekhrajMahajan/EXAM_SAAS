export enum SettingCategory {
  GENERAL = 'GENERAL',
  SECURITY = 'SECURITY',
  SMTP = 'SMTP',
  SMS = 'SMS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  STORAGE = 'STORAGE',
  QUEUE = 'QUEUE',
  EXAM = 'EXAM',
  PASSWORD_POLICY = 'PASSWORD_POLICY',
  FEATURE_FLAG = 'FEATURE_FLAG',
  BRANDING = 'BRANDING',
  BACKUP = 'BACKUP',
}

export enum SettingType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
}

export enum SettingVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface SystemSetting {
  _id: string;
  category: SettingCategory;
  key: string;
  value: unknown;
  type: SettingType;
  visibility: SettingVisibility;
  description?: string;
  isEditable: boolean;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingsResponse {
  data: SystemSetting[];
  success: boolean;
  message: string;
}
