import type {
  PaymentStatistics, Transaction, FeeConfig, Invoice,
  Receipt, RefundRequest, PaymentGatewayConfig, Settlement,
} from '../types';

export const DUMMY_PAYMENT_STATS: PaymentStatistics = {
  totalCollections: 48750000,
  todayCollection: 1240000,
  pendingPayments: 3420,
  successfulPayments: 98240,
  failedPayments: 2180,
  refundRequests: 342,
  processedRefunds: 218,
  outstandingAmount: 5870000,
};

export const DUMMY_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-001', transactionId: 'TXN20261020001', candidateName: 'Ravi Kumar', applicationNumber: 'APP-2026-00412',
    exam: 'SSC CGL 2026', amount: 500, feeType: 'Exam Fee', paymentMethod: 'UPI', gateway: 'Razorpay',
    status: 'Successful', transactionDate: '2026-10-20 09:15:00', gatewayRef: 'RZP_ORDER_ABCD1234',
  },
  {
    id: 'TXN-002', transactionId: 'TXN20261020002', candidateName: 'Priya Sharma', applicationNumber: 'APP-2026-00413',
    exam: 'IBPS PO 2026', amount: 750, feeType: 'Application Fee', paymentMethod: 'Net Banking', gateway: 'Cashfree',
    status: 'Successful', transactionDate: '2026-10-20 09:42:00', gatewayRef: 'CF_PAY_EFGH5678',
  },
  {
    id: 'TXN-003', transactionId: 'TXN20261020003', candidateName: 'Anil Verma', applicationNumber: 'APP-2026-00414',
    exam: 'SSC CGL 2026', amount: 500, feeType: 'Exam Fee', paymentMethod: 'Debit Card', gateway: 'Razorpay',
    status: 'Failed', transactionDate: '2026-10-20 10:05:00',
  },
  {
    id: 'TXN-004', transactionId: 'TXN20261020004', candidateName: 'Sunita Rao', applicationNumber: 'APP-2026-00415',
    exam: 'RRB NTPC 2026', amount: 250, feeType: 'Exam Fee', paymentMethod: 'UPI', gateway: 'PayU',
    status: 'Pending', transactionDate: '2026-10-20 10:30:00',
  },
  {
    id: 'TXN-005', transactionId: 'TXN20261019001', candidateName: 'Mohan Das', applicationNumber: 'APP-2026-00408',
    exam: 'UPSC Prelims 2026', amount: 100, feeType: 'Application Fee', paymentMethod: 'Credit Card', gateway: 'Stripe',
    status: 'Refunded', transactionDate: '2026-10-19 14:20:00', gatewayRef: 'STR_CHG_IJKL9012',
  },
  {
    id: 'TXN-006', transactionId: 'TXN20261019002', candidateName: 'Kavya Reddy', applicationNumber: 'APP-2026-00410',
    exam: 'IBPS PO 2026', amount: 1050, feeType: 'Late Fee', paymentMethod: 'UPI', gateway: 'Razorpay',
    status: 'Successful', transactionDate: '2026-10-19 16:00:00', gatewayRef: 'RZP_ORDER_MNOP3456',
  },
];

export const DUMMY_FEES: FeeConfig[] = [
  { id: 'FEE-01', feeType: 'Application Fee', exam: 'SSC CGL 2026', category: 'General', amount: 100, taxPercent: 18, isActive: true },
  { id: 'FEE-02', feeType: 'Application Fee', exam: 'SSC CGL 2026', category: 'SC/ST/PwD', amount: 0, taxPercent: 0, isActive: true },
  { id: 'FEE-03', feeType: 'Exam Fee', exam: 'SSC CGL 2026', category: 'General', amount: 500, taxPercent: 18, isActive: true },
  { id: 'FEE-04', feeType: 'Exam Fee', exam: 'IBPS PO 2026', category: 'General', amount: 750, taxPercent: 18, isActive: true },
  { id: 'FEE-05', feeType: 'Late Fee', exam: 'RRB NTPC 2026', category: 'All', amount: 300, taxPercent: 18, isActive: true },
  { id: 'FEE-06', feeType: 'Re-Exam Fee', exam: 'UPSC Prelims 2026', category: 'General', amount: 100, taxPercent: 0, isActive: false },
];

