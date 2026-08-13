import { PDFDocument } from 'pdf-lib';
import reportService from './report.service';
import pdfService from './pdf.service';
import User from '../user/user.model';
import auditLogService from '../audit-log/auditLog.service';
import { AuditAction } from '../audit-log/auditLog.types';
import Report from './report.model';
import { ReportType, ReportStatus, ReportFormat } from './report.types';
import SystemSetting from '../system-settings/systemSettings.model';

export class MasterReportService {
    
    private async getAppName(): Promise<string> {
        try {
            const setting = await SystemSetting.findOne({ key: 'APP_NAME' });
            return setting?.value || "ExamGuard Pro";
        } catch (error) {
            return "ExamGuard Pro";
        }
    }
    
    private getModuleLabel(moduleId: string): string {
        const labels: Record<string, string> = {
            'USER_ACCESS': 'User & Access Report',
            'CANDIDATE': 'Candidate Report',
            'EXAM': 'Exam Report',
            'ATTENDANCE': 'Attendance Report',
            'RESULT': 'Result Report',
            'FINANCIAL': 'Financial Report',
            'SECURITY': 'Security Report',
        };
        return labels[moduleId] || moduleId;
    }

    private generateCoverHtml(reportTitle: string, generatedDate: string, appName: string): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #ffffff;
                }
                .container {
                    text-align: center;
                    padding: 40px;
                    border: 2px solid #2D3E2C;
                    border-radius: 8px;
                    width: 80%;
                    max-width: 600px;
                    margin: 200px auto;
                }
                h1 {
                    color: #2D3E2C;
                    font-size: 28px;
                    margin-bottom: 10px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }
                h2 {
                    color: #4A5D4A;
                    font-size: 22px;
                    margin-bottom: 20px;
                }
                .divider {
                    height: 2px;
                    background-color: #2D3E2C;
                    width: 50%;
                    margin: 20px auto;
                }
                .footer {
                    margin-top: 30px;
                    color: #777;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>MASTER REPORT</h1>
                <div class="divider"></div>
                <h2>${reportTitle}</h2>
                <div class="divider"></div>
                <div class="footer">Generated: ${generatedDate}</div>
            </div>
        </body>
        </html>`;
    }

    private generateTocHtml(entries: { title: string, pageNumber: number }[], dateStr: string, generatedByName: string, appName: string): string {
        let rowsHtml = '';
        entries.forEach((entry, index) => {
            rowsHtml += `
            <div class="toc-row">
                <span class="toc-title">${index + 1}. ${entry.title}</span>
                <span class="toc-dots"></span>
                <span class="toc-page">Page ${entry.pageNumber}</span>
            </div>`;
        });

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 50px;
                }
                h1 {
                    color: #2D3E2C;
                    font-size: 32px;
                    margin-bottom: 10px;
                }
                .meta {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 5px;
                }
                h2 {
                    color: #2D3E2C;
                    border-bottom: 2px solid #2D3E2C;
                    padding-bottom: 10px;
                    margin-bottom: 30px;
                }
                .toc-row {
                    display: flex;
                    margin-bottom: 15px;
                    font-size: 16px;
                }
                .toc-title {
                    font-weight: bold;
                }
                .toc-dots {
                    flex-grow: 1;
                    border-bottom: 1px dotted #ccc;
                    margin: 0 10px;
                    position: relative;
                    top: -6px;
                }
                .toc-page {
                    font-weight: bold;
                    min-width: 60px;
                    text-align: right;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${appName}</h1>
                <div class="meta">Master Reports</div>
                <div class="meta">Generated By: ${generatedByName}</div>
                <div class="meta">Generated Date: ${dateStr}</div>
                <div class="meta">Total Reports Included: ${entries.length}</div>
            </div>
            <h2>Table of Contents</h2>
            <div class="toc-container">
                ${rowsHtml}
            </div>
        </body>
        </html>`;
    }

    public async generateMasterReport(modules: string[], payload: any, generatedBy: string, saveRecord = true) {
        const successful: string[] = [];
        const failed: string[] = [];
        
        const reportBuffers: { moduleId: string, buffer: Buffer }[] = [];
        
        for (const moduleId of modules) {
            try {
                let buffer: Buffer | null = null;
                switch (moduleId) {
                    case 'USER_ACCESS':
                        buffer = await reportService.generateUserReport(payload, generatedBy);
                        break;
                    case 'CANDIDATE':
                        buffer = await reportService.generateCandidateReport(payload, generatedBy);
                        break;
                    case 'EXAM':
                        buffer = await reportService.generateExamReport(payload, generatedBy);
                        break;
                    case 'ATTENDANCE':
                        buffer = await reportService.generateAttendanceReport(payload, generatedBy);
                        break;
                    case 'RESULT':
                        buffer = await reportService.generateResultReport(payload, generatedBy);
                        break;
                    case 'FINANCIAL':
                        buffer = await reportService.generateFinancialReport(payload, generatedBy);
                        break;
                    case 'SECURITY':
                        buffer = await reportService.generateSecurityReport(payload, generatedBy);
                        break;
                    default:
                        console.warn(`Unknown report module: ${moduleId}`);
                }
                
                if (buffer) {
                    reportBuffers.push({ moduleId, buffer });
                    successful.push(moduleId);
                } else {
                    failed.push(moduleId);
                }
            } catch (error) {
                console.error(`Failed to generate report for ${moduleId}:`, error);
                failed.push(moduleId);
            }
        }
        
        if (reportBuffers.length === 0) {
            throw new Error("All requested reports failed to generate.");
        }
        
        const generator = await User.findById(generatedBy);
        const generatedByName = generator ? `${generator.firstName} ${generator.lastName}` : "Admin";
        const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        
        // Prepare merging
        const mergedPdf = await PDFDocument.create();
        
        const appName = await this.getAppName();

        // We need to generate cover pages and map them to their corresponding report PDFs
        const processedSections = [];
        
        for (const rb of reportBuffers) {
            const title = this.getModuleLabel(rb.moduleId);
            const coverHtml = this.generateCoverHtml(title, dateStr, appName);
            const coverBuffer = await pdfService.generatePdfFromHtml(coverHtml);
            
            const coverPdf = await PDFDocument.load(coverBuffer);
            const reportPdf = await PDFDocument.load(rb.buffer);
            
            processedSections.push({
                title,
                coverPdf,
                reportPdf
            });
        }
        
        // Start assembling
        
        // Copy Sections (Cover + Report)
        for (const section of processedSections) {
            const coverPages = await mergedPdf.copyPages(section.coverPdf, section.coverPdf.getPageIndices());
            coverPages.forEach((page: any) => mergedPdf.addPage(page));
            
            const reportPages = await mergedPdf.copyPages(section.reportPdf, section.reportPdf.getPageIndices());
            reportPages.forEach((page: any) => mergedPdf.addPage(page));
        }
        
        const finalPdfBytes = await mergedPdf.save();
        const finalBuffer = Buffer.from(finalPdfBytes);
        
        if (saveRecord) {
            await Report.create({
                reportType: ReportType.MASTER,
                reportName: "Master Report",
                generatedBy: generator?._id as any,
                filters: payload,
                metadata: {
                    includedModules: successful,
                    failedModules: failed
                },
                status: ReportStatus.COMPLETED,
                format: ReportFormat.PDF
            });
        }

        // Audit log
        await auditLogService.log({
            action: AuditAction.EXPORT,
            module: "Report",
            performedBy: generator?._id as any,
            description: `Master Report Generated. Selected Modules: ${successful.join(', ')}. Total Pages: ${mergedPdf.getPageCount()}`,
        } as any);
        
        return {
            buffer: finalBuffer,
            successful,
            failed
        };
    }
}

export default new MasterReportService();
