import { HydratedDocument, Types } from "mongoose";

export enum ManagerStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  TERMINATED = "TERMINATED",
  DISCONNECTED = "DISCONNECTED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export interface IManager {
  companyId: Types.ObjectId;

  managerCode: string; // Renamed from employeeCode

  firstName: string;
  middleName?: string;
  lastName: string;

  email: string;
  username?: string;

  phone: string;
  alternateMobile?: string;
  
  password: string;

  branchId?: Types.ObjectId;
  centerId?: Types.ObjectId;
  department: string;
  designation: string;
  
  role: string; // The operational role

  joiningDate: Date;
  dob?: Date;
  gender?: Gender;
  salary?: number;
  reportingManager?: Types.ObjectId | null;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  status: ManagerStatus;
  
  // Authentication Fields
  devices?: any[];
  sessions?: any[];
  loginHistory?: any[];
  
  lastLogin?: Date;
  passwordChangedAt?: Date;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  loginAttempts: number;
  lockoutUntil?: Date | null;
  refreshToken?: string | null;

  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
  
  comparePassword(password: string): Promise<boolean>;
}

export type ManagerDocument = HydratedDocument<IManager>;
