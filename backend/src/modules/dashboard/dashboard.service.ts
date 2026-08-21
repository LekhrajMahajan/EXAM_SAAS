import {
  DashboardPeriod,
  IDashboardFilter,
  IDashboardCharts,
} from "./dashboard.types";
import Company from "../company/company.model";
import User from "../auth/user.model";
import Role from "../role/role.model";
import Permission from "../permission/permission.model";
import Payment from "../payment/payment.model";
import SupportTicket from "../support-ticket/supportTicket.model";
import { TicketStatus } from "../support-ticket/supportTicket.types";
import ActivityLog from "../activity-log/activityLog.model";
import { ActivityType } from "../activity-log/activityLog.types";
import Notification from "../notification/notification.model";
import { NotificationStatus } from "../notification/notification.types";
import { UserRole } from "../../constants/roles";

import Center from "../center/center.model";
import Exam from "../exam/exam.model";
import Candidate from "../candidate/candidate.model";
import Employee from "../employee/employee.model";
import Paper from "../paper/paper.model";
import { PaperApprovalStatus } from "../paper/paper.types";
import StaffAssignment from "../staff-assignment/staffAssignment.model";
import CenterStaff from "../center/centerStaff.model";
import CenterLab from "../center/centerLab.model";
import ExamCenter from "../exam-center/examCenter.model";
import { ImportCenterAssignExamModel } from "../import-center-assign-exam/importCenterAssignExam.model";
class DashboardService {
  /*
    |--------------------------------------------------------------------------
    | Dashboard Overview
    |--------------------------------------------------------------------------
    */

