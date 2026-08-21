import { HydratedDocument, Types } from "mongoose";
import { UserRole } from "../../constants/roles";

export interface IUser {
  companyId?: Types.ObjectId | null;
  centerId?: Types.ObjectId | null;

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

  forcePasswordChange?: boolean;

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

  comparePassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser>;
