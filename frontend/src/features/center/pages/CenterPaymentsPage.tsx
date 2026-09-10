import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, CreditCard, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useCenterPaymentsStore } from '../store/useCenterPaymentsStore';
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
                  <div style="font-size: 10px; color: #555; line-height: 1.4;">Exam: ${payment.examId?.examName || payment.examId?.examTitle || 'N/A'}<br/>Shift: ${payment.shiftId?.shiftName || 'N/A'}</div>
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

export const CenterPaymentsPage: React.FC = () => {
  const { paymentsList, fetchPayments, isLoading } = useCenterPaymentsStore();
  const user = useAuthStore(state => state.user);
  const centerId = user?.centerId || user?.referenceId || '';
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (centerId) {
      fetchPayments(centerId);
    }
  }, [centerId, fetchPayments]);

  const filteredPayments = statusFilter === 'all'
    ? paymentsList
    : paymentsList.filter(payment => payment.status === statusFilter);

  const handleExportCSV = () => {
    if (!filteredPayments || filteredPayments.length === 0) return;

    const headers = ['Payment ID', 'Exam', 'Shift', 'Amount', 'Date', 'Status', 'Reference Number', 'Remarks'];
    
    const rows = filteredPayments.map(payment => [
      payment._id,
      payment.examId?.examTitle || payment.examId?.title || payment.examId?.name || 'N/A',
      payment.shiftId?.shiftName || payment.shiftId?.name || 'N/A',
      payment.amount,
      payment.paymentDate ? new Date(payment.paymentDate).toISOString().split('T')[0] : 'N/A',
      payment.status,
      payment.referenceNumber || 'N/A',
      payment.remarks || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    link.setAttribute('download', `center_payments_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInvoice = (payment: any) => {
    const html = generateInvoiceHtml(payment);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      toast.error("Please allow popups to download invoices.");
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <div className="p-3 bg-[#E4FD97] rounded-xl text-[#2D3E2C] mt-1 shrink-0">
              <CreditCard className="h-8 w-8" />
            </div>
            Center Payments
          </h1>
          <p className="text-muted-foreground mt-2">
            View shift-wise payments made by the company admin to this center.
          </p>
        </div>
        <Button 
          onClick={handleExportCSV} 
          disabled={!filteredPayments.length || isLoading}
          variant="outline"
          className="flex items-center gap-2 border-border text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/50 shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-card border-border shadow-xl">
        <CardHeader className="border-b border-border pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
              <div className="p-2 bg-[#E4FD97] rounded-lg text-[#2D3E2C] shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              Payment History
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
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
        <CardContent className="pt-0 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Exam & Shift</th>
                  <th scope="col" className="px-6 py-4 font-medium">Date</th>
                  <th scope="col" className="px-6 py-4 font-medium">Amount</th>
                  <th scope="col" className="px-6 py-4 font-medium">Ref No.</th>
                  <th scope="col" className="px-6 py-4 font-medium">Status</th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground animate-pulse">
                      Loading payments...
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-10 w-10 text-muted-foreground/30 mb-4" />
                        <p className="text-lg font-medium text-foreground">No payments found</p>
                        <p className="text-sm">There are no payment records to display.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment: any) => (
                    <tr key={payment._id} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-foreground">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {payment.examId?.examTitle || 'N/A'}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Shift: {payment.shiftId ? (
                              <>
                                {payment.shiftId.shiftName || payment.shiftId.name || 'N/A'}
                                {payment.shiftId.startTime && payment.shiftId.endTime 
                                  ? ` (${payment.shiftId.startTime} - ${payment.shiftId.endTime})`
                                  : ''}
                              </>
                            ) : (
                              'N/A'
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium text-foreground">₹{payment.amount?.toLocaleString('en-IN') || '0'}</span>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full w-fit">
                            Ref: {payment.referenceNumber || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'Paid' 
                            ? 'bg-[#E4FD97] text-[#2D3E2C]' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
                        }`}>
                          {payment.status === 'Paid' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm max-w-[200px] truncate" title={payment.remarks}>
                          {payment.remarks || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {payment.status === 'Paid' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(payment)}
                            className="bg-[#2D3E2C] text-[#E4FD97] hover:bg-[#2D3E2C]/90 border-0"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CenterPaymentsPage;
