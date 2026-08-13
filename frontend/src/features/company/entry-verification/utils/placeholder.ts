import type { VerificationRecord, VerificationHistoryLog } from '../types';

export const DUMMY_VERIFICATIONS: VerificationRecord[] = [
  {
    id: 'VR-001',
    applicationNumber: 'APP-2026-001',
    candidateName: 'John Doe',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test',
    centerId: 'CTR-NY-01',
    shiftId: 'SHIFT-M',
    roomId: 'RM-101',
    seatNumber: 'S-12',
    status: 'Verified',
    checkInTime: '2026-08-15T08:15:00Z',
    verifiedBy: 'Jane Security',
    reportingTime: '08:00 AM'
  },
  {
    id: 'VR-002',
    applicationNumber: 'APP-2026-002',
    candidateName: 'Alice Smith',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test',
    centerId: 'CTR-NY-01',
    shiftId: 'SHIFT-M',
    roomId: 'RM-102',
    seatNumber: 'S-05',
    status: 'Pending',
    reportingTime: '08:00 AM'
  },
  {
    id: 'VR-003',
    applicationNumber: 'APP-2026-003',
    candidateName: 'Bob Williams',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test',
    centerId: 'CTR-NY-01',
    shiftId: 'SHIFT-M',
    roomId: 'RM-101',
    seatNumber: 'S-14',
    status: 'Hold',
    checkInTime: '2026-08-15T08:30:00Z',
    verifiedBy: 'Jane Security',
    remarks: 'ID proof unreadable. Waiting for original driving license.',
    reportingTime: '08:00 AM'
  },
];

export const DUMMY_VERIFICATION_HISTORY: VerificationHistoryLog[] = [
  {
    id: 'VH-001',
    verificationId: 'VR-001',
    candidateName: 'John Doe',
    applicationNumber: 'APP-2026-001',
    verifiedBy: 'Jane Security',
    date: '2026-08-15',
    time: '08:15 AM',
    status: 'Verified'
  },
  {
    id: 'VH-002',
    verificationId: 'VR-003',
    candidateName: 'Bob Williams',
    applicationNumber: 'APP-2026-003',
    verifiedBy: 'Jane Security',
    date: '2026-08-15',
    time: '08:30 AM',
    status: 'Hold',
    remarks: 'ID proof unreadable. Waiting for original driving license.'
  }
];
