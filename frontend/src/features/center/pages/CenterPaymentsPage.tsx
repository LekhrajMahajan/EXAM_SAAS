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
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-primary" />
            Center Payments
          </h1>
          <p className="text-slate-400 mt-2">
            View shift-wise payments made by the company admin to this center.
          </p>
        </div>
        <Button 
          onClick={handleExportCSV} 
          disabled={!paymentsList.length || isLoading}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-2 border border-slate-700"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader className="border-b border-slate-800 pb-4">
          <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-400" />
            Payment History
          </CardTitle>
          <CardDescription className="text-slate-400">
            A comprehensive list of all your processed and pending payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">Exam & Shift</th>
                  <th scope="col" className="px-6 py-4 font-medium">Date</th>
                  <th scope="col" className="px-6 py-4 font-medium">Amount</th>
                  <th scope="col" className="px-6 py-4 font-medium">Ref No.</th>
                  <th scope="col" className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Loading payments...
                    </td>
                  </tr>
                ) : paymentsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <CreditCard className="h-12 w-12 text-slate-600 mb-3" />
                        <p className="text-slate-400 text-lg">No payments found</p>
                        <p className="text-slate-500 text-sm mt-1">Payments made to your center will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paymentsList.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-200">
                            {payment.examId?.examTitle || payment.examId?.title || payment.examId?.name || 'N/A'}
                          </span>
                          <span className="text-xs text-slate-500 mt-1">
                            Shift: {payment.shiftId?.shiftName || payment.shiftId?.name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-emerald-400 font-semibold">₹{payment.amount?.toLocaleString() || 0}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400">
                        {payment.referenceNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' :
                          payment.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                          payment.status === 'Failed' ? 'bg-rose-500/10 text-rose-500' :
                          'bg-blue-500/10 text-blue-500'
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
