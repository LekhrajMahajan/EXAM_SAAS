import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Download, Send, Printer, RefreshCw, Activity } from "lucide-react";
import { InvoiceStatusBadge } from "../components/invoices/InvoiceStatusBadge";
import { invoiceApi } from "../api/invoice.api";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { GenericTimeline } from "@/shared/components/timeline/GenericTimeline";
import type { TimelineItem } from "@/shared/types";
import { toast } from "react-hot-toast";
import type { IInvoiceItem } from "../types/invoice.types";
import { useInvoice, useEmailInvoice } from "../hooks/invoice.hooks";
import { useAuditLogs } from "../hooks/audit-log.hooks";
import { CreditNotesTab } from "../components/invoices/CreditNotesTab";
import { DebitNotesTab } from "../components/invoices/DebitNotesTab";

export const InvoiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading, isError, refetch } = useInvoice(id as string);
  const { data: auditResponse, isLoading: isLoadingAudit } = useAuditLogs({ entityId: id });
  const logs = Array.isArray(auditResponse?.data) ? auditResponse.data : (auditResponse?.data as any)?.data || [];
  const { mutate: emailInvoice, isPending: isEmailing } = useEmailInvoice();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({ to: "", cc: "", message: "" });
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load invoice</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">
          We couldn&apos;t retrieve the invoice details. The invoice might have been deleted or there is a network error.
        </p>
        <Button onClick={() => refetch()}>
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await invoiceApi.downloadPdf(invoice._id);
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (_error) {
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleEmailSubmit = () => {
    if (!emailForm.to) {
        toast.error("Recipient email is required");
        return;
    }
    emailInvoice({ id: invoice._id, payload: emailForm }, {
        onSuccess: () => {
            setIsEmailDialogOpen(false);
        }
    });
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const response = await invoiceApi.downloadPdf(invoice._id);
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart], { type: 'application/pdf' }));
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.print();
        setTimeout(() => {
            document.body.removeChild(iframe);
            window.URL.revokeObjectURL(url);
        }, 100);
      };
    } catch (_error) {
      toast.error("Failed to print invoice");
    } finally {
      setIsPrinting(false);
    }
  };

  const timelineItems: TimelineItem[] = [
    {
      id: "1",
      title: "Invoice Generated",
      timestamp: new Date(invoice.createdAt).toLocaleString(),
      status: "success",
      icon: "FileText"
    }
  ];

  if (invoice.status === "SENT" || invoice.status === "PAID") {
    timelineItems.push({
      id: "2",
      title: "Invoice Sent",
      timestamp: new Date(invoice.updatedAt).toLocaleString(),
      status: "info",
      icon: "Send"
    });
  }

  if (invoice.paymentStatus === "PAID") {
    timelineItems.push({
      id: "3",
      title: "Payment Received",
      timestamp: new Date(invoice.updatedAt).toLocaleString(),
      status: "success",
      icon: "CheckCircle"
    });
  }

  const getStatusColor = (status: string, severity: string) => {
    if (status === 'FAILED') return 'error';
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      default: return 'success';
    }
  };

  const getIconForAction = (action: string) => {
    switch (action) {
      case 'GENERATE': return 'FilePlus';
      case 'UPDATE': return 'Edit';
      case 'DOWNLOAD': return 'Download';
      case 'SEND': return 'Mail';
      case 'VERIFY': return 'CheckCircle';
      case 'DELETE': return 'Trash';
      default: return 'Activity';
    }
  };

  const auditTimelineItems: TimelineItem[] = logs.map((log: any) => ({
    id: log._id,
    title: log.action,
    description: log.description,
    timestamp: new Date(log.createdAt).toLocaleString(),
    icon: getIconForAction(log.action),
    status: getStatusColor(log.status, log.severity),
    metadata: {
      'User': (log.performedBy as any)?.name || 'System',
      'Role': log.performedByRole || 'SYSTEM',
      'Status': log.status,
    }
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/master-admin/invoices")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              {invoice.invoiceNumber}
              <InvoiceStatusBadge status={invoice.status} />
              <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold uppercase">{invoice.paymentStatus}</span>
            </h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
              <span>Created: {new Date(invoice.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>Invoice Date: {new Date(invoice.issueDate).toLocaleDateString()}</span>
              <span>•</span>
              <span className="font-medium text-slate-700">Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} className="hidden sm:flex border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary" disabled={isPrinting}>
            {isPrinting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
            Print
          </Button>
          <Button variant="outline" onClick={handleDownload} className="border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary" disabled={isDownloading}>
            {isDownloading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            PDF
          </Button>
          <Button variant="outline" onClick={() => setActiveTab('audit')} className="border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary">
            <Activity className="w-4 h-4 mr-2" />
            Activity
          </Button>
          <Button variant="outline" onClick={() => setIsEmailDialogOpen(true)} className="border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary">
            <Send className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-white border-b border-slate-200 w-full justify-start rounded-none h-auto p-0 flex-wrap overflow-x-auto">
          <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Overview</TabsTrigger>
          <TabsTrigger value="company" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Company Details</TabsTrigger>
          <TabsTrigger value="subscription" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Subscription</TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Payment</TabsTrigger>
          <TabsTrigger value="items" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Invoice Items</TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Timeline</TabsTrigger>
          <TabsTrigger value="credit-notes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Credit Notes</TabsTrigger>
          <TabsTrigger value="debit-notes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Debit Notes</TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none py-3 px-4 shadow-none">Audit Logs</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Summary</CardTitle>
                <CardDescription>Financial breakdown of this invoice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-sm text-primary/70 mb-1">Subtotal</div>
                    <div className="text-xl font-bold text-primary">₹{(invoice.subtotal || 0).toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-sm text-primary/70 mb-1">Discount</div>
                    <div className="text-xl font-bold text-[#2D3E2C]">₹{(invoice.discount || 0).toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-sm text-primary/70 mb-1">Tax</div>
                    <div className="text-xl font-bold text-primary">₹{(invoice.tax || 0).toFixed(2)}</div>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg border border-secondary">
                    <div className="text-sm text-primary mb-1 font-medium">Grand Total (INR)</div>
                    <div className="text-xl font-bold text-primary">₹{(invoice.grandTotal || 0).toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-sm text-slate-500 block mb-1">Company Name</span>
                    <span className="font-medium text-slate-800">{invoice.companyId?.companyName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500 block mb-1">Company Code</span>
                    <span className="font-medium text-slate-800">{invoice.companyId?.companyCode || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500 block mb-1">Email</span>
                    <span className="font-medium text-slate-800">{invoice.companyId?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500 block mb-1">Mobile</span>
                    <span className="font-medium text-slate-800">{invoice.companyId?.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500 block mb-1">GST Number</span>
                    <span className="font-medium text-slate-800">N/A</span>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500 block mb-1">Address</span>
                    <span className="font-medium text-slate-800">N/A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            {invoice.subscriptionId || (invoice.items && invoice.items.length > 0) ? (
               <Card>
                 <CardHeader>
                   <CardTitle>Subscription Details</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Plan Name</span>
                        <span className="font-medium text-slate-800">{invoice.subscriptionId?.planId?.planName || invoice.subscriptionId?.planId?.name || invoice.subscriptionId?.planId || invoice.items?.[0]?.description || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Status</span>
                        <span className="font-medium text-slate-800">{invoice.subscriptionId?.status || invoice.status || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Amount</span>
                        <span className="font-medium text-slate-800">₹{(invoice.grandTotal || invoice.items?.[0]?.total || 0).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Start Date</span>
                        <span className="font-medium text-slate-800">{invoice.subscriptionId?.startDate ? new Date(invoice.subscriptionId.startDate).toLocaleDateString() : new Date(invoice.issueDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Expiry Date</span>
                        <span className="font-medium text-slate-800">
                          {invoice.subscriptionId?.endDate 
                            ? new Date(invoice.subscriptionId.endDate).toLocaleDateString() 
                            : (() => {
                                const d = new Date(invoice.issueDate);
                                d.setFullYear(d.getFullYear() + 1);
                                return d.toLocaleDateString();
                              })()
                          }
                        </span>
                      </div>
                   </div>
                 </CardContent>
               </Card>
            ) : (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
                <p className="text-slate-500">No subscription associated with this invoice.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="payment">
            {invoice.paymentReferenceId ? (
               <Card>
                 <CardHeader>
                   <CardTitle>Payment Details</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Transaction ID</span>
                        <span className="font-medium text-slate-800">{invoice.paymentReferenceId}</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Gateway</span>
                        <span className="font-medium text-slate-800">Razorpay</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Method</span>
                        <span className="font-medium text-slate-800">Credit/Debit/Netbanking</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Amount</span>
                        <span className="font-medium text-slate-800">₹{(invoice.grandTotal || 0).toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Status</span>
                        <span className="font-medium text-slate-800">{invoice.paymentStatus}</span>
                      </div>
                      <div>
                        <span className="text-sm text-slate-500 block mb-1">Paid Date</span>
                        <span className="font-medium text-slate-800">{invoice.paymentStatus === 'PAID' ? new Date(invoice.updatedAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                   </div>
                 </CardContent>
               </Card>
            ) : (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
                <p className="text-slate-500">No payment records found for this invoice.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="items">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 border-b">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Description</th>
                        <th className="px-4 py-3 font-semibold text-right">Quantity</th>
                        <th className="px-4 py-3 font-semibold text-right">Unit Price</th>
                        <th className="px-4 py-3 font-semibold text-right">Tax</th>
                        <th className="px-4 py-3 font-semibold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {invoice.items && invoice.items.length > 0 ? invoice.items.map((item: IInvoiceItem, idx: number) => (
                        <tr key={idx} className="bg-white hover:bg-slate-50">
                          <td className="px-4 py-3">{item.description}</td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-right">₹{(item.unitPrice || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">₹0.00</td>
                          <td className="px-4 py-3 text-right font-medium">₹{(item.total || 0).toFixed(2)}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-slate-500">No items found in this invoice</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Chronological events related to this invoice.</CardDescription>
              </CardHeader>
              <CardContent>
                <GenericTimeline items={timelineItems} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credit-notes">
            <CreditNotesTab invoice={invoice} />
          </TabsContent>

          <TabsContent value="debit-notes">
            <DebitNotesTab invoice={invoice} />
          </TabsContent>

          <TabsContent value="audit">
             <Card>
               <CardHeader>
                 <CardTitle>Audit Logs</CardTitle>
                 <CardDescription>Activity history for this invoice.</CardDescription>
               </CardHeader>
               <CardContent>
                 {isLoadingAudit ? (
                   <div className="flex justify-center p-8"><RefreshCw className="w-6 h-6 animate-spin text-slate-400" /></div>
                 ) : logs.length === 0 ? (
                   <div className="p-12 text-center bg-white border border-slate-200 rounded-xl">
                     <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                       <RefreshCw className="w-6 h-6 text-slate-400" />
                     </div>
                     <h3 className="text-lg font-medium text-slate-800">No Audit Logs</h3>
                     <p className="text-slate-500 mt-1 max-w-sm mx-auto">Detailed audit logs (Action, User, IP) are not available yet.</p>
                   </div>
                 ) : (
                   <GenericTimeline items={auditTimelineItems} />
                 )}
               </CardContent>
             </Card>
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Invoice</DialogTitle>
            <DialogDescription>Send invoice {invoice?.invoiceNumber} to customer.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>To</Label>
              <Input
                placeholder="customer@example.com"
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CC (Optional)</Label>
              <Input
                placeholder="accounting@example.com"
                value={emailForm.cc}
                onChange={(e) => setEmailForm({ ...emailForm, cc: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <Textarea
                placeholder="Add a personal note..."
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)} disabled={isEmailing}>Cancel</Button>
            <Button onClick={handleEmailSubmit} disabled={isEmailing}>
              {isEmailing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
