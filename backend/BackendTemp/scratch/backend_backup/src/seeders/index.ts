import { env } from "../config/env";
import Admin from "../modules/admin/admin.model";
import { UserRole } from "../constants/roles";
import Plan from "../modules/plan/plan.model";
import { PlanCategory, PlanStatus, PlanBillingCycle } from "../modules/plan/plan.types";

export const seedMasterAdmin = async () => {
    if (!env.MASTER_ADMIN_EMAIL || !env.MASTER_ADMIN_PASSWORD) return;

    const exists = await Admin.findOne({ email: env.MASTER_ADMIN_EMAIL, isDeleted: false });
    if (!exists) {
        await Admin.create({
            firstName: "Master",
            lastName: "Admin",
            email: env.MASTER_ADMIN_EMAIL,
            phone: "0000000000",
            password: env.MASTER_ADMIN_PASSWORD,
            role: UserRole.MASTER_ADMIN,
        });
        console.log("Master Admin seeded successfully in Admin collection from environment variables.");
    }
};

export const seedPlans = async () => {
    const plans = [
      {
        planName: "Starter",
        planCode: "STARTER",
        description: "Private • Small Certification • Internal Assessments",
        category: PlanCategory.PRIVATE,
        status: PlanStatus.ACTIVE,
        billingCycle: [PlanBillingCycle.MONTHLY, PlanBillingCycle.YEARLY],
        pricing: { monthlyPrice: 12000, quarterlyPrice: 34000, halfYearlyPrice: 65000, yearlyPrice: 120000, currency: "INR", taxPercent: 18, discountPercent: 17, razorpayPlanIdMonthly: "plan_starter_monthly", razorpayPlanIdYearly: "plan_starter_yearly" },
        usageLimits: {
          maxCenters: 5, maxEmployees: 10, maxCandidates: 1000, maxSubjects: 5, maxExams: 3, maxPapers: 10, maxQuestionBankSize: 1000,
          storageLimitGB: 5, apiRequestsPerMonth: 1000, maxManagers: 2, maxConcurrentExams: 1, maxActiveShifts: 2, maxExamRooms: 5, maxInvigilators: 10,
          maxObservers: 2, maxAiProctorSessions: 100, maxFileUploadSizeMB: 10, backupRetentionDays: 7, auditLogRetentionDays: 30, reportRetentionDays: 90,
          sessionTimeoutMinutes: 30, maxLoginDevices: 2
        },
        features: {
          questionBank: true, paperApproval: true, liveMonitoring: true, geoMonitoring: true, biometric: false, attendance: true, resultApproval: true, meritList: true,
          certificate: true, notifications: true, reports: true, apiAccess: false, fileStorage: true, importExport: false, customBranding: true, sso: false, auditLogs: false,
          offlineOMR: true, observerModule: true, nlpEvaluation: false, recruitingBodyModule: false, onlineExam: true, hybridExam: true, basicAiProctoring: true,
          fullAiProctoring: false, sixteenAiModules: false, cameraSnapshot: true, liveCameraStream: false, liveCameraAndVideo: false, gpsAtLogin: false,
          continuousGpsAndGeoFence: false, fullGpsAndAiGeoFraud: false, hallTicketAndSeating: true, recruitingBodyDetailsOnHallTicket: false, recruitingBodyPortalLogin: false,
          whiteLabelAndCustomDomain: false, dedicatedServerAndSla: false, omrStrongRoomBell: false, faceVerification: false, browserLock: true, safeExamBrowser: true,
          deviceTrust: false, screenRecording: false, clipboardBlocking: true, voiceDetection: false, activityLogs: true, analyticsDashboard: false, scheduledReports: true,
          customReports: true, webhooks: false, apiRateLimiting: true, whiteLabel: false, whiteLabelLogin: false, customDomain: false, darkTheme: true, customTheme: false,
          smtpConfiguration: false, emailTemplates: false, certificateTemplates: false, admitCardTemplates: false, twoFactorAuth: false, ldapActiveDirectory: false,
          ipWhitelisting: false, recruitingModule: false, paymentGateway: false, subscription: true, invoices: true, autoInvoice: false
        }
      },
      {
        planName: "Professional",
        planCode: "PROFESSIONAL",
        description: "Universities • Agencies • TCS iON Type",
        category: PlanCategory.PRIVATE,
        status: PlanStatus.ACTIVE,
        billingCycle: [PlanBillingCycle.MONTHLY, PlanBillingCycle.YEARLY],
        pricing: { monthlyPrice: 35000, quarterlyPrice: 100000, halfYearlyPrice: 190000, yearlyPrice: 350000, currency: "INR", taxPercent: 18, discountPercent: 17, razorpayPlanIdMonthly: "plan_professional_monthly", razorpayPlanIdYearly: "plan_professional_yearly" },
        usageLimits: {
          maxCenters: 50, maxEmployees: 100, maxCandidates: 50000, maxSubjects: 50, maxExams: 20, maxPapers: 100, maxQuestionBankSize: 50000,
          storageLimitGB: 100, apiRequestsPerMonth: 50000, maxManagers: 20, maxConcurrentExams: 5, maxActiveShifts: 10, maxExamRooms: 100, maxInvigilators: 200,
          maxObservers: 20, maxAiProctorSessions: 5000, maxFileUploadSizeMB: 50, backupRetentionDays: 30, auditLogRetentionDays: 180, reportRetentionDays: 365,
          sessionTimeoutMinutes: 60, maxLoginDevices: 5
        },
        features: {
          questionBank: true, paperApproval: true, liveMonitoring: true, geoMonitoring: true, biometric: true, attendance: true, resultApproval: true, meritList: true,
          certificate: true, notifications: true, reports: true, apiAccess: true, fileStorage: true, importExport: true, customBranding: true, sso: true, auditLogs: true,
          offlineOMR: true, observerModule: true, nlpEvaluation: false, recruitingBodyModule: true, onlineExam: true, hybridExam: true, basicAiProctoring: true,
          fullAiProctoring: true, sixteenAiModules: false, cameraSnapshot: true, liveCameraStream: true, liveCameraAndVideo: false, gpsAtLogin: true,
          continuousGpsAndGeoFence: true, fullGpsAndAiGeoFraud: false, hallTicketAndSeating: true, recruitingBodyDetailsOnHallTicket: false, recruitingBodyPortalLogin: false,
          whiteLabelAndCustomDomain: false, dedicatedServerAndSla: false, omrStrongRoomBell: false, faceVerification: true, browserLock: true, safeExamBrowser: true,
          deviceTrust: true, screenRecording: false, clipboardBlocking: true, voiceDetection: true, activityLogs: true, analyticsDashboard: true, scheduledReports: true,
          customReports: true, webhooks: true, apiRateLimiting: true, whiteLabel: true, whiteLabelLogin: false, customDomain: false, darkTheme: true, customTheme: true,
          smtpConfiguration: true, emailTemplates: true, certificateTemplates: true, admitCardTemplates: true, twoFactorAuth: true, ldapActiveDirectory: false,
          ipWhitelisting: false, recruitingModule: false, paymentGateway: true, subscription: true, invoices: true, autoInvoice: true
        }
      },
      {
        planName: "Enterprise",
        planCode: "ENTERPRISE",
        description: "Government • Large-scale • Multi-body Exams",
        category: PlanCategory.GOVERNMENT,
        status: PlanStatus.ACTIVE,
        billingCycle: [PlanBillingCycle.MONTHLY, PlanBillingCycle.YEARLY],
        pricing: { monthlyPrice: 90000, quarterlyPrice: 260000, halfYearlyPrice: 500000, yearlyPrice: 900000, currency: "INR", taxPercent: 18, discountPercent: 17, razorpayPlanIdMonthly: "plan_enterprise_monthly", razorpayPlanIdYearly: "plan_enterprise_yearly" },
        usageLimits: {
          maxCenters: 500, maxEmployees: 1000, maxCandidates: 1000000, maxSubjects: 500, maxExams: 100, maxPapers: 1000, maxQuestionBankSize: 500000,
          storageLimitGB: 1000, apiRequestsPerMonth: 1000000, maxManagers: 100, maxConcurrentExams: 20, maxActiveShifts: 50, maxExamRooms: 1000, maxInvigilators: 2000,
          maxObservers: 200, maxAiProctorSessions: 100000, maxFileUploadSizeMB: 500, backupRetentionDays: 365, auditLogRetentionDays: 1095, reportRetentionDays: 1095,
          sessionTimeoutMinutes: 120, maxLoginDevices: 10
        },
        features: {
          questionBank: true, paperApproval: true, liveMonitoring: true, geoMonitoring: true, biometric: true, attendance: true, resultApproval: true, meritList: true,
          certificate: true, notifications: true, reports: true, apiAccess: true, fileStorage: true, importExport: true, customBranding: true, sso: true, auditLogs: true,
          offlineOMR: true, observerModule: true, nlpEvaluation: true, recruitingBodyModule: true, onlineExam: true, hybridExam: true, basicAiProctoring: true,
          fullAiProctoring: true, sixteenAiModules: true, cameraSnapshot: true, liveCameraStream: true, liveCameraAndVideo: true, gpsAtLogin: true,
          continuousGpsAndGeoFence: true, fullGpsAndAiGeoFraud: true, hallTicketAndSeating: true, recruitingBodyDetailsOnHallTicket: true, recruitingBodyPortalLogin: true,
          whiteLabelAndCustomDomain: true, dedicatedServerAndSla: true, omrStrongRoomBell: true, faceVerification: true, browserLock: true, safeExamBrowser: true,
          deviceTrust: true, screenRecording: true, clipboardBlocking: true, voiceDetection: true, activityLogs: true, analyticsDashboard: true, scheduledReports: true,
          customReports: true, webhooks: true, apiRateLimiting: true, whiteLabel: true, whiteLabelLogin: true, customDomain: true, darkTheme: true, customTheme: true,
          smtpConfiguration: true, emailTemplates: true, certificateTemplates: true, admitCardTemplates: true, twoFactorAuth: true, ldapActiveDirectory: true,
          ipWhitelisting: true, recruitingModule: true, paymentGateway: true, subscription: true, invoices: true, autoInvoice: true
        }
      }
    ];

    const masterAdmin = await Admin.findOne({ role: UserRole.MASTER_ADMIN });
    if (!masterAdmin) return;

    for (const plan of plans) {
        await Plan.findOneAndUpdate(
            { planCode: plan.planCode },
            { ...plan, createdBy: masterAdmin._id },
            { upsert: true, returnDocument: "after" }
        );
        console.log(`Plan ${plan.planCode} seeded/updated.`);
    }
};
