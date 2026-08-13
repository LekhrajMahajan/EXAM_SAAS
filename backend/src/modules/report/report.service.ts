import Report from "./report.model";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import reportRepository from "./report.repository";

import {
    IGenerateReport,
    ReportStatus,
    ReportType,
} from "./report.types";
import Candidate from "../candidate/candidate.model";
import { CandidateStatus } from "../candidate/candidate.types";
import { AttendanceModel } from "../attendance/attendance.model";
import { AttendanceStatus, VerificationStatus } from "../attendance/attendance.types";
import Result from "../result/result.model";
import { PassStatus, ResultStatus as ResStatus } from "../result/result.types";
import { BaseService } from "../../common/base.service";
import User from "../user/user.model";
import SystemSetting from "../system-settings/systemSettings.model";
import Employee from "../employee/employee.model";
import Exam from "../exam/exam.model";
import { ExamStatus } from "../exam/exam.types";
import Invoice from "../invoice/invoice.model";
import Payment from "../payment/payment.model";
import { InvoiceStatus, PaymentStatus } from "../invoice/invoice.types";
import { SecurityEventModel } from "../security/securityEvent.model";
import { SecurityService } from "../security/security.service";

import fs from "fs";
import path from "path";
import pdfService from "./pdf.service";
import auditLogService from "../audit-log/auditLog.service";
import { AuditAction } from "../audit-log/auditLog.types";

const securityService = new SecurityService();

class ReportService extends BaseService<any> {
    constructor() {
        super(reportRepository, "Report");
    }

    private async getAppName(): Promise<string> {
        try {
            const setting = await SystemSetting.findOne({ key: 'APP_NAME' });
            return setting?.value || "ExamGuard Pro";
        } catch (error) {
            return "ExamGuard Pro";
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Report
    |--------------------------------------------------------------------------
    */

    async generate(

        payload: IGenerateReport,

        generatedBy: string

    ) {

        const report =
            await super.create({

                ...payload,

                generatedBy,

                status:
                    ReportStatus.PENDING,

            });

        /*
        |--------------------------------------------------------------------------
        | TODO
        |--------------------------------------------------------------------------
        |
        | Queue PDF Generation
        | Queue Excel Generation
        | Queue CSV Generation
        |
        */

        return report;

    }

    /*
    |--------------------------------------------------------------------------
    | Candidate Report
    |--------------------------------------------------------------------------
    */

    async generateCandidateReport(
        payload: any,
        generatedBy: string
    ) {
        // Fetch candidates with no limit to get all data matching filters
        const { data: candidates } = await this.getCandidateList({ ...payload, limit: 10000 });
        
        if (!candidates || candidates.length === 0) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "No candidate records found for export.");
        }

        const summary = await this.getCandidateSummary(payload);
        
        // Read HTML template
        const templatePath = path.join(__dirname, '../../templates/candidate_report.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        const generator = await User.findById(generatedBy);
        const generatedByName = generator ? `${generator.firstName} ${generator.lastName}` : "Admin";

        // Replace global placeholders
        html = html.replace(/{{ORG_NAME}}/g, await this.getAppName());
        html = html.replace(/{{ORG_INITIALS}}/g, "EGP");
        html = html.replace(/{{GENERATED_BY}}/g, generatedByName);
        html = html.replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString());
        html = html.replace(/{{TOTAL_CANDIDATES}}/g, summary.totalCandidates.toString());
        html = html.replace(/{{ACTIVE_APPROVED}}/g, summary.activeCandidates.toString());
        html = html.replace(/{{PENDING_VERIFICATION}}/g, summary.pendingVerification.toString());
        html = html.replace(/{{REJECTED_SUSPENDED}}/g, summary.rejectedCandidates.toString());
        html = html.replace(/{{ADMIT_CARDS}}/g, summary.admitCardsGenerated.toString());
        html = html.replace(/{{APPEARED}}/g, summary.appeared.toString());
        html = html.replace(/{{ABSENT}}/g, summary.absent.toString());
        html = html.replace(/{{ROW_START}}/g, "1");
        html = html.replace(/{{ROW_END}}/g, candidates.length.toString());
        html = html.replace(/{{TOTAL_ROWS}}/g, candidates.length.toString());

        // Replace candidate rows
        const rowStartMatch = html.match(/<!-- CANDIDATE_ROWS_START -->([\s\S]*?)<!-- CANDIDATE_ROWS_END -->/);
        if (rowStartMatch && rowStartMatch[1]) {
            const rowTemplate = rowStartMatch[1];
            let rowsHtml = '';
            
            candidates.forEach((c: any) => {
                let row = rowTemplate;
                row = row.replace(/{{CAND_ID}}/g, c.candidateCode || "");
                row = row.replace(/{{CAND_NAME}}/g, c.fullName || "");
                row = row.replace(/{{CAND_EMAIL}}/g, c.email || "");
                row = row.replace(/{{CAND_MOBILE}}/g, c.mobile || "");
                row = row.replace(/{{CAND_EXAM}}/g, c.exam || "");
                row = row.replace(/{{CAND_COMPANY}}/g, c.company || "");
                row = row.replace(/{{CAND_CENTER}}/g, c.center || "");
                row = row.replace(/{{CAND_BIOMETRIC}}/g, c.biometricVerified ? "Yes" : "No");
                row = row.replace(/{{CAND_STATUS}}/g, c.status || "");
                row = row.replace(/{{CAND_REGISTERED}}/g, c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "");
                rowsHtml += row;
            });
            
            html = html.replace(rowStartMatch[0], rowsHtml);
        }

        // Generate PDF
        const pdfBuffer = await pdfService.generatePdfFromHtml(html);

        await super.create({
            reportType: ReportType.CANDIDATE,
            reportName: "Candidate Report",
            description: "Export of candidate data",
            generatedBy: generator?._id as any,
            filters: payload,
            status: ReportStatus.COMPLETED,
            fileUrl: "PDF",
            format: "PDF"
        });

        // Audit Log
        await auditLogService.log({
            action: AuditAction.EXPORT,
            module: "Report",
            performedBy: generator?._id as any,
            description: `Candidate Report Exported. Record Count: ${candidates.length}`,
        } as any);

        return pdfBuffer;
    }

    /*
    |--------------------------------------------------------------------------
    | Exam Report
    |--------------------------------------------------------------------------
    */

