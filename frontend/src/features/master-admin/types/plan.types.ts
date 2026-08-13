export enum PlanCategory {
  GOVERNMENT = "GOVERNMENT",
  PRIVATE = "PRIVATE",
}

export enum PlanBillingCycle {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  HALFYEARLY = "HALFYEARLY",
  YEARLY = "YEARLY",
  LIFETIME = "LIFETIME",
}

export enum PlanStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export interface IPlanFeatures {
  questionBank: boolean;
  paperApproval: boolean;
  liveMonitoring: boolean;
  geoMonitoring: boolean;
  biometric: boolean;
  attendance: boolean;
  resultApproval: boolean;
  meritList: boolean;
  certificate: boolean;
  notifications: boolean;
  reports: boolean;
  apiAccess: boolean;
  fileStorage: boolean;
  importExport: boolean;
  customBranding: boolean;
  sso: boolean;
  auditLogs: boolean;
  offlineOMR: boolean;
  observerModule: boolean;
  nlpEvaluation: boolean;
  recruitingBodyModule: boolean;
  onlineExam: boolean;
  hybridExam: boolean;
  basicAiProctoring: boolean;
  fullAiProctoring: boolean;
  sixteenAiModules: boolean;
  cameraSnapshot: boolean;
  liveCameraStream: boolean;
  liveCameraAndVideo: boolean;
  gpsAtLogin: boolean;
  continuousGpsAndGeoFence: boolean;
  fullGpsAndAiGeoFraud: boolean;
  hallTicketAndSeating: boolean;
  recruitingBodyDetailsOnHallTicket: boolean;
  recruitingBodyPortalLogin: boolean;
  whiteLabelAndCustomDomain: boolean;
  dedicatedServerAndSla: boolean;
  omrStrongRoomBell: boolean;
  faceVerification: boolean;
  browserLock: boolean;
  safeExamBrowser: boolean;
  deviceTrust: boolean;
  screenRecording: boolean;
  clipboardBlocking: boolean;
  voiceDetection: boolean;
  activityLogs: boolean;
  analyticsDashboard: boolean;
  scheduledReports: boolean;
  customReports: boolean;
  webhooks: boolean;
  apiRateLimiting: boolean;
  whiteLabel: boolean;
  whiteLabelLogin: boolean;
  customDomain: boolean;
  darkTheme: boolean;
  customTheme: boolean;
  smtpConfiguration: boolean;
  emailTemplates: boolean;
  certificateTemplates: boolean;
  admitCardTemplates: boolean;
  twoFactorAuth: boolean;
  ldapActiveDirectory: boolean;
  ipWhitelisting: boolean;
  recruitingModule: boolean;
  paymentGateway: boolean;
  subscription: boolean;
  invoices: boolean;
  autoInvoice: boolean;
}

export interface IPlanPricing {
  monthlyPrice: number;
  quarterlyPrice: number;
  halfYearlyPrice: number;
  yearlyPrice: number;
  currency: string;
  taxPercent: number;
  discountPercent: number;
  razorpayPlanIdMonthly?: string;
  razorpayPlanIdYearly?: string;
}

export interface IPlanUsageLimits {
  maxBranches: number;
  maxCenters: number;
  maxEmployees: number;
  maxCandidates: number;
  maxSubjects: number;
  maxExams: number;
  maxPapers: number;
  maxQuestionBankSize: number;
  storageLimitGB: number;
  apiRequestsPerMonth: number;
  maxManagers: number;
  maxConcurrentExams: number;
  maxActiveShifts: number;
  maxExamRooms: number;
  maxInvigilators: number;
  maxObservers: number;
  maxAiProctorSessions: number;
  maxFileUploadSizeMB: number;
  backupRetentionDays: number;
  auditLogRetentionDays: number;
  reportRetentionDays: number;
  sessionTimeoutMinutes: number;
  maxLoginDevices: number;
}

export interface Plan {
  _id: string;
  planName: string;
  planCode: string;
  description?: string;
  category: PlanCategory;
  status: PlanStatus;
  billingCycle: PlanBillingCycle[];
  pricing: IPlanPricing;
  usageLimits: IPlanUsageLimits;
  features: IPlanFeatures;
  activeCompaniesCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PlanStatus;
  category?: PlanCategory;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
