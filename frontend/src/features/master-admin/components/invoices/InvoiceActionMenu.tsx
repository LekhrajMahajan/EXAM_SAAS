import React, { useState } from "react";
import { MoreVertical, Download, Send, CreditCard, Banknote, Ban } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import type { Invoice } from "../../types/invoice.types";
import { InvoiceStatus, InvoiceType } from "../../types/invoice.types";
import { CreditDebitNoteDialog } from "./CreditDebitNoteDialog";
import { useUpdateInvoiceStatus } from "../../hooks/invoice.hooks";
import { invoiceApi } from "../../api/invoice.api";

interface InvoiceActionMenuProps {
  invoice: Invoice;
}

export const InvoiceActionMenu: React.FC<InvoiceActionMenuProps> = ({ invoice }) => {
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [noteType, setNoteType] = useState<"credit" | "debit">("credit");
  
  const updateStatusMutation = useUpdateInvoiceStatus();

  const handleDownload = async () => {
    try {
      const response = await invoiceApi.downloadPdf(invoice._id);
      const url = window.URL.createObjectURL(new Blob([response.data as any]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Failed to download PDF", error);
    }
  };

  const handleResend = async () => {
    try {
      await invoiceApi.resendEmail(invoice._id);
    } catch (error) {
      console.error("Failed to resend email", error);
    }
  };

  const handleCancel = () => {
    updateStatusMutation.mutate({
      id: invoice._id,
      payload: { status: InvoiceStatus.CANCELLED }
    });
  };

  const handleMarkPaid = () => {
    updateStatusMutation.mutate({
      id: invoice._id,
      payload: { status: InvoiceStatus.PAID }
    });
  };

  const openNoteDialog = (type: "credit" | "debit") => {
    setNoteType(type);
    setNoteDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <MoreVertical className="w-4 h-4 text-slate-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download PDF</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleResend}>
            <Send className="mr-2 h-4 w-4" />
            <span>Resend Email</span>
          </DropdownMenuItem>
          
          {invoice.type === InvoiceType.INVOICE && invoice.status !== InvoiceStatus.CANCELLED && (
            <>
              <DropdownMenuSeparator />
              {invoice.status !== InvoiceStatus.PAID && (
                <DropdownMenuItem onClick={handleMarkPaid}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Mark as Paid</span>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={() => openNoteDialog("credit")}>
                <Banknote className="mr-2 h-4 w-4" />
                <span>Issue Credit Note</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openNoteDialog("debit")}>
                <Banknote className="mr-2 h-4 w-4" />
                <span>Issue Debit Note</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCancel} className="text-red-600 focus:text-red-600">
                <Ban className="mr-2 h-4 w-4" />
                <span>Cancel Invoice</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <CreditDebitNoteDialog
        isOpen={noteDialogOpen}
        onClose={() => setNoteDialogOpen(false)}
        invoice={invoice}
        type={noteType}
      />
    </>
  );
};
