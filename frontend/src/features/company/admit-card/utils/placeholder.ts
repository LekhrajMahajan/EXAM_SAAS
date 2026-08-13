import type { AdmitCard, AdmitCardHistoryLog } from '../types';

export const DUMMY_ADMIT_CARDS: AdmitCard[] = [
  {
    id: 'AC-001',
    applicationNumber: 'APP-2026-001',
    candidateName: 'John Doe',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test 2026',
    examDate: '2026-08-15',
    shiftId: 'SHIFT-M',
    reportingTime: '08:00 AM',
    gateClosingTime: '08:45 AM',
    examStartTime: '09:00 AM',
    examEndTime: '12:00 PM',
    centerId: 'CTR-NY-01',
    centerName: 'New York Test Center Alpha',
    centerAddress: '123 Testing Blvd, New York, NY 10001',
    roomId: 'RM-101',
    seatNumber: 'S-12',
    issueDate: '2026-07-20T10:00:00Z',
    status: 'Generated',
  },
  {
    id: 'AC-002',
    applicationNumber: 'APP-2026-002',
    candidateName: 'Jane Smith',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test 2026',
    examDate: '2026-08-15',
    shiftId: 'SHIFT-M',
    reportingTime: '08:00 AM',
    gateClosingTime: '08:45 AM',
    examStartTime: '09:00 AM',
    examEndTime: '12:00 PM',
    centerId: 'CTR-NY-01',
    centerName: 'New York Test Center Alpha',
    centerAddress: '123 Testing Blvd, New York, NY 10001',
    roomId: 'RM-101',
    seatNumber: 'S-13',
    issueDate: '2026-07-20T10:00:00Z',
    status: 'Downloaded',
  }
];

export const DUMMY_ADMIT_HISTORY: AdmitCardHistoryLog[] = [
  {
    id: 'ACH-001',
    date: '2026-07-20T10:00:00Z',
    generatedBy: 'Admin User',
    examId: 'EX-2026-SPRING',
    totalCards: 150,
    status: 'Success',
  }
];
