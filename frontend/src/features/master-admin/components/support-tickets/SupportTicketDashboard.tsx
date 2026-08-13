import React from "react";
import { Card } from "@/shared/components/ui/card";
import { useSupportTicketStats } from "../../hooks/support-ticket.hooks";
import { MasterAdminStatCard } from "../cards/MasterAdminStatCard";
import { Ticket, Clock, AlertCircle, Timer } from "lucide-react";

export const SupportTicketDashboard = () => {
  const { data, isLoading } = useSupportTicketStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse h-[104px]" />
        ))}
      </div>
    );
  }

  const stats = data?.data || { open: 0, inProgress: 0, highPriority: 0, avgResolutionTime: "0h" };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <MasterAdminStatCard
        title="Open Tickets"
        value={stats.open || 0}
        icon={Ticket}
        accent="amber"
      />
      <MasterAdminStatCard
        title="In Progress"
        value={stats.inProgress || 0}
        icon={Clock}
        accent="slate"
      />
      <MasterAdminStatCard
        title="High Priority"
        value={stats.highPriority || 0}
        icon={AlertCircle}
        accent="red"
      />
      <MasterAdminStatCard
        title="Avg Response Time"
        value={stats.avgResolutionTime || "0h"}
        icon={Timer}
        accent="slate"
      />
    </div>
  );
};
