export type BiometricStatus = 'Pending' | 'Verified' | 'Failed' | 'Manual Review Required';
export type VerificationMethod = 'Face Recognition' | 'Fingerprint' | 'Iris Scan' | 'Liveness Detection';

export interface DeviceStatus {
  cameraConnected: boolean;
  fingerprintScannerConnected: boolean;
  irisScannerConnected: boolean;
  internetStatus: 'Online' | 'Offline';
}

export interface BiometricRecord {
  id: string;
  applicationNumber: string;
  candidateName: string;
  examId: string;
  examName: string;
  centerId: string;
  shiftId: string;
  roomId: string;
  seatNumber: string;
  verificationType: VerificationMethod;
  status: BiometricStatus;
  verificationTime?: string;
  verifiedBy?: string;
  remarks?: string;
  photoUrl?: string;
  matchScore?: number;
}

export interface BiometricHistoryLog {
  id: string;
  biometricId: string;
  candidateName: string;
  verificationType: VerificationMethod;
  verifiedBy: string;
  date: string;
  time: string;
  result: BiometricStatus;
  remarks?: string;
}
