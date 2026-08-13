export type StaffRole = 
  | 'Employee'
  | 'Branch Manager'
  | 'Center Manager'
  | 'Technical Manager'
  | 'Paper Reviewer'
  | 'Entry Checker'
  | 'Biometric Verifier'
  | 'Observer'
  | 'Invigilator'
  | 'Support Staff'
  | 'PAPER_SETTER';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Temporary';
export type StaffStatus = 'Active' | 'Inactive' | 'On Leave' | 'Suspended';

export interface Staff {
  id?: string;
  _id?: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  roles?: StaffRole[];
  department: string;
  branch: string;
  center?: string;
  status: StaffStatus;
  joiningDate: string;
  employmentType: EmploymentType;
  lastLogin?: string;
}

export interface StaffDetails extends Staff {
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  aadhaarNumber: string;
  panNumber: string;
  emergencyContact: string;
  address: string;
  username: string;
  documents: {
    type: 'Aadhaar' | 'PAN' | 'Education' | 'Experience' | 'Appointment Letter' | 'Agreement' | 'Profile Photo';
    name: string;
    url: string;
    uploadedAt: string;
  }[];
  activities: {
    id: string;
    action: string;
    date: string;
    ipAddress: string;
    details?: string;
  }[];
  assignments: {
    id: string;
    type: 'Center' | 'Exam' | 'Shift';
    name: string;
    role: string;
    startDate: string;
    endDate?: string;
    status: 'Active' | 'Completed' | 'Upcoming';
  }[];
}
