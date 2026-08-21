import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/app-layout/AppLayout'
import { CandidateLayout } from '@/layouts/CandidateLayout'
import { CandidateDashboardPage } from '@/features/candidate/pages/CandidateDashboardPage'
import { CandidateProfilePage } from '@/features/candidate/pages/CandidateProfilePage'
import { ApplicationStatusPage } from '@/features/candidate/pages/ApplicationStatusPage'
import { MyDocumentsPage } from '@/features/candidate/pages/MyDocumentsPage'
import { CandidateAdmitCardPage } from '@/features/candidate/pages/CandidateAdmitCardPage'
import { ExamSchedulePage } from '@/features/candidate/pages/ExamSchedulePage'
import { MockTestPage } from '@/features/candidate/pages/MockTestPage'
import { CandidateResultsPage } from '@/features/candidate/pages/CandidateResultsPage'
import { CandidateMeritListPage } from '@/features/candidate/pages/CandidateMeritListPage'
import { CandidateCertificatesPage } from '@/features/candidate/pages/CandidateCertificatesPage'
import { CandidateNotificationsPage } from '@/features/candidate/pages/CandidateNotificationsPage'
import { CandidateSupportPage } from '@/features/candidate/pages/CandidateSupportPage'
import { ExamArenaPage } from '@/features/exam-arena/pages/ExamArenaPage'
import { ExamInstructionsPage } from '@/features/exam-arena/pages/ExamInstructionsPage'
import { CandidateExamGuard } from '@/core/auth/CandidateExamGuard'
import { ExamManagerLayout } from '@/layouts/ExamManagerLayout'
import { ExamCalendarPage } from '@/features/exam-manager/pages/ExamCalendarPage'
import {
  ExamListPage,
  CreateExamPage,
  TopicManagementPage,
  ExamSchedulingPage,
  ShiftManagementPage,
  CandidateImportPage,
  ExamAuditLogsPage,
} from '@/features/exam-manager/pages'

// Live Monitoring Pages
import { LiveDashboardPage } from '@/features/company/live-monitoring/pages/LiveDashboardPage'
import { CandidateMonitoringPage } from '@/features/company/live-monitoring/pages/CandidateMonitoringPage'
import { CenterMonitoringPage } from '@/features/company/live-monitoring/pages/CenterMonitoringPage'
import { ViolationMonitoringPage } from '@/features/company/live-monitoring/pages/ViolationMonitoringPage'
import { ObserverMonitoringPage } from '@/features/company/live-monitoring/pages/ObserverMonitoringPage'
import { ActivityLogsPage as LiveActivityLogsPage } from '@/features/company/live-monitoring/pages/ActivityLogsPage'

// Result Management Pages
import { ResultDashboardPage } from '@/features/company/result/pages/ResultDashboardPage'
import { ResultListPage } from '@/features/company/result/pages/ResultListPage'
import { GenerateResultsPage } from '@/features/company/result/pages/GenerateResultsPage'
import { ResultDetailsPage } from '@/features/company/result/pages/ResultDetailsPage'
import { ResultPreviewPage } from '@/features/company/result/pages/ResultPreviewPage'
import { PublishResultsPage } from '@/features/company/result/pages/PublishResultsPage'
import { ResultHistoryPage } from '@/features/company/result/pages/ResultHistoryPage'
import { ResultAnalyticsPage } from '@/features/company/result/pages/ResultAnalyticsPage'

// Merit Management Pages
import { MeritDashboardPage } from '@/features/company/merit/pages/MeritDashboardPage'
import { MeritListPage } from '@/features/company/merit/pages/MeritListPage'
import { GenerateMeritPage } from '@/features/company/merit/pages/GenerateMeritPage'
import { MeritDetailsPage } from '@/features/company/merit/pages/MeritDetailsPage'
import { MeritPreviewPage } from '@/features/company/merit/pages/MeritPreviewPage'
import { PublishMeritPage } from '@/features/company/merit/pages/PublishMeritPage'
import { MeritHistoryPage } from '@/features/company/merit/pages/MeritHistoryPage'
import { MeritAnalyticsPage } from '@/features/company/merit/pages/MeritAnalyticsPage'

// Certificate Management Pages
import { CertificateDashboardPage } from '@/features/company/certificates/pages/CertificateDashboardPage'
import { CertificateListPage } from '@/features/company/certificates/pages/CertificateListPage'
import { CertificateTemplatesPage } from '@/features/company/certificates/pages/CertificateTemplatesPage'
import { GenerateCertificatesPage } from '@/features/company/certificates/pages/GenerateCertificatesPage'
import { CertificateDetailsPage } from '@/features/company/certificates/pages/CertificateDetailsPage'
import { CertificatePreviewPage } from '@/features/company/certificates/pages/CertificatePreviewPage'
import { CertificateVerificationPage } from '@/features/company/certificates/pages/CertificateVerificationPage'
import { CertificateHistoryPage } from '@/features/company/certificates/pages/CertificateHistoryPage'
import { CertificateAnalyticsPage } from '@/features/company/certificates/pages/CertificateAnalyticsPage'

// Reports & Analytics Pages
import { ReportsDashboardPage } from '@/features/company/reports/pages/ReportsDashboardPage'
import { EnterpriseAnalyticsPage } from '@/features/company/enterprise-analytics/pages/EnterpriseAnalyticsPage'
import { ExamReportsPage } from '@/features/company/reports/pages/ExamReportsPage'
import { CandidateReportsPage } from '@/features/company/reports/pages/CandidateReportsPage'
import { AttendanceReportsPage } from '@/features/company/reports/pages/AttendanceReportsPage'
import { ResultReportsPage } from '@/features/company/reports/pages/ResultReportsPage'
import { MeritReportsPage } from '@/features/company/reports/pages/MeritReportsPage'
import { CenterReportsPage } from '@/features/company/reports/pages/CenterReportsPage'
import { RevenueReportsPage } from '@/features/company/reports/pages/RevenueReportsPage'
import { AuditReportsPage } from '@/features/company/reports/pages/AuditReportsPage'
import { ScheduledReportsPage } from '@/features/company/reports/pages/ScheduledReportsPage'
import { ExportReportsPage } from '@/features/company/reports/pages/ExportReportsPage'

// System Settings Pages
import { SettingsLayout } from '@/features/company/system-settings/components/SettingsLayout'
import { SettingsDashboardPage } from '@/features/company/system-settings/pages/SettingsDashboardPage'
import { GeneralSettingsPage } from '@/features/company/system-settings/pages/GeneralSettingsPage'
import { OrganizationSettingsPage } from '@/features/company/system-settings/pages/OrganizationSettingsPage'
import { SecuritySettingsPage } from '@/features/company/system-settings/pages/SecuritySettingsPage'
import { AuthenticationSettingsPage } from '@/features/company/system-settings/pages/AuthenticationSettingsPage'
import { ExamPolicyPage } from '@/features/company/system-settings/pages/ExamPolicyPage'
import { NotificationSettingsPage } from '@/features/company/system-settings/pages/NotificationSettingsPage'
import { EmailConfigurationPage } from '@/features/company/system-settings/pages/EmailConfigurationPage'
import { SmsConfigurationPage } from '@/features/company/system-settings/pages/SmsConfigurationPage'
import { BrandingPage } from '@/features/company/system-settings/pages/BrandingPage'
import { ThemeSettingsPage } from '@/features/company/system-settings/pages/ThemeSettingsPage'
import { FeatureFlagsPage } from '@/features/company/system-settings/pages/FeatureFlagsPage'
import { IntegrationsPage } from '@/features/company/system-settings/pages/IntegrationsPage'
import { ApiKeysPage } from '@/features/company/system-settings/pages/ApiKeysPage'
import { BackupPage } from '@/features/company/system-settings/pages/BackupPage'
import { AuditConfigurationPage } from '@/features/company/system-settings/pages/AuditConfigurationPage'

// Notification Center Pages
import { NotificationDashboardPage } from '@/features/company/notifications/pages/NotificationDashboardPage'
import { InAppNotificationsPage } from '@/features/company/notifications/pages/InAppNotificationsPage'
import { EmailNotificationsPage } from '@/features/company/notifications/pages/EmailNotificationsPage'
import { SmsNotificationsPage } from '@/features/company/notifications/pages/SmsNotificationsPage'
import { PushNotificationsPage } from '@/features/company/notifications/pages/PushNotificationsPage'
import { AnnouncementsPage } from '@/features/company/notifications/pages/AnnouncementsPage'
import { NotificationTemplatesPage } from '@/features/company/notifications/pages/NotificationTemplatesPage'
import { BroadcastMessagesPage } from '@/features/company/notifications/pages/BroadcastMessagesPage'
import { NotificationHistoryPage } from '@/features/company/notifications/pages/NotificationHistoryPage'
import { UserPreferencesPage } from '@/features/company/notifications/pages/UserPreferencesPage'
import { ScheduledNotificationsPage } from '@/features/company/notifications/pages/ScheduledNotificationsPage'

