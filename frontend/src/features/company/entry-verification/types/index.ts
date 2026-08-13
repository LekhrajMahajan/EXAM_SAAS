export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected' | 'Hold';

export interface VerificationRecord {
  id: string;
  applicationNumber: string;
  candidateName: string;
  examId: string;
  examName: string;
  centerId: string;
  shiftId: string;
  roomId: string;
  seatNumber: string;
  status: VerificationStatus;
  checkInTime?: string;
  verifiedBy?: string;
  remarks?: string;
  photoUrl?: string;
  signatureUrl?: string;
  reportingTime: string;
}

export interface VerificationHistoryLog {
  id: string;
  verificationId: string;
  candidateName: string;
  applicationNumber: string;
  verifiedBy: string;
  date: string;
  time: string;
  status: VerificationStatus;
  remarks?: string;
}
