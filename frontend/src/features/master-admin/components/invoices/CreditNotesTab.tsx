import React, { useState, useMemo } from "react";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import type { TableColumn } from "@/shared/types";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import type { Invoice } from "../../types/invoice.types";
import { useCreditNotes, useUpdateInvoiceStatus } from "../../hooks/invoice.hooks";
import { InvoiceStatus } from "../../types/invoice.types";
import { Button } from "@/shared/components/ui/button";
import { FileText, Printer, Ban, Plus } from "lucide-react";
import { invoiceApi } from "../../api/invoice.api";
import { toast } from "react-hot-toast";
import { CreditNoteDialog } from "./CreditNoteDialog";

interface CreditNotesTabProps {
  invoice: Invoice;
}

export const CreditNotesTab: React.FC<CreditNotesTabProps> = ({ invoice }) => {
  const { data: creditNotes, isLoading } = useCreditNotes(invoice._id);
  const { mutate: updateStatus } = useUpdateInvoiceStatus();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableBalance = useMemo(() => {
    if (!creditNotes) return invoice.grandTotal;
    const totalCredited = creditNotes
      .filter((cn: Invoice) => cn.status !== InvoiceStatus.CANCELLED)
      .reduce((sum: number, cn: Invoice) => sum + cn.grandTotal, 0);
    return Math.max(0, invoice.grandTotal - totalCredited);
  }, [invoice.grandTotal, creditNotes]);

  const handleDownload = async (id: string, cnNumber: string) => {
    try {
      const response = await invoiceApi.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CreditNote-${cnNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (_error) {
      toast.error("Failed to download credit note");
    }
  };

  const handlePrint = async (id: string) => {
    try {
      const response = await invoiceApi.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart], { type: "application/pdf" }));
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (_error) {
      toast.error("Failed to print credit note");
    }
  };

  const handleCancel = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this credit note? This action cannot be undone.")) {
      updateStatus({
        id,
        payload: { status: InvoiceStatus.CANCELLED },
      });
    }
  };

  const columns: TableColumn<Invoice>[] = [
    {
      id: "cnNumber",
      header: "Credit Note Number",
      accessorKey: "invoiceNumber",
      cell: ({ row }) => <span className="font-medium text-slate-700">{row.invoiceNumber}</span>,
    },
    {
      id: "amount",
      header: "Amount",
      accessorKey: "grandTotal",
      cell: ({ row }) => <span className="font-medium text-emerald-600">${row.grandTotal.toFixed(2)}</span>,
    },
    {
      id: "reason",
      header: "Reason / Remarks",
      cell: ({ row }) => <span className="text-sm text-slate-600 truncate max-w-[200px] block" title={row.notes}>{row.notes || "N/A"}</span>,
    },
    {
      id: "issueDate",
      header: "Effective Date",
      cell: ({ row }) => new Date(row.issueDate).toLocaleDateString(),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <InvoiceStatusBadge status={row.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleDownload(row._id, row.invoiceNumber)} title="Download PDF">
            <FileText className="w-4 h-4 text-blue-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handlePrint(row._id)} title="Print">
            <Printer className="w-4 h-4 text-slate-500" />
          </Button>
          {row.status !== InvoiceStatus.CANCELLED && (
            <Button variant="ghost" size="sm" onClick={() => handleCancel(row._id)} title="Cancel Credit Note">
              <Ban className="w-4 h-4 text-red-500" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Credit Notes</h3>
          <p className="text-sm text-slate-500">Manage credit notes issued against this invoice.</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right mr-4">
                <span className="text-sm text-slate-500 block">Available Balance</span>
                <span className="font-bold text-[#2D3E2C]">${availableBalance.toFixed(2)}</span>
            </div>
            <Button 
                onClick={() => setIsDialogOpen(true)}
                disabled={invoice.status === InvoiceStatus.CANCELLED || availableBalance <= 0}
            >
                <Plus className="w-4 h-4 mr-2" />
                Generate Credit Note
            </Button>
        </div>
      </div>

      <GenericDataTable
        columns={columns as any}
        data={creditNotes || []}
        keyExtractor={(item: any) => item._id}
      />

      <CreditNoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        invoice={invoice}
        availableBalance={availableBalance}
      />
    </div>
  );
};