// Audit Logs Pages
import { AuditDashboardPage } from '@/features/company/audit/pages/AuditDashboardPage'
import { UserActivityPage } from '@/features/company/audit/pages/UserActivityPage'
import { LoginHistoryPage } from '@/features/company/audit/pages/LoginHistoryPage'
import { SecurityEventsPage } from '@/features/company/audit/pages/SecurityEventsPage'
import { SystemEventsPage } from '@/features/company/audit/pages/SystemEventsPage'
import { ExamEventsPage } from '@/features/company/audit/pages/ExamEventsPage'
import { ResultEventsPage } from '@/features/company/audit/pages/ResultEventsPage'
import { ApiLogsPage } from '@/features/company/audit/pages/ApiLogsPage'
import { TimelinePage } from '@/features/company/audit/pages/TimelinePage'
import { ExportAuditLogsPage } from '@/features/company/audit/pages/ExportAuditLogsPage'

// Help Desk & Support
import { SupportDashboardPage } from '@/features/company/support/pages/SupportDashboardPage'
import { TicketListPage } from '@/features/company/support/pages/TicketListPage'
import { CreateTicketPage } from '@/features/company/support/pages/CreateTicketPage'
import { TicketDetailsPage } from '@/features/company/support/pages/TicketDetailsPage'
import { TicketAssignmentPage } from '@/features/company/support/pages/TicketAssignmentPage'
import { KnowledgeBasePage } from '@/features/company/support/pages/KnowledgeBasePage'
import { FaqPage } from '@/features/company/support/pages/FaqPage'
import { LiveChatPage } from '@/features/company/support/pages/LiveChatPage'
import { SupportHistoryPage } from '@/features/company/support/pages/SupportHistoryPage'
import { SupportAnalyticsPage } from '@/features/company/support/pages/SupportAnalyticsPage'

// Import & Export Management
import { ImportExportDashboardPage } from '@/features/company/import-export/pages/ImportExportDashboardPage'
import { ImportDataPage } from '@/features/company/import-export/pages/ImportDataPage'
import { ExportDataPage } from '@/features/company/import-export/pages/ExportDataPage'
import { ImportTemplatesPage } from '@/features/company/import-export/pages/ImportTemplatesPage'
import { JobsPage } from '@/features/company/import-export/pages/JobsPage'
import { HistoryPage } from '@/features/company/import-export/pages/HistoryPage'
import { ErrorReportsPage } from '@/features/company/import-export/pages/ErrorReportsPage'
import { FieldMappingPage } from '@/features/company/import-export/pages/FieldMappingPage'
import { ImportExportSettingsPage } from '@/features/company/import-export/pages/ImportExportSettingsPage'

// File & Document Management
import { FileDashboardPage } from '@/features/company/file-management/pages/FileDashboardPage'
import { DocumentLibraryPage } from '@/features/company/file-management/pages/DocumentLibraryPage'
import { UploadCenterPage } from '@/features/company/file-management/pages/UploadCenterPage'
import { FolderManagementPage } from '@/features/company/file-management/pages/FolderManagementPage'
import { CategoriesPage } from '@/features/company/file-management/pages/CategoriesPage'
import { FileDetailsPage } from '@/features/company/file-management/pages/FileDetailsPage'
import { VersionHistoryPage } from '@/features/company/file-management/pages/VersionHistoryPage'
import { ActivityLogsPage as FileActivityLogsPage } from '@/features/company/file-management/pages/ActivityLogsPage'
import { ArchivePage } from '@/features/company/file-management/pages/ArchivePage'
import { StorageSettingsPage } from '@/features/company/file-management/pages/StorageSettingsPage'

// Payment & Finance Management
import { PaymentDashboardPage } from '@/features/company/payments/pages/PaymentDashboardPage'
import { TransactionsPage } from '@/features/company/payments/pages/TransactionsPage'
import { FeeManagementPage } from '@/features/company/payments/pages/FeeManagementPage'
import { InvoicesPage } from '@/features/company/payments/pages/InvoicesPage'
import { ReceiptsPage } from '@/features/company/payments/pages/ReceiptsPage'
import { RefundsPage } from '@/features/company/payments/pages/RefundsPage'
import { PaymentGatewaysPage } from '@/features/company/payments/pages/PaymentGatewaysPage'
import { SettlementsPage } from '@/features/company/payments/pages/SettlementsPage'
import { FinancialReportsPage } from '@/features/company/payments/pages/FinancialReportsPage'
import { PaymentSettingsPage } from '@/features/company/payments/pages/PaymentSettingsPage'

// Offline Examination Management
import { OfflineExamDashboardPage } from '@/features/company/offline-exam/pages/OfflineExamDashboardPage'
import { OfflineSessionsPage } from '@/features/company/offline-exam/pages/OfflineSessionsPage'
import { AttendancePage as OfflineAttendancePage } from '@/features/company/offline-exam/pages/AttendancePage'
import { SeatingPlanPage } from '@/features/company/offline-exam/pages/SeatingPlanPage'
import { InvigilatorsPage } from '@/features/company/offline-exam/pages/InvigilatorsPage'
import { OmrManagementPage } from '@/features/company/offline-exam/pages/OmrManagementPage'
import { ManualEvaluationPage } from '@/features/company/offline-exam/pages/ManualEvaluationPage'
import { ExamMaterialsPage } from '@/features/company/offline-exam/pages/ExamMaterialsPage'
import { OfflineResultsPage } from '@/features/company/offline-exam/pages/OfflineResultsPage'
import { OfflineReportsPage } from '@/features/company/offline-exam/pages/OfflineReportsPage'
// Observer Management
import { ObserverDashboardPage } from '@/features/company/observer/pages/ObserverDashboardPage'
import { ObserversPage } from '@/features/company/observer/pages/ObserversPage'
import { InvigilatorsPage as ObserverInvigilatorsPage } from '@/features/company/observer/pages/InvigilatorsPage'
import { DutyAllocationPage } from '@/features/company/observer/pages/DutyAllocationPage'
import { DutyAttendancePage } from '@/features/company/observer/pages/DutyAttendancePage'
import { IncidentsPage } from '@/features/company/observer/pages/IncidentsPage'
import { ViolationsPage } from '@/features/company/observer/pages/ViolationsPage'
import { RoomsPage as ObserverRoomsPage } from '@/features/company/observer/pages/RoomsPage'
import { ShiftsPage } from '@/features/company/observer/pages/ShiftsPage'
import { PerformancePage } from '@/features/company/observer/pages/PerformancePage'
import { ActivityLogsPage as ObserverActivityLogsPage } from '@/features/company/observer/pages/ActivityLogsPage'

// Dashboard & BI Management

