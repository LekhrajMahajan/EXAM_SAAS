import { Skeleton } from "@/shared/components/ui/skeleton";
import { MasterAdminStatCard as StatCard } from "../cards/MasterAdminStatCard";
import { 
  Building2, 
  CheckCircle, 
  Clock, 
  IndianRupee, 
  Users, 
  Ticket, 
  ShieldAlert,
  CreditCard,
  Ban,
  BarChart,
  ShieldCheck,
  Lock
} from "lucide-react";
import { useDashboardOverview } from "../../hooks/dashboard.hooks";

export const DashboardStatsCards = () => {
  const { data: overview, isLoading, isError } = useDashboardOverview();

  const STATS = [
    { 
      title: "Total Companies", 
      value: overview?.data?.companies || 0, 
      icon: Building2, 
      color: "slate" 
    },
    { 
      title: "Active Companies", 
      value: overview?.data?.activeCompanies || 0, 
      icon: CheckCircle, 
      color: "green" 
    },
    { 
      title: "Pending Approvals", 
      value: overview?.data?.pendingCompanies || 0, 
      icon: Clock, 
      color: "amber" 
    },
    { 
      title: "Suspended Companies", 
      value: overview?.data?.suspendedCompanies || 0, 
      icon: ShieldAlert, 
      color: "red" 
    },
    { 
      title: "Active Subscriptions", 
      value: overview?.data?.activeSubscriptions || 0, 
      icon: CreditCard, 
      color: "lime" 
    },
    { 
      title: "Expired Subscriptions", 
      value: overview?.data?.expiredSubscriptions || 0, 
      icon: Ban, 
      color: "red" 
    },
    { 
      title: "Today's Revenue", 
      value: overview?.data?.todaysRevenue || 0, 
      prefix: "₹",
      icon: IndianRupee, 
      color: "green" 
    },
    { 
      title: "Monthly Revenue", 
      value: overview?.data?.monthlyRevenue || 0, 
      prefix: "₹",
      icon: BarChart, 
      color: "green" 
    },
    { 
      title: "System Users", 
      value: overview?.data?.totalUsers || 0, 
      icon: Users, 
      color: "slate" 
    },
    { 
      title: "Roles", 
      value: overview?.data?.totalRoles || 0, 
      icon: ShieldCheck, 
      color: "slate" 
    },
    { 
      title: "Permissions", 
      value: overview?.data?.totalPermissions || 0, 
      icon: Lock, 
      color: "slate" 
    },
    { 
      title: "Open Tickets", 
      value: overview?.data?.openSupportTickets || 0, 
      icon: Ticket, 
      color: "amber" 
    },
  ];

  if (isError) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
        Failed to load dashboard statistics.
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {STATS.map((stat, i) => (
        <StatCard
          key={`${stat.title}-${i}`}
          title={stat.title}
          value={isLoading ? <Skeleton className="h-7 w-16" /> : stat.value}
          prefix={stat.prefix}
          icon={stat.icon}
          accent={stat.color as any}
        />
      ))}
    </div>
  );
};
