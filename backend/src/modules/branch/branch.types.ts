import { HydratedDocument, Types } from "mongoose";

/*
|--------------------------------------------------------------------------
| Branch Status & Setup Status
|--------------------------------------------------------------------------
*/

export enum BranchStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum BranchSetupStatus {
  DRAFT = "DRAFT",
  PENDING_VERIFICATION = "PENDING_VERIFICATION",
  VERIFIED = "VERIFIED",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
}

export enum DocumentStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

/*
|--------------------------------------------------------------------------
| Setup Wizard Step Interfaces
|--------------------------------------------------------------------------
*/

export interface IBranchLegalDocument {
  documentType: string;
  url: string;
  status: DocumentStatus;
  expiryDate?: Date | null;
  uploadedBy?: Types.ObjectId | null;
  uploadedAt: Date;
  version: number;
  isMandatory: boolean;
  encryptionKeyHash?: string;
}

export interface IVerificationHistoryItem {
  status: VerificationStatus | string;
  remarks?: string;
  updatedBy?: Types.ObjectId | string | null;
  updatedAt: Date;
}

export interface IBranchVerification {
  panNumber?: string;
  gstinNumber?: string;
  aadhaarNumber?: string;
  aadhaarOtpVerified: boolean;
  mobileOtpVerified: boolean;
  emailVerified: boolean;
  faceVerified: boolean;
  verificationStatus: VerificationStatus;
  history: IVerificationHistoryItem[];
}

export interface IEmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
  role?: string;
}

export interface IBranchStaffRegistration {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContact?: IEmergencyContact;
  qualification?: string;
  experience?: number;
  role: string;
  department: string;
  joiningDate: Date;
  aadhaarNumber?: string;
  panNumber?: string;
  photoUrl?: string;
  faceBiometricsUrl?: string;
  mobileVerified: boolean;
  emailVerified: boolean;
  aadhaarOtpVerified?: boolean;
  digitalSignatureUrl?: string;
  policeVerificationStatus: VerificationStatus;
  backgroundVerificationStatus: VerificationStatus;
  employmentStatus: "ACTIVE" | "INACTIVE" | "PROBATION" | "TERMINATED";
  userId?: Types.ObjectId | null;
  employeeId?: Types.ObjectId | null;
}

export interface IBranchInfrastructure {
  buildingName: string;
  floorNumber: number;
  roomNumber: string;
  roomType: string;
  capacity: number;
  computerCount: number;
  lanAvailability: boolean;
  internetSpeed?: string;
  ups: boolean;
  generator: boolean;
  airConditioning: boolean;
  projector: boolean;
  cctv: boolean;
  biometricDevice: boolean;
  printer: boolean;
  scanner: boolean;
  barcodeScanner: boolean;
  powerBackup: boolean;
  emergencyExit: boolean;
  accessibilitySupport: boolean;
  geoCoordinates?: {
    latitude: number;
    longitude: number;
  };
  centerId?: Types.ObjectId | null;
  roomId?: Types.ObjectId | null;
}

export interface IBranchExamReadiness {
  controlRoom: boolean;
  biometricCounters: number;
  waitingAreaCapacity: number;
  helpDeskAvailable: boolean;
  medicalRoomAvailable: boolean;
  strongRoomSecurity: string;
  questionPaperStorage: boolean;
  internetRedundancy: string;
  powerRedundancy: string;
  emergencyContacts: IEmergencyContact[];
  disasterRecoveryChecklist: Record<string, boolean>;
  readinessScore: number;
}

export interface IBranchComplianceChecklist {
  fireSafety: boolean;
  cctvWorking: boolean;
  networkWorking: boolean;
  biometricDeviceTested: boolean;
  systemsTested: boolean;
  seatingVerified: boolean;
  staffAssigned: boolean;
  emergencyContactAvailable: boolean;
  generatorTested: boolean;
  internetBackupTested: boolean;
}

/*
|--------------------------------------------------------------------------
| Branch Interface
|--------------------------------------------------------------------------
*/

export interface IBranch {
  companyId: Types.ObjectId;

  branchCode: string;

  branchName: string;

  branchType?: string;

  examCenterCode?: string;
  totalLabs?: number;
  totalSystems?: number;
  facilities?: string[];

  parentBranchId?: Types.ObjectId | null;

  branchManagerId?: Types.ObjectId | null;