import { DashboardPage as MasterAdminDashboardPage } from '@/features/master-admin/pages/DashboardPage'
import { CompanyAdminDashboard } from '@/features/dashboard/pages/CompanyAdminDashboard'
import { ExamManagerDashboard } from '@/features/dashboard/pages/ExamManagerDashboard'
import { CenterManagerDashboard } from '@/features/dashboard/pages/CenterManagerDashboard'
import { CenterStaffPage } from '@/features/center/pages/CenterStaffPage'
import { CenterLabDetailsPage } from '@/features/center/pages/CenterLabDetailsPage'
import { AssignedExamsPage } from '@/features/center/pages/AssignedExamsPage'
import { CenterInfrastructurePage } from '@/features/center/pages/CenterInfrastructurePage'
import { CenterPhotosPage } from '@/features/center/pages/CenterPhotosPage'
import { CenterLocationPage } from '@/features/center/pages/CenterLocationPage'
import { CenterSystemNetworkPage } from '@/features/center/pages/CenterSystemNetworkPage'
import { CenterPaymentsPage } from '@/features/center/pages/CenterPaymentsPage'
import { CenterAuditLogsPage } from '@/features/center/pages/CenterAuditLogsPage'
import { CenterManagerProfilePage } from '@/features/center/pages/CenterManagerProfilePage'
import { AssignExamStaffPage } from '@/features/center/pages/AssignExamStaffPage'
import { AssignCandidateSeatAllocationPage } from '@/features/center/pages/AssignCandidateSeatAllocationPage'
import { AssignedCandidateAttendancePage } from '@/features/center/pages/AssignedCandidateAttendancePage'
import { ObserverDashboard } from '@/features/dashboard/pages/ObserverDashboard'
import { PaperSetterDashboard } from '@/features/dashboard/pages/PaperSetterDashboard'
import { PaperReviewerDashboard } from '@/features/dashboard/pages/PaperReviewerDashboard'
import { TechnicalTeamDashboard } from '@/features/dashboard/pages/TechnicalTeamDashboard'
import { CandidateDashboard as BIDashboardCandidate } from '@/features/dashboard/pages/CandidateDashboard'
import { CommandCenterDashboard } from '@/features/dashboard/pages/CommandCenterDashboard'
import { AIProctorerDashboard } from '@/features/dashboard/pages/AIProctorerDashboard'
import { BiometricVerifierDashboard } from '@/features/dashboard/pages/BiometricVerifierDashboard'
import { EntryCheckerDashboard } from '@/features/entry-checker/pages/EntryCheckerDashboard'
import { InvigilatorDashboard } from '@/features/dashboard/pages/InvigilatorDashboard'
import { GovtAuthorityDashboard } from '@/features/dashboard/pages/GovtAuthorityDashboard'
import { GovtImportCentersPage } from '@/features/govt-authority/pages/GovtImportCentersPage'
import { PrivateCandidateImportPage } from '@/features/private-authority/pages/PrivateCandidateImportPage'
import { PrivateImportCentersPage } from '@/features/private-authority/pages/PrivateImportCentersPage'
import { RoleDashboard } from '@/features/dashboard/pages/RoleDashboard'
import { DashboardSettings } from '@/features/dashboard/pages/DashboardSettings'

// Design System
import { DesignSystemLayout } from '@/features/design-system/components/DesignSystemLayout'
import { IntroductionPage } from '@/features/design-system/pages/IntroductionPage'
import { DesignTokensPage } from '@/features/design-system/pages/DesignTokensPage'
import { TypographyPage } from '@/features/design-system/pages/TypographyPage'
import { IconsPage } from '@/features/design-system/pages/IconsPage'
import { LayoutSystemPage } from '@/features/design-system/pages/LayoutSystemPage'
import { ButtonsPage } from '@/features/design-system/pages/ButtonsPage'
import { FormsPage } from '@/features/design-system/pages/FormsPage'
import { TablesPage } from '@/features/design-system/pages/TablesPage'
import { CardsPage } from '@/features/design-system/pages/CardsPage'
import { DialogsPage } from '@/features/design-system/pages/DialogsPage'
import { NavigationPage } from '@/features/design-system/pages/NavigationPage'
import { FeedbackPage } from '@/features/design-system/pages/FeedbackPage'
import { BadgesPage } from '@/features/design-system/pages/BadgesPage'
import { ChartsPage } from '@/features/design-system/pages/ChartsPage'
import { AccessibilityGuidePage } from '@/features/design-system/pages/AccessibilityGuidePage'
import { ResponsiveGuidePage } from '@/features/design-system/pages/ResponsiveGuidePage'
import { ComponentPlaygroundPage } from '@/features/design-system/pages/ComponentPlaygroundPage'

// Developer Tools
import { DeveloperDashboard } from '@/features/dev-tools/pages/DeveloperDashboard'
import { RouteExplorerPage } from '@/features/dev-tools/pages/RouteExplorerPage'
import { ApiExplorerPage } from '@/features/dev-tools/pages/ApiExplorerPage'
import { PermissionMatrixPage } from '@/features/dev-tools/pages/PermissionMatrixPage'
import { ThemePreviewPage } from '@/features/dev-tools/pages/ThemePreviewPage'
import { IconBrowserPage } from '@/features/dev-tools/pages/IconBrowserPage'
import { MockDataViewerPage } from '@/features/dev-tools/pages/MockDataViewerPage'
import { ErrorBoundaryTesterPage } from '@/features/dev-tools/pages/ErrorBoundaryTesterPage'
import { RegisterCompanyPage } from '../features/auth/pages/RegisterCompanyPage'
import { MasterAdminLoginPage } from '../features/auth/pages/MasterAdminLoginPage'
import { CandidateLoginPage } from '../features/auth/pages/CandidateLoginPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { PerformanceMonitorPage } from '@/features/dev-tools/pages/PerformanceMonitorPage'
import { BuildInformationPage } from '@/features/dev-tools/pages/BuildInformationPage'
import { EnvironmentInformationPage } from '@/features/dev-tools/pages/EnvironmentInformationPage'
import { ApplicationHealthPage } from '@/features/dev-tools/pages/ApplicationHealthPage'

import { NotFoundPage } from '@/shared/components/NotFoundPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { UnauthorizedPage } from '@/features/auth/pages/UnauthorizedPage'
import { SessionExpiredPage } from '@/features/auth/pages/SessionExpiredPage'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { GuestRoute } from '@/features/auth/components/GuestRoute'
import { RoleGuard } from '@/features/auth/components/RoleGuard'

// Master Admin Pages
// Master Admin Pages
import { CompaniesPage } from '@/features/master-admin/pages/CompaniesPage'
import { CreateCompanyPage } from '@/features/master-admin/pages/CreateCompanyPage'
import { EditCompanyPage } from '@/features/master-admin/pages/EditCompanyPage'
import { CompanyDetailsPage } from '@/features/master-admin/pages/CompanyDetailsPage'
import { CompanyApprovalPage } from '@/features/master-admin/pages/CompanyApprovalPage'
import { CompanyApprovalDetailsPage } from '@/features/master-admin/pages/CompanyApprovalDetailsPage'
import { SubscriptionsPage } from '@/features/master-admin/pages/SubscriptionsPage'
import { SubscriptionDetailsPage } from '@/features/master-admin/pages/SubscriptionDetailsPage'
import { SubscriptionSelectionPage } from '@/features/company/pages/SubscriptionSelectionPage'
import { CompanyOnboardingPage } from '@/features/company/pages/CompanyOnboardingPage'
import { SubscriptionGuard } from '@/features/company/components/SubscriptionGuard'
import { PlansPage } from '@/features/master-admin/pages/PlansPage'

import { CreatePlanPage } from '@/features/master-admin/pages/CreatePlanPage'
import { EditPlanPage } from '@/features/master-admin/pages/EditPlanPage'
import { PlanDetailsPage } from '@/features/master-admin/pages/PlanDetailsPage'
import { InvoiceDashboardPage } from '@/features/master-admin/pages/InvoiceDashboardPage'
import { InvoiceAuditLogPage } from '@/features/master-admin/pages/InvoiceAuditLogPage'
import { InvoicesPage as MAInvoicesPage } from '@/features/master-admin/pages/InvoicesPage'
import { InvoiceDetailsPage } from '@/features/master-admin/pages/InvoiceDetailsPage'
import { AccessManagementPage } from '@/features/master-admin/pages/AccessManagementPage'
import { CreateUserPage } from '@/features/master-admin/pages/CreateUserPage'
import { EditUserPage } from '@/features/master-admin/pages/EditUserPage'
import { UserDetailsPage } from '@/features/master-admin/pages/UserDetailsPage'
import { UserActivityPage as SystemUserActivityPage } from '@/features/master-admin/pages/UserActivityPage'
import { RoleHierarchyPage } from '@/features/master-admin/pages/RoleHierarchyPage'
import { RoleDetailsPage } from '@/features/master-admin/pages/RoleDetailsPage'
import { AssignPermissionsPage } from '@/features/master-admin/pages/AssignPermissionsPage'
import { RoleAuditLogPage } from '@/features/master-admin/pages/RoleAuditLogPage'
import { CreateRolePage } from '@/features/master-admin/pages/CreateRolePage'
import { EditRolePage } from '@/features/master-admin/pages/EditRolePage'
import { SecurityPage } from '@/features/master-admin/pages/SecurityPage'
import { ThreatDashboardPage } from '@/features/master-admin/pages/ThreatDashboardPage'
import { ThreatEventDetailsPage } from '@/features/master-admin/pages/ThreatEventDetailsPage'
import { LoginSessionsPage } from '@/features/master-admin/pages/LoginSessionsPage'
import { TrustedDevicesPage } from '@/features/master-admin/pages/TrustedDevicesPage'
import { IpRulesPage } from '@/features/master-admin/pages/IpRulesPage'
import { AuthPoliciesPage } from '@/features/master-admin/pages/AuthPoliciesPage'
import { MfaManagementPage } from '@/features/master-admin/pages/MfaManagementPage'
import { ActivityLogsPage } from '@/features/master-admin/pages/ActivityLogsPage'

