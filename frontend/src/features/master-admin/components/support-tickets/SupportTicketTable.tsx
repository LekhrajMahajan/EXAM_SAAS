import React from "react";
import { GenericDataTable } from "@/shared/components/datatable/GenericDataTable";
import type { TableColumn } from "@/shared/types";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, MessageSquare, CheckCircle } from "lucide-react";
import { useUpdateTicketStatus } from "../../hooks/support-ticket.hooks";

interface SupportTicketTableProps {
  tickets: any[];
  isLoading: boolean;
  onView: (id: string) => void;
}

export const SupportTicketTable = ({ tickets, isLoading, onView }: SupportTicketTableProps) => {
  const updateStatus = useUpdateTicketStatus();

  const columns: TableColumn<any>[] = [
    { id: "ticketId", header: "Ticket ID", accessorKey: "ticketId" },
    { 
      id: "subject", 
      header: "Subject", 
      accessorKey: "subject",
      cell: ({ row }) => <span className="font-medium text-slate-900">{row.subject}</span>
    },
    { 
      id: "companyName", 
      header: "Company", 
      cell: ({ row }) => row.companyId?.name || "System"
    },
    { 
      id: "priority", 
      header: "Priority", 
      cell: ({ row }) => (
        <Badge variant="outline" className={
          row.priority === 'HIGH' || row.priority === 'CRITICAL' ? 'border-red-200 text-red-700 bg-red-50' :
          row.priority === 'MEDIUM' ? 'border-orange-200 text-orange-700 bg-orange-50' :
          'border-blue-200 text-blue-700 bg-blue-50'
        }>
          {row.priority}
        </Badge>
      )
    },
    { 
      id: "status", 
      header: "Status", 
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          row.status === 'OPEN' ? 'bg-yellow-100 text-yellow-700' : 
          row.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 
          row.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {row.status.replace('_', ' ')}
        </span>
      )
    },
    { 
      id: "createdAt", 
      header: "Created At", 
      cell: ({ row }) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" title="View Ticket" onClick={() => onView(row._id)}>
            <Eye className="w-4 h-4 text-slate-500" />
          </Button>
          {row.status !== "RESOLVED" && row.status !== "CLOSED" && (
            <Button 
              variant="ghost" 
              size="icon" 
              title="Mark as Resolved"
              onClick={() => updateStatus.mutate({ id: row._id, status: "RESOLVED" })}
              disabled={updateStatus.isPending}
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
            </Button>
          )}
        </div>
      )
    }
  ];

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading tickets...</div>;
  }

  return (
    <GenericDataTable
      columns={columns}
      data={tickets}
      keyExtractor={(item) => item._id}
    />
  );
};
