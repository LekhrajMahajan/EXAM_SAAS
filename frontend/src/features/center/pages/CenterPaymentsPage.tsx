import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Download, CreditCard, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useCenterPaymentsStore } from '../store/useCenterPaymentsStore';

export const CenterPaymentsPage: React.FC = () => {
  const { paymentsList, fetchPayments, isLoading } = useCenterPaymentsStore();
  const user = useAuthStore(state => state.user);
  const centerId = user?.centerId || user?.referenceId || '';

  useEffect(() => {
    if (centerId) {
      fetchPayments(centerId);
    }
  }, [centerId, fetchPayments]);

  const handleExportCSV = () => {
    if (!paymentsList || paymentsList.length === 0) return;

    const headers = ['Payment ID', 'Exam', 'Shift', 'Amount', 'Date', 'Status', 'Reference Number', 'Remarks'];
    
    const rows = paymentsList.map(payment => [
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
          disabled={!paymentsList.length || isLoading}
          variant="outline"
          className="flex items-center gap-2 border-border text-primary hover:bg-primary/10 hover:text-primary hover:border-primary/50 shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-card border-border shadow-xl">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="text-lg font-medium text-foreground flex items-center gap-2">
            <div className="p-2 bg-[#E4FD97] rounded-lg text-[#2D3E2C] shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            Payment History
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            A comprehensive list of all your processed and pending payments.
          </CardDescription>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      Loading payments...
                    </td>
                  </tr>
                ) : paymentsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CreditCard className="h-12 w-12 text-muted-foreground/50 mb-3" />
                        <p className="text-foreground text-lg font-medium">No payments found</p>
                        <p className="text-muted-foreground text-sm mt-1">Payments made to your center will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paymentsList.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {payment.examId?.examTitle || payment.examId?.title || payment.examId?.name || 'N/A'}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1">
                            Shift: {payment.shiftId?.shiftName || payment.shiftId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-emerald-600 font-semibold">₹{payment.amount?.toLocaleString() || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {payment.referenceNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          payment.status === 'Paid' ? 'bg-primary/10 text-primary border-primary/20' :
                          payment.status === 'Pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                          payment.status === 'Failed' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                          'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        }`}>
                          {payment.status === 'Paid' && <CheckCircle2 className="h-3 w-3" />}
                          {payment.status}
                        </span>
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