import { MAReportTemplatesPage } from '../features/master-admin/pages/reports/MAReportTemplatesPage'
import { PaperSetterWorkspace } from '@/features/paper-setter/pages/PaperSetterWorkspace'
import { PaperSetterSubjectWorkspace } from '@/features/paper-setter/pages/PaperSetterSubjectWorkspace'
import { PaperSetterPapersPage } from '@/features/paper-setter/pages/PaperSetterPapersPage'
import { SystemSettingsPage } from '../features/master-admin/pages/SystemSettingsPage'
import { GeneralSettingsPage as MAGeneralSettingsPage } from '../features/master-admin/pages/settings/GeneralSettingsPage'
import { ExamConfigurationPage } from '@/features/master-admin/pages/settings/ExamConfigurationPage'
import { ConfigurationHistoryPage } from '@/features/master-admin/pages/settings/ConfigurationHistoryPage'
import { OrganizationSettingsPage as MAOrganizationSettingsPage } from '@/features/master-admin/pages/settings/OrganizationSettingsPage'
import { SecuritySettingsPage as MASecuritySettingsPage } from '@/features/master-admin/pages/settings/SecuritySettingsPage'
import { NotificationSettingsPage as MANotificationSettingsPage } from '@/features/master-admin/pages/settings/NotificationSettingsPage'
import { EmailSmsGatewayPage } from '@/features/master-admin/pages/settings/EmailSmsGatewayPage'
import { StorageSettingsPage as MAStorageSettingsPage } from '@/features/master-admin/pages/settings/StorageSettingsPage'
import { BackupSettingsPage } from '@/features/master-admin/pages/settings/BackupSettingsPage'
import { IntegrationsPage as MAIntegrationsPage } from '@/features/master-admin/pages/settings/IntegrationsPage'
import { AuditCompliancePage } from '@/features/master-admin/components/AuditCompliance/AuditCompliancePage'
import { ReportsPage } from '@/features/master-admin/pages/ReportsPage'
import { UserAccessReportsPage } from '@/features/master-admin/pages/UserAccessReportsPage'
import { CandidateReportsPage as MACandidateReportsPage } from '@/features/master-admin/pages/CandidateReportsPage'
import { ExamReportsPage as MAExamReportsPage } from '@/features/master-admin/pages/ExamReportsPage'
import { AttendanceReportsPage as MAAttendanceReportsPage } from '@/features/master-admin/pages/AttendanceReportsPage'
import { ResultReportsPage as MAResultReportsPage } from '@/features/master-admin/pages/ResultReportsPage'
import MAFinancialReportsPage from '@/features/master-admin/pages/reports/FinancialReportsPage'
import { SecurityReportsPage as MASecurityReportsPage } from '@/features/master-admin/pages/reports/SecurityReportsPage'

import { SupportTicketsPage } from '@/features/master-admin/pages/SupportTicketsPage'
import { ProfilePage as MAProfilePage } from '@/features/master-admin/pages/ProfilePage'

// Company Admin Pages
import { CompanyDashboardPage } from '@/features/company/pages/CompanyDashboardPage'
import { CompanyProfilePage } from '@/features/company/pages/CompanyProfilePage'
import { CompanySettingsPage } from '@/features/company/pages/CompanySettingsPage'

// Company Center Pages
import { CenterListPage } from '@/features/company/center/pages/CenterListPage'
import { CreateCenterPage } from '@/features/company/center/pages/CreateCenterPage'
import { CenterDetailsPage } from '@/features/company/center/pages/CenterDetailsPage'
import { EditCenterPage } from '@/features/company/center/pages/EditCenterPage'
import { InfrastructurePage } from '@/features/company/center/pages/InfrastructurePage'
import { RoomsPage } from '@/features/company/center/pages/RoomsPage'
import { DevicesPage } from '@/features/company/center/pages/DevicesPage'
import { DocumentsPage } from '@/features/company/center/pages/DocumentsPage'
import { ApprovalPage } from '@/features/company/center/pages/ApprovalPage'
import { CenterSetupWizardPage } from '@/features/company/center/pages/CenterSetupWizardPage'
import { CenterOnboarding } from '@/features/center/pages/CenterOnboarding'
import { CenterPendingVerificationsPage } from '@/features/company/center/pages/CenterPendingVerificationsPage'

import { CompanySubjectTopicsPage } from '@/features/company/exams/pages/CompanySubjectTopicsPage'

// Company Staff Pages
import { StaffListPage } from '@/features/company/staff/pages/StaffListPage'
import { CreateStaffPage } from '@/features/company/staff/pages/CreateStaffPage'
import { PaperSettersManagementPage } from '@/features/company/staff/pages/PaperSettersManagementPage'
import { FinalPapersPage } from '@/features/company/staff/pages/FinalPapersPage'
import { StaffDetailsPage } from '@/features/company/staff/pages/StaffDetailsPage'
import { EditStaffPage } from '@/features/company/staff/pages/EditStaffPage'
import { RoleAssignmentPage } from '@/features/company/staff/pages/RoleAssignmentPage'
import { PermissionAssignmentPage } from '@/features/company/staff/pages/PermissionAssignmentPage'

import { SidebarManagementPage } from '@/features/company/staff/pages/SidebarManagementPage'

// Company Candidate Pages
import { CandidateListPage } from '@/features/company/candidate/pages/CandidateListPage'
import { CreateCandidatePage } from '@/features/company/candidate/pages/CreateCandidatePage'
import { CandidateDetailsPage } from '@/features/company/candidate/pages/CandidateDetailsPage'
import { EditCandidatePage } from '@/features/company/candidate/pages/EditCandidatePage'
import { ImportCandidatesPage } from '@/features/company/candidate/pages/ImportCandidatesPage'
import { ExportCandidatesPage } from '@/features/company/candidate/pages/ExportCandidatesPage'
import { CandidateDocumentsPage } from '@/features/company/candidate/pages/CandidateDocumentsPage'
import { DocumentVerificationPage } from '@/features/company/candidate/pages/DocumentVerificationPage'
import { VerificationTimelinePage } from '@/features/company/candidate/pages/VerificationTimelinePage'
import { GovtCandidateImportPage } from '@/features/company/candidate/pages/GovtCandidateImportPage'

// Company Paper Setter Pages
import { CreatePaperPage } from '../features/company/paper/pages/CreatePaperPage'
import { AssignmentListPage } from '../features/company/candidate-assignment/pages/AssignmentListPage'
import { CreateAssignmentPage } from '../features/company/candidate-assignment/pages/CreateAssignmentPage'
import { BulkAssignmentPage } from '../features/company/candidate-assignment/pages/BulkAssignmentPage'
import { ImportAssignmentPage } from '../features/company/candidate-assignment/pages/ImportAssignmentPage'
import { AssignmentPreviewPage } from '../features/company/candidate-assignment/pages/AssignmentPreviewPage'
import { AssignmentHistoryPage } from '../features/company/candidate-assignment/pages/AssignmentHistoryPage'
import { VerificationDashboardPage } from '../features/company/entry-verification/pages/VerificationDashboardPage'

import { CandidateCheckInPage } from '../features/company/entry-verification/pages/CandidateCheckInPage'
import { VerificationDetailsPage } from '../features/company/entry-verification/pages/VerificationDetailsPage'
import { VerificationHistoryPage as EntryVerificationHistoryPage } from '../features/company/entry-verification/pages/VerificationHistoryPage'
import { BiometricDashboardPage } from '../features/company/biometric/pages/BiometricDashboardPage'
import { CandidateVerificationPage } from '../features/company/biometric/pages/CandidateVerificationPage'
import { VerificationDetailsPage as BiometricDetailsPage } from '../features/company/biometric/pages/VerificationDetailsPage'
import { VerificationHistoryPage as BiometricHistoryPage } from '../features/company/biometric/pages/VerificationHistoryPage'
import { DeviceStatusPage } from '../features/company/biometric/pages/DeviceStatusPage'
import { PaperListPage } from '@/features/company/paper/pages/PaperListPage'
import { PaperDetailsPage } from '@/features/company/paper/pages/PaperDetailsPage'
import { EditPaperPage } from '@/features/company/paper/pages/EditPaperPage'
import { PaperPreviewPage } from '@/features/company/paper/pages/PaperPreviewPage'

// Company Paper Review Pages
import { PaperReviewListPage } from '@/features/company/paper-review/pages/PaperReviewListPage'
import { PaperReviewDetailsPage } from '@/features/company/paper-review/pages/PaperReviewDetailsPage'
import { ReviewWorkspacePage } from '@/features/company/paper-review/pages/ReviewWorkspacePage'
import { ReviewHistoryPage } from '@/features/company/paper-review/pages/ReviewHistoryPage'

