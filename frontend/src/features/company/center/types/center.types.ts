export interface Center {
  id: string;
  centerCode: string;
  centerName: string;
  branch: string;
  state: string;
  city: string;
  address: string;
  pincode: string;
  googleMapUrl?: string;
  headName: string;
  headEmail: string;
  headMobile: string;
  emergencyContact?: string;
  capacity: {
    maxCandidates: number;
    maxRooms: number;
    maxSystems: number;
  };
  status: 'Active' | 'Inactive';
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  createdAt?: string;
  _id?: string;
  email?: string;
  setupStatus?: string;
  setupCurrentStep?: number;
  readinessScore?: number;
  complianceScore?: number;
  adminReviewRemarks?: string;
  mouPdfUrl?: string;
  documents?: {
    _id?: string;
    id?: string;
    documentType?: string;
    documentUrl?: string;
    fileName?: string;
    verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
    correctionNotes?: string;
    uploadedAt?: string;
  }[];
  commercialAgreement?: Record<string, unknown>[];
}

export interface CenterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  companyId?: string;
  branchId?: string;
  city?: string;
  state?: string;
  status?: string;
}

export interface CenterListResponse {
  success: boolean;
  message?: string;
  data: {
    data?: Center[];
    centers?: Center[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface Infrastructure {
  id: string;
  centerId: string;
  internetAvailable: boolean;
  powerBackup: boolean;
  generator: boolean;
  ups: boolean;
  airConditioning: boolean;
  cctvAvailable: boolean;
  biometricDevice: boolean;
  metalDetector: boolean;
  parking: boolean;
  waitingArea: boolean;
  medicalRoom: boolean;
  washroom: boolean;
  drinkingWater: boolean;
}

export interface Room {
  id: string;
  centerId: string;
  roomNumber: string;
  floor: string;
  capacity: number;
  systemCount: number;
  projector: boolean;
  camera: boolean;
  status: 'Active' | 'Maintenance' | 'Inactive';
}

export interface Device {
  id: string;
  centerId: string;
  type: 'Computer' | 'Biometric' | 'Printer' | 'Scanner' | 'Router' | 'Switch' | 'Webcam';
  make: string;
  model: string;
  serialNumber: string;
  status: 'Working' | 'Faulty' | 'Repair';
}

export interface Document {
  id: string;
  centerId: string;
  type: 'Building Certificate' | 'Fire NOC' | 'Electric Certificate' | 'Internet Agreement' | 'Ownership Proof' | 'Other';
  name: string;
  url: string;
  uploadedAt: string;
}

export interface Approval {
  id: string;
  centerId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  remarks?: string;
  timeline: {
    status: 'Pending' | 'Approved' | 'Rejected';
    date: string;
    remarks?: string;
    by: string;
  }[];
}
