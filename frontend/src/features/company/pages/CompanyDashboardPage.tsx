import { Users, FileText, Clock, MapPin, Loader2, BookOpen } from "lucide-react";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import { StatCard } from "../components/dashboard/StatCard";
import { StatisticsGrid } from "../components/dashboard/StatisticsGrid";
import { RecentActivityCard } from "../components/dashboard/RecentActivityCard";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useUserStore } from "@/stores/user/user.store";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";

export const CompanyDashboardPage = () => {
  const { user } = useAuthStore();
  const profile = useUserStore((state) => state.profile);

  const { data: dashData, isLoading } = useQuery({
    queryKey: ['company-dashboard-overview'],
    queryFn: () => dashboardApi.getCompanyDashboardData(),
    staleTime: 30000,
  });
  
  if (profile && !profile.subscriptionPlan) {
    return <Navigate to="/company/subscription" replace />;
  }

  const statsList: Array<{
    title: string;
    value: string;
    icon: typeof MapPin;
    colorClass: string;
    accent: 'slate' | 'green' | 'amber' | 'red';
  }> = [
    { title: "Total Centers", value: String(dashData?.totalCenters ?? 0), icon: MapPin, colorClass: "text-indigo-500", accent: "slate" },
    { title: "Total Employees", value: String(dashData?.totalEmployees ?? 0), icon: Users, colorClass: "text-emerald-500", accent: "slate" },
    { title: "Total Candidates", value: String(dashData?.totalCandidates ?? 0), icon: Users, colorClass: "text-purple-500", accent: "slate" },
    { title: "Active Exams", value: String(dashData?.activeExams ?? 0), icon: FileText, colorClass: "text-orange-500", accent: "green" },
    { title: "Pending Approvals", value: String(dashData?.pendingApprovals ?? 0), icon: Clock, colorClass: "text-yellow-500", accent: "amber" },
  ];

  return (
    <div className="space-y-6 p-6">

      <WelcomeCard 
        companyName={String((profile as unknown as Record<string, unknown>)?.companyType || "Private Organization")} 
        adminName={((user as any)?.firstName ? `${(user as any).firstName} ${(user as any).lastName || ''}`.trim() : user?.name) || "Company Admin"}
        lastLoginAt={user?.lastLoginAt || profile?.lastLoginAt}
        previousLoginAt={(user as any)?.previousLoginAt}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48 border rounded-xl bg-slate-50 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-6">
          <StatisticsGrid>
            {statsList.map((stat) => (
              <StatCard 
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                colorClass={stat.colorClass}
                accent={stat.accent}
              />
            ))}
          </StatisticsGrid>
        </div>
      )}
      
    </div>
  );
};