// Company Paper Approval Pages
import { ApprovalQueuePage } from '@/features/company/paper-approval/pages/ApprovalQueuePage'
import { PaperApprovalDetailsPage } from '@/features/company/paper-approval/pages/PaperApprovalDetailsPage'
import { ApprovalWorkspacePage } from '@/features/company/paper-approval/pages/ApprovalWorkspacePage'
import { ApprovalHistoryPage } from '@/features/company/paper-approval/pages/ApprovalHistoryPage'

import { useUserStore } from '@/stores/user/user.store'

const RoleBasedDashboardRedirect = () => {
  const profile = useUserStore((state) => state.profile)
  const role = profile?.roleId

  if (!role) return <Navigate to='/auth/login' replace />

  // Roles with dedicated portals
  if (role === 'MASTER_ADMIN' || role === 'Master Admin')
    return <Navigate to='/master-admin/dashboard' replace />
  if (role === 'COMPANY_ADMIN' || role === 'Company Admin')
    return <Navigate to='/company/dashboard' replace />
  if (role === 'CANDIDATE' || role === 'Candidate')
    return <Navigate to='/candidate/dashboard' replace />
  if (role === 'EXAM_MANAGER' || role === 'Exam Manager')
    return <Navigate to='/exam-manager/dashboard' replace />

  // All other roles get the RoleDashboard (reads role from JWT)
  if (role === 'PAPER_SETTER' || role === 'QUESTION_SETTER' || role === 'Paper Setter')
    return <Navigate to='/dashboard/paper-setter' replace />
  if (role === 'OBSERVER' || role === 'Observer')
    return <Navigate to='/dashboard/observer' replace />
  if (role === 'TECHNICAL_MANAGER' || role === 'Technical Manager')
    return <Navigate to='/dashboard/technical-team' replace />
  if (role === 'CENTER_MANAGER' || role === 'Center Manager')
    return <Navigate to='/dashboard/center-manager' replace />
  if (role === 'COMMAND_CENTER' || role === 'Command Center')
    return <Navigate to='/dashboard/command-center' replace />
  if (role === 'AI_PROCTOR' || role === 'AI Proctor')
    return <Navigate to='/dashboard/ai-proctor' replace />
  if (role === 'BIOMETRIC_VERIFIER' || role === 'Biometric Verifier')
    return <Navigate to='/dashboard/biometric-verifier' replace />
  if (role === 'ENTRY_CHECKER' || role === 'Entry Checker')
    return <Navigate to='/dashboard/entry-checker' replace />
  if (role === 'INVIGILATOR' || role === 'Invigilator')
    return <Navigate to='/dashboard/invigilator' replace />
  if (role === 'GOVT_AUTHORITY' || role === 'Govt Authority' || role === 'Government Authority')
    return <Navigate to='/dashboard/govt-authority' replace />
  if (role === 'PRIVATE_AUTHORITY' || role === 'Private Authority')
    return <Navigate to='/dashboard/private-authority' replace />

  // Universal fallback — RoleDashboard handles anything else
  return <Navigate to='/dashboard/role' replace />
}