    async generateExamReport(
        payload: any,
        generatedBy: string
    ) {
        const { data: exams } = await this.getExamList({ ...payload, limit: 10000 });

        if (!exams || exams.length === 0) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "No exam records found for export.");
        }

        const summary = await this.getExamSummary(payload);

        const templatePath = path.join(__dirname, '../../templates/exam_report.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        const generator = await User.findById(generatedBy);
        const generatedByName = generator ? `${generator.firstName} ${generator.lastName}` : "Admin";

        html = html.replace(/{{ORG_NAME}}/g, await this.getAppName());
        html = html.replace(/{{ORG_INITIALS}}/g, "EGP");
        html = html.replace(/{{GENERATED_BY}}/g, generatedByName);
        html = html.replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString());
        html = html.replace(/{{TOTAL_EXAMS}}/g, summary.totalExams.toString());
        html = html.replace(/{{SCHEDULED_EXAMS}}/g, summary.scheduledExams.toString());
        html = html.replace(/{{RUNNING_EXAMS}}/g, summary.runningExams.toString());
        html = html.replace(/{{COMPLETED_EXAMS}}/g, summary.completedExams.toString());
        html = html.replace(/{{CANCELLED_EXAMS}}/g, summary.cancelledExams.toString());
        html = html.replace(/{{TOTAL_CENTERS}}/g, summary.totalExamCenters.toString());
        html = html.replace(/{{ROW_START}}/g, "1");
        html = html.replace(/{{ROW_END}}/g, exams.length.toString());
        html = html.replace(/{{TOTAL_ROWS}}/g, exams.length.toString());

        const rowMatch = html.match(/<!-- EXAM_ROWS_START -->([\s\S]*?)<!-- EXAM_ROWS_END -->/);
        if (rowMatch && rowMatch[1]) {
            const rowTemplate = rowMatch[1];
            let rowsHtml = '';
            exams.forEach((e: any) => {
                let row = rowTemplate;
                row = row.replace(/{{EXAM_CODE}}/g, e.examCode || "");
                row = row.replace(/{{EXAM_TITLE}}/g, e.examTitle || "");
                row = row.replace(/{{EXAM_SUBJECT}}/g, e.subject || "");
                row = row.replace(/{{EXAM_COMPANY}}/g, e.company || "");
                row = row.replace(/{{EXAM_CENTER}}/g, e.examCenter || "");
                row = row.replace(/{{EXAM_ASSIGNED}}/g, (e.candidatesAssigned || 0).toString());
                row = row.replace(/{{EXAM_APPEARED}}/g, (e.candidatesAppeared || 0).toString());
                row = row.replace(/{{EXAM_ABSENT}}/g, (e.candidatesAbsent || 0).toString());
                row = row.replace(/{{EXAM_STATUS}}/g, e.status || "");
                row = row.replace(/{{EXAM_DATE}}/g, e.examDate ? new Date(e.examDate).toLocaleDateString() : "N/A");
                rowsHtml += row;
            });
            html = html.replace(/<!-- EXAM_ROWS_START -->[\s\S]*?<!-- EXAM_ROWS_END -->/, rowsHtml);
        }

        const pdfBuffer = await pdfService.generatePdfFromHtml(html);

        await super.create({
            reportType: ReportType.EXAM,
            reportName: "Exam Report",
            description: "Export of exam data",
            generatedBy: generator?._id as any,
            filters: payload,
            status: ReportStatus.COMPLETED,
            fileUrl: "PDF",
            format: "PDF"
        });

        await auditLogService.log({
            action: AuditAction.DOWNLOAD,
            module: "Report",
            performedBy: generator?._id as any,
            description: `Exam Report Exported. Record Count: ${exams.length}`,
        } as any);

        return pdfBuffer;
    }

    /*
    |--------------------------------------------------------------------------
    | Result Report
    |--------------------------------------------------------------------------
    */

    async generateResultReport(
        payload: any,
        generatedBy: string
    ) {
        const { data: results } = await this.getResultList({ ...payload, limit: 10000 });

        if (!results || results.length === 0) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "No result records found for export.");
        }

        const summary = await this.getResultSummary(payload);

        const templatePath = path.join(__dirname, '../../templates/result_report.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        const generator = await User.findById(generatedBy);
        const generatedByName = generator ? `${generator.firstName} ${generator.lastName}` : "Admin";

        html = html.replace(/{{ORG_NAME}}/g, await this.getAppName());
        html = html.replace(/{{ORG_INITIALS}}/g, "EGP");
        html = html.replace(/{{GENERATED_BY}}/g, generatedByName);
        html = html.replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString());
        html = html.replace(/{{TOTAL_RESULTS}}/g, summary.totalResults.toString());
        html = html.replace(/{{PUBLISHED}}/g, summary.publishedResults.toString());
        html = html.replace(/{{PENDING_APPROVAL}}/g, summary.pendingApproval.toString());
        html = html.replace(/{{PASS_COUNT}}/g, summary.passCandidates.toString());
        html = html.replace(/{{FAIL_COUNT}}/g, summary.failCandidates.toString());
        html = html.replace(/{{PASS_PCT}}/g, summary.overallPassPercentage.toString());
        html = html.replace(/{{ROW_START}}/g, "1");
        html = html.replace(/{{ROW_END}}/g, results.length.toString());
        html = html.replace(/{{TOTAL_ROWS}}/g, results.length.toString());

        const rowMatch = html.match(/<!-- RESULT_ROWS_START -->([\s\S]*?)<!-- RESULT_ROWS_END -->/);
        if (rowMatch && rowMatch[1]) {
            const rowTemplate = rowMatch[1];
            let rowsHtml = '';
            results.forEach((r: any) => {
                let row = rowTemplate;
                row = row.replace(/{{RES_CAND_ID}}/g, r.candidateId || "");
                row = row.replace(/{{RES_CAND_NAME}}/g, r.candidateName || "");
                row = row.replace(/{{RES_EXAM}}/g, r.exam || "");
                row = row.replace(/{{RES_SUBJECT}}/g, r.subject || "");
                row = row.replace(/{{RES_MARKS}}/g, (r.marksObtained || 0).toString());
                row = row.replace(/{{RES_MAX_MARKS}}/g, (r.maximumMarks || 0).toString());
                row = row.replace(/{{RES_PERCENTAGE}}/g, (r.percentage || 0).toString());
                row = row.replace(/{{RES_GRADE}}/g, r.grade || "");
                row = row.replace(/{{RES_RANK}}/g, r.rank?.toString() || "N/A");
                row = row.replace(/{{RES_STATUS}}/g, r.resultStatus || "");
                rowsHtml += row;
            });
            html = html.replace(/<!-- RESULT_ROWS_START -->[\s\S]*?<!-- RESULT_ROWS_END -->/, rowsHtml);
        }

        const pdfBuffer = await pdfService.generatePdfFromHtml(html);

        await super.create({
            reportType: ReportType.RESULT,
            reportName: "Result Report",
            description: "Export of result data",
            generatedBy: generator?._id as any,
            filters: payload,
            status: ReportStatus.COMPLETED,
            fileUrl: "PDF",
            format: "PDF"
        });

        await auditLogService.log({
            action: AuditAction.DOWNLOAD,
            module: "Report",
            performedBy: generator?._id as any,
            description: `Result Report Exported. Record Count: ${results.length}`,
        } as any);

        return pdfBuffer;
    }

    /*
    |--------------------------------------------------------------------------
    | Attendance Report
    |--------------------------------------------------------------------------
    */

    async generateAttendanceReport(
        payload: any,
        generatedBy: string
    ) {
        const { data: attendances } = await this.getAttendanceList({ ...payload, limit: 10000 });

        if (!attendances || attendances.length === 0) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "No attendance records found for export.");
        }

        const summary = await this.getAttendanceSummary(payload);

        const templatePath = path.join(__dirname, '../../templates/attendance_report.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        const generator = await User.findById(generatedBy);
        const generatedByName = generator ? `${generator.firstName} ${generator.lastName}` : "Admin";

        html = html.replace(/{{ORG_NAME}}/g, await this.getAppName());
        html = html.replace(/{{ORG_INITIALS}}/g, "EGP");
        html = html.replace(/{{GENERATED_BY}}/g, generatedByName);
        html = html.replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString());
        html = html.replace(/{{TOTAL_REGISTERED}}/g, summary.totalRegistered.toString());
        html = html.replace(/{{PRESENT}}/g, summary.present.toString());
        html = html.replace(/{{ABSENT}}/g, summary.absent.toString());
        html = html.replace(/{{LATE_ARRIVALS}}/g, summary.lateArrivals.toString());
        html = html.replace(/{{NO_SHOWS}}/g, summary.noShows.toString());
        html = html.replace(/{{ATTENDANCE_PCT}}/g, summary.attendancePercentage.toString());
        html = html.replace(/{{ROW_START}}/g, "1");
        html = html.replace(/{{ROW_END}}/g, attendances.length.toString());
        html = html.replace(/{{TOTAL_ROWS}}/g, attendances.length.toString());

        const rowMatch = html.match(/<!-- ATTENDANCE_ROWS_START -->([\s\S]*?)<!-- ATTENDANCE_ROWS_END -->/);
        if (rowMatch && rowMatch[1]) {
            const rowTemplate = rowMatch[1];
            let rowsHtml = '';
            attendances.forEach((a: any) => {
                let row = rowTemplate;
                row = row.replace(/{{ATT_CAND_ID}}/g, a.candidateId || "");
                row = row.replace(/{{ATT_CAND_NAME}}/g, a.candidateName || "");
                row = row.replace(/{{ATT_EXAM}}/g, a.exam || "");
                row = row.replace(/{{ATT_SESSION}}/g, a.session || "");
                row = row.replace(/{{ATT_CENTER}}/g, a.examCenter || "");
                row = row.replace(/{{ATT_CHECKIN}}/g, a.checkInTime ? new Date(a.checkInTime).toLocaleString() : "N/A");
                row = row.replace(/{{ATT_CHECKOUT}}/g, a.checkOutTime ? new Date(a.checkOutTime).toLocaleString() : "N/A");
                row = row.replace(/{{ATT_BIOMETRIC}}/g, a.biometricStatus || "N/A");
                row = row.replace(/{{ATT_STATUS}}/g, a.attendanceStatus || "");
                rowsHtml += row;
            });
            html = html.replace(/<!-- ATTENDANCE_ROWS_START -->[\s\S]*?<!-- ATTENDANCE_ROWS_END -->/, rowsHtml);
        }

        const pdfBuffer = await pdfService.generatePdfFromHtml(html);

        await super.create({
            reportType: ReportType.ATTENDANCE,
            reportName: "Attendance Report",
            description: "Export of attendance data",
            generatedBy: generator?._id as any,
            filters: payload,
            status: ReportStatus.COMPLETED,
            fileUrl: "PDF",
            format: "PDF"
        });

        await auditLogService.log({
            action: AuditAction.DOWNLOAD,
            module: "Report",
            performedBy: generator?._id as any,
            description: `Attendance Report Exported. Record Count: ${attendances.length}`,
        } as any);

        return pdfBuffer;
    }

    /*
    |--------------------------------------------------------------------------
    | Biometric Report
    |--------------------------------------------------------------------------
    */

    async generateBiometricReport(

        payload: IGenerateReport,

        generatedBy: string

    ) {

        return this.generate(

            {

                ...payload,

                reportType:

                    ReportType.BIOMETRIC,

            },

            generatedBy

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Live Monitoring Report
    |--------------------------------------------------------------------------
    */

    async generateLiveMonitoringReport(

        payload: IGenerateReport,

        generatedBy: string

    ) {

        return this.generate(

            {

                ...payload,

                reportType:

                    ReportType.LIVE_MONITORING,

            },

            generatedBy

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Custom Report
    |--------------------------------------------------------------------------
    */

    async generateCustomReport(

        payload: IGenerateReport,

        generatedBy: string

    ) {

        return this.generate(

            {

                ...payload,

                reportType:

                    ReportType.CUSTOM,

            },

            generatedBy

        );

    }

  /*
    |--------------------------------------------------------------------------
    | Get By Company
    |--------------------------------------------------------------------------
    */

    async getByCompany(
        companyId: string
    ) {

        return reportRepository.findByCompany(
            companyId
        );

    }

  /*
    |--------------------------------------------------------------------------
    | Delete Report
    |--------------------------------------------------------------------------
    */

    async delete(
        id: string
    ) {

        const report =
            await reportRepository.deleteById(
                id
            );

        if (!report) {

            throw new ApiError(

                HTTP_STATUS.NOT_FOUND,

                "Report not found."

            );

        }

        return {

            deleted: true,

        };

    }

    async getDashboard(query: any = {}, userId: string) {
        const { companyId, startDate, endDate } = query;
        const filter: any = {};
        if (companyId) filter.companyId = companyId;
        
        let dateFilter: any = {};
        if (startDate && endDate) {
            dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
            filter.createdAt = dateFilter;
        }

        // Today filter
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const totalReports = await Report.countDocuments(filter);
        const generatedToday = await Report.countDocuments({ ...filter, createdAt: { $gte: startOfToday, $lte: endOfToday } });
        
        const scheduledReports = await Report.countDocuments({ ...filter, isScheduled: true });
        
        // Favorited by current user
        const favoriteReports = await Report.countDocuments({ ...filter, favorites: userId });
        
        // Downloads today (we might just aggregate total downloads if 'downloadsToday' is hard without a download log collection, 
        // let's just return total downloads for now or mock it with 0)
        const downloadsToday = await Report.aggregate([
            { $match: { ...filter } },
            { $group: { _id: null, total: { $sum: "$downloadCount" } } }
        ]).then(res => res[0]?.total || 0);

        const failedReports = await Report.countDocuments({ ...filter, status: ReportStatus.FAILED });
        const pendingReports = await Report.countDocuments({ ...filter, status: { $in: [ReportStatus.PENDING, ReportStatus.PROCESSING] } });

        return {
            totalReports,
            generatedToday,
            scheduledReports,
            favoriteReports,
            downloadsToday,
            failedReports,
            pendingReports,
        };
    }

    async getStatistics(query: any = {}) {
        const { companyId } = query;
        const filter: any = {};
        if (companyId) filter.companyId = companyId;

        // Reports by Module
        const reportsByModule = await Report.aggregate([
            { $match: filter },
            { $group: { _id: "$reportType", count: { $sum: 1 } } }
        ]);

        // Reports by Day (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const reportsByDay = await Report.aggregate([
            { $match: { ...filter, createdAt: { $gte: thirtyDaysAgo } } },
            { 
                $group: { 
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, 
                    count: { $sum: 1 } 
                } 
            },
            { $sort: { _id: 1 } }
        ]);

        // Top Downloaded Reports
        const topDownloaded = await Report.find(filter)
            .sort({ downloadCount: -1 })
            .limit(5)
            .select('reportName downloadCount reportType');

        return {
            reportsByModule: reportsByModule.map(m => ({ module: m._id, count: m.count })),
            reportsByDay: reportsByDay.map(d => ({ date: d._id, count: d.count })),
            topDownloaded
        };
    }

    async getRecent(query: any = {}) {
        const { companyId, limit = 10, type, reportType } = query;
        const filter: any = {};
        if (companyId) filter.companyId = companyId;
        if (type || reportType) filter.reportType = type || reportType;

        const recent = await Report.find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .populate('generatedBy', 'firstName lastName email')
            .lean();
            
        return recent;
    }

    async getCategories() {
        return Object.values(ReportType);
    }

    async toggleFavorite(reportId: string, userId: string) {
        const report = await Report.findById(reportId);
        if (!report) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Report not found.");
        }

        const isFavorite = report.favorites.includes(userId as any);
        if (isFavorite) {
            report.favorites = report.favorites.filter(id => id.toString() !== userId);
        } else {
            report.favorites.push(userId as any);
        }
        
        await report.save();
        
        return { isFavorite: !isFavorite, reportId };
    }

    async incrementDownload(reportId: string) {
        const report = await Report.findByIdAndUpdate(
            reportId,
            { $inc: { downloadCount: 1 } },
            { new: true }
        );
        
        if (!report) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Report not found.");
        }
        
        return { downloadCount: report.downloadCount, reportId };
    }

    /*
    |--------------------------------------------------------------------------
    | User Access Report - Summary Cards
    |--------------------------------------------------------------------------
    */

    async getUserReportSummary(query: any = {}) {
        const { companyId, startDate, endDate } = query;
        const userFilter: any = {};
        const empFilter: any = {};
        if (companyId) {
            userFilter.companyId = companyId;
            empFilter.companyId = companyId;
        }

        const dateFilter: any = {};
        if (startDate && endDate) {
            dateFilter.$gte = new Date(startDate);
            dateFilter.$lte = new Date(endDate);
        }
        if (startDate) userFilter.createdAt = dateFilter;

        // Today's date range for login stats
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const [
            totalUsers,
            activeUsers,
            lockedUsers,
            suspendedUsers,
            loginAttemptsToday,
        ] = await Promise.all([
            User.countDocuments(companyId ? { companyId } : {}),
            User.countDocuments({ ...(companyId ? { companyId } : {}), status: 'ACTIVE' }),
            User.countDocuments({ ...(companyId ? { companyId } : {}), status: 'BLOCKED' }),
            User.countDocuments({ ...(companyId ? { companyId } : {}), status: 'SUSPENDED' }),
            User.aggregate([
                { $match: companyId ? { companyId } : {} },
                { $unwind: '$loginHistory' },
                { $match: { 'loginHistory.loginAt': { $gte: startOfToday, $lte: endOfToday } } },
                { $count: 'total' },
            ]).then(res => res[0]?.total || 0),
        ]);

        // Active sessions: users who have at least one session
        const activeSessions = await User.aggregate([
            { $match: companyId ? { companyId } : {} },
            { $project: { sessionCount: { $size: { $ifNull: ['$sessions', []] } } } },
            { $group: { _id: null, total: { $sum: '$sessionCount' } } },
        ]).then(res => res[0]?.total || 0);

        // Total roles distinct
        const totalRoles = await User.distinct('role', companyId ? { companyId } : {}).then(r => r.length);

        // Permission assignments via employee records (they have roleId references)
        const permissionAssignments = await Employee.countDocuments(empFilter);

        return {
            totalUsers,
            activeUsers,
            lockedUsers,
            suspendedUsers,
            totalRoles,
            activeSessions,
            permissionAssignments,
            loginAttemptsToday,
        };
    }

    /*
    |--------------------------------------------------------------------------
    | User Access Report - Users List (paginated, filtered)
    |--------------------------------------------------------------------------
    */

    async getUsersList(query: any = {}) {
        const {
            page = 1,
            limit = 20,
            search,
            companyId,
            status,
            role,
            startDate,
            endDate,
        } = query;

        const skip = (Number(page) - 1) * Number(limit);
        const filter: any = {};
        const andConditions: any[] = [];

        if (companyId) filter.companyId = companyId;
        
        if (status) {
            if (status === 'ACTIVE') {
                andConditions.push({ $or: [{ status: 'ACTIVE' }, { isDeleted: false, status: { $exists: false } }] });
            } else if (status === 'INACTIVE') {
                andConditions.push({ $or: [{ status: 'INACTIVE' }, { isDeleted: true, status: { $exists: false } }] });
            } else {
                filter.status = status;
            }
        }

        if (role) {
            filter.role = { $regex: role.replace(/\s+/g, '_'), $options: 'i' };
        }
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        
        if (search) {
            const matchedEmployees = await Employee.find({
                $or: [
                    { employeeCode: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } }
                ]
            }).select('userId').lean();
            const matchedUserIds = matchedEmployees.map((e: any) => e.userId);

            andConditions.push({
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } },
                    { role: { $regex: search.replace(/\s+/g, '_'), $options: 'i' } },
                    {
                        $expr: {
                            $regexMatch: {
                                input: { $concat: ["$firstName", " ", "$lastName"] },
                                regex: search,
                                options: "i"
                            }
                        }
                    },
                    ...(matchedUserIds.length > 0 ? [{ _id: { $in: matchedUserIds } }] : [])
                ]
            });
        }

        if (andConditions.length > 0) {
            filter.$and = andConditions;
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-password -devices -sessions -loginHistory')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            User.countDocuments(filter),
        ]);

        // Enrich with employee data (employeeCode, department, branch, company)
        const userIds = users.map((u: any) => u._id);
        const employees = await Employee.find({ userId: { $in: userIds } })
            .populate('companyId', 'name')
            .populate('branchId', 'name')
            .lean();

        const empMap: any = {};
        employees.forEach((e: any) => {
            empMap[e.userId.toString()] = e;
        });

        const enriched = users.map((u: any) => {
            const emp = empMap[u._id.toString()] || {};
            return {
                ...u,
                employeeCode: emp.employeeCode || null,
                department: emp.department || null,
                company: emp.companyId?.name || null,
                branch: emp.branchId?.name || null,
                status: u.status || (u.isDeleted ? 'INACTIVE' : 'ACTIVE'),
                lastLoginAt: u.lastLogin || null,
            };
        });

        return {
            data: enriched,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }

    /*
    |--------------------------------------------------------------------------
    | User Access Report - Login History
    |--------------------------------------------------------------------------
    */

    async getUserLoginHistory(query: any = {}) {
        const {
            page = 1,
            limit = 50,
            companyId,
            userId,
            successful,
            startDate,
            endDate,
        } = query;

        const skip = (Number(page) - 1) * Number(limit);
        const userFilter: any = {};
        if (companyId) userFilter.companyId = companyId;
        if (userId) userFilter._id = userId;

        const matchStage: any = {};
        if (successful !== undefined) matchStage['loginHistory.successful'] = successful === 'true';
        if (startDate || endDate) {
            matchStage['loginHistory.loginAt'] = {};
            if (startDate) matchStage['loginHistory.loginAt'].$gte = new Date(startDate);
            if (endDate) matchStage['loginHistory.loginAt'].$lte = new Date(endDate);
        }

        const pipeline: any[] = [
            { $match: userFilter },
            { $unwind: '$loginHistory' },
            ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
            { $sort: { 'loginHistory.loginAt': -1 } },
            {
                $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    role: 1,
                    loginAt: '$loginHistory.loginAt',
                    successful: '$loginHistory.successful',
                    ipAddress: '$loginHistory.ipAddress',
                    browser: '$loginHistory.browser',
                    operatingSystem: '$loginHistory.operatingSystem',
                    location: '$loginHistory.location',
                },
            },
        ];

        const countPipeline = [...pipeline, { $count: 'total' }];
        const [records, countResult] = await Promise.all([
            User.aggregate([...pipeline, { $skip: skip }, { $limit: Number(limit) }]),
            User.aggregate(countPipeline),
        ]);

        const total = countResult[0]?.total || 0;

        // Stats for summary
        const statsAgg = await User.aggregate([
            { $match: userFilter },
            { $unwind: '$loginHistory' },
            {
                $group: {
                    _id: null,
                    totalLogins: { $sum: 1 },
                    successful: { $sum: { $cond: ['$loginHistory.successful', 1, 0] } },
                    failed: { $sum: { $cond: ['$loginHistory.successful', 0, 1] } },
                },
            },
        ]);

        const loginsByDay = await User.aggregate([
            { $match: userFilter },
            { $unwind: '$loginHistory' },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$loginHistory.loginAt' } },
                    count: { $sum: 1 },
                    successful: { $sum: { $cond: ['$loginHistory.successful', 1, 0] } },
                    failed: { $sum: { $cond: ['$loginHistory.successful', 0, 1] } },
                },
            },
            { $sort: { _id: 1 } },
            { $limit: 30 },
        ]);

        return {
            data: records,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
            stats: statsAgg[0] || { totalLogins: 0, successful: 0, failed: 0 },
            loginsByDay: loginsByDay.map(d => ({ date: d._id, count: d.count, successful: d.successful, failed: d.failed })),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | User Access Report - Roles Summary
    |--------------------------------------------------------------------------
    */

    async getUserRolesReport(query: any = {}) {
        const { companyId } = query;
        const filter: any = {};
        if (companyId) filter.companyId = companyId;

        const usersByRole = await User.aggregate([
            { $match: filter },
            { $group: { _id: '$role', count: { $sum: 1 }, statuses: { $push: { $ifNull: ['$status', 'ACTIVE'] } } } },
            { $sort: { count: -1 } },
        ]);

        const usersByStatus = await User.aggregate([
            { $match: filter },
            { $group: { _id: { $ifNull: ['$status', 'ACTIVE'] }, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        const newUsersLast30Days = await User.aggregate([
            { $match: { ...filter, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return {
            usersByRole: usersByRole.map(r => ({
                role: r._id,
                count: r.count,
                active: r.statuses.filter((s: string) => s === 'ACTIVE').length,
            })),
            usersByStatus: usersByStatus.map(s => ({ status: s._id, count: s.count })),
            newUsersLast30Days: newUsersLast30Days.map(d => ({ date: d._id, count: d.count })),
        };
    }

    /*
    |--------------------------------------------------------------------------
    | User Access Report - Export (returns raw data)
    |--------------------------------------------------------------------------
    */

    async getUsersExport(query: any = {}) {
        const { companyId, status, role } = query;
        const filter: any = {};
        if (companyId) filter.companyId = companyId;
        if (status) filter.status = status;
        if (role) filter.role = role;

        const users = await User.find(filter)
            .select('firstName lastName email role status lastLoginAt createdAt')
            .sort({ createdAt: -1 })
            .lean();

        const userIds = users.map((u: any) => u._id);
        const employees = await Employee.find({ userId: { $in: userIds } })
            .populate('companyId', 'name')
            .populate('branchId', 'name')
            .lean();

        const empMap: any = {};
        employees.forEach((e: any) => {
            empMap[e.userId.toString()] = e;
        });

        return users.map((u: any) => {
            const emp = empMap[u._id.toString()] || {};
            return {
                name: `${u.firstName} ${u.lastName}`,
                email: u.email,
                role: u.role,
                status: u.status,
                employeeCode: emp.employeeCode || '',
                department: emp.department || '',
                company: (emp.companyId as any)?.name || '',
                branch: (emp.branchId as any)?.name || '',
                lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt).toISOString() : '',
                createdAt: new Date(u.createdAt).toISOString(),
            };
        });
    }

    /*
    |--------------------------------------------------------------------------
    | User & Access Report - PDF Generation
    |--------------------------------------------------------------------------
    */

    async generateUserReport(payload: any, generatedBy: string) {
        const users = await this.getUsersExport(payload);
        const summary = await this.getUserReportSummary(payload);

        const templatePath = path.join(__dirname, '../../templates/user_report.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        const generator = await User.findById(generatedBy);
        const generatedByName = generator ? `${generator.firstName} ${generator.lastName}` : "Admin";
        const stats = (summary as any).data || summary;

        html = html.replace(/{{ORG_NAME}}/g, await this.getAppName());
        html = html.replace(/{{ORG_INITIALS}}/g, "EGP");
        html = html.replace(/{{GENERATED_BY}}/g, generatedByName);
        html = html.replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString());
        html = html.replace(/{{TOTAL_USERS}}/g, (stats.totalUsers || 0).toString());
        html = html.replace(/{{ACTIVE_USERS}}/g, (stats.activeUsers || 0).toString());
        html = html.replace(/{{LOCKED_ACCOUNTS}}/g, (stats.lockedUsers || 0).toString());
        html = html.replace(/{{SUSPENDED_USERS}}/g, (stats.suspendedUsers || 0).toString());
        html = html.replace(/{{TOTAL_ROLES}}/g, (stats.totalRoles || 0).toString());
        html = html.replace(/{{ACTIVE_SESSIONS}}/g, (stats.activeSessions || 0).toString());
        html = html.replace(/{{ROW_START}}/g, "1");
        html = html.replace(/{{ROW_END}}/g, (users?.length || 0).toString());
        html = html.replace(/{{TOTAL_ROWS}}/g, (users?.length || 0).toString());

        const rowMatch = html.match(/<!-- USER_ROWS_START -->([\s\S]*?)<!-- USER_ROWS_END -->/);
        if (rowMatch && rowMatch[1]) {
            const rowTemplate = rowMatch[1];
            let rowsHtml = '';
            (users || []).forEach((u: any) => {
                let row = rowTemplate;
                row = row.replace(/{{USER_NAME}}/g, u.name || "");
                row = row.replace(/{{USER_EMAIL}}/g, u.email || "");
                row = row.replace(/{{USER_ROLE}}/g, u.role || "");
                row = row.replace(/{{USER_STATUS}}/g, u.status || "");
                row = row.replace(/{{USER_EMP_CODE}}/g, u.employeeCode || "N/A");
                row = row.replace(/{{USER_DEPT}}/g, u.department || "N/A");
                row = row.replace(/{{USER_COMPANY}}/g, u.company || "N/A");
                row = row.replace(/{{USER_BRANCH}}/g, u.branch || "N/A");
                row = row.replace(/{{USER_LAST_LOGIN}}/g, u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "N/A");
                row = row.replace(/{{USER_CREATED_AT}}/g, u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A");
                rowsHtml += row;
            });
            html = html.replace(/<!-- USER_ROWS_START -->[\s\S]*?<!-- USER_ROWS_END -->/, rowsHtml);
        }

        const loginHistoryData = await this.getUserLoginHistory({ ...payload, limit: 10000 });
        const loginRecords = loginHistoryData?.data || [];
        const loginMatch = html.match(/<!-- LOGIN_ROWS_START -->([\s\S]*?)<!-- LOGIN_ROWS_END -->/);
        if (loginMatch && loginMatch[1]) {
            const loginTemplate = loginMatch[1];
            let loginRowsHtml = '';
            loginRecords.forEach((l: any) => {
                let row = loginTemplate;
                row = row.replace(/{{LOGIN_USER}}/g, `${l.firstName} ${l.lastName}` || "");
                row = row.replace(/{{LOGIN_EMAIL}}/g, l.email || "");
                row = row.replace(/{{LOGIN_RESULT}}/g, l.successful ? "Success" : "Failed");
                row = row.replace(/{{LOGIN_IP}}/g, l.ipAddress || "N/A");
                row = row.replace(/{{LOGIN_BROWSER}}/g, l.browser || "N/A");
                row = row.replace(/{{LOGIN_OS}}/g, l.operatingSystem || "N/A");
                row = row.replace(/{{LOGIN_LOCATION}}/g, l.location || "N/A");
                row = row.replace(/{{LOGIN_DATE}}/g, l.loginAt ? new Date(l.loginAt).toLocaleString() : "N/A");
                loginRowsHtml += row;
            });
            html = html.replace(/<!-- LOGIN_ROWS_START -->[\s\S]*?<!-- LOGIN_ROWS_END -->/, loginRowsHtml);
        }

        const rolesData = await this.getUserRolesReport(payload);
        const roles = rolesData?.usersByRole || [];
        const roleMatch = html.match(/<!-- ROLE_ROWS_START -->([\s\S]*?)<!-- ROLE_ROWS_END -->/);
        if (roleMatch && roleMatch[1]) {
            const roleTemplate = roleMatch[1];
            let roleRowsHtml = '';
            roles.forEach((r: any) => {
                let row = roleTemplate;
                row = row.replace(/{{ROLE_NAME}}/g, r.role || "N/A");
                row = row.replace(/{{ROLE_COUNT}}/g, r.count.toString() || "0");
                row = row.replace(/{{ROLE_ACTIVE}}/g, r.active.toString() || "0");
                roleRowsHtml += row;
            });
            html = html.replace(/<!-- ROLE_ROWS_START -->[\s\S]*?<!-- ROLE_ROWS_END -->/, roleRowsHtml);
        }

        const pdfBuffer = await pdfService.generatePdfFromHtml(html);

        await super.create({
            reportType: ReportType.CUSTOM,
            reportName: "User Access Report",
            format: "PDF",
            generatedBy: generatedBy,
            status: ReportStatus.COMPLETED
        });

        await auditLogService.log({
            action: AuditAction.DOWNLOAD,
            module: "Report",
            performedBy: generator?._id as any,
            description: `User & Access Report Exported. Record Count: ${users?.length || 0}`,
        } as any);

        return pdfBuffer;
    }

    /*
    |--------------------------------------------------------------------------
    | Candidate Reports - Analytics
    |--------------------------------------------------------------------------
    */


    async getCandidateSummary(query: any) {
        const totalCandidates = await Candidate.countDocuments({ isDeleted: false });
        const activeCandidates = await Candidate.countDocuments({ status: CandidateStatus.ACTIVE, isDeleted: false });
        const pendingVerification = await Candidate.countDocuments({
            isDeleted: false,
            $or: [{ biometricVerified: false }, { faceVerified: false }]
        });
        const rejectedCandidates = await Candidate.countDocuments({ 
            status: { $in: [CandidateStatus.BLOCKED, CandidateStatus.DISQUALIFIED] }, 
            isDeleted: false 
        });

        const admitCardsGenerated = await Candidate.countDocuments({ hallTicketGenerated: true, isDeleted: false });
        
        const appeared = await AttendanceModel.countDocuments({ attendanceStatus: AttendanceStatus.PRESENT, isDeleted: false });
        const absent = await AttendanceModel.countDocuments({ attendanceStatus: AttendanceStatus.ABSENT, isDeleted: false });

        // Registration Trend (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const registrationTrend = await Candidate.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo }, isDeleted: false } },
            { 
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        return {
            totalCandidates,
            activeCandidates,
            pendingVerification,
            rejectedCandidates,
            admitCardsGenerated,
            appeared,
            absent,
            registrationTrend: registrationTrend.map((t: any) => ({
                date: t._id,
                count: t.count
            }))
        };
    }

    async getCandidateList(query: any) {
        const {
            page = 1,
            limit = 10,
            search = "",
            status,
            sort = "-createdAt",
        } = query;

        const filter: any = { isDeleted: false };

        if (search) {
            filter.$or = [
                { fullName: { $regex: search, $options: "i" } },
                { candidateCode: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobile: { $regex: search, $options: "i" } },
            ];
        }

        if (status) {
            filter.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);
        
        const [data, total] = await Promise.all([
            Candidate.find(filter)
                .populate("examId", "examTitle")
                .populate("companyId", "companyName")
                .populate("centerId", "centerName")
                .sort(sort)
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Candidate.countDocuments(filter)
        ]);

        return {
            data: data.map((c: any) => ({
                id: c._id,
                candidateCode: c.candidateCode,
                fullName: c.fullName,
                email: c.email,
                mobile: c.mobile,
                status: c.status,
                biometricVerified: c.biometricVerified,
                exam: c.examId?.examTitle || "N/A",
                company: c.companyId?.companyName || "N/A",
                center: c.centerId?.centerName || "N/A",
                createdAt: c.createdAt,
            })),
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    async getCandidateExport(query: any) {
        // Generate CSV string logic for exporting candidates
        const { data } = await this.getCandidateList({ ...query, limit: 10000 }); // fetch large limit for export
        
        if (!data || data.length === 0) {
            return "No candidates found";
        }
        
        const header = ["Candidate ID", "Name", "Email", "Mobile", "Status", "Biometric Verified", "Exam", "Company", "Center", "Registration Date"];
        const rows = data.map((c: any) => [
            c.candidateCode,
            c.fullName,
            c.email,
            c.mobile,
            c.status,
            c.biometricVerified ? "Yes" : "No",
            c.exam,
            c.company,
            c.center,
            new Date(c.createdAt).toLocaleDateString()
        ]);
        
        const csvContent = [header, ...rows]
            .map(e => e.join(","))
            .join("\n");
            
        return csvContent;
    }

    /*
    |--------------------------------------------------------------------------
    | Exam Reports - Analytics
    |--------------------------------------------------------------------------
    */

    async getExamSummary(query: any) {
        const totalExams = await Exam.countDocuments({ isDeleted: false });
        const scheduledExams = await Exam.countDocuments({ status: ExamStatus.ACTIVE, isDeleted: false });
        const runningExams = await Exam.countDocuments({ status: ExamStatus.ACTIVE, isDeleted: false }); // Fallback to ACTIVE
        const completedExams = await Exam.countDocuments({ status: ExamStatus.COMPLETED, isDeleted: false });
        const cancelledExams = await Exam.countDocuments({ status: ExamStatus.CANCELLED, isDeleted: false });

        const totalExamSessions = (await Exam.distinct('shiftId', { isDeleted: false })).length;
        const totalShifts = (await Exam.distinct('shiftId', { isDeleted: false })).length;
        const totalExamCenters = (await Exam.distinct('centerId', { isDeleted: false })).length;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const completionTrend = await Exam.aggregate([
            { $match: { isDeleted: false, status: ExamStatus.COMPLETED, createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return {
            totalExams,
            scheduledExams,
            runningExams,
            completedExams,
            cancelledExams,
            totalExamSessions,
            totalShifts,
            totalExamCenters,
            completionTrend: completionTrend.map(t => ({ date: t._id, count: t.count }))
        };
    }

    async getExamList(query: any) {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            companyId,
            branchId,
            centerId
        } = query;

        const skip = (Number(page) - 1) * Number(limit);
        
        const filter: any = { isDeleted: false };
        if (status) filter.status = status;
        if (companyId) filter.companyId = companyId;
        if (branchId) filter.branchId = branchId;
        if (centerId) filter.centerId = centerId;
        
        if (search) {
            filter.$or = [
                { examCode: { $regex: search, $options: 'i' } },
                { examTitle: { $regex: search, $options: 'i' } }
            ];
        }

        const [exams, total] = await Promise.all([
            Exam.find(filter)
                .populate("subjectId", "subjectName")
                .populate("paperId", "paperName")
                .populate("companyId", "companyName")
                .populate("branchId", "branchName")
                .populate("centerId", "centerName")
                .populate("shiftId", "shiftName")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Exam.countDocuments(filter)
        ]);

        const examIds = exams.map((e: any) => e._id);
        const attendances = await AttendanceModel.aggregate([
            { $match: { examId: { $in: examIds }, isDeleted: false } },
            { $group: { 
                _id: { examId: '$examId', status: '$attendanceStatus' }, 
                count: { $sum: 1 } 
              } 
            }
        ]);

        const attendanceMap: Record<string, { appeared: number, absent: number }> = {};
        attendances.forEach(a => {
            const examId = a._id.examId.toString();
            if (!attendanceMap[examId]) attendanceMap[examId] = { appeared: 0, absent: 0 };
            
            if (a._id.status === AttendanceStatus.PRESENT) attendanceMap[examId].appeared += a.count;
            if (a._id.status === AttendanceStatus.ABSENT) attendanceMap[examId].absent += a.count;
        });

        const data = exams.map((e: any) => {
            const examId = e._id.toString();
            const att = attendanceMap[examId] || { appeared: 0, absent: 0 };
            const candidatesAssigned = e.candidateIds ? e.candidateIds.length : 0;

            return {
                id: examId,
                examCode: e.examCode || "N/A",
                examTitle: e.examTitle || "N/A",
                subject: e.subjectId?.subjectName || "N/A",
                paper: e.paperId?.paperName || "N/A",
                session: e.shiftId?.shiftName || "N/A",
                shift: e.shiftId?.shiftName || "N/A",
                examCenter: e.centerId?.centerName || "N/A",
                company: e.companyId?.companyName || "N/A",
                branch: e.branchId?.branchName || "N/A",
                candidatesAssigned,
                candidatesAppeared: att.appeared,
                candidatesAbsent: att.absent,
                status: e.status,
                startTime: e.startTime,
                endTime: e.endTime,
                duration: e.duration,
                examDate: e.examDate
            };
        });

        return {
            data,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }

    async getExamExport(query: any) {
        const { data } = await this.getExamList({ ...query, limit: 10000 });
        return { data };
    }

    /*
    |--------------------------------------------------------------------------
    | Attendance Reports
    |--------------------------------------------------------------------------
    */
    async getAttendanceSummary(query: any) {
        const totalRegistered = await AttendanceModel.countDocuments({ isDeleted: false });
        const present = await AttendanceModel.countDocuments({ attendanceStatus: AttendanceStatus.PRESENT, isDeleted: false });
        const absent = await AttendanceModel.countDocuments({ attendanceStatus: AttendanceStatus.ABSENT, isDeleted: false });
        const late = await AttendanceModel.countDocuments({ attendanceStatus: AttendanceStatus.LATE, isDeleted: false });
        const noShows = absent; 
        
        const biometricVerified = await AttendanceModel.countDocuments({ biometricVerification: VerificationStatus.SUCCESS, isDeleted: false });
        const faceVerified = await AttendanceModel.countDocuments({ faceVerification: VerificationStatus.SUCCESS, isDeleted: false });

        return {
            totalRegistered,
            present,
            absent,
            lateArrivals: late,
            noShows,
            biometricVerified,
            faceVerified,
            attendancePercentage: totalRegistered ? ((present / totalRegistered) * 100).toFixed(2) : 0
        };
    }

    async getAttendanceList(query: any) {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            examId
        } = query;

        const skip = (Number(page) - 1) * Number(limit);
        
        const filter: any = { isDeleted: false };
        if (status) filter.attendanceStatus = status;
        if (examId) filter.examId = examId;

        const [attendances, total] = await Promise.all([
            AttendanceModel.find(filter)
                .populate("candidateId", "candidateCode fullName email mobile")
                .populate("examId", "examCode examTitle")
                .populate("shiftId", "shiftName")
                .populate({
                    path: "examCenterId",
                    populate: {
                        path: "centerId",
                        select: "centerName"
                    }
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            AttendanceModel.countDocuments(filter)
        ]);

        let data = attendances.map((a: any) => {
            return {
                id: a._id,
                candidateId: a.candidateId?.candidateCode || "N/A",
                registrationNo: a.candidateId?.candidateCode || "N/A",
                candidateName: a.candidateId?.fullName || "N/A",
                exam: a.examId?.examTitle || "N/A",
                session: a.shiftId?.shiftName || "N/A",
                shift: a.shiftId?.shiftName || "N/A",
                examCenter: a.examCenterId?.centerId?.centerName || "N/A",
                company: "N/A",
                branch: "N/A",
                attendanceStatus: a.attendanceStatus,
                checkInTime: a.checkInTime,
                checkOutTime: a.checkOutTime,
                biometricStatus: a.biometricVerification,
                faceVerificationStatus: a.faceVerification,
                attendanceMethod: a.manualVerification === VerificationStatus.SUCCESS ? "Manual" : "System",
                lateMinutes: 0
            };
        });

        if (search) {
            const s = search.toLowerCase();
            data = data.filter(d => 
                d.candidateName.toLowerCase().includes(s) || 
                d.candidateId.toLowerCase().includes(s) ||
                d.exam.toLowerCase().includes(s)
            );
        }

        return {
            data,
            pagination: {
                total: search ? data.length : total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil((search ? data.length : total) / Number(limit))
            }
        };
    }

    async getAttendanceExport(query: any) {
        const { data } = await this.getAttendanceList({ ...query, limit: 10000 });
        
        if (!data || data.length === 0) {
            return "No attendance records found";
        }
        
        const header = ["Candidate ID", "Registration No", "Candidate Name", "Exam", "Session", "Shift", "Exam Center", "Company", "Branch", "Attendance Status", "Check-In Time", "Check-Out Time", "Biometric Status", "Face Verification Status", "Attendance Method", "Late Minutes"];
        const rows = data.map((a: any) => [
            a.candidateId,
            a.registrationNo,
            a.candidateName,
            a.exam,
            a.session,
            a.shift,
            a.examCenter,
            a.company,
            a.branch,
            a.attendanceStatus,
            a.checkInTime ? new Date(a.checkInTime).toLocaleString() : "N/A",
            a.checkOutTime ? new Date(a.checkOutTime).toLocaleString() : "N/A",
            a.biometricStatus,
            a.faceVerificationStatus,
            a.attendanceMethod,
            a.lateMinutes
        ]);
        
        const csvContent = [header, ...rows]
            .map(e => e.join(","))
            .join("\n");
            
        return csvContent;
    }

    /*
    |--------------------------------------------------------------------------
    | Result Reports
    |--------------------------------------------------------------------------
    */
    async getResultSummary(query: any) {
        const totalResults = await Result.countDocuments({ isDeleted: false });
        const publishedResults = await Result.countDocuments({ resultStatus: ResStatus.PUBLISHED, isDeleted: false });
        const pendingApproval = await Result.countDocuments({ resultStatus: { $in: [ResStatus.DRAFT, ResStatus.EVALUATED] }, isDeleted: false });
        const approvedResults = await Result.countDocuments({ resultStatus: ResStatus.APPROVED, isDeleted: false });
        const passCandidates = await Result.countDocuments({ passStatus: PassStatus.PASSED, isDeleted: false });
        const failCandidates = await Result.countDocuments({ passStatus: PassStatus.FAILED, isDeleted: false });
        const meritListsGenerated = 12; // Placeholder

        return {
            totalResults,
            publishedResults,
            pendingApproval,
            approvedResults,
            passCandidates,
            failCandidates,
            meritListsGenerated,
            overallPassPercentage: totalResults ? ((passCandidates / totalResults) * 100).toFixed(2) : 0
        };
    }

    async getResultList(query: any) {
        const {
            page = 1,
            limit = 10,
            search,
            status,
            examId
        } = query;

        const skip = (Number(page) - 1) * Number(limit);
        
        const filter: any = { isDeleted: false };
        if (status) filter.resultStatus = status;
        if (examId) filter.examId = examId;

        const [results, total] = await Promise.all([
            Result.find(filter)
                .populate("candidateId", "candidateCode fullName email mobile")
                .populate("examId", "examCode examTitle")
                .populate("subjectId", "subjectName")
                .populate("paperId", "paperName")
                .populate({
                    path: "examCenterId",
                    select: "centerName centerId",
                    populate: {
                        path: "centerId",
                        select: "centerName"
                    }
                })
                .populate({
                    path: "attendanceId",
                    populate: {
                        path: "examCenterId",
                        populate: {
                            path: "centerId",
                            select: "centerName"
                        }
                    }
                })
                .sort({ percentage: -1, createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .lean(),
            Result.countDocuments(filter)
        ]);

        let data = results.map((r: any) => {
            return {
                id: r._id,
                candidateId: r.candidateId?.candidateCode || "N/A",
                registrationNo: r.candidateId?.candidateCode || "N/A",
                candidateName: r.candidateId?.fullName || "N/A",
                exam: r.examId?.examTitle || "N/A",
                subject: r.subjectId?.subjectName || "N/A",
                paper: r.paperId?.paperName || "N/A",
                session: "N/A",
                shift: "N/A",
                examCenter: r.examCenterId?.centerId?.centerName || r.examCenterId?.centerName || r.attendanceId?.examCenterId?.centerId?.centerName || r.attendanceId?.examCenterId?.centerName || "N/A",
                company: "N/A",
                branch: "N/A",
                marksObtained: r.marksObtained || 0,
                maximumMarks: r.totalMarks || 0,
                percentage: r.percentage || 0,
                grade: r.percentage >= 90 ? 'A+' : r.percentage >= 80 ? 'A' : r.percentage >= 70 ? 'B' : r.percentage >= 60 ? 'C' : r.percentage >= 50 ? 'D' : 'F',
                rank: r.rank || "N/A",
                resultStatus: r.resultStatus,
                meritStatus: r.rank ? "Qualified" : "Not Qualified",
                approvalStatus: r.resultStatus === ResStatus.APPROVED || r.resultStatus === ResStatus.PUBLISHED ? "Approved" : "Pending",
                publishedDate: r.publishedAt || null
            };
        });

        if (search) {
            const s = search.toLowerCase();
            data = data.filter(d => 
                d.candidateName.toLowerCase().includes(s) || 
                d.candidateId.toLowerCase().includes(s) ||
                d.exam.toLowerCase().includes(s)
            );
        }

        return {
            data,
            pagination: {
                total: search ? data.length : total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil((search ? data.length : total) / Number(limit))
            }
        };
    }

    async getResultExport(query: any) {
        const { data } = await this.getResultList({ ...query, limit: 10000 });
        
        if (!data || data.length === 0) {
            return "No result records found";
        }
        
        const header = ["Candidate ID", "Registration No", "Candidate Name", "Exam", "Subject", "Paper", "Session", "Shift", "Exam Center", "Company", "Branch", "Marks Obtained", "Maximum Marks", "Percentage", "Grade", "Rank", "Result Status", "Merit Status", "Approval Status", "Published Date"];
        const rows = data.map((r: any) => [
            r.candidateId,
            r.registrationNo,
            r.candidateName,
            r.exam,
            r.subject,
            r.paper,
            r.session,
            r.shift,
            r.examCenter,
            r.company,
            r.branch,
            r.marksObtained,
            r.maximumMarks,
            r.percentage,
            r.grade,
            r.rank,
            r.resultStatus,
            r.meritStatus,
            r.approvalStatus,
            r.publishedDate ? new Date(r.publishedDate).toLocaleString() : "N/A"
        ]);
        
        const csvContent = [header, ...rows]
            .map(e => e.join(","))
            .join("\n");
            
        return csvContent;
    }

    /*
    |--------------------------------------------------------------------------
    | Financial Reports
    |--------------------------------------------------------------------------
    */

    async generateFinancialReport(
        payload: any,
        generatedBy: string
    ) {
        const { data: invoices } = await this.getFinancialList({ ...payload, limit: 10000 });

        if (!invoices || invoices.length === 0) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "No financial records found for export.");
        }

        const summary = await this.getFinancialSummary(payload);

        const templatePath = path.join(__dirname, '../../templates/financial_report.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        const generator = await User.findById(generatedBy);
        const generatedByName = generator ? `${generator.firstName} ${generator.lastName}` : "Admin";

        html = html.replace(/{{ORG_NAME}}/g, await this.getAppName());
        html = html.replace(/{{ORG_INITIALS}}/g, "EGP");
        html = html.replace(/{{GENERATED_BY}}/g, generatedByName);
        html = html.replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString());
        html = html.replace(/{{TOTAL_REVENUE}}/g, summary.totalRevenue.toFixed(2));
        html = html.replace(/{{MONTHLY_REVENUE}}/g, summary.monthlyRevenue.toFixed(2));
        html = html.replace(/{{OUTSTANDING}}/g, summary.outstandingAmount.toFixed(2));
        html = html.replace(/{{TOTAL_INVOICES}}/g, summary.totalInvoices.toString());
        html = html.replace(/{{PAID_INVOICES}}/g, summary.paidInvoices.toString());
        html = html.replace(/{{UNPAID_INVOICES}}/g, summary.unpaidInvoices.toString());
        html = html.replace(/{{ROW_START}}/g, "1");
        html = html.replace(/{{ROW_END}}/g, invoices.length.toString());
        html = html.replace(/{{TOTAL_ROWS}}/g, invoices.length.toString());

        const rowMatch = html.match(/<!-- FIN_ROWS_START -->([\s\S]*?)<!-- FIN_ROWS_END -->/);
        if (rowMatch && rowMatch[1]) {
            const rowTemplate = rowMatch[1];
            let rowsHtml = '';
            invoices.forEach((inv: any) => {
                let row = rowTemplate;
                row = row.replace(/{{FIN_INVOICE_NO}}/g, inv.invoiceNumber || "");
                row = row.replace(/{{FIN_COMPANY}}/g, inv.company || "");
                row = row.replace(/{{FIN_PLAN}}/g, inv.plan || "");
                row = row.replace(/{{FIN_AMOUNT}}/g, (inv.amount || 0).toString());
                row = row.replace(/{{FIN_CURRENCY}}/g, inv.currency || "");
                row = row.replace(/{{FIN_STATUS}}/g, inv.status || "");
                row = row.replace(/{{FIN_PAYMENT_STATUS}}/g, inv.paymentStatus || "");
                row = row.replace(/{{FIN_ISSUE_DATE}}/g, inv.issueDate ? new Date(inv.issueDate).toLocaleDateString() : "N/A");
                row = row.replace(/{{FIN_DUE_DATE}}/g, inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "N/A");
                rowsHtml += row;
            });
            html = html.replace(/<!-- FIN_ROWS_START -->[\s\S]*?<!-- FIN_ROWS_END -->/, rowsHtml);
        }

        const pdfBuffer = await pdfService.generatePdfFromHtml(html);

        await super.create({
            reportType: ReportType.FINANCIAL,
            reportName: "Financial Report",
            description: "Export of financial data",
            generatedBy: generator?._id as any,
            filters: payload,
            status: ReportStatus.COMPLETED,
            fileUrl: "PDF",
            format: "PDF"
        });

        await auditLogService.log({
            action: AuditAction.DOWNLOAD,
            module: "Report",
            performedBy: generator?._id as any,
            description: `Financial Report Exported. Record Count: ${invoices.length}`,
        } as any);

        return pdfBuffer;
    }


    async getFinancialSummary(query: any) {
        const invoices = await Invoice.find({ isDeleted: false })
            .populate({
                path: "subscriptionId",
                populate: {
                    path: "planId",
                    select: "planName"
                }
            });
        const payments = await Payment.find();

        const totalRevenue = invoices
            .filter((inv) => inv.status === InvoiceStatus.PAID)
            .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

        const outstandingAmount = invoices
            .filter((inv) => [InvoiceStatus.DRAFT, InvoiceStatus.OVERDUE, InvoiceStatus.UNPAID].includes(inv.status as any))
            .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
            
        // Refunds don't have a distinct model, so we mock or use payment status
        const refundAmount = payments
            .filter((p) => (p.status as any) === PaymentStatus.FAILED) // Simplification
            .reduce((sum, p) => sum + (p.amount || 0), 0);

        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthlyRevenue = invoices
            .filter((inv) => inv.status === InvoiceStatus.PAID && new Date(inv.issueDate) >= startOfMonth)
            .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

        const revenueTrend = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            const nextD = new Date(d);
            nextD.setDate(d.getDate() + 1);

            const dayRev = invoices
                .filter(
                    (inv) =>
                        inv.status === InvoiceStatus.PAID &&
                        new Date(inv.issueDate) >= d &&
                        new Date(inv.issueDate) < nextD
                )
                .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

            revenueTrend.push({ date: d.toISOString(), count: dayRev });
        }

        const revenueByPlanObj: Record<string, number> = {};
        invoices.forEach((inv) => {
            if (inv.status === InvoiceStatus.PAID) {
                const planName = (inv as any).subscriptionId?.planId?.planName || "Other";
                revenueByPlanObj[planName] = (revenueByPlanObj[planName] || 0) + (inv.grandTotal || 0);
            }
        });
        const revenueByPlan = Object.entries(revenueByPlanObj).map(([name, amount]) => ({ name, amount }));

        return {
            totalRevenue,
            outstandingAmount,
            refundAmount,
            monthlyRevenue,
            revenueTrend,
            revenueByPlan,
            totalInvoices: invoices.length,
            paidInvoices: invoices.filter((i) => i.status === InvoiceStatus.PAID).length,
            unpaidInvoices: invoices.filter((i) => i.status !== InvoiceStatus.PAID).length,
        };
    }

    async getFinancialList(query: any) {
        const { page = 1, limit = 10, search = "", status, paymentStatus } = query;
        let dbQuery: any = { isDeleted: false };
        
        if (search) {
            dbQuery.$or = [
                { invoiceNumber: { $regex: search, $options: "i" } },
                { currency: { $regex: search, $options: "i" } },
            ];
        }

        if (status) {
            dbQuery.status = status;
        }

        if (paymentStatus) {
            dbQuery.paymentStatus = paymentStatus;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [data, total] = await Promise.all([
            Invoice.find(dbQuery)
                .populate("companyId", "companyName companyCode subscriptionPlan")
                .populate({
                    path: "subscriptionId",
                    populate: {
                        path: "planId",
                        select: "planName"
                    }
                })
                .sort({ issueDate: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Invoice.countDocuments(dbQuery),
        ]);

        return {
            data: data.map((inv: any) => ({
                id: inv._id,
                invoiceNumber: inv.invoiceNumber,
                company: inv.companyId?.companyName || "N/A",
                plan: inv.subscriptionId?.planId?.planName || inv.companyId?.subscriptionPlan || "N/A",
                amount: inv.grandTotal,
                currency: inv.currency,
                status: inv.status,
                paymentStatus: inv.paymentStatus,
                issueDate: inv.issueDate,
                dueDate: inv.dueDate,
            })),
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        };
    }

    async getFinancialExport(query: any) {
        const { data } = await this.getFinancialList({ ...query, limit: 10000 });

        if (!data || data.length === 0) {
            return "No financial records found";
        }

        const header = [
            "Invoice Number",
            "Company",
            "Plan",
            "Amount",
            "Currency",
            "Invoice Status",
            "Payment Status",
            "Issue Date",
            "Due Date"
        ];
        
        const rows = data.map((r: any) => [
            r.invoiceNumber,
            r.company,
            r.plan,
            r.amount,
            r.currency,
            r.status,
            r.paymentStatus,
            r.issueDate ? new Date(r.issueDate).toLocaleString() : "N/A",
            r.dueDate ? new Date(r.dueDate).toLocaleString() : "N/A"
        ]);

        const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
        return csvContent;
    }

    /*
    |--------------------------------------------------------------------------
    | Security Reports
    |--------------------------------------------------------------------------
    */

    async generateSecurityReport(payload: any, generatedBy: string) {
        const { data: events } = await this.getSecurityList({ ...payload, limit: 10000 });

        const statistics = await this.getSecurityStatistics();

        const templatePath = path.join(__dirname, '../../templates/security_report.html');
        let html = fs.readFileSync(templatePath, 'utf8');

        const generator = await User.findById(generatedBy);
        const generatedByName = generator ? `${generator.firstName} ${generator.lastName}` : "Admin";
        const stats = statistics.summary;

        html = html.replace(/{{ORG_NAME}}/g, await this.getAppName());
        html = html.replace(/{{ORG_INITIALS}}/g, "EGP");
        html = html.replace(/{{GENERATED_BY}}/g, generatedByName);
        html = html.replace(/{{GENERATED_DATE}}/g, new Date().toLocaleString());
        html = html.replace(/{{TOTAL_USERS}}/g, (stats.totalUsers || 0).toString());
        html = html.replace(/{{ACTIVE_SESSIONS}}/g, (stats.activeSessions || 0).toString());
        html = html.replace(/{{LOCKED_ACCOUNTS}}/g, (stats.lockedAccounts || 0).toString());
        html = html.replace(/{{FAILED_LOGINS}}/g, (stats.failedLoginsToday || 0).toString());
        html = html.replace(/{{SECURITY_ALERTS}}/g, (stats.securityAlerts || 0).toString());
        html = html.replace(/{{HEALTH_SCORE}}/g, (stats.securityHealthScore || 0).toString());
        html = html.replace(/{{ROW_START}}/g, "1");
        html = html.replace(/{{ROW_END}}/g, (events?.length || 0).toString());
        html = html.replace(/{{TOTAL_ROWS}}/g, (events?.length || 0).toString());

        const rowMatch = html.match(/<!-- SEC_ROWS_START -->([\s\S]*?)<!-- SEC_ROWS_END -->/);
        if (rowMatch && rowMatch[1]) {
            const rowTemplate = rowMatch[1];
            let rowsHtml = '';
            (events || []).forEach((e: any) => {
                let row = rowTemplate;
                row = row.replace(/{{SEC_EVENT_ID}}/g, e.eventId || "");
                row = row.replace(/{{SEC_EVENT_TYPE}}/g, e.eventType || "");
                row = row.replace(/{{SEC_SEVERITY}}/g, e.severity || "");
                row = row.replace(/{{SEC_CATEGORY}}/g, e.category || "");
                row = row.replace(/{{SEC_USER}}/g, e.userId ? `${e.userId.firstName} ${e.userId.lastName}` : "N/A");
                row = row.replace(/{{SEC_IP}}/g, e.ipAddress || "N/A");
                row = row.replace(/{{SEC_DEVICE}}/g, e.device || "N/A");
                row = row.replace(/{{SEC_STATUS}}/g, e.status || "");
                row = row.replace(/{{SEC_DATE}}/g, e.createdAt ? new Date(e.createdAt).toLocaleString() : "N/A");
                rowsHtml += row;
            });
            html = html.replace(/<!-- SEC_ROWS_START -->[\s\S]*?<!-- SEC_ROWS_END -->/, rowsHtml);
        }

        const pdfBuffer = await pdfService.generatePdfFromHtml(html);

        await super.create({
            reportType: ReportType.SECURITY,
            reportName: "Security Report",
            description: "Export of security events and statistics",
            generatedBy: generator?._id as any,
            filters: payload,
            status: ReportStatus.COMPLETED,
            fileUrl: "PDF",
            format: "PDF"
        });

        await auditLogService.log({
            action: AuditAction.DOWNLOAD,
            module: "Report",
            performedBy: generator?._id as any,
            description: `Security Report Exported. Record Count: ${events?.length || 0}`,
        } as any);

        return pdfBuffer;
    }

    async getSecurityStatistics() {
        const dashboardStats = await securityService.getDashboardStats();
        
        // Incident trend
        const today = new Date();
        const dates = [];
        const incidents = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(date.getDate() + 1);
            
            const count = await SecurityEventModel.countDocuments({
                createdAt: { $gte: date, $lt: nextDate }
            });
            dates.push(date.toISOString().split('T')[0]);
            incidents.push(count);
        }

        const eventsByCategory = await SecurityEventModel.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        const eventsBySeverity = await SecurityEventModel.aggregate([
            { $group: { _id: "$severity", count: { $sum: 1 } } }
        ]);

        return {
            summary: dashboardStats,
            trend: { dates, incidents },
            byCategory: eventsByCategory.map(item => ({ label: item._id, value: item.count })),
            bySeverity: eventsBySeverity.map(item => ({ label: item._id, value: item.count }))
        };
    }

    async getSecurityList(query: any = {}) {
        const { companyId, branchId, severity, category, status, search, page = 1, limit = 10, startDate, endDate } = query;
        const filter: any = {};
        
        if (companyId) filter.companyId = companyId;
        if (branchId) filter.branchId = branchId;
        if (severity) filter.severity = severity;
        if (category) filter.category = category;
        if (status) filter.status = status;
        
        if (startDate && endDate) {
            filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            filter.createdAt = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.createdAt = { $lte: new Date(endDate) };
        }

        if (search) {
            filter.$or = [
                { eventId: { $regex: search, $options: "i" } },
                { eventType: { $regex: search, $options: "i" } },
                { ipAddress: { $regex: search, $options: "i" } },
                { device: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const data = await SecurityEventModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate("userId", "firstName lastName email")
            .populate("companyId", "name")
            .populate("branchId", "name")
            .lean();
            
        const total = await SecurityEventModel.countDocuments(filter);
        
        return {
            data,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        };
    }

    async getSecurityExport(query: any = {}) {
        const { data } = await this.getSecurityList({ ...query, limit: 10000 });
        
        const header = [
            "Event ID",
            "Event Type",
            "Severity",
            "Category",
            "User",
            "Company",
            "Branch",
            "IP Address",
            "Device",
            "Browser",
            "OS",
            "Status",
            "Created At"
        ];
        
        const rows = data.map((r: any) => [
            r.eventId,
            r.eventType,
            r.severity,
            r.category,
            r.userId ? `${r.userId.firstName} ${r.userId.lastName}` : "N/A",
            r.companyId ? r.companyId.name : "N/A",
            r.branchId ? r.branchId.name : "N/A",
            r.ipAddress || "N/A",
            r.device || "N/A",
            r.browser || "N/A",
            r.operatingSystem || "N/A",
            r.status,
            r.createdAt ? new Date(r.createdAt).toLocaleString() : "N/A"
        ]);

        const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
        return csvContent;
    }
}

export default new ReportService();
