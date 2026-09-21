import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Download, IndianRupee, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { apiClient } from '@/core/api/http/axios-client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { toast } from 'react-hot-toast';

// Print styles for invoice
const generateInvoiceHtml = (payment: any) => {
  return `
    <html>
      <head>
        <title>Invoice - ${payment.referenceNumber || payment._id}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; color-adjust: exact; }
        </style>
      </head>
      <body>
        <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; color: #2D3E2C; padding: 40px; background: white;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px;">
            <div>
              <div style="width: 48px; height: 48px; background: #E4FD97; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D3E2C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <h1 style="font-size: 24px; font-weight: 800; margin: 0; color: #2D3E2C;">ExamGuard<br/>Pro.</h1>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 32px; font-weight: 800; color: #2D3E2C; margin: 0 0 5px 0; letter-spacing: 2px; text-transform: uppercase;">INVOICE</h2>
              <p style="margin: 0; font-size: 14px; font-weight: 600; color: #2D3E2C;">${payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <!-- Addresses -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div>
              <h3 style="font-size: 14px; font-weight: 700; margin: 0 0 8px 0; color: #2D3E2C;">Office Address</h3>
              <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.6;">
                ${payment.companyId?.companyName || 'ExamGuard Pro Inc.'}<br>
                Tech Park, Sector 62<br>
                Noida, UP
              </p>
              <p style="margin: 12px 0 0 0; font-size: 12px; font-weight: 700; color: #2D3E2C;">(+91) 9876543210</p>
            </div>
            <div style="text-align: left; width: 40%;">
              <h3 style="font-size: 14px; font-weight: 700; margin: 0 0 8px 0; color: #2D3E2C;">To :</h3>
              <p style="margin: 0; font-size: 12px; color: #2D3E2C; line-height: 1.6; font-weight: 700;">
                ${payment.centerId?.centerName || 'Examination Center'}
              </p>
              <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.6;">
                Center Code: ${payment.centerId?.centerCode || 'N/A'}<br>
                UPI ID: ${payment.centerId?.upiId || 'N/A'}<br>
                ${payment.centerId?.email || 'No email provided'}
              </p>
            </div>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background-color: #2D3E2C; color: #E4FD97;">
                <th style="padding: 12px 15px; text-align: left; font-size: 12px; font-weight: 600;">Items Description</th>
                <th style="padding: 12px 15px; text-align: center; font-size: 12px; font-weight: 600;">Unit Price</th>
                <th style="padding: 12px 15px; text-align: center; font-size: 12px; font-weight: 600;">Qnt</th>
                <th style="padding: 12px 15px; text-align: right; font-size: 12px; font-weight: 600;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 20px 15px; border-bottom: 1px solid #2D3E2C;">
                  <div style="font-size: 14px; font-weight: 700; color: #2D3E2C; margin-bottom: 4px;">Exam Conduction Charges</div>
                  <div style="font-size: 10px; color: #555; line-height: 1.4;">Exam: ${payment.examId?.examName || payment.examId?.examTitle || 'N/A'}<br/>Shift: ${payment.shift || payment.shiftId?.shiftName || 'N/A'}</div>
                </td>
                <td style="padding: 20px 15px; text-align: center; border-bottom: 1px solid #2D3E2C; font-size: 12px; font-weight: 700; color: #2D3E2C;">
                  ₹${payment.amount?.toLocaleString()}
                </td>
                <td style="padding: 20px 15px; text-align: center; border-bottom: 1px solid #2D3E2C; font-size: 12px; font-weight: 700; color: #2D3E2C;">
                  1
                </td>
                <td style="padding: 20px 15px; text-align: right; border-bottom: 1px solid #2D3E2C; font-size: 12px; font-weight: 700; color: #2D3E2C;">
                  ₹${payment.amount?.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Totals -->
          <div style="display: flex; justify-content: space-between; margin-bottom: 50px;">
            <div style="width: 50%;">
              <div style="font-size: 12px; font-weight: 700; color: #2D3E2C; margin-bottom: 4px;">Note:</div>
              <div style="font-size: 10px; color: #555; line-height: 1.4;">Payment Reference Number: ${payment.referenceNumber || payment._id}<br/>Status: <span style="color: ${payment.status === 'Paid' ? '#2D3E2C' : '#ea580c'}; font-weight: 700;">${payment.status}</span></div>
            </div>
            <div style="width: 40%;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 15px; font-size: 12px; font-weight: 700; color: #2D3E2C; text-align: right;">SUBTOTAL :</td>
                  <td style="padding: 8px 15px; font-size: 12px; font-weight: 700; color: #2D3E2C; text-align: right;">₹${payment.amount?.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px; font-size: 12px; font-weight: 700; color: #2D3E2C; text-align: right;">Tax VAT 0% :</td>
                  <td style="padding: 8px 15px; font-size: 12px; font-weight: 700; color: #2D3E2C; text-align: right;">₹0</td>
                </tr>
                <tr>
                  <td style="padding: 8px 15px; font-size: 12px; font-weight: 700; color: #2D3E2C; text-align: right;">DISCOUNT 0% :</td>
                  <td style="padding: 8px 15px; font-size: 12px; font-weight: 700; color: #2D3E2C; text-align: right;">₹0</td>
                </tr>
                <tr style="background-color: #2D3E2C; color: #E4FD97;">
                  <td style="padding: 15px; font-size: 14px; font-weight: 700; text-align: right;">TOTAL DUE :</td>
                  <td style="padding: 15px; font-size: 14px; font-weight: 700; text-align: right;">₹${payment.amount?.toLocaleString()}</td>
                </tr>
              </table>
            </div>
          </div>

          <h3 style="font-size: 16px; font-weight: 800; color: #2D3E2C; margin-bottom: 40px;">Thank you for your Business</h3>

          <!-- Footer -->
          <div style="border-top: 1px solid #2D3E2C; padding-top: 20px; display: flex; justify-content: space-between;">
            <div style="width: 30%;">
              <h4 style="font-size: 12px; font-weight: 700; color: #2D3E2C; margin: 0 0 10px 0;">Questions?</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 10px; color: #555;">
                <tr><td style="font-weight: 700; color: #2D3E2C; padding-bottom: 4px; width: 60px;">Email us</td><td style="padding-bottom: 4px;">: support@examguard.pro</td></tr>
                <tr><td style="font-weight: 700; color: #2D3E2C; width: 60px;">Call us</td><td>: +91 9876543210</td></tr>
              </table>
            </div>
            <div style="width: 30%;">
              <h4 style="font-size: 12px; font-weight: 700; color: #2D3E2C; margin: 0 0 10px 0;">Payment Info :</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 10px; color: #555;">
                <tr><td style="font-weight: 700; color: #2D3E2C; padding-bottom: 4px; width: 60px;">Method</td><td style="padding-bottom: 4px;">: Razorpay / UPI</td></tr>
                <tr><td style="font-weight: 700; color: #2D3E2C; padding-bottom: 4px; width: 60px;">Status</td><td style="padding-bottom: 4px;">: ${payment.status}</td></tr>
              </table>
            </div>
            <div style="width: 35%;">
              <h4 style="font-size: 12px; font-weight: 700; color: #2D3E2C; margin: 0 0 10px 0;">Terms & Conditions/Note:</h4>
              <p style="margin: 0; font-size: 10px; color: #555; line-height: 1.4;">
                This is a computer generated invoice and does not require a physical signature. Payments are final and non-refundable.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
};

export function CenterPaymentsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: response, isLoading } = useQuery({
    queryKey: ['company-center-payments'],
    queryFn: () => apiClient.get('/center-payments/company').then((res) => res.data),
  });

  const markPaidMutation = useMutation({
    mutationFn: (paymentId: string) => 
      apiClient.patch(`/center-payments/${paymentId}/pay`, { 
        status: 'Paid',
        referenceNumber: `REF-${Math.random().toString(36).substring(7).toUpperCase()}` 
      }).then(res => res.data),
    onSuccess: () => {
      toast.success('Payment marked as paid successfully');
      queryClient.invalidateQueries({ queryKey: ['company-center-payments'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to mark payment as paid');
    }
  });

  const handleDownloadInvoice = (payment: any) => {
    const html = generateInvoiceHtml(payment);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      // Give images/fonts a moment to load before printing
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      toast.error("Please allow popups to download invoices.");
    }
  };

  // Load razorpay script (only once, only if not already present)
  useEffect(() => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRazorpayPayment = async (paymentId: string, centerUpiId: string) => {
    try {
      // 1. Create order
      const orderRes = await apiClient.post(`/center-payments/${paymentId}/razorpay-order`);
      const { orderId, amount, currency, keyId } = orderRes.data.data;

      // 2. Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "ExamGuard Pro",
        description: `Payment Transfer to Center UPI: ${centerUpiId}`,
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment
            await apiClient.post(`/center-payments/${paymentId}/verify-razorpay`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Payment successful!");
            queryClient.invalidateQueries({ queryKey: ['company-center-payments'] });
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Payment verification failed");
          }
        },
        theme: {
          color: "#2D3E2C",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    }
  };

  const payments = response?.data || [];
  const filteredPayments = statusFilter === 'all' 
    ? payments 
    : payments.filter((payment: any) => (payment.status || '').toLowerCase() === statusFilter.toLowerCase());

  const getStatusBadge = (status: string) => {
    const normalizedStatus = (status || '').toLowerCase();
    switch (normalizedStatus) {
      case 'paid':
        return <Badge className="bg-[#E4FD97] text-[#2D3E2C] hover:bg-[#E4FD97]/90 border-0"><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Centers Payment</h1>
        <p className="text-muted-foreground mt-1">Manage and track payments made to examination centers.</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-primary" />
              Payment History
            </CardTitle>
            <CardDescription>
              A comprehensive list of all your processed and pending payments.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
              className={statusFilter === 'all' ? 'bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90' : ''}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'Pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('Pending')}
              className={statusFilter === 'Pending' ? 'bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90' : ''}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'Paid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('Paid')}
              className={statusFilter === 'Paid' ? 'bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90' : ''}
            >
              Paid
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border-0">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead className="w-[120px]">Payment ID</TableHead>
                  <TableHead>Center</TableHead>
                  <TableHead>Center UPI</TableHead>
                  <TableHead>Exam & Shift</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <IndianRupee className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-4" />
                        <p className="text-lg font-medium text-slate-900 dark:text-white">No payments found</p>
                        <p className="text-sm">There are no payment records to display.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment: any) => (
                    <TableRow key={payment._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                      <TableCell className="font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 dark:text-slate-300">
                            {payment._id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{payment.centerId?.centerName}</span>
                          <span className="text-xs text-muted-foreground">{payment.centerId?.centerCode}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {payment.centerId?.paymentDetails?.mode === 'BANK' ? (
                            <span className="text-xs">Bank: {payment.centerId.paymentDetails.accountNumber}</span>
                          ) : payment.centerId?.paymentDetails?.upiId ? (
                            payment.centerId.paymentDetails.upiId
                          ) : payment.centerId?.upiId ? (
                            payment.centerId.upiId
                          ) : (
                            <span className="text-muted-foreground italic">Not set</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{payment.examId?.examTitle || 'N/A'}</span>
                          <span className="text-xs text-muted-foreground">
                            {payment.shift ? (
                                payment.shift
                            ) : payment.shiftId ? (
                              <>
                                {payment.shiftId.shiftName || 'Shift'}
                                {payment.shiftId.startTime && payment.shiftId.endTime 
                                  ? ` (${payment.shiftId.startTime} - ${payment.shiftId.endTime})`
                                  : ''}
                              </>
                            ) : (
                              'N/A'
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        ₹{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {(payment.status || '').toLowerCase() === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#E4FD97] hover:text-[#2D3E2C] hover:border-[#E4FD97] border-[#2D3E2C]"
                              onClick={() => {
                                const hasUpi = payment.centerId?.paymentDetails?.upiId || payment.centerId?.upiId;
                                const hasBank = payment.centerId?.paymentDetails?.mode === 'BANK';
                                if (!hasUpi && !hasBank) {
                                  toast.error("Center has not provided payment details. Cannot process payment.");
                                  return;
                                }
                                handleRazorpayPayment(payment._id, hasUpi ? (payment.centerId?.paymentDetails?.upiId || payment.centerId?.upiId) : payment.centerId?.paymentDetails?.accountNumber);
                              }}
                            >
                              Pay with Razorpay
                            </Button>
                          )}
                          {(payment.status || '').toLowerCase() === 'paid' && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-primary hover:bg-primary/90"
                              onClick={() => handleDownloadInvoice(payment)}
                            >
                              <Download className="w-4 h-4 mr-1.5" />
                              Invoice
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CenterPaymentsPage;
