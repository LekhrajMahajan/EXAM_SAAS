import { invoiceRepository } from "./invoice.repository";
import { IInvoice, InvoiceType, InvoiceStatus, PaymentStatus, IInvoiceItem } from "./invoice.types";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { Types } from "mongoose";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import emailService from "../email/email.service";
import { EmailTemplate } from "../email/email.types";
import SystemSetting from "../system-settings/systemSettings.model";

class InvoiceService {
  async getAppName(): Promise<string> {
    const setting = await SystemSetting.findOne({ key: "appName" });
    return setting?.value || "Invoice System";
  }

  async getAllInvoices(query: any) {
    const page = parseInt(query.page || "1", 10);
    const limit = parseInt(query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    if (query.search) {
      filter.invoiceNumber = { $regex: query.search, $options: "i" };
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.paymentStatus) {
      filter.paymentStatus = query.paymentStatus;
    }

    if (query.companyId) {
      filter.companyId = new Types.ObjectId(query.companyId);
    }

    if (query.company) {
      const companies = await invoiceRepository.findCompaniesByName(query.company);
      const companyIds = companies.map((c: any) => c._id);
      filter.companyId = { $in: companyIds };
    }
    
    if (query.type) {
      filter.type = query.type;
    }

    if (query.date) {
      const startOfDay = new Date(query.date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(query.date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      filter.issueDate = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    } else if (query.startDate && query.endDate) {
      filter.issueDate = {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate),
      };
    }

    const [invoices, total] = await Promise.all([
      invoiceRepository.find(filter, skip, limit),
      invoiceRepository.countDocuments(filter),
    ]);

    return {
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInvoiceById(id: string) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invoice not found");
    return invoice;
  }

  async createInvoice(data: {
    companyId: string;
    subscriptionId?: string;
    paymentReferenceId?: string;
    items: IInvoiceItem[];
    subtotal: number;
    tax: number;
    discount: number;
    grandTotal: number;
    currency?: string;
    status?: InvoiceStatus;
    paymentStatus?: PaymentStatus;
  }) {
    const invoiceNumber = await invoiceRepository.getNextInvoiceNumber();
    
    const invoiceData: Partial<IInvoice> = {
      ...data,
      invoiceNumber,
      companyId: new Types.ObjectId(data.companyId),
      subscriptionId: data.subscriptionId ? new Types.ObjectId(data.subscriptionId) : undefined,
      type: InvoiceType.INVOICE,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Default 15 days due date
      currency: data.currency || "USD",
      status: data.status || InvoiceStatus.DRAFT,
      paymentStatus: data.paymentStatus || PaymentStatus.PENDING,
    };

    const invoice = await invoiceRepository.create(invoiceData);
    
    // Audit Log could be hooked here
    
    return invoice;
  }

  async updateInvoiceStatus(id: string, status: InvoiceStatus, paymentStatus?: PaymentStatus, notes?: string, generatedBy?: string) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invoice not found");
    
    if (invoice.status === InvoiceStatus.CANCELLED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot update a cancelled invoice");
    }

    const updateData: Partial<IInvoice> = { status };
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (notes) updateData.notes = notes;
    if (generatedBy) updateData.generatedBy = new Types.ObjectId(generatedBy);

    return invoiceRepository.update(id, updateData);
  }

  async generateCreditNote(invoiceId: string, amount: number, reason: string, generatedBy: string, remarks?: string, effectiveDate?: string) {
    const originalInvoice = await invoiceRepository.findById(invoiceId);
    if (!originalInvoice) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Original invoice not found");
    
    if (originalInvoice.status === InvoiceStatus.CANCELLED) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Cannot create a credit note for a cancelled invoice");
    }

    const existingCreditNotes = await invoiceRepository.find({ 
      referenceInvoiceId: originalInvoice._id, 
      type: InvoiceType.CREDIT_NOTE 
    }, 0, 100);
    
    const existingCreditTotal = existingCreditNotes
      .filter((cn: IInvoice) => cn.status !== InvoiceStatus.CANCELLED)
      .reduce((sum: number, cn: IInvoice) => sum + cn.grandTotal, 0);

    if (existingCreditTotal + amount > originalInvoice.grandTotal) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Credit note amount cannot exceed available invoice balance");
    }

    const cnNumber = await invoiceRepository.getNextInvoiceNumber();
    
    const cnData: Partial<IInvoice> = {
      invoiceNumber: cnNumber.replace("INV-", "CN-"),
      companyId: originalInvoice.companyId,
      type: InvoiceType.CREDIT_NOTE,
      referenceInvoiceId: originalInvoice._id as Types.ObjectId,
      issueDate: effectiveDate ? new Date(effectiveDate) : new Date(),
      dueDate: new Date(),
      items: [{
        description: `Credit Note for ${originalInvoice.invoiceNumber}: ${reason}`,
        quantity: 1,
        unitPrice: amount,
        total: amount
      }],
      subtotal: amount,
      tax: 0,
      discount: 0,
      grandTotal: amount,
      currency: originalInvoice.currency,
      status: InvoiceStatus.PAID,
      paymentStatus: PaymentStatus.PAID,
      generatedBy: new Types.ObjectId(generatedBy),
      notes: remarks || reason,
    };

    return invoiceRepository.create(cnData);
  }

