import { Request, Response, NextFunction } from "express";
import { invoiceService } from "./invoice.service";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { InvoiceStatus, PaymentStatus } from "./invoice.types";
import ApiError from "../../utils/ApiError";

export const getAllInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await invoiceService.getAllInvoices(req.query);
    res.status(HTTP_STATUS.OK).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id as string);
    res.status(HTTP_STATUS.OK).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, paymentStatus, notes } = req.body;
    const generatedBy = req.user?.userId; // Assuming authenticate middleware sets req.user
    
    const invoice = await invoiceService.updateInvoiceStatus(req.params.id as string, status, paymentStatus, notes, generatedBy);
    res.status(HTTP_STATUS.OK).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

export const generateCreditNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, reason, remarks, effectiveDate } = req.body;
    const generatedBy = req.user?.userId;
    if (!generatedBy) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");

    const creditNote = await invoiceService.generateCreditNote(req.params.id as string, amount, reason, generatedBy, remarks, effectiveDate);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: creditNote });
  } catch (error) {
    next(error);
  }
};

export const getCreditNotesByInvoiceId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const creditNotes = await invoiceService.getCreditNotesByInvoiceId(req.params.id as string);
    res.status(HTTP_STATUS.OK).json({ success: true, data: creditNotes });
  } catch (error) {
    next(error);
  }
};

export const generateDebitNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, reason, remarks, effectiveDate } = req.body;
    const generatedBy = req.user?.userId;
    if (!generatedBy) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "User not authenticated");

    const parsedDate = effectiveDate ? new Date(effectiveDate) : undefined;
    const debitNote = await invoiceService.generateDebitNote(req.params.id as string, amount, reason, generatedBy, remarks, parsedDate);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: debitNote });
  } catch (error) {
    next(error);
  }
};

export const getDebitNotesByInvoiceId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const debitNotes = await invoiceService.getDebitNotesByInvoiceId(req.params.id as string);
    res.status(HTTP_STATUS.OK).json({ success: true, data: debitNotes });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query;
    const stats = await invoiceService.getDashboardStats(filter);
    res.status(HTTP_STATUS.OK).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getDashboardCharts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query;
    const charts = await invoiceService.getDashboardCharts(filter);
    res.status(HTTP_STATUS.OK).json({ success: true, data: charts });
  } catch (error) {
    next(error);
  }
};

export const getTopCompaniesByRevenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filter = req.query;
    const companies = await invoiceService.getTopCompaniesByRevenue(filter);
    res.status(HTTP_STATUS.OK).json({ success: true, data: companies });
  } catch (error) {
    next(error);
  }
};

import auditLogRepository from "../audit-log/auditLog.repository";
import { AuditAction, AuditSeverity, AuditStatus } from "../audit-log/auditLog.types";
import mongoose from "mongoose";

export const downloadInvoicePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Permission check
    const user = req.user as any;
    if (user.permissions && !user.permissions.includes('Invoice Download')) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "Missing 'Invoice Download' permission");
    }

    // 2. Fetch invoice
    const invoice = await invoiceService.getInvoiceById(req.params.id as string);
    if (!invoice) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invoice not found.");
    }

    // 3. Generate PDF
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await invoiceService.generatePdf(req.params.id as string);
    } catch (err) {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Unable to generate invoice.");
    }
    
    // 4. Audit Log
    try {
      await auditLogRepository.create({
        action: AuditAction.READ,
        module: "Invoice Download",
        description: "Invoice Downloaded",
        performedBy: new mongoose.Types.ObjectId(req.user?.userId),
        performedByRole: req.user?.role,
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
        requestMethod: req.method,
        requestUrl: req.originalUrl,
        responseStatus: HTTP_STATUS.OK,
        severity: AuditSeverity.LOW,
        status: AuditStatus.SUCCESS,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          invoiceNumber: invoice.invoiceNumber,
          downloadedBy: req.user?.userId,
          downloadedTime: new Date(),
          companyId: invoice.companyId
        }
      });
    } catch (err) {
      console.error("Audit log failed for Invoice Download", err);
    }

    // 5. Send Response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice_${invoice.invoiceNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const resendInvoiceEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { to, cc, message } = req.body;
    await invoiceService.emailInvoice(req.params.id as string, { to, cc, message });
    res.status(HTTP_STATUS.OK).json({ success: true, message: `Invoice email sent successfully` });
  } catch (error) {
    next(error);
  }
};
