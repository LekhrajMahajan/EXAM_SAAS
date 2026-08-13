// frontend types mirroring backend employee.types.ts and auth/user.types.ts

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'LOCKED' | 'TERMINATED';

export type EmployeeGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Employee {
  _id: string;
  companyId: string | Record<string, any>;
  userId: string | Record<string, any>;
  employeeCode: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  phone: string;
  alternateMobile?: string | null;
  username?: string | null;
  branchId?: string | Record<string, any>;
  department: string;
  designation: string;
  role: string;
  joiningDate: string;
  dob?: string;
  gender?: EmployeeGender;
  salary?: number;
  reportingManager?: string | null;
  profileImage?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  status: EmployeeStatus;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeStatistics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  terminated: number;
}