export const DUMMY_INVOICES: Invoice[] = [
  { id: 'INV-001', invoiceNumber: 'INV-2026-0412', candidateName: 'Priya Sharma', applicationNumber: 'APP-2026-00413', exam: 'IBPS PO 2026', amount: 750, taxAmount: 135, totalAmount: 885, status: 'Paid', issuedDate: '2026-10-20', dueDate: '2026-10-27' },
  { id: 'INV-002', invoiceNumber: 'INV-2026-0411', candidateName: 'Ravi Kumar', applicationNumber: 'APP-2026-00412', exam: 'SSC CGL 2026', amount: 500, taxAmount: 90, totalAmount: 590, status: 'Paid', issuedDate: '2026-10-20', dueDate: '2026-10-27' },
  { id: 'INV-003', invoiceNumber: 'INV-2026-0408', candidateName: 'Sunita Rao', applicationNumber: 'APP-2026-00415', exam: 'RRB NTPC 2026', amount: 250, taxAmount: 45, totalAmount: 295, status: 'Issued', issuedDate: '2026-10-20', dueDate: '2026-10-27' },
  { id: 'INV-004', invoiceNumber: 'INV-2026-0399', candidateName: 'Anil Verma', applicationNumber: 'APP-2026-00414', exam: 'SSC CGL 2026', amount: 500, taxAmount: 90, totalAmount: 590, status: 'Overdue', issuedDate: '2026-10-10', dueDate: '2026-10-17' },
];

export const DUMMY_RECEIPTS: Receipt[] = [
  { id: 'RCP-001', receiptNumber: 'RCP-2026-0412', transactionId: 'TXN20261020001', candidateName: 'Ravi Kumar', applicationNumber: 'APP-2026-00412', exam: 'SSC CGL 2026', amount: 590, paymentMethod: 'UPI', issuedAt: '2026-10-20 09:15:00' },
  { id: 'RCP-002', receiptNumber: 'RCP-2026-0413', transactionId: 'TXN20261020002', candidateName: 'Priya Sharma', applicationNumber: 'APP-2026-00413', exam: 'IBPS PO 2026', amount: 885, paymentMethod: 'Net Banking', issuedAt: '2026-10-20 09:42:00' },
];

export const DUMMY_REFUNDS: RefundRequest[] = [
  { id: 'REF-001', refundId: 'REF-2026-0012', transactionId: 'TXN20261019001', candidateName: 'Mohan Das', applicationNumber: 'APP-2026-00408', amount: 100, reason: 'Candidate withdrew application before exam.', status: 'Processed', requestedAt: '2026-10-19 15:00:00', processedAt: '2026-10-19 17:00:00' },
  { id: 'REF-002', refundId: 'REF-2026-0013', transactionId: 'TXN20261020003', candidateName: 'Anil Verma', applicationNumber: 'APP-2026-00414', amount: 590, reason: 'Duplicate payment made by mistake.', status: 'Under Review', requestedAt: '2026-10-20 11:00:00' },
  { id: 'REF-003', refundId: 'REF-2026-0014', transactionId: 'TXN20261019002', candidateName: 'Kavya Reddy', applicationNumber: 'APP-2026-00410', amount: 300, reason: 'Exam cancelled by authority.', status: 'Requested', requestedAt: '2026-10-20 12:00:00' },
];

export const DUMMY_GATEWAYS: PaymentGatewayConfig[] = [
  { id: 'GW-01', name: 'Razorpay', status: 'Active', successRate: 97.4, totalTransactions: 62410, totalVolume: 31200000, supportedMethods: ['UPI', 'Net Banking', 'Credit Card', 'Debit Card', 'Wallet'], lastSync: '2026-10-20 14:00:00' },
  { id: 'GW-02', name: 'Cashfree', status: 'Active', successRate: 96.1, totalTransactions: 18920, totalVolume: 9460000, supportedMethods: ['UPI', 'Net Banking', 'Credit Card', 'Debit Card'], lastSync: '2026-10-20 13:50:00' },
  { id: 'GW-03', name: 'Stripe', status: 'Test Mode', successRate: 99.2, totalTransactions: 1240, totalVolume: 620000, supportedMethods: ['Credit Card', 'Debit Card'], lastSync: '2026-10-20 09:00:00' },
  { id: 'GW-04', name: 'PayU', status: 'Inactive', successRate: 94.8, totalTransactions: 8240, totalVolume: 4120000, supportedMethods: ['UPI', 'Net Banking', 'Wallet'], lastSync: '2026-10-18 12:00:00' },
];

export const DUMMY_SETTLEMENTS: Settlement[] = [
  { id: 'STL-001', settlementId: 'STL-2026-1020-RZP', gateway: 'Razorpay', amount: 2840000, transactionCount: 5682, status: 'Settled', settlementDate: '2026-10-20', bankAccount: 'HDFC ****4521' },
  { id: 'STL-002', settlementId: 'STL-2026-1020-CF', gateway: 'Cashfree', amount: 920000, transactionCount: 1840, status: 'Processing', settlementDate: '2026-10-20', bankAccount: 'ICICI ****7832' },
  { id: 'STL-003', settlementId: 'STL-2026-1019-RZP', gateway: 'Razorpay', amount: 3120000, transactionCount: 6240, status: 'Settled', settlementDate: '2026-10-19', bankAccount: 'HDFC ****4521' },
];
