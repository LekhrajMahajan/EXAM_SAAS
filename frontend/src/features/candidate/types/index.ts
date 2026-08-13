export interface CandidateProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  education: string;
  identityProofType: string;
  identityProofNumber: string;
  photoUrl: string;
  signatureUrl: string;
}

export interface ApplicationRecord {
  id: string;
  applicationNumber: string;
  examName: string;
  category: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  submittedDate: string;
}

export interface CandidateDocument {
  id: string;
  name: string;
  type: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  uploadDate: string;
  remarks?: string;
}

export interface AdmitCardRecord {
  id: string;
  applicationNumber: string;
  examName: string;
  date: string;
  time: string;
  center: string;
  status: 'Available' | 'Pending Generation' | 'Withheld';
}

export interface ExamScheduleRecord {
  id: string;
  examName: string;
  date: string;
  time: string;
  center: string;
  room: string;
  seatNumber: string;
}

export interface ResultRecord {
  id: string;
  examName: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  status: 'Pass' | 'Fail' | 'Pending';
  declaredDate: string;
}

export interface MeritRecord {
  id: string;
  examName: string;
  overallRank: number;
  categoryRank: number;
  percentile: number;
}

export interface CertificateRecord {
  id: string;
  name: string;
  issueDate: string;
  status: 'Issued' | 'Pending';
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  type: 'Info' | 'Alert' | 'Success';
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  date: string;
}
