import { HydratedDocument, Types } from "mongoose";

export enum CenterStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum CenterSetupStatus {
  DRAFT = "DRAFT",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
}

export enum DocumentApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum CenterType {
  COLLEGE = "COLLEGE",
  SCHOOL = "SCHOOL",
  UNIVERSITY = "UNIVERSITY",
  GOVERNMENT = "GOVERNMENT",
  PRIVATE = "PRIVATE",
  TRAINING_INSTITUTE = "TRAINING_INSTITUTE",
  OTHER = "OTHER",
}

export interface IShiftCommercialAgreement {
  shiftName: string; // Morning, Afternoon, Evening, Night
  candidateCapacity: number;
  pricePerCandidate: number;
  minimumGuarantee: number;
  maximumCapacity: number;
  paymentTerms: string;
  includedFacilities: string[];
  requiredInfrastructure: string[];
  penaltyRules: string[];
  bonusRules: string[];
  specialNotes?: string;
}

export interface ICenterAgreementDetails {
  acceptedBy?: string;
  acceptedTime?: Date;
  acceptedIp?: string;
  browser?: string;
  device?: string;
  geoLocation?: {
    latitude?: number;
    longitude?: number;
    city?: string;
  };
}

export interface ICenterProfileExtension {
  website?: string;
  alternateContact?: string;
  googleMapUrl?: string;
  latitude?: number;
  longitude?: number;
  buildingType?: string;
  parking?: string;
  nearbyLandmark?: string;
  officeHours?: string;
  emergencyContacts?: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
}

export interface ICenterDocumentUpload {
  _id?: Types.ObjectId | string;
  documentType: string; // e.g. PAN Card, GST Certificate, Fire NOC
  isMandatory: boolean;
  fileName: string;
  fileUrl: string;
  version: number;
  expiryDate?: Date;
  status: DocumentApprovalStatus;
  rejectionReason?: string;
  correctionNotes?: string;
  uploadedAt: Date;
}

export interface ICenterStaffRegistration {
  _id?: Types.ObjectId | string;
  employeeId: string; // Auto generated e.g. CTR_STF_001
  fullName: string;
  role: string; // Supervisor, Invigilator, Biometric Verifier, etc.
  department: string;
  email: string;
  mobile: string;
  emergencyContact?: string;
  qualification?: string;
  experience?: string;
  joiningDate: Date;
  photoUrl?: string;
  signatureUrl?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  isPoliceVerified?: boolean;
  isBackgroundVerified?: boolean;
  isMedicalFit?: boolean;
  isFaceVerified?: boolean;
  isEmailVerified?: boolean;
  isMobileVerified?: boolean;
  employeeStatus: string; // ACTIVE
}

export interface ICenterInfrastructureNode {
  _id?: Types.ObjectId | string;
  building: string;
  floor: string;
  wing: string;
  roomNumber: string;
  roomType: string; // Lab, Classroom, Server Room
  capacity: number;
  computerCount: number;
  hasLan: boolean;
  hasWifi: boolean;
  internetSpeedMbps?: number;
  hasUps: boolean;
  hasGenerator: boolean;
  powerBackupHrs?: number;
  hasAC: boolean;
  projectorCount?: number;
  printerCount?: number;
  scannerCount?: number;
  barcodeScannerCount?: number;
  biometricDeviceCount?: number;
  metalDetectorCount?: number;
  cctvCameraCount?: number;
  hasEmergencyExit: boolean;
  hasFireExtinguisher: boolean;
  isWheelchairAccessible: boolean;
}

export interface ICenterExamReadiness {
  hasControlRoom: boolean;
  hasStrongRoom: boolean;
  hasQuestionPaperStorage: boolean;
  biometricCountersCount: number;
  waitingAreaCapacity: number;
  hasMedicalRoom: boolean;
  hasHelpDesk: boolean;
  hasSecurityDesk: boolean;
  powerBackupTested: boolean;
  internetBackupTested: boolean;
  emergencyExitClear: boolean;
  disasterRecoveryPlanUrl?: string;
  readinessChecklistNotes?: string;
  readinessScore: number;
}

export interface ICenterShiftPlan {
  shiftName: string;
  maximumCandidates: number;
  availableLabs: number;
  availableSystems: number;
  assignedInvigilators: number;
  assignedSupervisors: number;
  assignedBiometricStaff: number;
  assignedTechnicalStaff: number;
  assignedSecurityStaff: number;
  waitingAreaCapacity: number;
  parkingCapacity: number;
  powerConsumptionKw?: number;
  expectedRevenue: number;
  isInfrastructureValid: boolean;
}

export interface ICenterComplianceChecklist {
  fireSafetyTested: boolean;
  biometricTested: boolean;
  cctvWorking: boolean;
  networkTested: boolean;
  powerBackupTested: boolean;
  generatorTested: boolean;
  computersTested: boolean;
  printerTested: boolean;
  scannerTested: boolean;
  staffAssigned: boolean;
  emergencyContactPosted: boolean;
  medicalRoomReady: boolean;
  strongRoomReady: boolean;
  questionStorageReady: boolean;
  complianceScore: number;
}

export interface ICenter {
  companyId: Types.ObjectId;
  centerManagerId?: Types.ObjectId | null;

  centerCode: string;
  centerName: string;
  centerType: CenterType;
  centerCategory?: string;
  displayCenterType?: string;

  email: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;

  capacity: number;
  availableCapacity: number;
  managerName?: string;
  examCategories?: string[];

  mouPdfUrl?: string;
  mouFileName?: string;
  facilities?: string[];
  shifts?: any[];
  commercialAgreement?: IShiftCommercialAgreement[];

  // Onboarding metadata
  setupStatus: CenterSetupStatus;
  setupCurrentStep: number;
  completionPercentage: number;
  readinessScore: number;
  complianceScore: number;
  adminReviewRemarks?: string;

  agreementDetails?: ICenterAgreementDetails;
  profileExtension?: ICenterProfileExtension;
  documents?: ICenterDocumentUpload[];
  staffList?: ICenterStaffRegistration[];
  infrastructureNodes?: ICenterInfrastructureNode[];
  examReadiness?: ICenterExamReadiness;
  shiftPlans?: ICenterShiftPlan[];
  complianceChecklist?: ICenterComplianceChecklist;

  status: CenterStatus;
  isDeleted: boolean;
  deletedAt?: Date | null;
  createdBy?: Types.ObjectId | null;
  updatedBy?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CenterDocument = HydratedDocument<ICenter>;

export interface ICenterDashboardStats {
  centerCompletionPercentage: number;
  verificationStatus: string;
  readinessScore: number;
  complianceScore: number;
  totalLabs: number;
  totalSystems: number;
  totalRegisteredStaff: number;
  totalUploadedDocuments: number;
  pendingApprovedDocuments: number;
  revenueForecast: number;
  centerHealthScore: number;
}

