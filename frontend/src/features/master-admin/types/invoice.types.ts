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

export interface Invoice {
  _id: string;
  id?: string;
  invoiceNumber: string;
  companyId: any;
  subscriptionId?: any;
  paymentReferenceId?: string;
  type: InvoiceType;
  referenceInvoiceId?: string;
  
  issueDate: string;
  dueDate: string;
  
  items: IInvoiceItem[];
  
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  currency: string;
  
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  
  generatedBy?: string;
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  cancelledInvoices: number;
  creditNotes: number;
  debitNotes: number;
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
}

export interface GenerateNotePayload {
  amount: number;
  reason: string;
  remarks?: string;
  effectiveDate?: string;
}

export interface UpdateInvoiceStatusPayload {
  status: InvoiceStatus;
  paymentStatus?: PaymentStatus;
  notes?: string;
}
