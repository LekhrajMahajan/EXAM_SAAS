export type PaymentStatus = 'Successful' | 'Pending' | 'Failed' | 'Refunded' | 'Partial Refund';
export type PaymentMethod = 'UPI' | 'Net Banking' | 'Credit Card' | 'Debit Card' | 'Wallet' | 'Challan';
export type PaymentGateway = 'Razorpay' | 'Stripe' | 'PayU' | 'Cashfree' | 'Internal';
export type FeeType = 'Application Fee' | 'Exam Fee' | 'Late Fee' | 'Additional Charge' | 'Re-Exam Fee';
export type RefundStatus = 'Requested' | 'Under Review' | 'Approved' | 'Processed' | 'Rejected';
export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled';
export type GatewayStatus = 'Active' | 'Inactive' | 'Test Mode' | 'Error';

export interface PaymentStatistics {
  totalCollections: number;
  todayCollection: number;
  pendingPayments: number;
  successfulPayments: number;
  failedPayments: number;
  refundRequests: number;
  processedRefunds: number;
  outstandingAmount: number;
}

export interface Transaction {
  id: string;
  transactionId: string;
  candidateName: string;
  applicationNumber: string;
  exam: string;
  amount: number;
  feeType: FeeType;
  paymentMethod: PaymentMethod;
  gateway: PaymentGateway;
  status: PaymentStatus;
  transactionDate: string;
  gatewayRef?: string;
}

export interface FeeConfig {
  id: string;
  feeType: FeeType;
  exam: string;
  category: string;
  amount: number;
  taxPercent: number;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  candidateName: string;
  applicationNumber: string;
  exam: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  transactionId: string;
  candidateName: string;
  applicationNumber: string;
  exam: string;
  amount: number;
  paymentMethod: PaymentMethod;
  issuedAt: string;
}

export interface RefundRequest {
  id: string;
  refundId: string;
  transactionId: string;
  candidateName: string;
  applicationNumber: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  requestedAt: string;
  processedAt?: string;
}

export interface PaymentGatewayConfig {
  id: string;
  name: PaymentGateway;
  status: GatewayStatus;
  successRate: number;
  totalTransactions: number;
  totalVolume: number;
  supportedMethods: PaymentMethod[];
  lastSync: string;
}

export interface Settlement {
  id: string;
  settlementId: string;
  gateway: PaymentGateway;
  amount: number;
  transactionCount: number;
  status: 'Settled' | 'Pending' | 'Processing';
  settlementDate: string;
  bankAccount: string;
}
