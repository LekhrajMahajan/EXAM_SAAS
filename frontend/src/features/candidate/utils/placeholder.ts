import type { 
  CandidateProfile, 
  ApplicationRecord, 
  CandidateDocument, 
  AdmitCardRecord, 
  ExamScheduleRecord, 
  ResultRecord, 
  MeritRecord, 
  CertificateRecord, 
  NotificationRecord, 
  SupportTicket 
} from '../types';

export const DUMMY_CANDIDATE_PROFILE: CandidateProfile = {
  id: 'CAN-1001',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, Apt 4B',
  city: 'New York',
  state: 'NY',
  country: 'USA',
  pincode: '10001',
  education: 'Bachelor of Science in Computer Science',
  identityProofType: 'Passport',
  identityProofNumber: 'A12345678',
  photoUrl: '',
  signatureUrl: ''
};

export const DUMMY_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'APP-001',
    applicationNumber: 'APP-2026-001',
    examName: 'Spring Admissions Test 2026',
    category: 'General',
    status: 'Approved',
    submittedDate: '2026-02-15'
  },
  {
    id: 'APP-002',
    applicationNumber: 'APP-2026-045',
    examName: 'Summer Entrance Exam 2026',
    category: 'General',
    status: 'Under Review',
    submittedDate: '2026-04-10'
  }
];

export const DUMMY_DOCUMENTS: CandidateDocument[] = [
  {
    id: 'DOC-001',
    name: 'Passport_Copy.pdf',
    type: 'Identity Proof',
    status: 'Verified',
    uploadDate: '2026-02-10'
  },
  {
    id: 'DOC-002',
    name: 'Degree_Certificate.pdf',
    type: 'Education Proof',
    status: 'Pending',
    uploadDate: '2026-02-10'
  },
  {
    id: 'DOC-003',
    name: 'Photo.jpg',
    type: 'Photograph',
    status: 'Verified',
    uploadDate: '2026-02-12'
  }
];

export const DUMMY_ADMIT_CARDS: AdmitCardRecord[] = [
  {
    id: 'AC-001',
    applicationNumber: 'APP-2026-001',
    examName: 'Spring Admissions Test 2026',
    date: '2026-08-15',
    time: '09:00 AM',
    center: 'New York City Test Center - Main Hall',
    status: 'Available'
  }
];

export const DUMMY_EXAM_SCHEDULES: ExamScheduleRecord[] = [
  {
    id: 'EXS-001',
    examName: 'Spring Admissions Test 2026',
    date: '2026-08-15',
    time: '09:00 AM',
    center: 'New York City Test Center',
    room: 'Hall A',
    seatNumber: '45'
  }
];

export const DUMMY_RESULTS: ResultRecord[] = [
  {
    id: 'RES-001',
    examName: 'Winter Entrance Exam 2025',
    marksObtained: 185,
    totalMarks: 200,
    percentage: 92.5,
    status: 'Pass',
    declaredDate: '2025-12-20'
  }
];

export const DUMMY_MERIT_LIST: MeritRecord[] = [
  {
    id: 'MER-001',
    examName: 'Winter Entrance Exam 2025',
    overallRank: 42,
    categoryRank: 12,
    percentile: 98.5
  }
];

export const DUMMY_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'CERT-001',
    name: 'Winter Entrance Exam 2025 - Qualification Certificate',
    issueDate: '2026-01-15',
    status: 'Issued'
  }
];

export const DUMMY_NOTIFICATIONS: NotificationRecord[] = [
  {
    id: 'NOT-001',
    title: 'Admit Card Available',
    message: 'Your admit card for Spring Admissions Test 2026 is now available for download.',
    date: '2026-07-20',
    isRead: false,
    type: 'Success'
  },
  {
    id: 'NOT-002',
    title: 'Application Under Review',
    message: 'Your application APP-2026-045 is currently under review.',
    date: '2026-04-11',
    isRead: true,
    type: 'Info'
  }
];

export const DUMMY_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Name correction in Admit Card',
    status: 'In Progress',
    date: '2026-07-21'
  }
];