  async getCreditNotesByInvoiceId(invoiceId: string) {
    const originalInvoice = await invoiceRepository.findById(invoiceId);
    if (!originalInvoice) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Original invoice not found");
    
    return invoiceRepository.find({ 
      referenceInvoiceId: originalInvoice._id, 
      type: InvoiceType.CREDIT_NOTE 
    }, 0, 100);
  }

  async generateDebitNote(invoiceId: string, amount: number, reason: string, generatedBy: string, remarks?: string, effectiveDate?: Date) {
    const originalInvoice = await invoiceRepository.findById(invoiceId);
    if (!originalInvoice) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Original invoice not found");
    
    const dnNumber = await invoiceRepository.getNextInvoiceNumber();
    
    const dnData: Partial<IInvoice> = {
      invoiceNumber: dnNumber.replace("INV-", "DN-"),
      companyId: originalInvoice.companyId,
      type: InvoiceType.DEBIT_NOTE,
      referenceInvoiceId: originalInvoice._id as Types.ObjectId,
      issueDate: effectiveDate || new Date(),
      dueDate: effectiveDate ? new Date(effectiveDate.getTime() + 15 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      items: [{
        description: `Debit Note for ${originalInvoice.invoiceNumber}: ${reason}`,
        quantity: 1,
        unitPrice: amount,
        total: amount
      }],
      subtotal: amount,
      tax: 0,
      discount: 0,
      grandTotal: amount,
      currency: originalInvoice.currency,
      status: InvoiceStatus.SENT,
      paymentStatus: PaymentStatus.PENDING,
      generatedBy: new Types.ObjectId(generatedBy),
      notes: remarks || reason,
    };

    return invoiceRepository.create(dnData);
  }

  async getDebitNotesByInvoiceId(invoiceId: string) {
    const originalInvoice = await invoiceRepository.findById(invoiceId);
    if (!originalInvoice) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Original invoice not found");
    
    return invoiceRepository.find({ 
      referenceInvoiceId: originalInvoice._id, 
      type: InvoiceType.DEBIT_NOTE 
    }, 0, 100);
  }

  async getDashboardStats(filter?: Record<string, any>) {
    return invoiceRepository.getDashboardStats(filter);
  }

  async getDashboardCharts(filter?: Record<string, any>) {
    return invoiceRepository.getDashboardCharts(filter);
  }

  async getTopCompaniesByRevenue(filter?: Record<string, any>) {
    return invoiceRepository.getTopCompaniesByRevenue(filter);
  }

  async generatePdf(id: string): Promise<Buffer> {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invoice not found");

    const templatePath = path.join(__dirname, "templates", "invoice.html");
    let html = fs.readFileSync(templatePath, "utf-8");

    const appName = await this.getAppName();

    // Replace basic placeholders
    const replacements: Record<string, string> = {
      ORG_NAME: appName,
      ORG_INITIALS: "EGP",
      ORG_ADDRESS_LINE1: "123 Exam Street",
      ORG_ADDRESS_LINE2: "Education City, ED 12345",
      ORG_EMAIL: "billing@examguard.com",
      ORG_PHONE: "+1-800-123-4567",
      INVOICE_NUMBER: invoice.invoiceNumber,
      INVOICE_DATE: new Date(invoice.issueDate).toLocaleDateString(),
      DUE_DATE: new Date(invoice.dueDate).toLocaleDateString(),
      PAYMENT_STATUS: invoice.paymentStatus,
      PAYMENT_MODE: "Online",
      PLAN_NAME: "Subscription",
      BILL_TO_COMPANY_NAME: ((invoice as any).companyId)?.companyName || "N/A",
      BILL_TO_COMPANY_ID: ((invoice as any).companyId)?.companyCode || invoice.companyId.toString(),
      BILL_TO_ADDRESS: [
        ((invoice as any).companyId)?.address,
        ((invoice as any).companyId)?.city,
        ((invoice as any).companyId)?.state,
        ((invoice as any).companyId)?.pincode
      ].filter(Boolean).join(", ") || "N/A",
      BILL_TO_EMAIL: ((invoice as any).companyId)?.email || "N/A",
      BILL_TO_PHONE: ((invoice as any).companyId)?.phone || "N/A",
      BILL_TO_GSTIN: ((invoice as any).companyId)?.gstNumber || "N/A",
      SUBTOTAL: `Rs. ${invoice.subtotal.toFixed(2)}`,
      TAX: `Rs. ${invoice.tax.toFixed(2)}`,
      DISCOUNT: `Rs. ${invoice.discount.toFixed(2)}`,
      GRAND_TOTAL: `Rs. ${invoice.grandTotal.toFixed(2)}`,
      BANK_NAME: "ExamGuard Bank",
      ACCOUNT_NUMBER: "1234567890",
      IFSC: "EXAM0001234",
      UPI: "billing@examguard",
      NOTES: invoice.notes || ""
    };

    for (const [key, value] of Object.entries(replacements)) {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
    }

    // Process Items
    const itemsStartMatch = html.match(/<!-- ITEMS_START -->/);
    const itemsEndMatch = html.match(/<!-- ITEMS_END -->/);

    if (itemsStartMatch && itemsEndMatch) {
      const startIndex = itemsStartMatch.index! + itemsStartMatch[0].length;
      const endIndex = itemsEndMatch.index!;
      const itemTemplate = html.substring(startIndex, endIndex);

      let itemsHtml = "";
      for (const item of invoice.items) {
        let currentItemHtml = itemTemplate;
        currentItemHtml = currentItemHtml.replace(/{{ITEM_DESC}}/g, item.description);
        currentItemHtml = currentItemHtml.replace(/{{ITEM_QTY}}/g, item.quantity.toString());
        currentItemHtml = currentItemHtml.replace(/{{ITEM_UNIT_PRICE}}/g, `Rs. ${item.unitPrice.toFixed(2)}`);
        currentItemHtml = currentItemHtml.replace(/{{ITEM_TOTAL}}/g, `Rs. ${item.total.toFixed(2)}`);
        itemsHtml += currentItemHtml;
      }

      html = html.substring(0, itemsStartMatch.index!) + itemsHtml + html.substring(itemsEndMatch.index! + itemsEndMatch[0].length);
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    try {
      const page = await browser.newPage();
      
      // Inject CSS for Black & White printing per requirements
      const bWStyle = `
        <style>
          * { 
            filter: grayscale(100%) !important; 
            color: black !important; 
            background: white !important;
            border-color: gray !important;
          }
        </style>
      `;
      html = html.replace('</head>', `${bWStyle}</head>`);

      await page.setContent(html, { waitUntil: "networkidle0" });
      
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true
      });

      await browser.close();
      return Buffer.from(pdfBuffer);
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  async emailInvoice(id: string, payload: { to: string, cc?: string, message?: string }) {
    const invoice = await invoiceRepository.findById(id);
    if (!invoice) throw new ApiError(HTTP_STATUS.NOT_FOUND, "Invoice not found");

    const pdfBuffer = await this.generatePdf(id);

    const appName = await this.getAppName();

    await emailService.sendCustom({
      to: payload.to,
      cc: payload.cc ? [payload.cc] : undefined,
      subject: `Invoice ${invoice.invoiceNumber} from ${appName}`,
      html: `
        <h2>Your Invoice ${invoice.invoiceNumber}</h2>
        <p>Please find your invoice attached.</p>
        ${payload.message ? `<p><strong>Message:</strong><br/>${payload.message}</p>` : ''}
      `,
      attachments: [
        {
          filename: `${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });
  }
}

export const invoiceService = new InvoiceService();
