import type { BiometricRecord, BiometricHistoryLog, DeviceStatus } from '../types';

export const DUMMY_DEVICE_STATUS: DeviceStatus = {
  cameraConnected: true,
  fingerprintScannerConnected: false,
  irisScannerConnected: false,
  internetStatus: 'Online'
};

export const DUMMY_BIOMETRICS: BiometricRecord[] = [
  {
    id: 'BIO-001',
    applicationNumber: 'APP-2026-001',
    candidateName: 'John Doe',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test',
    centerId: 'CTR-NY-01',
    shiftId: 'SHIFT-M',
    roomId: 'RM-101',
    seatNumber: 'S-12',
    verificationType: 'Face Recognition',
    status: 'Verified',
    verificationTime: '2026-08-15T08:15:00Z',
    verifiedBy: 'System',
    matchScore: 98.5
  },
  {
    id: 'BIO-002',
    applicationNumber: 'APP-2026-002',
    candidateName: 'Alice Smith',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test',
    centerId: 'CTR-NY-01',
    shiftId: 'SHIFT-M',
    roomId: 'RM-102',
    seatNumber: 'S-05',
    verificationType: 'Face Recognition',
    status: 'Pending',
  },
  {
    id: 'BIO-003',
    applicationNumber: 'APP-2026-003',
    candidateName: 'Bob Williams',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test',
    centerId: 'CTR-NY-01',
    shiftId: 'SHIFT-M',
    roomId: 'RM-101',
    seatNumber: 'S-14',
    verificationType: 'Face Recognition',
    status: 'Failed',
    verificationTime: '2026-08-15T08:30:00Z',
    verifiedBy: 'System',
    matchScore: 45.2,
    remarks: 'Low confidence match score.'
  },
  {
    id: 'BIO-004',
    applicationNumber: 'APP-2026-004',
    candidateName: 'Charlie Brown',
    examId: 'EX-2026-SPRING',
    examName: 'Spring Admissions Test',
    centerId: 'CTR-NY-01',
    shiftId: 'SHIFT-M',
    roomId: 'RM-103',
    seatNumber: 'S-20',
    verificationType: 'Face Recognition',
    status: 'Manual Review Required',
    verificationTime: '2026-08-15T08:45:00Z',
    verifiedBy: 'Jane Security',
    matchScore: 72.1,
    remarks: 'Candidate wearing thick glasses, lighting poor.'
  },
];

export const DUMMY_BIOMETRIC_HISTORY: BiometricHistoryLog[] = [
  {
    id: 'BH-001',
    biometricId: 'BIO-001',
    candidateName: 'John Doe',
    verificationType: 'Face Recognition',
    verifiedBy: 'System',
    date: '2026-08-15',
    time: '08:15 AM',
    result: 'Verified'
  },
  {
    id: 'BH-002',
    biometricId: 'BIO-003',
    candidateName: 'Bob Williams',
    verificationType: 'Face Recognition',
    verifiedBy: 'System',
    date: '2026-08-15',
    time: '08:30 AM',
    result: 'Failed',
    remarks: 'Low confidence match score.'
  },
  {
    id: 'BH-003',
    biometricId: 'BIO-004',
    candidateName: 'Charlie Brown',
    verificationType: 'Face Recognition',
    verifiedBy: 'System',
    date: '2026-08-15',
    time: '08:42 AM',
    result: 'Failed',
    remarks: 'Face match failed 3 times.'
  },
  {
    id: 'BH-004',
    biometricId: 'BIO-004',
    candidateName: 'Charlie Brown',
    verificationType: 'Face Recognition',
    verifiedBy: 'Jane Security',
    date: '2026-08-15',
    time: '08:45 AM',
    result: 'Manual Review Required',
    remarks: 'Candidate wearing thick glasses, lighting poor.'
  }
];