  setupStatus: BranchSetupStatus;

  setupCurrentStep: number;

  completionPercentage: number;

  readinessScore: number;

  displayName?: string;

  logoUrl?: string;

  email: string;

  phone: string;

  alternatePhone?: string;

  address: string;

  city: string;

  state: string;

  country: string;

  postalCode: string;

  addressDetails?: {
    street?: string;
    district?: string;
    taluka?: string;
    latitude?: number;
    longitude?: number;
    mapLocationUrl?: string;
  };

  website?: string;

  officeTiming?: {
    openTime?: string;
    closeTime?: string;
    workingDays?: string[];
    timeZone?: string;
  };

  legalDocuments?: IBranchLegalDocument[];

  verificationDetails?: IBranchVerification;

  onboardingStaff?: IBranchStaffRegistration[];

  onboardingInfrastructure?: IBranchInfrastructure[];

  examReadiness?: IBranchExamReadiness;

  complianceChecklist?: IBranchComplianceChecklist;

  adminReviewRemarks?: string;

  adminReviewedBy?: Types.ObjectId | null;

  adminReviewedAt?: Date | null;

  managerName?: string;

  status: BranchStatus;

  isDeleted: boolean;

  deletedAt?: Date | null;

  deletedBy?: Types.ObjectId | null;

  createdBy?: Types.ObjectId | null;

  updatedBy?: Types.ObjectId | null;

  createdAt: Date;

  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| Branch Document
|--------------------------------------------------------------------------
*/

export type BranchDocument = HydratedDocument<IBranch>;

/*
|--------------------------------------------------------------------------
| Enterprise DTOs & Analytical Interfaces
|--------------------------------------------------------------------------
*/

export interface IBranchDashboard {
  totalBranches: number;
  activeBranches: number;
  inactiveBranches: number;
  totalCenters: number;
  totalEmployees: number;
  totalStaff: number;
  totalExams: number;
  upcomingExams: number;
  runningExams: number;
  completedExams: number;
  candidateCount: number;
  averageTrustScore: number;
}

export interface IBranchManagerDashboard {
  branchId: string;
  branchName: string;
  branchCode: string;
  setupStatus: BranchSetupStatus;
  completionPercentage: number;
  readinessScore: number;
  verificationStatus: VerificationStatus;
  pendingTasks: string[];
  staffCount: number;
  infrastructureStatus: {
    totalRooms: number;
    totalComputers: number;
    cctvOperational: boolean;
    biometricOperational: boolean;
    powerBackupOperational: boolean;
  };
  labStatus: string;
  examReadiness: {
    score: number;
    status: "READY" | "REQUIRES_ATTENTION" | "NOT_READY";
  };
  upcomingExamsCount: number;
  notifications: any[];
  recentActivities: any[];
  verificationRequestsCount: number;
  documentExpiryAlerts: {
    documentType: string;
    expiryDate: Date | string;
    isExpired: boolean;
    daysUntilExpiry: number;
  }[];
  systemHealth: {
    status: "OPTIMAL" | "DEGRADED" | "CRITICAL";
    uptime: string;
    lastChecked: Date;
  };
}

export interface IBranchAnalytics {
  monthlyCandidateGrowth: { month: string; count: number }[];
  monthlyExamCount: { month: string; count: number }[];
  revenue: number;
  attendancePercentage: number;
  passPercentage: number;
  failPercentage: number;
  trustScoreTrend: { date: string; score: number }[];
  centerPerformance: { centerId: string; name: string; performance: number }[];
}

export interface IBranchStatistics {
  activeBranchPercentage: number;
  archivedBranchPercentage: number;
  branchGrowth: number;
  monthlyRegistrations: { month: string; count: number }[];
  totalCapacity: number;
  averageCentersPerBranch: number;
}

export interface IBranchCapacity {
  totalCenters: number;
  totalLabs: number;
  totalSeats: number;
  occupiedSeats: number;
  availableSeats: number;
  capacityPercentage: number;
  runningExams: number;
}

export interface IBulkOperationResult {
  total: number;
  successCount: number;
  failureCount: number;
  successfulIds: string[];
  failures: { id: string; reason: string }[];
}

export interface IImportValidationRow {
  rowNumber: number;
  branchCode?: string;
  email?: string;
  phone?: string;
  valid: boolean;
  errors: string[];
}


