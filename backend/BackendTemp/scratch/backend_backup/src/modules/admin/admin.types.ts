import { HydratedDocument, Types } from "mongoose";
import { UserRole } from "../../constants/roles";

export interface IAdmin {
  companyId?: Types.ObjectId | null;

  firstName: string;
  middleName?: string;
  lastName: string;

  email: string;
  username?: string;

  phone: string;
  alternateMobile?: string;

  password: string;

  role: string | UserRole;

  profileImage?: string;

  isEmailVerified: boolean;

  isPhoneVerified: boolean;

  loginAttempts: number;

  lockoutUntil?: Date | null;

  lastLogin?: Date;

  refreshToken?: string | null;

  passwordChangedAt?: Date;

  status: boolean;

  isDeleted: boolean;

  deletedAt?: Date | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
  
  devices?: any[];
  sessions?: any[];
  loginHistory?: any[];
}

export type AdminDocument = HydratedDocument<IAdmin>;