  async getOverview(filter: IDashboardFilter) {
    const totalCandidates = await User.countDocuments({
      role: { $ne: "MASTER_ADMIN" },
    });
    const activeCompanies = await Company.countDocuments({ status: true });
    const totalCompanies = await Company.countDocuments();
    const pendingCompanies = await Company.countDocuments({ status: false });
    const suspendedCompanies = 0;

    const totalUsers = await User.countDocuments();
    const totalRoles = await Role.countDocuments();
    const totalPermissions = await Permission.countDocuments();

    const now = new Date();
    const activeSubscriptions = await Company.countDocuments({
      subscriptionEndDate: { $gt: now },
      status: true,
    });
    const expiredSubscriptions = await Company.countDocuments({
      subscriptionEndDate: { $lte: now },
    });

    const openSupportTickets = await SupportTicket.countDocuments({
      status: TicketStatus.OPEN,
    });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [todaysRevenueResult, monthlyRevenueResult] = await Promise.all([
      Payment.aggregate([
        { $match: { status: "SUCCESS", createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Payment.aggregate([
        { $match: { status: "SUCCESS", createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const todaysRevenue = todaysRevenueResult[0]?.total || 0;
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    return {
      period: filter.period ?? DashboardPeriod.TODAY,
      totalCandidates,
      totalExams: 0,
      totalResults: 0,
      totalAttendance: 0,
      activeExams: 0,
      companies: totalCompanies,
      activeCompanies,
      pendingCompanies,
      suspendedCompanies,
      totalUsers,
      totalRoles,
      totalPermissions,
      activeSubscriptions,
      expiredSubscriptions,
      todaysRevenue,
      monthlyRevenue,
      openSupportTickets,
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Role-Based Dashboard Stats
    |--------------------------------------------------------------------------
    */

  async getRoleStats(
    userId: string,
    role: string,
    companyId?: string,
    centerId?: string,
  ) {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - 7);
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Common queries
    const [recentActivities, unreadNotifications] = await Promise.all([
      ActivityLog.find({ userId, isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Notification.find({
        recipientId: userId,
        status: NotificationStatus.PENDING,
        isDeleted: false,
      } as any)
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const activities = recentActivities.map((a: any) => ({
      id: String(a._id),
      title: a.title || a.activityType || "Activity",
      description: a.description || "",
      timestamp: a.createdAt
        ? new Date(a.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Recently",
      type:
        a.activityType === "ERROR"
          ? "error"
          : a.activityType === "WARNING"
            ? "warning"
            : a.activityType === "SUCCESS"
              ? "success"
              : "info",
      iconName:
        a.module === "AUTH"
          ? "LogIn"
          : a.module === "EXAM"
            ? "BookOpen"
            : a.module === "CANDIDATE"
              ? "Users"
              : "Activity",
    }));

    const notifications = unreadNotifications.map((n: any) => ({
      id: String(n._id),
      title: n.title || "Notification",
      message: n.message || "",
      timestamp: n.createdAt
        ? new Date(n.createdAt).toLocaleDateString()
        : "Today",
      isRead: n.status === "READ",
      priority:
        n.priority?.toLowerCase() === "high"
          ? "high"
          : n.priority?.toLowerCase() === "low"
            ? "low"
            : "medium",
    }));

    const base = {
      activities,
      notifications,
      unreadCount: notifications.filter((n: any) => !n.isRead).length,
    };

    const roleNormalized = role.toUpperCase().replace(/ /g, "_");

    switch (roleNormalized) {
      case UserRole.MASTER_ADMIN:
      case "MASTER_ADMIN":
      case "Master Admin": {
        const [
          totalCompanies,
          activeCompanies,
          totalUsers,
          totalRoles,
          activeSubscriptions,
        ] = await Promise.all([
          Company.countDocuments(),
          Company.countDocuments({ status: true }),
          User.countDocuments(),
          Role.countDocuments(),
          Company.countDocuments({
            subscriptionEndDate: { $gt: now },
            status: true,
          }),
        ]);
        const revenueResult = await Payment.aggregate([
          { $match: { status: "SUCCESS", createdAt: { $gte: startOfMonth } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Total Companies",
              value: totalCompanies,
              change: "Platform wide",
              trend: "neutral",
              iconName: "Building2",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Active Subscriptions",
              value: activeSubscriptions,
              change: "Currently active",
              trend: "up",
              iconName: "CreditCard",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Total Users",
              value: totalUsers,
              change: "All roles",
              trend: "up",
              iconName: "Users",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Monthly Revenue",
              value: `₹${(revenueResult[0]?.total || 0).toLocaleString()}`,
              change: "This month",
              trend: "up",
              iconName: "DollarSign",
              colorScheme: "amber",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Create Company",
              path: "/master-admin/companies/new",
              iconName: "Plus",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Manage Plans",
              path: "/master-admin/plans",
              iconName: "CreditCard",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "View Reports",
              path: "/master-admin/reports",
              iconName: "BarChart2",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "System Settings",
              path: "/master-admin/system-settings",
              iconName: "Settings",
              colorScheme: "slate",
            },
          ],
          pendingApprovals: await Company.countDocuments({ status: false }),
          totalRoles,
        };
      }

      case UserRole.COMPANY_ADMIN:
      case "Company Admin": {
        if (!companyId) {
          return {
            activities: [],
            notifications: [],
            unreadCount: 0,
            stats: [
              {
                id: "1",
                label: "Total Exams",
                value: 0,
                change: "Active exams",
                trend: "neutral",
                iconName: "FileText",
                colorScheme: "indigo",
              },
              {
                id: "2",
                label: "Total Centers",
                value: 0,
                change: "Exam centers",
                trend: "neutral",
                iconName: "Building2",
                colorScheme: "emerald",
              },
              {
                id: "3",
                label: "Total Staff",
                value: 0,
                change: "All roles",
                trend: "neutral",
                iconName: "Users",
                colorScheme: "sky",
              },
              {
                id: "4",
                label: "Total Candidates",
                value: 0,
                change: "Registered",
                trend: "neutral",
                iconName: "UserCheck",
                colorScheme: "amber",
              },
            ],
            quickActions: [],
            pendingApprovals: 0,
            activeExams: 0,
            totalBranches: 0,
            totalCenters: 0,
            totalEmployees: 0,
            totalCandidates: 0,
          };
        }

        const [

          totalCenters,
          empCount,
          userEmpCount,
          candCount,
          userCandCount,
          activeExams,
          pendingApprovals,
          compActivities,
          compNotifications,
        ] = await Promise.all([
          Center.countDocuments({ companyId, isDeleted: { $ne: true } }),
          Employee.countDocuments({ companyId, isDeleted: { $ne: true } }),
          User.countDocuments({
            companyId,
            role: {
              $nin: [
                UserRole.MASTER_ADMIN,
                UserRole.CANDIDATE,
                UserRole.COMPANY_ADMIN,
                "MASTER_ADMIN",
                "CANDIDATE",
                "COMPANY_ADMIN",
              ],
            },
          }),
          Candidate.countDocuments({ companyId, isDeleted: { $ne: true } }),
          User.countDocuments({
            companyId,
            role: { $in: [UserRole.CANDIDATE, "CANDIDATE"] },
          }),
          Exam.countDocuments({ companyId, isDeleted: { $ne: true } }),
          User.countDocuments({ companyId, status: false }),
          ActivityLog.find({ companyId, isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
          Notification.find({ companyId, isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean(),
        ]);

        const totalEmployees = Math.max(empCount, userEmpCount);
        const totalCandidates = Math.max(candCount, userCandCount);

        const activities = compActivities.map((a: any, index: number) => ({
          id: String(a._id || index),
          title: a.title || a.activityType || "Activity",
          description: a.description || "",
          timestamp: a.createdAt
            ? new Date(a.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recently",
          type:
            a.activityType === "ERROR"
              ? "error"
              : a.activityType === "WARNING"
                ? "warning"
                : a.activityType === "SUCCESS"
                  ? "success"
                  : "info",
          iconName:
            a.module === "AUTH"
              ? "LogIn"
              : a.module === "EXAM"
                ? "BookOpen"
                : a.module === "CANDIDATE"
                  ? "Users"
                  : "Activity",
          action: a.title || a.activityType || "System Activity",
          entity: a.description || a.module || "Record",
          time: a.createdAt
            ? new Date(a.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recently",
        }));

        const notifications = compNotifications.map(
          (n: any, index: number) => ({
            id: String(n._id || index),
            title: n.title || "Notification",
            message: n.message || "",
            timestamp: n.createdAt
              ? new Date(n.createdAt).toLocaleDateString()
              : "Today",
            isRead: n.status === "READ" || n.isRead === true,
            priority:
              n.priority?.toLowerCase() === "high"
                ? "high"
                : n.priority?.toLowerCase() === "low"
                  ? "low"
                  : "medium",
            time: n.createdAt
              ? new Date(n.createdAt).toLocaleDateString()
              : "Today",
          }),
        );

        return {
          activities,
          notifications,
          unreadCount: notifications.filter((n: any) => !n.isRead).length,
          stats: [
            {
              id: "1",
              label: "Total Exams",
              value: activeExams,
              change: "Active exams",
              trend: "neutral",
              iconName: "FileText",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Total Centers",
              value: totalCenters,
              change: "Exam centers",
              trend: "neutral",
              iconName: "Building2",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Total Staff",
              value: totalEmployees,
              change: "All roles",
              trend: "up",
              iconName: "Users",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Total Candidates",
              value: totalCandidates,
              change: "Registered",
              trend: "up",
              iconName: "UserCheck",
              colorScheme: "amber",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Create Exam",
              path: "/company/exams/create",
              iconName: "Plus",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Manage Centers",
              path: "/company/centers",
              iconName: "Building2",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Add Staff",
              path: "/company/staff/create",
              iconName: "UserPlus",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "View Reports",
              path: "/company/reports",
              iconName: "BarChart2",
              colorScheme: "amber",
            },
            {
              id: "5",
              label: "Question Bank",
              path: "/company/question-bank",
              iconName: "BookOpen",
              colorScheme: "violet",
            },
            {
              id: "6",
              label: "Notifications",
              path: "/company/notifications",
              iconName: "Bell",
              colorScheme: "rose",
            },
          ],
          pendingApprovals,
          activeExams,

          totalCenters,
          totalEmployees,
          totalCandidates,
        };
      }

      case UserRole.EXAM_MANAGER:
      case "Exam Manager": {
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Upcoming Exams",
              value: 0,
              change: "Scheduled",
              trend: "neutral",
              iconName: "Calendar",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Active Exams",
              value: 0,
              change: "Running now",
              trend: "neutral",
              iconName: "PlayCircle",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Pending Approvals",
              value: 0,
              change: "Awaiting review",
              trend: "down",
              iconName: "Clock",
              colorScheme: "amber",
            },
            {
              id: "4",
              label: "Completed Exams",
              value: 0,
              change: "This month",
              trend: "up",
              iconName: "CheckCircle",
              colorScheme: "sky",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Create Exam",
              path: "/company/exams/create",
              iconName: "Plus",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Exam Calendar",
              path: "/exam-manager/calendar",
              iconName: "Calendar",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Approve Papers",
              path: "/company/paper-approval",
              iconName: "CheckSquare",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "View Reports",
              path: "/company/reports",
              iconName: "BarChart2",
              colorScheme: "amber",
            },
          ],
        };
      }

      case UserRole.PAPER_SETTER:
      case UserRole.QUESTION_SETTER:
      case "Paper Setter": {
        const employee = await Employee.findOne({ userId });
        let draft = 0,
          submitted = 0,
          approved = 0,
          rejected = 0;
        if (employee) {
          draft = await Paper.countDocuments({
            assignedTo: employee._id,
            approvalStatus: PaperApprovalStatus.DRAFT,
          });
          submitted = await Paper.countDocuments({
            assignedTo: employee._id,
            approvalStatus: PaperApprovalStatus.PENDING_APPROVAL,
          });
          approved = await Paper.countDocuments({
            assignedTo: employee._id,
            approvalStatus: PaperApprovalStatus.APPROVED,
          });
          rejected = await Paper.countDocuments({
            assignedTo: employee._id,
            approvalStatus: PaperApprovalStatus.REJECTED,
          });
        }
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Draft Papers",
              value: draft,
              change: "In progress",
              trend: "neutral",
              iconName: "FileText",
              colorScheme: "amber",
            },
            {
              id: "2",
              label: "Submitted Papers",
              value: submitted,
              change: "Awaiting review",
              trend: "up",
              iconName: "Send",
              colorScheme: "sky",
            },
            {
              id: "3",
              label: "Approved Papers",
              value: approved,
              change: "This month",
              trend: "up",
              iconName: "CheckCircle",
              colorScheme: "emerald",
            },
            {
              id: "4",
              label: "Rejected Papers",
              value: rejected,
              change: "Need revision",
              trend: "down",
              iconName: "XCircle",
              colorScheme: "rose",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Create Paper",
              path: "/company/papers/create",
              iconName: "Plus",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "View Papers",
              path: "/company/papers",
              iconName: "FileText",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Question Bank",
              path: "/company/question-bank",
              iconName: "BookOpen",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Paper Review",
              path: "/company/paper-review",
              iconName: "Eye",
              colorScheme: "amber",
            },
          ],
        };
      }

      case UserRole.OBSERVER:
      case "Observer": {
        const employee = await Employee.findOne({ userId });
        let assignedCenters = 0;
        if (employee) {
          assignedCenters = await StaffAssignment.countDocuments({
            employeeId: employee._id,
            role: "OBSERVER",
          });
        }
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Assigned Centers",
              value: assignedCenters,
              change: "This session",
              trend: "neutral",
              iconName: "Building2",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Reported Violations",
              value: 0,
              change: "Today",
              trend: "down",
              iconName: "AlertTriangle",
              colorScheme: "rose",
            },
            {
              id: "3",
              label: "Candidates Monitored",
              value: 0,
              change: "Active",
              trend: "neutral",
              iconName: "Users",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Reports Submitted",
              value: 0,
              change: "This week",
              trend: "up",
              iconName: "FileCheck",
              colorScheme: "emerald",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Live Monitoring",
              path: "/company/live-monitoring",
              iconName: "Monitor",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "View Centers",
              path: "/company/centers",
              iconName: "Building2",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Report Incident",
              path: "/company/observer/incidents",
              iconName: "AlertTriangle",
              colorScheme: "rose",
            },
            {
              id: "4",
              label: "My Reports",
              path: "/company/observer/performance",
              iconName: "FileText",
              colorScheme: "sky",
            },
          ],
        };
      }

      case UserRole.TECHNICAL_MANAGER:
      case "Technical Manager": {
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Active Servers",
              value: 1,
              change: "Online",
              trend: "up",
              iconName: "Server",
              colorScheme: "emerald",
            },
            {
              id: "2",
              label: "Database Status",
              value: "Connected",
              change: "Healthy",
              trend: "up",
              iconName: "Database",
              colorScheme: "sky",
            },
            {
              id: "3",
              label: "Biometric Devices",
              value: 0,
              change: "Registered",
              trend: "neutral",
              iconName: "Fingerprint",
              colorScheme: "indigo",
            },
            {
              id: "4",
              label: "Open Tickets",
              value: 0,
              change: "Pending",
              trend: "down",
              iconName: "Wrench",
              colorScheme: "amber",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "System Health",
              path: "/dev-tools/health",
              iconName: "Activity",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Biometric Devices",
              path: "/company/biometric/devices",
              iconName: "Fingerprint",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Audit Logs",
              path: "/company/audit",
              iconName: "ClipboardList",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Support Tickets",
              path: "/company/support/tickets",
              iconName: "Ticket",
              colorScheme: "amber",
            },
          ],
          systemHealth: {
            server: "Healthy",
            database: "Connected",
            uptime: process.uptime(),
          },
        };
      }

      case UserRole.COMMAND_CENTER:
      case "Command Center": {
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Live Exams",
              value: 0,
              change: "Running now",
              trend: "neutral",
              iconName: "Radio",
              colorScheme: "rose",
            },
            {
              id: "2",
              label: "Active Candidates",
              value: 0,
              change: "In exam",
              trend: "neutral",
              iconName: "Users",
              colorScheme: "indigo",
            },
            {
              id: "3",
              label: "Violations",
              value: 0,
              change: "Flagged",
              trend: "down",
              iconName: "AlertOctagon",
              colorScheme: "amber",
            },
            {
              id: "4",
              label: "Critical Alerts",
              value: 0,
              change: "Unresolved",
              trend: "down",
              iconName: "ShieldAlert",
              colorScheme: "red",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Live Dashboard",
              path: "/company/live-monitoring/dashboard",
              iconName: "Monitor",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Violations",
              path: "/company/live-monitoring/violations",
              iconName: "AlertTriangle",
              colorScheme: "rose",
            },
            {
              id: "3",
              label: "Candidates",
              path: "/company/live-monitoring/candidates",
              iconName: "Users",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Centers",
              path: "/company/live-monitoring/centers",
              iconName: "Building2",
              colorScheme: "emerald",
            },
          ],
        };
      }

      case UserRole.AI_PROCTOR:
      case "AI Proctor": {
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Face Verifications",
              value: 0,
              change: "Today",
              trend: "neutral",
              iconName: "ScanFace",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "AI Flags",
              value: 0,
              change: "Suspicious",
              trend: "down",
              iconName: "Flag",
              colorScheme: "rose",
            },
            {
              id: "3",
              label: "Browser Violations",
              value: 0,
              change: "Detected",
              trend: "down",
              iconName: "Globe",
              colorScheme: "amber",
            },
            {
              id: "4",
              label: "Avg Trust Score",
              value: "98%",
              change: "All candidates",
              trend: "up",
              iconName: "ShieldCheck",
              colorScheme: "emerald",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Live Monitoring",
              path: "/company/live-monitoring",
              iconName: "Monitor",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Violations",
              path: "/company/live-monitoring/violations",
              iconName: "AlertTriangle",
              colorScheme: "rose",
            },
            {
              id: "3",
              label: "Biometric Check",
              path: "/company/biometric",
              iconName: "Fingerprint",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Activity Logs",
              path: "/company/audit/user-activity",
              iconName: "Activity",
              colorScheme: "emerald",
            },
          ],
        };
      }
      case UserRole.CENTER_MANAGER:
      case "Center Manager": {
        const centerQuery: any = centerId ? { centerId } : {};
        const [totalStaff, totalRooms, assignedExamsList] = await Promise.all([
          CenterStaff.countDocuments({ ...centerQuery }),
          CenterLab.countDocuments({ ...centerQuery }),
          ImportCenterAssignExamModel.find({
            isSentToCenters: true,
            ...(centerId ? { 'centers.matchedCenterId': centerId } : {})
          }).populate({
            path: 'examId',
            populate: { path: 'shiftId' }
          }),
        ]);

        let activeExamsCount = 0;
        let assignedCandidatesCount = 0;

        const now = new Date();
        for (const record of assignedExamsList) {
          let isEnded = false;
          const exam = record.examId as any;
          const examDate = exam?.examDate;
          const shiftId = exam?.shiftId;
          let endTimeStr = shiftId?.endTime || exam?.endTime;
          
          if (examDate && endTimeStr && typeof endTimeStr === 'string' && endTimeStr.includes(':')) {
            const [hours, minutes] = endTimeStr.split(':').map(Number);
            const endDateTime = new Date(examDate);
            endDateTime.setHours(hours, minutes, 0, 0);
            
            if (endDateTime < now) {
              isEnded = true;
            }
          }

          if (!isEnded) {
            activeExamsCount++;
            
            const count = await Candidate.countDocuments({
              centerId: centerQuery.centerId || record.centers.find((c: any) => c.matchedCenterId)?.matchedCenterId,
              examId: exam?._id || exam
            });
            assignedCandidatesCount += count; 
          }
        }
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Center Staff",
              value: totalStaff,
              change: "Total registered",
              trend: "neutral",
              iconName: "Users",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Center Labs",
              value: totalRooms,
              change: "Total labs",
              trend: "neutral",
              iconName: "Building2",
              colorScheme: "sky",
            },
            {
              id: "3",
              label: "Assigned Exams",
              value: activeExamsCount,
              change: "Active exams",
              trend: "up",
              iconName: "BookOpen",
              colorScheme: "emerald",
            },
            {
              id: "4",
              label: "Assigned Candidates",
              value: assignedCandidatesCount,
              change: "Total candidates",
              trend: "neutral",
              iconName: "UserCheck",
              colorScheme: "amber",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Center Staff Add",
              path: "/dashboard/center-manager/staff",
              iconName: "UserPlus",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Center Lab Add",
              path: "/dashboard/center-manager/labs",
              iconName: "Monitor",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Assigned Exams",
              path: "/dashboard/center-manager/assigned-exams",
              iconName: "Monitor",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Center Infrastructure",
              path: "/dashboard/center-manager/infrastructure",
              iconName: "Upload",
              colorScheme: "amber",
            },
          ],
          totalStaff,
        };
      }

      case UserRole.BIOMETRIC_VERIFIER:
      case "Biometric Verifier": {
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Verified Today",
              value: 0,
              change: "Biometric scans",
              trend: "up",
              iconName: "Fingerprint",
              colorScheme: "emerald",
            },
            {
              id: "2",
              label: "Pending",
              value: 0,
              change: "In queue",
              trend: "neutral",
              iconName: "Clock",
              colorScheme: "amber",
            },
            {
              id: "3",
              label: "Failed Attempts",
              value: 0,
              change: "Today",
              trend: "down",
              iconName: "XCircle",
              colorScheme: "rose",
            },
            {
              id: "4",
              label: "Devices Active",
              value: 0,
              change: "Online",
              trend: "up",
              iconName: "Monitor",
              colorScheme: "sky",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Start Verification",
              path: "/company/biometric/check-in",
              iconName: "Fingerprint",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "View History",
              path: "/company/biometric/history",
              iconName: "Clock",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Device Status",
              path: "/company/biometric/devices",
              iconName: "Monitor",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Activity Log",
              path: "/company/audit/user-activity",
              iconName: "Activity",
              colorScheme: "amber",
            },
          ],
        };
      }

      case UserRole.ENTRY_CHECKER:
      case "Entry Checker": {
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Checked In",
              value: 0,
              change: "Today",
              trend: "up",
              iconName: "CheckCircle",
              colorScheme: "emerald",
            },
            {
              id: "2",
              label: "Pending Entry",
              value: 0,
              change: "In queue",
              trend: "neutral",
              iconName: "Clock",
              colorScheme: "amber",
            },
            {
              id: "3",
              label: "Rejected Entry",
              value: 0,
              change: "Today",
              trend: "down",
              iconName: "XCircle",
              colorScheme: "rose",
            },
            {
              id: "4",
              label: "Total Candidates",
              value: 0,
              change: "This session",
              trend: "neutral",
              iconName: "Users",
              colorScheme: "indigo",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "Check In",
              path: "/company/entry-verification/check-in",
              iconName: "CheckSquare",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Verify History",
              path: "/company/entry-verification/history",
              iconName: "Clock",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Verify Details",
              path: "/company/entry-verification",
              iconName: "Eye",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Activity Log",
              path: "/company/audit/user-activity",
              iconName: "Activity",
              colorScheme: "amber",
            },
          ],
        };
      }

      case UserRole.INVIGILATOR:
      case "Invigilator": {
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Assigned Rooms",
              value: 0,
              change: "Today",
              trend: "neutral",
              iconName: "DoorOpen",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Candidates Under Watch",
              value: 0,
              change: "Active",
              trend: "neutral",
              iconName: "Users",
              colorScheme: "sky",
            },
            {
              id: "3",
              label: "Violations Reported",
              value: 0,
              change: "Today",
              trend: "down",
              iconName: "AlertTriangle",
              colorScheme: "amber",
            },
            {
              id: "4",
              label: "Shifts Today",
              value: 0,
              change: "Scheduled",
              trend: "neutral",
              iconName: "Clock",
              colorScheme: "emerald",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "My Shifts",
              path: "/company/shifts",
              iconName: "Calendar",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Report Violation",
              path: "/company/observer/violations",
              iconName: "AlertTriangle",
              colorScheme: "rose",
            },
            {
              id: "3",
              label: "Room Status",
              path: "/company/observer/rooms",
              iconName: "DoorOpen",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Attendance",
              path: "/company/observer/attendance",
              iconName: "CheckSquare",
              colorScheme: "emerald",
            },
          ],
        };
      }

      case UserRole.GOVT_AUTHORITY:
      case "Govt Authority": {
        const totalCompanies = await Company.countDocuments({ status: true });
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Active Organizations",
              value: totalCompanies,
              change: "Registered",
              trend: "up",
              iconName: "Building2",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Active Exams",
              value: 0,
              change: "Nationwide",
              trend: "neutral",
              iconName: "BookOpen",
              colorScheme: "sky",
            },
            {
              id: "3",
              label: "Total Candidates",
              value: 0,
              change: "Registered",
              trend: "up",
              iconName: "Users",
              colorScheme: "emerald",
            },
            {
              id: "4",
              label: "Compliance Reports",
              value: 0,
              change: "Pending review",
              trend: "neutral",
              iconName: "FileCheck",
              colorScheme: "amber",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "View Reports",
              path: "/company/reports",
              iconName: "BarChart2",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Audit Logs",
              path: "/company/audit",
              iconName: "ClipboardList",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "View Centers",
              path: "/company/centers",
              iconName: "Building2",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Notifications",
              path: "/company/notifications",
              iconName: "Bell",
              colorScheme: "amber",
            },
          ],
        };
      }

      case UserRole.CANDIDATE:
      case "Candidate": {
        return {
          ...base,
          stats: [
            {
              id: "1",
              label: "Upcoming Exams",
              value: 0,
              change: "Registered",
              trend: "neutral",
              iconName: "Calendar",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Completed Exams",
              value: 0,
              change: "Total",
              trend: "up",
              iconName: "CheckCircle",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Certificates",
              value: 0,
              change: "Earned",
              trend: "up",
              iconName: "Award",
              colorScheme: "amber",
            },
            {
              id: "4",
              label: "Results Available",
              value: 0,
              change: "Published",
              trend: "neutral",
              iconName: "BarChart2",
              colorScheme: "sky",
            },
          ],
          quickActions: [
            {
              id: "1",
              label: "My Exams",
              path: "/candidate/exam-schedule",
              iconName: "Calendar",
              colorScheme: "indigo",
            },
            {
              id: "2",
              label: "Admit Card",
              path: "/candidate/admit-card",
              iconName: "CreditCard",
              colorScheme: "emerald",
            },
            {
              id: "3",
              label: "Results",
              path: "/candidate/results",
              iconName: "BarChart2",
              colorScheme: "sky",
            },
            {
              id: "4",
              label: "Certificates",
              path: "/candidate/certificates",
              iconName: "Award",
              colorScheme: "amber",
            },
          ],
        };
      }

      default:
        return { ...base, stats: [], quickActions: [] };
    }
  }

  /*
    |--------------------------------------------------------------------------
    | Dashboard Charts
    |--------------------------------------------------------------------------
    */

  async getDashboardCharts(
    filter: IDashboardFilter,
  ): Promise<IDashboardCharts> {
    const companyStatusCounts = await Company.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const activeCount =
      companyStatusCounts.find((c: any) => c._id === true)?.count || 0;
    const pendingCount =
      companyStatusCounts.find((c: any) => c._id === false)?.count || 0;

    const currentYear = new Date().getFullYear();
    const companyGrowthAgg = await Company.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const allMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let cumulative = 0;
    const growthData = allMonths.map((_: string, index: number) => {
      const monthData = companyGrowthAgg.find((m: any) => m._id === index + 1);
      cumulative += monthData?.count || 0;
      return cumulative;
    });

    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const diff =
      today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(today.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);

    const revenueAgg = await Payment.aggregate([
      { $match: { status: "SUCCESS", createdAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const revenueData = [2, 3, 4, 5, 6, 7, 1].map((day: number) => {
      return revenueAgg.find((r: any) => r._id === day)?.total || 0;
    });

    return {
      companyGrowth: {
        labels: allMonths,
        series: [{ name: "Companies", data: growthData }],
      },
      subscriptionTrend: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        series: [
          { name: "Basic Plan", data: [20, 25, 35, 40, 45, 55, 60] },
          { name: "Pro Plan", data: [5, 10, 15, 25, 35, 45, 50] },
          { name: "Enterprise", data: [1, 2, 2, 4, 5, 8, 12] },
        ],
      },
      revenueTrend: {
        labels: weekLabels,
        series: [{ name: "Revenue (₹)", data: revenueData }],
      },
      companyStatusDistribution: {
        labels: ["Active", "Pending", "Suspended", "Inactive"],
        series: [{ name: "Status", data: [activeCount, pendingCount, 0, 0] }],
      },
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Dashboard Cards (legacy)
    |--------------------------------------------------------------------------
    */

  async getDashboardCards(filter: IDashboardFilter) {
    return [
      { title: "Candidates", value: 0 },
      { title: "Exams", value: 0 },
      { title: "Results", value: 0 },
      { title: "Attendance", value: 0 },
    ];
  }

  async getExamStatistics(filter: IDashboardFilter) {
    return { total: 0, scheduled: 0, ongoing: 0, completed: 0, cancelled: 0 };
  }

  async getCandidateStatistics(filter: IDashboardFilter) {
    return { total: 0, registered: 0, verified: 0, blocked: 0 };
  }

  async getResultStatistics(filter: IDashboardFilter) {
    return { total: 0, passed: 0, failed: 0, passPercentage: 0 };
  }

  async getAttendanceStatistics(filter: IDashboardFilter) {
    return { present: 0, absent: 0, attendancePercentage: 0 };
  }

  async getLiveMonitoringStatistics(filter: IDashboardFilter) {
    return { activeCandidates: 0, warnings: 0, violations: 0, disconnected: 0 };
  }

  async getQuestionBankStatistics(filter: IDashboardFilter) {
    return { subjects: 0, chapters: 0, topics: 0, questions: 0, papers: 0 };
  }

  async getCompanyStatistics(filter: IDashboardFilter) {
    const [companies, activeCompanies] = await Promise.all([
      Company.countDocuments(),
      Company.countDocuments({ status: true }),
    ]);
    return {
      companies,
      activeCompanies,
      inactiveCompanies: companies - activeCompanies,
    };
  }

  async getCenterStatistics(filter: IDashboardFilter) {
    return { totalCenters: 0, activeCenters: 0, inactiveCenters: 0 };
  }

  async getEmployeeStatistics(filter: IDashboardFilter) {
    const total = await User.countDocuments({
      role: { $nin: [UserRole.MASTER_ADMIN, UserRole.CANDIDATE] },
    });
    return {
      totalEmployees: total,
      activeEmployees: total,
      inactiveEmployees: 0,
    };
  }

  async getActivityStatistics(filter: IDashboardFilter) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [todayActivities, loginActivities] = await Promise.all([
      ActivityLog.countDocuments({ createdAt: { $gte: startOfDay } }),
      ActivityLog.countDocuments({
        activityType: ActivityType.LOGIN,
        createdAt: { $gte: startOfDay },
      } as any),
    ]);
    return {
      todayActivities,
      loginActivities,
      examActivities: 0,
      systemActivities: todayActivities - loginActivities,
    };
  }

  async getQueueStatistics(filter: IDashboardFilter) {
    return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 };
  }

  async getNotificationStatistics(filter: IDashboardFilter) {
    const unread = await Notification.countDocuments({
      status: NotificationStatus.PENDING,
      isDeleted: false,
    } as any);
    return { emails: 0, sms: 0, pushNotifications: 0, unread };
  }

  async getSystemHealth() {
    return {
      server: "Healthy",
      database: "Connected",
      redis: "Connected",
      queue: "Running",
      storage: "Available",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
    };
  }
}

export default new DashboardService();
