export interface AdmitCard {
  id: string;
  applicationNumber: string;
  candidateName: string;
  examId: string;
  examName: string;
  examDate: string;
  shiftId: string;
  reportingTime: string;
  gateClosingTime: string;
  examStartTime: string;
  examEndTime: string;
  centerId: string;
  centerName: string;
  centerAddress: string;
  roomId: string;
  seatNumber: string;
  issueDate: string;
  status: 'Generated' | 'Downloaded' | 'Revoked';
  photoUrl?: string;
  signatureUrl?: string;
}

export interface AdmitCardHistoryLog {
  id: string;
  date: string;
  generatedBy: string;
  examId: string;
  totalCards: number;
  status: 'Success' | 'Failed';
}