export const router = createBrowserRouter([
  // Guest Routes (Only accessible if NOT logged in)
  {
    path: '/auth',
    element: <GuestRoute />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'master-admin-login', element: <MasterAdminLoginPage /> },
      { path: 'candidate-login', element: <CandidateLoginPage /> },
      { path: 'register-company', element: <RegisterCompanyPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },

  // Master Admin Guest Route
  {
    path: '/masteradmin/auth',
    element: <GuestRoute />,
    children: [{ path: 'login', element: <MasterAdminLoginPage /> }],
  },

  // Public Utility Routes
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '/session-expired', element: <SessionExpiredPage /> },

  // Forced Password Change (Requires Auth bypassed)

  {},

  // Center Manager Mandatory Onboarding Setup Wizard
  {
    path: '/center/onboarding-wizard',
    element: (
      <ProtectedRoute>
        <CenterOnboarding />
      </ProtectedRoute>
    ),
  },

  // Design System (Internal Dev Tool)
  {
    path: '/design-system',
    element: <DesignSystemLayout />,
    children: [
      { index: true, element: <IntroductionPage /> },
      { path: 'colors', element: <DesignTokensPage /> },
      { path: 'typography', element: <TypographyPage /> },
      { path: 'icons', element: <IconsPage /> },
      { path: 'layout', element: <LayoutSystemPage /> },
      { path: 'buttons', element: <ButtonsPage /> },
      { path: 'forms', element: <FormsPage /> },
      { path: 'tables', element: <TablesPage /> },
      { path: 'cards', element: <CardsPage /> },
      { path: 'dialogs', element: <DialogsPage /> },
      { path: 'navigation', element: <NavigationPage /> },
      { path: 'feedback', element: <FeedbackPage /> },
      { path: 'badges', element: <BadgesPage /> },
      { path: 'charts', element: <ChartsPage /> },
      { path: 'accessibility', element: <AccessibilityGuidePage /> },
      { path: 'responsive', element: <ResponsiveGuidePage /> },
      { path: 'playground', element: <ComponentPlaygroundPage /> },
    ],
  },

  // Protected App Routes
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <RoleBasedDashboardRedirect />,
          },
          {
            path: 'dashboard',
            children: [
              { index: true, element: <RoleBasedDashboardRedirect /> },
              { path: 'master-admin', element: <MasterAdminDashboardPage /> },
              { path: 'company-admin', element: <CompanyAdminDashboard /> },
              { path: 'exam-manager', element: <ExamManagerDashboard /> },
              { path: 'center-manager', element: <CenterManagerDashboard /> },
              { path: 'center-manager/staff', element: <CenterStaffPage /> },
              { path: 'center-manager/labs', element: <CenterLabDetailsPage /> },
              { path: 'center-manager/assigned-exams', element: <AssignedExamsPage /> },
              { path: 'center-manager/infrastructure', element: <CenterInfrastructurePage /> },
              { path: 'center-manager/photos', element: <CenterPhotosPage /> },
              { path: 'center-manager/location', element: <CenterLocationPage /> },
              { path: 'center-manager/system-network', element: <CenterSystemNetworkPage /> },
              { path: 'center-manager/assign-exam-staff', element: <AssignExamStaffPage /> },
              {
                path: 'center-manager/assign-candidate-seat-allocation',
                element: <AssignCandidateSeatAllocationPage />,
              },
              {
                path: 'center-manager/assigned-candidate-attendance',
                element: <AssignedCandidateAttendancePage />,
              },
              { path: 'center-manager/payments', element: <CenterPaymentsPage /> },
              { path: 'center-manager/audit-logs', element: <CenterAuditLogsPage /> },
              { path: 'center-manager/profile', element: <CenterManagerProfilePage /> },
              { path: 'observer', element: <ObserverDashboard /> },
              { path: 'paper-setter', element: <PaperSetterDashboard /> },
              { path: 'paper-setter/papers', element: <PaperSetterPapersPage /> },
              { path: 'paper-setter/workspace/:paperId', element: <PaperSetterWorkspace /> },
              {
                path: 'paper-setter/workspace/:paperId/subject/:subjectName',
                element: <PaperSetterSubjectWorkspace />,
              },
              { path: 'technical-team', element: <TechnicalTeamDashboard /> },
              { path: 'candidate', element: <BIDashboardCandidate /> },
              { path: 'command-center', element: <CommandCenterDashboard /> },
              { path: 'ai-proctor', element: <AIProctorerDashboard /> },
              { path: 'biometric-verifier', element: <BiometricVerifierDashboard /> },
              { path: 'entry-checker', element: <EntryCheckerDashboard /> },
              { path: 'invigilator', element: <InvigilatorDashboard /> },
              { path: 'govt-authority', element: <GovtAuthorityDashboard /> },
              { path: 'govt-authority/import-candidates', element: <GovtCandidateImportPage /> },
              { path: 'govt-authority/import-centers', element: <GovtImportCentersPage /> },
              { path: 'private-authority', element: <GovtAuthorityDashboard /> },
              { path: 'private-authority/import-candidates', element: <PrivateCandidateImportPage /> },
              { path: 'private-authority/import-centers', element: <PrivateImportCentersPage /> },
              { path: 'role', element: <RoleDashboard /> },
              { path: 'settings', element: <DashboardSettings /> },
            ],
          },
          // ─── Developer Tools ───────────────────────
          {
            path: 'dev-tools',
            element: (
              <RoleGuard allowedRoles={['Master Admin']}>
                <Outlet />
              </RoleGuard>
            ),
            children: [
              { index: true, element: <DeveloperDashboard /> },
              { path: 'dashboard', element: <DeveloperDashboard /> },
              { path: 'routes', element: <RouteExplorerPage /> },
              { path: 'apis', element: <ApiExplorerPage /> },
              { path: 'permissions', element: <PermissionMatrixPage /> },
              { path: 'theme', element: <ThemePreviewPage /> },
              { path: 'icons', element: <IconBrowserPage /> },
              { path: 'mock-data', element: <MockDataViewerPage /> },
              { path: 'error-boundary', element: <ErrorBoundaryTesterPage /> },
              { path: 'performance', element: <PerformanceMonitorPage /> },
              { path: 'build', element: <BuildInformationPage /> },
              { path: 'environment', element: <EnvironmentInformationPage /> },
              { path: 'health', element: <ApplicationHealthPage /> },
            ],
          },

          // ─── Candidate Routes ────────────────────────
          {
            path: 'candidate',
            element: (
              <RoleGuard allowedRoles={['Candidate']}>
                <CandidateLayout />
              </RoleGuard>
            ),
            children: [
              { index: true, element: <CandidateDashboardPage /> },
              { path: 'dashboard', element: <CandidateDashboardPage /> },
              { path: 'profile', element: <CandidateProfilePage /> },
              { path: 'application', element: <ApplicationStatusPage /> },
              { path: 'documents', element: <MyDocumentsPage /> },
              { path: 'admit-card', element: <CandidateAdmitCardPage /> },
              { path: 'exam-schedule', element: <ExamSchedulePage /> },
              { path: 'mock-test', element: <MockTestPage /> },
              { path: 'results', element: <CandidateResultsPage /> },
              { path: 'merit', element: <CandidateMeritListPage /> },
              { path: 'certificates', element: <CandidateCertificatesPage /> },
              { path: 'notifications', element: <CandidateNotificationsPage /> },
              { path: 'support', element: <CandidateSupportPage /> },
            ],
          },

          // ─── Company Admin Routes ────────────────────────
          {
            path: 'company',
            element: (
              <RoleGuard allowedRoles={['Company Admin']}>
                <Outlet />
              </RoleGuard>
            ),
            children: [
              { path: 'subscription', element: <SubscriptionSelectionPage /> },
              { path: 'onboarding', element: <CompanyOnboardingPage /> },
              {
                element: <SubscriptionGuard />,
                children: [
                  { index: true, element: <Navigate to='dashboard' replace /> },
                  { path: 'dashboard', element: <CompanyDashboardPage /> },
                  { path: 'profile', element: <CompanyProfilePage /> },
                  { path: 'settings', element: <CompanySettingsPage /> },
                  { path: 'centers', element: <CenterListPage /> },
                  { path: 'centers/create', element: <CreateCenterPage /> },
                  {
                    path: 'centers/pending-verifications',
                    element: <CenterPendingVerificationsPage />,
                  },
                  { path: 'centers/:id', element: <CenterDetailsPage /> },
                  { path: 'centers/:id/edit', element: <EditCenterPage /> },
                  { path: 'centers/:id/staff', element: <CenterStaffPage /> },
                  { path: 'centers/:id/labs', element: <CenterLabDetailsPage /> },
                  { path: 'centers/:id/assigned-exams', element: <AssignedExamsPage /> },
                  { path: 'centers/:id/infrastructure', element: <CenterInfrastructurePage /> },
                  { path: 'centers/:id/photos', element: <CenterPhotosPage /> },
                  { path: 'centers/:id/location', element: <CenterLocationPage /> },
                  { path: 'centers/:id/system-network', element: <CenterSystemNetworkPage /> },
                  { path: 'centers/:id/assign-exam-staff', element: <AssignExamStaffPage /> },
                  {
                    path: 'centers/:id/assigned-candidate-attendance',
                    element: <AssignedCandidateAttendancePage />,
                  },
                  { path: 'staff', element: <StaffListPage /> },
                  { path: 'staff/create', element: <CreateStaffPage /> },
                  { path: 'staff/roles', element: <RoleAssignmentPage /> },
                  { path: 'staff/permissions', element: <PermissionAssignmentPage /> },
                  { path: 'staff/sidebar', element: <SidebarManagementPage /> },

                  { path: 'staff/:id', element: <StaffDetailsPage /> },
                  { path: 'staff/:id/edit', element: <EditStaffPage /> },
                  { path: 'paper-setters', element: <PaperSettersManagementPage /> },
                  { path: 'final-papers', element: <FinalPapersPage /> },
                  { path: 'exams', element: <ExamListPage /> },
                  { path: 'subject-topics', element: <CompanySubjectTopicsPage /> },
                  { path: 'candidates', element: <CandidateListPage /> },
                  { path: 'candidates/create', element: <CreateCandidatePage /> },
                  { path: 'candidates/import', element: <ImportCandidatesPage /> },
                  { path: 'candidates/export', element: <ExportCandidatesPage /> },
                  { path: 'candidates/:id', element: <CandidateDetailsPage /> },
                  { path: 'candidates/:id/edit', element: <EditCandidatePage /> },
                  { path: 'candidates/:id/documents', element: <CandidateDocumentsPage /> },
                  { path: 'candidates/:id/verification', element: <DocumentVerificationPage /> },
                  { path: 'candidates/:id/timeline', element: <VerificationTimelinePage /> },
                  { path: 'papers', element: <PaperListPage /> },
                  { path: 'papers/create', element: <CreatePaperPage /> },
                  { path: 'papers/:id', element: <PaperDetailsPage /> },
                  { path: 'papers/:id/edit', element: <EditPaperPage /> },
                  { path: 'papers/:id/preview', element: <PaperPreviewPage /> },
                  { path: 'paper-review', element: <PaperReviewListPage /> },
                  { path: 'paper-review/history', element: <ReviewHistoryPage /> },
                  { path: 'paper-review/:id', element: <PaperReviewDetailsPage /> },
                  { path: 'paper-review/:id/review', element: <ReviewWorkspacePage /> },
                  { path: 'paper-approval', element: <ApprovalQueuePage /> },
                  { path: 'paper-approval/history', element: <ApprovalHistoryPage /> },
                  { path: 'candidate-assignment', element: <AssignmentListPage /> },
                  { path: 'candidate-assignment/create', element: <CreateAssignmentPage /> },
                  { path: 'candidate-assignment/bulk', element: <BulkAssignmentPage /> },
                  { path: 'candidate-assignment/import', element: <ImportAssignmentPage /> },
                  { path: 'candidate-assignment/preview', element: <AssignmentPreviewPage /> },
                  { path: 'candidate-assignment/history', element: <AssignmentHistoryPage /> },
                  { path: 'entry-verification', element: <VerificationDashboardPage /> },
                  { path: 'entry-verification/check-in', element: <CandidateCheckInPage /> },
                  { path: 'entry-verification/history', element: <EntryVerificationHistoryPage /> },
                  { path: 'entry-verification/:id', element: <VerificationDetailsPage /> },
                  { path: 'biometric', element: <BiometricDashboardPage /> },
                  { path: 'biometric/check-in', element: <CandidateVerificationPage /> },

                  // Live Monitoring
                  { path: 'live-monitoring', element: <LiveDashboardPage /> },
                  { path: 'live-monitoring/dashboard', element: <LiveDashboardPage /> },
                  { path: 'live-monitoring/candidates', element: <CandidateMonitoringPage /> },
                  { path: 'live-monitoring/centers', element: <CenterMonitoringPage /> },
                  { path: 'live-monitoring/violations', element: <ViolationMonitoringPage /> },
                  { path: 'live-monitoring/observer', element: <ObserverMonitoringPage /> },
                  { path: 'live-monitoring/logs', element: <LiveActivityLogsPage /> },

                  // Result Management
                  { path: 'results', element: <ResultDashboardPage /> },
                  { path: 'results/list', element: <ResultListPage /> },
                  { path: 'results/generate', element: <GenerateResultsPage /> },
                  { path: 'results/publish', element: <PublishResultsPage /> },
                  { path: 'results/history', element: <ResultHistoryPage /> },
                  { path: 'results/analytics', element: <ResultAnalyticsPage /> },
                  { path: 'results/:id', element: <ResultDetailsPage /> },
                  { path: 'results/:id/preview', element: <ResultPreviewPage /> },

                  // Merit Management
                  { path: 'merit', element: <MeritDashboardPage /> },
                  { path: 'merit/list', element: <MeritListPage /> },
                  { path: 'merit/generate', element: <GenerateMeritPage /> },
                  { path: 'merit/publish', element: <PublishMeritPage /> },
                  { path: 'merit/history', element: <MeritHistoryPage /> },
                  { path: 'merit/analytics', element: <MeritAnalyticsPage /> },
                  { path: 'merit/:id', element: <MeritDetailsPage /> },
                  { path: 'merit/:id/preview', element: <MeritPreviewPage /> },

                  // Certificate Management
                  { path: 'certificates', element: <CertificateDashboardPage /> },
                  { path: 'certificates/list', element: <CertificateListPage /> },
                  { path: 'certificates/templates', element: <CertificateTemplatesPage /> },
                  { path: 'certificates/generate', element: <GenerateCertificatesPage /> },
                  { path: 'certificates/verify', element: <CertificateVerificationPage /> },
                  { path: 'certificates/history', element: <CertificateHistoryPage /> },
                  { path: 'certificates/analytics', element: <CertificateAnalyticsPage /> },
                  { path: 'certificates/:id', element: <CertificateDetailsPage /> },
                  { path: 'certificates/:id/preview', element: <CertificatePreviewPage /> },

                  // Reports & Analytics
                  { path: 'analytics', element: <EnterpriseAnalyticsPage /> },
                  {
                    path: 'reports',
                    element: <Navigate to='/company/reports/dashboard' replace />,
                  },
                  { path: 'reports/dashboard', element: <ReportsDashboardPage /> },
                  { path: 'reports/exams', element: <ExamReportsPage /> },
                  { path: 'reports/candidates', element: <CandidateReportsPage /> },
                  { path: 'reports/attendance', element: <AttendanceReportsPage /> },
                  { path: 'reports/results', element: <ResultReportsPage /> },
                  { path: 'reports/merit', element: <MeritReportsPage /> },
                  { path: 'reports/centers', element: <CenterReportsPage /> },
                  { path: 'reports/revenue', element: <RevenueReportsPage /> },
                  { path: 'reports/audit', element: <AuditReportsPage /> },
                  { path: 'reports/scheduled', element: <ScheduledReportsPage /> },
                  { path: 'reports/export', element: <ExportReportsPage /> },

                  // System Settings
                  {
                    path: 'system-settings',
                    element: (
                      <SettingsLayout>
                        <Outlet />
                      </SettingsLayout>
                    ),
                    children: [
                      { index: true, element: <SettingsDashboardPage /> },
                      { path: 'general', element: <GeneralSettingsPage /> },
                      { path: 'organization', element: <OrganizationSettingsPage /> },
                      { path: 'security', element: <SecuritySettingsPage /> },
                      { path: 'authentication', element: <AuthenticationSettingsPage /> },
                      { path: 'exam-policy', element: <ExamPolicyPage /> },
                      { path: 'notification', element: <NotificationSettingsPage /> },
                      { path: 'email', element: <EmailConfigurationPage /> },
                      { path: 'sms', element: <SmsConfigurationPage /> },
                      { path: 'branding', element: <BrandingPage /> },
                      { path: 'theme', element: <ThemeSettingsPage /> },
                      { path: 'feature-flags', element: <FeatureFlagsPage /> },
                      { path: 'integrations', element: <IntegrationsPage /> },
                      { path: 'api-keys', element: <ApiKeysPage /> },
                      { path: 'backup', element: <BackupPage /> },
                      { path: 'audit', element: <AuditConfigurationPage /> },
                    ],
                  },

                  // Notification Center
                  { path: 'notifications', element: <NotificationDashboardPage /> },
                  { path: 'notifications/in-app', element: <InAppNotificationsPage /> },
                  { path: 'notifications/email', element: <EmailNotificationsPage /> },
                  { path: 'notifications/sms', element: <SmsNotificationsPage /> },
                  { path: 'notifications/push', element: <PushNotificationsPage /> },
                  { path: 'notifications/announcements', element: <AnnouncementsPage /> },
                  { path: 'notifications/templates', element: <NotificationTemplatesPage /> },
                  { path: 'notifications/broadcast', element: <BroadcastMessagesPage /> },
                  { path: 'notifications/history', element: <NotificationHistoryPage /> },
                  { path: 'notifications/preferences', element: <UserPreferencesPage /> },
                  { path: 'notifications/scheduled', element: <ScheduledNotificationsPage /> },

                  // Audit Logs
                  { path: 'audit', element: <AuditDashboardPage /> },
                  { path: 'audit/user-activity', element: <UserActivityPage /> },
                  { path: 'audit/login-history', element: <LoginHistoryPage /> },
                  { path: 'audit/security-events', element: <SecurityEventsPage /> },
                  { path: 'audit/system-events', element: <SystemEventsPage /> },
                  { path: 'audit/exam-events', element: <ExamEventsPage /> },
                  { path: 'audit/result-events', element: <ResultEventsPage /> },
                  { path: 'audit/api-logs', element: <ApiLogsPage /> },
                  { path: 'audit/timeline', element: <TimelinePage /> },
                  { path: 'audit/export', element: <ExportAuditLogsPage /> },

                  // Help Desk & Support
                  { path: 'support', element: <SupportDashboardPage /> },
                  { path: 'support/dashboard', element: <SupportDashboardPage /> },
                  { path: 'support/tickets', element: <TicketListPage /> },
                  { path: 'support/create', element: <CreateTicketPage /> },
                  { path: 'support/assignment', element: <TicketAssignmentPage /> },
                  { path: 'support/knowledge-base', element: <KnowledgeBasePage /> },
                  { path: 'support/faq', element: <FaqPage /> },
                  { path: 'support/live-chat', element: <LiveChatPage /> },
                  { path: 'support/history', element: <SupportHistoryPage /> },
                  { path: 'support/analytics', element: <SupportAnalyticsPage /> },
                  { path: 'support/:id', element: <TicketDetailsPage /> },

                  // Import & Export Management
                  { path: 'import-export', element: <ImportExportDashboardPage /> },
                  { path: 'import-export/import', element: <ImportDataPage /> },
                  { path: 'import-export/export', element: <ExportDataPage /> },
                  { path: 'import-export/templates', element: <ImportTemplatesPage /> },
                  { path: 'import-export/jobs', element: <JobsPage /> },
                  { path: 'import-export/history', element: <HistoryPage /> },
                  { path: 'import-export/errors', element: <ErrorReportsPage /> },
                  { path: 'import-export/mapping', element: <FieldMappingPage /> },
                  { path: 'import-export/settings', element: <ImportExportSettingsPage /> },

                  // File & Document Management
                  { path: 'file-management', element: <FileDashboardPage /> },
                  { path: 'file-management/library', element: <DocumentLibraryPage /> },
                  { path: 'file-management/upload', element: <UploadCenterPage /> },
                  { path: 'file-management/folders', element: <FolderManagementPage /> },
                  { path: 'file-management/categories', element: <CategoriesPage /> },
                  { path: 'file-management/versions', element: <VersionHistoryPage /> },
                  { path: 'file-management/activity', element: <FileActivityLogsPage /> },
                  { path: 'file-management/archive', element: <ArchivePage /> },
                  { path: 'file-management/settings', element: <StorageSettingsPage /> },
                  { path: 'file-management/:id', element: <FileDetailsPage /> },

                  { path: 'biometric/history', element: <BiometricHistoryPage /> },
                  { path: 'biometric/devices', element: <DeviceStatusPage /> },
                  { path: 'biometric/:id', element: <BiometricDetailsPage /> },
                  { path: 'paper-approval/:id', element: <PaperApprovalDetailsPage /> },
                  { path: 'paper-approval/:id/approve', element: <ApprovalWorkspacePage /> },

                  // Payment & Finance Management
                  { path: 'payments', element: <PaymentDashboardPage /> },
                  { path: 'payments/dashboard', element: <PaymentDashboardPage /> },
                  { path: 'payments/transactions', element: <TransactionsPage /> },
                  { path: 'payments/fees', element: <FeeManagementPage /> },
                  { path: 'payments/invoices', element: <InvoicesPage /> },
                  { path: 'payments/receipts', element: <ReceiptsPage /> },
                  { path: 'payments/refunds', element: <RefundsPage /> },
                  { path: 'payments/gateways', element: <PaymentGatewaysPage /> },
                  { path: 'payments/settlements', element: <SettlementsPage /> },
                  { path: 'payments/reports', element: <FinancialReportsPage /> },
                  { path: 'payments/settings', element: <PaymentSettingsPage /> },

                  // Offline Examination Management
                  { path: 'offline-exam', element: <OfflineExamDashboardPage /> },
                  { path: 'offline-exam/dashboard', element: <OfflineExamDashboardPage /> },
                  { path: 'offline-exam/sessions', element: <OfflineSessionsPage /> },
                  { path: 'offline-exam/attendance', element: <OfflineAttendancePage /> },
                  { path: 'offline-exam/seating-plan', element: <SeatingPlanPage /> },
                  { path: 'offline-exam/invigilators', element: <InvigilatorsPage /> },
                  { path: 'offline-exam/omr', element: <OmrManagementPage /> },
                  { path: 'offline-exam/manual-evaluation', element: <ManualEvaluationPage /> },
                  { path: 'offline-exam/materials', element: <ExamMaterialsPage /> },
                  { path: 'offline-exam/results', element: <OfflineResultsPage /> },
                  { path: 'offline-exam/results', element: <OfflineResultsPage /> },
                  { path: 'offline-exam/reports', element: <OfflineReportsPage /> },

                  // Observer & Invigilator Management
                  { index: true, element: <Navigate to='dashboard' replace /> },
                  { path: 'observer', element: <ObserverDashboardPage /> },
                  { path: 'observer/dashboard', element: <ObserverDashboardPage /> },
                  { path: 'observer/observers', element: <ObserversPage /> },
                  { path: 'observer/invigilators', element: <ObserverInvigilatorsPage /> },
                  { path: 'observer/duty-allocation', element: <DutyAllocationPage /> },
                  { path: 'observer/attendance', element: <DutyAttendancePage /> },
                  { path: 'observer/incidents', element: <IncidentsPage /> },
                  { path: 'observer/violations', element: <ViolationsPage /> },
                  { path: 'observer/rooms', element: <ObserverRoomsPage /> },
                  { path: 'observer/shifts', element: <ShiftsPage /> },
                  { path: 'observer/performance', element: <PerformancePage /> },
                  { path: 'observer/activity', element: <ObserverActivityLogsPage /> },
                ],
              },
            ],
          },
          // ─── Exam Manager Routes ───────────────────────
          {
            path: 'exam-manager',
            element: (
              <RoleGuard allowedRoles={['Exam Manager']}>
                <ExamManagerLayout />
              </RoleGuard>
            ),
            children: [
              { index: true, element: <Navigate to='dashboard' replace /> },
              { path: 'dashboard', element: <ExamManagerDashboard /> },
              { path: 'calendar', element: <ExamCalendarPage /> },
              { path: 'exams', element: <ExamListPage /> },
              { path: 'exams/new', element: <CreateExamPage /> },
              { path: 'exams/:id/edit', element: <CreateExamPage /> },
              { path: 'topics', element: <TopicManagementPage /> },
              { path: 'scheduling', element: <ExamSchedulingPage /> },
              { path: 'shifts', element: <ShiftManagementPage /> },
              { path: 'candidate-import', element: <CandidateImportPage /> },
              { path: 'audit-logs', element: <ExamAuditLogsPage /> },
            ],
          },
          // ─── Master Admin Routes ────────────────────────
          {
            path: 'master-admin',
            element: (
              <RoleGuard allowedRoles={['Master Admin']}>
                <Outlet />
              </RoleGuard>
            ),
            children: [
              { index: true, element: <Navigate to='dashboard' replace /> },
              { path: 'dashboard', element: <MasterAdminDashboardPage /> },
              { path: 'companies', element: <CompaniesPage /> },
              { path: 'plans', element: <PlansPage /> },
              { path: 'plans/new', element: <CreatePlanPage /> },
              { path: 'plans/:id/edit', element: <EditPlanPage /> },
              { path: 'plans/:id', element: <PlanDetailsPage /> },
              { path: 'companies/new', element: <CreateCompanyPage /> },
              { path: 'companies/:id/edit', element: <EditCompanyPage /> },
              { path: 'companies/:id', element: <CompanyDetailsPage /> },
              { path: 'company-approvals', element: <CompanyApprovalPage /> },
              { path: 'company-approvals/:id', element: <CompanyApprovalDetailsPage /> },
              { path: 'subscriptions', element: <SubscriptionsPage /> },
              { path: 'subscriptions/:id', element: <SubscriptionDetailsPage /> },

              { path: 'invoices', element: <MAInvoicesPage /> },
              { path: 'invoices/dashboard', element: <InvoiceDashboardPage /> },
              { path: 'invoices/:id', element: <InvoiceDetailsPage /> },
              { path: 'invoices/:invoiceId/audit', element: <InvoiceAuditLogPage /> },
              { path: 'access-management', element: <AccessManagementPage /> },
              {
                path: 'access-management/users',
                element: <Navigate to='/master-admin/access-management?tab=users' replace />,
              },
              {
                path: 'access-management/roles',
                element: <Navigate to='/master-admin/access-management?tab=roles' replace />,
              },
              { path: 'access-management/users/create', element: <CreateUserPage /> },
              { path: 'access-management/users/:id', element: <UserDetailsPage /> },
              { path: 'access-management/users/:id/edit', element: <EditUserPage /> },
              { path: 'access-management/users/:id/activity', element: <SystemUserActivityPage /> },
              { path: 'access-management/roles/hierarchy', element: <RoleHierarchyPage /> },
              { path: 'access-management/roles/create', element: <CreateRolePage /> },
              { path: 'access-management/roles/:id', element: <RoleDetailsPage /> },
              { path: 'access-management/roles/:id/edit', element: <EditRolePage /> },
              {
                path: 'access-management/roles/:id/permissions',
                element: <AssignPermissionsPage />,
              },
              { path: 'access-management/roles/:id/audit', element: <RoleAuditLogPage /> },
              { path: 'security', element: <SecurityPage /> },
              { path: 'security/sessions', element: <LoginSessionsPage /> },
              { path: 'security/devices', element: <TrustedDevicesPage /> },
              { path: 'security/ip-rules', element: <IpRulesPage /> },
              { path: 'security/auth-policies', element: <AuthPoliciesPage /> },
              { path: 'security/mfa', element: <MfaManagementPage /> },
              { path: 'security/events', element: <ThreatDashboardPage /> },
              { path: 'security/events/:id', element: <ThreatEventDetailsPage /> },
              { path: 'security/audit', element: <AuditCompliancePage /> },
              { path: 'activity-logs', element: <ActivityLogsPage /> },
              {
                path: 'reports',
                element: <Navigate to='/master-admin/reports/dashboard' replace />,
              },
              { path: 'reports/dashboard', element: <ReportsPage /> },

              { path: 'reports/user-access', element: <UserAccessReportsPage /> },
              { path: 'reports/candidates', element: <MACandidateReportsPage /> },
              { path: 'reports/exams', element: <MAExamReportsPage /> },
              { path: 'reports/attendance', element: <MAAttendanceReportsPage /> },
              { path: 'reports/results', element: <MAResultReportsPage /> },
              { path: 'reports/financial', element: <MAFinancialReportsPage /> },
              { path: 'reports/security', element: <MASecurityReportsPage /> },

              { path: 'reports/templates', element: <MAReportTemplatesPage /> },
              {
                path: 'settings',
                element: <Navigate to='/master-admin/system-settings' replace />,
              },
              { path: 'system-settings', element: <SystemSettingsPage /> },
              { path: 'settings/general', element: <MAGeneralSettingsPage /> },
              { path: 'settings/organization', element: <MAOrganizationSettingsPage /> },
              { path: 'settings/security', element: <MASecuritySettingsPage /> },
              { path: 'settings/notifications', element: <MANotificationSettingsPage /> },
              { path: 'settings/gateways', element: <EmailSmsGatewayPage /> },
              { path: 'settings/storage', element: <MAStorageSettingsPage /> },
              { path: 'settings/backup', element: <BackupSettingsPage /> },
              { path: 'settings/integrations', element: <MAIntegrationsPage /> },
              { path: 'settings/exam-configuration', element: <ExamConfigurationPage /> },
              { path: 'settings/configuration-history', element: <ConfigurationHistoryPage /> },
              { path: 'support-tickets', element: <SupportTicketsPage /> },
              { path: 'profile', element: <MAProfilePage /> },
            ],
          },
        ],
      },
    ],
  },

  // ─── Exam Arena Routes (Independent from main layout) ───
  {
    path: '/exam/instructions',
    element: (
      <CandidateExamGuard>
        <ExamInstructionsPage />
      </CandidateExamGuard>
    ),
  },
  {
    path: '/exam-arena',
    element: (
      <CandidateExamGuard>
        <ExamArenaPage />
      </CandidateExamGuard>
    ),
  },
])
