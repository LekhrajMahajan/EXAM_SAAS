/*
|--------------------------------------------------------------------------
| Setting Category
|--------------------------------------------------------------------------
*/

export enum SettingCategory {
  GENERAL = "GENERAL",

  SECURITY = "SECURITY",

  SMTP = "SMTP",

  SMS = "SMS",

  PUSH_NOTIFICATION = "PUSH_NOTIFICATION",

  STORAGE = "STORAGE",

  QUEUE = "QUEUE",

  EXAM = "EXAM",

  PASSWORD_POLICY = "PASSWORD_POLICY",

  FEATURE_FLAG = "FEATURE_FLAG",

  BRANDING = "BRANDING",

  ORGANIZATION = "ORGANIZATION",

  NOTIFICATIONS = "NOTIFICATIONS",

  BACKUP = "BACKUP",
}

/*
|--------------------------------------------------------------------------
| Setting Type
|--------------------------------------------------------------------------
*/

export enum SettingType {
  STRING = "STRING",

  NUMBER = "NUMBER",

  BOOLEAN = "BOOLEAN",

  OBJECT = "OBJECT",

  ARRAY = "ARRAY",
}

/*
|--------------------------------------------------------------------------
| Setting Visibility
|--------------------------------------------------------------------------
*/

export enum SettingVisibility {
  PUBLIC = "PUBLIC",

  PRIVATE = "PRIVATE",
}

/*
|--------------------------------------------------------------------------
| System Setting
|--------------------------------------------------------------------------
*/

export interface ISystemSetting {
  category: SettingCategory;

  key: string;

  value: unknown;

  type: SettingType;

  visibility?: SettingVisibility;

  description?: string;
}
