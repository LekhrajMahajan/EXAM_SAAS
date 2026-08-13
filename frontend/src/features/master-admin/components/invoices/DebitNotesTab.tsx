import React, { useState, useMemo } from "react";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import type { TableColumn } from "@/shared/types";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import type { Invoice } from "../../types/invoice.types";
import { useDebitNotes, useCreditNotes, useUpdateInvoiceStatus } from "../../hooks/invoice.hooks";
import { InvoiceStatus } from "../../types/invoice.types";
import { Button } from "@/shared/components/ui/button";
import { FileText, Printer, Ban, Plus } from "lucide-react";
import { invoiceApi } from "../../api/invoice.api";
import { toast } from "react-hot-toast";
import { DebitNoteDialog } from "./DebitNoteDialog";

interface DebitNotesTabProps {
  invoice: Invoice;
}

export const DebitNotesTab: React.FC<DebitNotesTabProps> = ({ invoice }) => {
  const { data: debitNotes } = useDebitNotes(invoice._id);
  const { data: creditNotes } = useCreditNotes(invoice._id);
  const { mutate: updateStatus } = useUpdateInvoiceStatus();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableCredit = useMemo(() => {
    if (!creditNotes) return invoice.grandTotal;
    const totalCredited = creditNotes
      .filter((cn: Invoice) => cn.status !== InvoiceStatus.CANCELLED)
      .reduce((sum: number, cn: Invoice) => sum + cn.grandTotal, 0);
    return Math.max(0, invoice.grandTotal - totalCredited);
  }, [invoice.grandTotal, creditNotes]);

  const handleDownload = async (id: string, dnNumber: string) => {
    try {
      const response = await invoiceApi.downloadPdf(id);
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `DebitNote-${dnNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (_error) {
      toast.error("Failed to download debit note");
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
      toast.error("Failed to print debit note");
    }
  };

  const handleCancel = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this debit note? This action cannot be undone.")) {
      updateStatus({
        id,
        payload: { status: InvoiceStatus.CANCELLED },
      });
    }
  };

  const columns: TableColumn<Invoice>[] = [
    {
      id: "dnNumber",
      header: "Debit Note Number",
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
            <Button variant="ghost" size="sm" onClick={() => handleCancel(row._id)} title="Cancel Debit Note">
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
          <h3 className="text-lg font-bold text-slate-800">Debit Notes</h3>
          <p className="text-sm text-slate-500">Manage debit notes issued against this invoice.</p>
        </div>
        <div className="flex items-center gap-4">
            <Button 
                onClick={() => setIsDialogOpen(true)}
                disabled={invoice.status === InvoiceStatus.CANCELLED}
            >
                <Plus className="w-4 h-4 mr-2" />
                Generate Debit Note
            </Button>
        </div>
      </div>

      <GenericDataTable
        columns={columns as any}
        data={debitNotes || []}
        keyExtractor={(item: any) => item._id}
      />

      <DebitNoteDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        invoice={invoice}
        availableCredit={availableCredit}
      />
    </div>
  );
};
