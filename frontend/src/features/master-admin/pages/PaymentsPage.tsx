import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import type { TableColumn } from "@/shared/types";
import { Download, Eye, RefreshCw, Loader2 } from "lucide-react";
import { usePayments, useVerifyPayment } from "../hooks/payment.hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const loadRazorpay = async () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PaymentsPage = () => {
  const { data: payments = [], isLoading } = usePayments();
  const verifyPaymentMutation = useVerifyPayment();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleView = (payment: any) => {
    setSelectedPayment(payment);
    setIsViewOpen(true);
  };

  const generatePDF = (payment: any) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="padding: 40px; font-family: system-ui, sans-serif; color: #333; background: white;">
        <div style="border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px;">
          <h2 style="margin-top: 0; color: #2D3E2C;">Payment Receipt</h2>
          <p style="margin-bottom: 5px; font-size: 14px;"><strong>Transaction ID:</strong> ${payment.razorpayOrderId || payment._id}</p>
          <p style="margin-top: 0; font-size: 14px;"><strong>Date:</strong> ${new Date(payment.createdAt || new Date()).toLocaleString()}</p>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f5f5f5; padding-bottom: 5px; font-size: 14px;">
          <span style="color: #666;">Company:</span> 
          <span style="font-weight: 500;">${payment.companyId?.companyName || 'Unknown'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f5f5f5; padding-bottom: 5px; font-size: 14px;">
          <span style="color: #666;">Status:</span> 
          <span style="font-weight: 500;">${payment.status}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f5f5f5; padding-bottom: 5px; font-size: 14px;">
          <span style="color: #666;">Method:</span> 
          <span style="font-weight: 500;">${payment.method || 'Razorpay / Card'}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px; border-top: 2px solid #eee; padding-top: 15px; font-weight: bold; font-size: 1.2em;">
          <span>Total Amount:</span> 
          <span style="color: #2D3E2C;">₹${(payment.amount || 0).toLocaleString('en-IN')}</span>
        </div>
        <p style="margin-top: 60px; font-size: 11px; color: #999; text-align: center;">This is an electronically generated receipt.</p>
      </div>
    `;
    
    const opt = {
      margin:       0.5,
      filename:     `receipt_${payment.razorpayOrderId || payment._id}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    (window as any).html2pdf().set(opt).from(element).save().then(() => {
       toast({ title: "Success", description: "Receipt downloaded successfully", variant: "default" });
    });
  };

  const handleDownload = (payment: any) => {
    toast({ title: "Generating PDF", description: "Please wait while your receipt is being prepared...", variant: "default" });
    
    if (!(window as any).html2pdf) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = () => generatePDF(payment);
      document.body.appendChild(script);
    } else {
      generatePDF(payment);
    }
  };

  const handleProcessPayment = async (payment: any) => {
    if (payment.status !== 'PENDING' && payment.status !== 'Pending') {
      toast({ title: "Info", description: "Payment is already completed or failed.", variant: "default" });
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      toast({ title: "Error", description: "Razorpay SDK failed to load.", variant: "destructive" });
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_mock",
      amount: (payment.amount * 100).toString(),
      currency: "INR",
      name: "ExamGuard Pro",
      description: "Pending Payment Completion",
      order_id: payment.razorpayOrderId,
      handler: async function (response: any) {
        try {
          await verifyPaymentMutation.mutateAsync({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast({ title: "Success", description: "Payment is successful", variant: "default" });
          queryClient.invalidateQueries({ queryKey: ['payments'] });
        } catch (err) {
          toast({ title: "Error", description: "Could not verify payment.", variant: "destructive" });
        }
      },
      prefill: {
        name: payment.companyId?.companyName || "Company",
      },
      theme: { color: "#0f172a" },
    };

    const paymentObject = new (window as any).Razorpay(options);
    paymentObject.open();
  };

  const columns: TableColumn<any>[] = [
    { 
      id: "transactionId", 
      header: "Transaction ID", 
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.razorpayOrderId || row._id}</span>
    },
    { 
      id: "companyName", 
      header: "Company", 
      cell: ({ row }) => <span>{row.companyId?.companyName || 'Unknown'}</span>,
      enableSorting: true 
    },
    { 
      id: "amount", 
      header: "Amount", 
      cell: ({ row }) => <span className="font-medium text-slate-900">₹{row.amount?.toLocaleString('en-IN') || 0}</span>,
      enableSorting: true 
    },
    { 
      id: "date", 
      header: "Date", 
      cell: ({ row }) => new Date(row.createdAt || new Date()).toLocaleString(),
      enableSorting: true 
    },
    { 
      id: "method", 
      header: "Method", 
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200">
          {row.method || 'Razorpay / Card'}
        </span>
      )
    },
    { 
      id: "status", 
      header: "Status", 
      cell: ({ row }) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.status === 'SUCCESS' || row.status === 'Completed' ? 'bg-primary/10 text-primary border border-primary/20' : 
          row.status === 'PENDING' || row.status === 'Pending' ? 'bg-secondary text-secondary-foreground border border-secondary/50' : 
          row.status === 'FAILED' || row.status === 'Refunded' ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-muted text-muted-foreground'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button onClick={() => handleView(row)} className="p-1 hover:bg-primary/10 rounded text-muted-foreground hover:text-primary transition-colors" title="View Details">
            <Eye className="w-4 h-4" />
          </button>
          <button onClick={() => handleDownload(row)} className="p-1 hover:bg-primary/10 rounded text-muted-foreground hover:text-primary transition-colors" title="Download Receipt">
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  const totalVolume = payments
    .filter((p: any) => p.status === 'SUCCESS' || p.status === 'Completed')
    .reduce((acc: number, p: any) => acc + (p.amount || 0), 0);
  const completedCount = payments.filter((p: any) => p.status === 'SUCCESS' || p.status === 'Completed').length;
  const pendingCount = payments.filter((p: any) => p.status === 'PENDING' || p.status === 'Pending').length;
  const failedCount = payments.filter((p: any) => p.status === 'FAILED' || p.status === 'Refunded').length;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#2D3E2C]">Payments</h1>
        <p className="text-muted-foreground mt-2">
          Track financial transactions and payment gateway webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Volume */}
        <Card className="border-primary/20 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{totalVolume.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        {/* Completed */}
        <Card className="border-primary/20 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Completed Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{completedCount}</div>
          </CardContent>
        </Card>
        {/* Pending */}
        <Card className="border-primary/20 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{pendingCount}</div>
          </CardContent>
        </Card>
        {/* Failed */}
        <Card className="border-primary/20 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Failed / Refunds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{failedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>A ledger of all payments made by tenants.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="px-1 pb-4">
            <GenericDataTable
              columns={columns}
              data={payments}
              keyExtractor={(item) => item._id || item.id}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Txn ID:</span>
                <span className="col-span-3 text-sm">{selectedPayment.razorpayOrderId || selectedPayment._id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Company:</span>
                <span className="col-span-3 text-sm">{selectedPayment.companyId?.companyName || 'Unknown'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Amount:</span>
                <span className="col-span-3 text-sm">₹{(selectedPayment.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Date:</span>
                <span className="col-span-3 text-sm">{new Date(selectedPayment.createdAt || new Date()).toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Method:</span>
                <span className="col-span-3 text-sm">{selectedPayment.method || 'Razorpay / Card'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-semibold col-span-1">Status:</span>
                <span className="col-span-3 text-sm">{selectedPayment.status}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
