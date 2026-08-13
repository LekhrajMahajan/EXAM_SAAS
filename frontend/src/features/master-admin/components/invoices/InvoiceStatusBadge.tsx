import React from "react";
import { InvoiceStatus, PaymentStatus } from "../../types/invoice.types";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus | PaymentStatus;
  type?: "invoice" | "payment";
}

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({ status }) => {
  let bgColor = "bg-slate-100";
  let textColor = "text-slate-700";

  switch (status) {
    case InvoiceStatus.PAID:
    case PaymentStatus.PAID:
      bgColor = "bg-[#E4FD97]";
      textColor = "text-[#2D3E2C]";
      break;
    case InvoiceStatus.UNPAID:
    case PaymentStatus.PENDING:
      bgColor = "bg-amber-100";
      textColor = "text-amber-700";
      break;
    case InvoiceStatus.OVERDUE:
    case PaymentStatus.FAILED:
    case InvoiceStatus.CANCELLED:
    case PaymentStatus.REFUNDED:
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      break;
    case InvoiceStatus.SENT:
    case InvoiceStatus.DRAFT:
      bgColor = "bg-[#2D3E2C]/10 dark:bg-[#E4FD97]/10";
      textColor = "text-[#2D3E2C] dark:text-[#E4FD97]";
      break;
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};
