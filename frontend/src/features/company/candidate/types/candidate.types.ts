export type CandidateStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Education {
  qualification: string;
  boardUniversity: string;
  passingYear: string;
  percentage: string;
}

export interface Candidate {
  id: string;
  applicationNo: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  nationality: string;
  
  photoUrl?: string;
  signatureUrl?: string;
  thumbImpressionUrl?: string;

  aadhaarNumber: string;
  panNumber?: string;
  passportNumber?: string;

  mobile: string;
  email: string;
  emergencyContact: string;

  currentAddress: string;
  permanentAddress: string;
  state: string;
  city: string;

  education: Education[];

  // Exam assignments for listing context
  exam: string;
  shift: string;

  status: CandidateStatus;
  approvalStatus: ApprovalStatus;
  
  createdAt: string;
}
