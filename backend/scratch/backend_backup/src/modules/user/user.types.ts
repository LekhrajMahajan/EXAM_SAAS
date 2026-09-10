/*
|--------------------------------------------------------------------------
| User Status
|--------------------------------------------------------------------------
*/

export enum UserStatus {
  ACTIVE = "ACTIVE",

  INACTIVE = "INACTIVE",

  SUSPENDED = "SUSPENDED",

  BLOCKED = "BLOCKED",

  DELETED = "DELETED",

  DISCONNECTED = "DISCONNECTED",
}

/*
|--------------------------------------------------------------------------
| Gender
|--------------------------------------------------------------------------
*/

export enum Gender {
  MALE = "MALE",

  FEMALE = "FEMALE",

  OTHER = "OTHER",
}

/*
|--------------------------------------------------------------------------
| User Theme
|--------------------------------------------------------------------------
*/

export enum UserTheme {
  LIGHT = "LIGHT",

  DARK = "DARK",

  SYSTEM = "SYSTEM",
}

/*
|--------------------------------------------------------------------------
| Language
|--------------------------------------------------------------------------
*/

export enum UserLanguage {
  ENGLISH = "ENGLISH",

  HINDI = "HINDI",

  GUJARATI = "GUJARATI",
}

/*
|--------------------------------------------------------------------------
| Notification Preference
|--------------------------------------------------------------------------
*/

export interface IUserNotificationPreference {
  email: boolean;

  sms: boolean;

  push: boolean;
}

/*
|--------------------------------------------------------------------------
| User Preference
|--------------------------------------------------------------------------
*/

export interface IUserPreference {
  theme: UserTheme;

  language: UserLanguage;

  notifications: IUserNotificationPreference;
}

/*
|--------------------------------------------------------------------------
| User Session
|--------------------------------------------------------------------------
*/

export interface IUserSession {
  deviceId: string;

  deviceName: string;

  browser: string;

  operatingSystem: string;

  ipAddress: string;

  loginAt: Date;

  lastActivityAt: Date;
}

/*
|--------------------------------------------------------------------------
| User Device
|--------------------------------------------------------------------------
*/

export interface IUserDevice {
  deviceId: string;

  deviceName: string;

  browser: string;

  operatingSystem: string;

  trusted: boolean;
}

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export interface IUpdateProfile {
  firstName: string;

  lastName: string;

  employeeId?: string;

  department?: string;

  designation?: string;

  gender?: Gender;

  profileImage?: string;
}

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export interface IChangePassword {
  currentPassword: string;

  newPassword: string;
}

/*
|--------------------------------------------------------------------------
| User Dashboard
|--------------------------------------------------------------------------
*/

export interface IUserDashboard {
  totalSessions: number;

  trustedDevices: number;

  loginHistory: number;
}
