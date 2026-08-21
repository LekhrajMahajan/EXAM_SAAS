import { Building2, Users, FileText, Clock, MapPin, Sparkles, Activity, ShieldCheck, BarChart3, Loader2, BookOpen } from "lucide-react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { WelcomeCard } from "../components/dashboard/WelcomeCard";
import { StatCard } from "../components/dashboard/StatCard";
import { StatisticsGrid } from "../components/dashboard/StatisticsGrid";
import { RecentActivityCard } from "../components/dashboard/RecentActivityCard";
import { QuickActionCard } from "../components/dashboard/QuickActionCard";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useUserStore } from "@/stores/user/user.store";
import { Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";

const QUICK_ACTIONS = [
  { title: "Create Exam", icon: FileText, path: "/company/exams/create" },
  { title: "Invite Staff", icon: Users, path: "/company/staff/create" },
  { title: "Manage Centers", icon: MapPin, path: "/company/centers" },
  { title: "Question Bank", icon: BookOpen, path: "/company/question-bank" },
  { title: "View Reports", icon: BarChart3, path: "/company/reports" },
];

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

  const planCode = profile?.subscriptionPlan || "STARTER";

  const statsList: Array<{
    title: string;
    value: string;
    icon: typeof Building2;
    colorClass: string;
    accent: 'slate' | 'green' | 'amber' | 'red';
  }> = [
    { title: "Total Branches", value: String(dashData?.totalBranches ?? 0), icon: Building2, colorClass: "text-blue-500", accent: "slate" },
    { title: "Total Centers", value: String(dashData?.totalCenters ?? 0), icon: MapPin, colorClass: "text-indigo-500", accent: "slate" },
    { title: "Total Employees", value: String(dashData?.totalEmployees ?? 0), icon: Users, colorClass: "text-emerald-500", accent: "slate" },
    { title: "Total Candidates", value: String(dashData?.totalCandidates ?? 0), icon: Users, colorClass: "text-purple-500", accent: "slate" },
    { title: "Active Exams", value: String(dashData?.activeExams ?? 0), icon: FileText, colorClass: "text-orange-500", accent: "green" },
    { title: "Pending Approvals", value: String(dashData?.pendingApprovals ?? 0), icon: Clock, colorClass: "text-yellow-500", accent: "amber" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardHeader 
          title="Dashboard" 
          description={`Overview of your company's operations and performance under the ${planCode} Plan.`} 
        />
        <div className="flex items-center gap-3 bg-card text-card-foreground px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 w-fit">
          <div className="p-1.5 rounded-md bg-secondary text-[#2D3E2C] shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase block leading-tight">Active Subscription Tier</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase mt-0.5 block">{planCode} PLAN</span>
          </div>
        </div>
      </div>
      
      <WelcomeCard 
        companyName={String((profile as unknown as Record<string, unknown>)?.companyName || (user as unknown as Record<string, unknown>)?.companyName || (user?.name ? `${user.name}'s Organization` : "Your Organization"))} 
        adminName={user?.name || "Admin"} 
      />
      
      {/* Plan-Specific Widgets */}
      {planCode === "ENTERPRISE" && (
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none">
            <ShieldCheck className="h-40 w-40 text-[#2D3E2C] dark:text-secondary" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-secondary text-[#2D3E2C] shrink-0">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-lg md:text-xl font-bold tracking-tight text-[#2D3E2C] dark:text-white">Enterprise Live Command Center</h3>
              <span className="bg-[#2D3E2C] text-[#E4FD97] dark:bg-[#2D3E2C] dark:text-[#E4FD97] text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#2D3E2C] dark:border-[#2D3E2C]">
                AI Proctoring Active
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
              Real-time telemetry and biometric fraud detection are active across all examination centers. You have unlimited candidate concurrency and dedicated infrastructure priority.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link 
                to="/company/live-monitoring" 
                className="inline-flex items-center justify-start px-4 py-2 text-sm font-semibold rounded-md border transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary dark:border-[#334155] dark:text-[#E2E8F0] dark:hover:bg-[#2D3E2C] dark:hover:text-secondary gap-2 shadow-sm qa-button"
              >
                <Activity className="h-4 w-4" /> Open Real-time Monitoring
              </Link>
              <Link 
                to="/company/ai-proctoring" 
                className="inline-flex items-center justify-start px-4 py-2 text-sm font-semibold rounded-md border transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary dark:border-[#334155] dark:text-[#E2E8F0] dark:hover:bg-[#2D3E2C] dark:hover:text-secondary gap-2 shadow-sm qa-button"
              >
                <ShieldCheck className="h-4 w-4" /> View AI Fraud Audit Logs
              </Link>
            </div>
          </div>
        </div>
      )}

      {planCode === "PROFESSIONAL" && (
        <div className="bg-card text-card-foreground border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-secondary text-[#2D3E2C] shrink-0">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-bold text-[#2D3E2C] dark:text-white">Professional Multi-Center Analytics & Scheduling</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
                You have access to advanced custom report builders, multi-branch scheduling, and question banks.
              </p>
            </div>
            <Link 
              to="/company/reports" 
              className="inline-flex items-center justify-start px-4 py-2 text-sm font-semibold rounded-md border transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary dark:border-[#334155] dark:text-[#E2E8F0] dark:hover:bg-[#2D3E2C] dark:hover:text-secondary gap-2 shadow-sm qa-button w-fit shrink-0"
            >
              Generate Analytics Report
            </Link>
          </div>
        </div>
      )}

      {planCode === "STARTER" && (
        <div className="bg-card text-card-foreground border border-amber-200 dark:border-amber-500/40 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-md bg-secondary text-[#2D3E2C] shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-slate-700 dark:text-slate-300">
              You are currently on the <strong>Starter Plan</strong>. Upgrade to Professional or Enterprise to unlock AI Proctoring, Live Command Center, and unlimited custom branding.
            </span>
          </div>
          <Link 
            to="/company/subscription" 
            className="inline-flex items-center justify-start px-4 py-1.5 text-xs font-semibold rounded-md border transition-colors border-[#2D3E2C] text-[#2D3E2C] hover:bg-[#2D3E2C] hover:text-secondary dark:border-[#334155] dark:text-[#E2E8F0] dark:hover:bg-[#2D3E2C] dark:hover:text-secondary gap-2 shadow-sm qa-button shrink-0 text-center"
          >
            Upgrade Plan
          </Link>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center items-center h-48 border rounded-xl bg-slate-50 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
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
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard activities={dashData?.activities || []} />
        <QuickActionCard actions={QUICK_ACTIONS} />
      </div>
    </div>
  );
};


