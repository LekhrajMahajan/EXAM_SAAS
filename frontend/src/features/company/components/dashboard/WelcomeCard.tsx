import { useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

interface WelcomeCardProps {
  companyName: string;
  adminName: string;
}

export const WelcomeCard = ({ companyName, adminName }: WelcomeCardProps) => {
  const { currentDate, lastLoginDate } = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });

    const loginFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    const lastLogin = new Date(now.getTime() - 86400000);
    return {
      currentDate: formatter.format(now),
      lastLoginDate: loginFormatter.format(lastLogin)
    };
  }, []);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#2D3E2C] p-6 rounded-xl border border-[#2D3E2C] shadow-sm mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#E4FD97] mb-1">
          Welcome back, {adminName || "Admin"}! 👋
        </h1>
        <p className="text-[#E4FD97]/80 font-medium text-sm sm:text-base">
          Organization: <span className="text-[#E4FD97] font-semibold">{companyName || "Your Company"}</span>
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-[#E4FD97]/80 w-full md:w-auto justify-between md:justify-end">
        <div className="text-left md:text-right hidden sm:block">
          <p className="font-medium text-[#E4FD97]">{currentDate}</p>
          <p className="mt-0.5 text-xs">Last login: {lastLoginDate}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161E2E] text-[#2D3E2C] dark:text-[#E2E8F0] hover:bg-[#2D3E2C] hover:text-[#E4FD97] hover:border-[#E4FD97] dark:hover:bg-[#2D3E2C] dark:hover:text-[#E4FD97] dark:hover:border-[#E4FD97] transition-all duration-200 w-full sm:w-auto text-xs sm:text-sm font-semibold shadow-sm" asChild>
            <Link to="/company/settings">View Profile</Link>
          </Button>
          <Button variant="outline" className="border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161E2E] text-[#2D3E2C] dark:text-[#E2E8F0] hover:bg-[#2D3E2C] hover:text-[#E4FD97] hover:border-[#E4FD97] dark:hover:bg-[#2D3E2C] dark:hover:text-[#E4FD97] dark:hover:border-[#E4FD97] transition-all duration-200 w-full sm:w-auto text-xs sm:text-sm font-semibold shadow-sm" asChild>
            <Link to="/company/exams/create">Create Exam</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

