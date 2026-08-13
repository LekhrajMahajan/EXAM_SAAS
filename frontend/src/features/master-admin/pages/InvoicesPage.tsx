import { useState } from "react";
import { MasterAdminStatCard as StatCard } from '../components/cards/MasterAdminStatCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import { GenericPagination } from "@/shared/components/pagination/GenericPagination";
import type { TableColumn } from "@/shared/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useNavigate, Link } from "react-router-dom";
import { useInvoices, useInvoiceStats } from "../hooks/invoice.hooks";
import { Button } from "@/shared/components/ui/button";
import { BarChart2, Eye, Download, Printer, Mail, IndianRupee, CheckCircle, Clock, FileText } from "lucide-react";
import { InvoiceFilters } from "../components/invoices/InvoiceFilters";
import { InvoiceStatusBadge } from "../components/invoices/InvoiceStatusBadge";
import type { Invoice } from "../types/invoice.types";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { invoiceApi } from "../api/invoice.api";
import { toast } from "react-hot-toast";

const ActionsCell = ({ invoice }: { invoice: Invoice }) => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await invoiceApi.downloadPdf(invoice._id);
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (_error) {
      toast.error("Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
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

  const handleEmail = async () => {
    const emailTo = invoice.companyId?.email;
    if (!emailTo) {
      toast.error("Company email not found");
      return;
    }
    
    try {
      setIsEmailing(true);
      await invoiceApi.resendEmail(invoice._id, { 
        to: emailTo,
        message: "Please find your attached invoice for the subscription."
      });
      toast.success(`Invoice emailed successfully to ${emailTo}`);
    } catch (_error) {
      toast.error("Failed to email invoice");
    } finally {
      setIsEmailing(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(`/master-admin/invoices/${invoice._id}`)}
        className="h-8 px-2 text-[#2D3E2C] hover:text-[#2D3E2C] hover:bg-[#2D3E2C]/8 dark:text-foreground dark:hover:text-foreground"
        title="View Details"
      >
        <Eye className="w-4 h-4 mr-1 icon-bright" /> View
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleDownload}
        disabled={isDownloading}
        className="h-8 px-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-foreground dark:hover:text-foreground"
        title="Download PDF"
      >
        <Download className="w-4 h-4 mr-1 icon-bright" /> PDF
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handlePrint}
        disabled={isPrinting}
        className="h-8 px-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-foreground dark:hover:text-foreground"
        title="Print"
      >
        <Printer className="w-4 h-4 mr-1 icon-bright" /> Print
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleEmail}
        disabled={isEmailing}
        className="h-8 px-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 dark:text-foreground dark:hover:text-foreground"
        title="Email"
      >
        <Mail className="w-4 h-4 mr-1 icon-bright" /> {isEmailing ? "Sending..." : "Email"}
      </Button>
    </div>
  );
};

export const InvoicesPage = () => {
  const [filters, setFilters] = useState<Record<string, unknown>>({
    page: 1,
    limit: 10,
  });

  const { data } = useInvoices(filters);
  const { data: stats, isLoading: statsLoading } = useInvoiceStats();

  const invoices = data?.data || [];
  const pagination = data?.pagination;

  const columns: TableColumn<Invoice>[] = [
    { 
      id: "invoiceNumber", 
      header: "Invoice Number", 
      accessorKey: "invoiceNumber", 
      cell: ({ row }) => <span className="font-medium text-slate-700 dark:text-foreground">{row.invoiceNumber}</span>
    },
    { 
      id: "company", 
      header: "Company", 
      cell: ({ row }) => row.companyId?.companyName || "N/A"
    },
    {
      id: "subscription",
      header: "Subscription",
      cell: ({ row }) => (
        <div className="flex flex-col">
          {row.subscriptionId?.planId?.name && (
            <span className="text-sm text-slate-600 mb-0.5">{row.subscriptionId.planId.name}</span>
          )}
          <span className="text-sm font-medium text-slate-900">₹{(row.grandTotal || 0).toFixed(2)}</span>
        </div>
      )
    },
    { 
      id: "invoiceDate", 
      header: "Invoice Date", 
      cell: ({ row }) => new Date(row.issueDate).toLocaleDateString(),
    },
    { 
      id: "dueDate", 
      header: "Due Date", 
      cell: ({ row }) => new Date(row.dueDate).toLocaleDateString(),
    },
    { 
      id: "amount", 
      header: "Amount", 
      cell: ({ row }) => <span>₹{(row.subtotal || 0).toFixed(2)}</span>,
    },
    { 
      id: "tax", 
      header: "Tax", 
      cell: ({ row }) => <span>₹{(row.tax || 0).toFixed(2)}</span>
    },
    { 
      id: "status", 
      header: "Status", 
      cell: ({ row }) => <InvoiceStatusBadge status={row.status} />
    },
    {
      id: "createdDate",
      header: "Created Date",
      cell: ({ row }) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ActionsCell invoice={row} />
    }
  ];

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2D3E2C] dark:text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-2">
            Manage billing records, monitor revenue, and issue credit/debit notes.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/master-admin/invoices/dashboard">
            <Button variant="outline" className="flex items-center gap-2 border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-[#E4FD97] transition-colors qa-button">
              <BarChart2 className="w-4 h-4" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₹${(stats?.totalRevenue || 0).toFixed(2)}`}
            icon={IndianRupee}
            accent="lime"
          />
          <StatCard
            title="Paid Invoices"
            value={stats?.paidInvoices || 0}
            icon={CheckCircle}
            accent="green"
          />
          <StatCard
            title="Pending & Overdue"
            value={(stats?.pendingInvoices || 0) + (stats?.overdueInvoices || 0)}
            icon={Clock}
            accent="amber"
          />
          <StatCard
            title="Credit Notes"
            value={stats?.creditNotes || 0}
            icon={FileText}
            accent="slate"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Invoice Ledger</CardTitle>
          <CardDescription>A complete history of all generated invoices and notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceFilters filters={filters} onFilterChange={(newFilters) => setFilters({ ...newFilters, page: 1 })} />
          
          <GenericDataTable
            columns={columns}
            data={invoices}
            keyExtractor={(item) => item._id}
          />
          <div className="mt-4 flex justify-end">
            <GenericPagination
              pageIndex={(pagination?.page || 1) - 1}
              pageSize={pagination?.limit || 10}
              totalCount={pagination?.total || 0}
              onPageChange={(pageIndex) => handlePageChange(pageIndex + 1)}
              onPageSizeChange={(pageSize) => setFilters(prev => ({ ...prev, limit: pageSize, page: 1 }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
