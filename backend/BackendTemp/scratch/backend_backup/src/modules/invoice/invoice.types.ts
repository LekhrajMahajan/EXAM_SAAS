import { Document, Types } from "mongoose";

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  PAID = "PAID",
  UNPAID = "UNPAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum InvoiceType {
  INVOICE = "INVOICE",
  CREDIT_NOTE = "CREDIT_NOTE",
  DEBIT_NOTE = "DEBIT_NOTE",
}

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  companyId: Types.ObjectId;
  subscriptionId?: Types.ObjectId;
  paymentReferenceId?: string;
  type: InvoiceType;
  referenceInvoiceId?: Types.ObjectId; // For credit/debit notes pointing to an original invoice
  
  issueDate: Date;
  dueDate: Date;
  
  items: IInvoiceItem[];
  
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  currency: string;
  
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  
  generatedBy?: Types.ObjectId; // Master admin user ID if generated manually
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
