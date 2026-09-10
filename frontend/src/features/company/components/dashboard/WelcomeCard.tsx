import { useMemo } from "react";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

interface WelcomeCardProps {
  companyName: string;
  adminName: string;
  lastLoginAt?: string | Date;
}

export const WelcomeCard = ({ companyName, adminName, lastLoginAt, previousLoginAt }: WelcomeCardProps & { previousLoginAt?: string | Date }) => {
  const { currentDate, lastLoginDate } = useMemo(() => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });

    const loginFormatter = new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    });

    // Prefer previousLoginAt if available, else lastLoginAt
    const userLastLogin = previousLoginAt || lastLoginAt;
    let lastLogin = "Just now";
    
    if (userLastLogin) {
      const loginDate = new Date(userLastLogin);
      if (Math.abs(now.getTime() - loginDate.getTime()) > 60000) {
        lastLogin = loginFormatter.format(loginDate);
      }
    }
    
    return {
      currentDate: formatter.format(now),
      lastLoginDate: lastLogin
    };
  }, [lastLoginAt, previousLoginAt]);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#2D3E2C] p-6 rounded-xl border border-[#2D3E2C] shadow-sm mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-secondary mb-1">
          Welcome back, {adminName || "Admin"}!
        </h1>
        <p className="text-secondary/80 font-medium text-sm sm:text-base">
          Organization: <span className="text-secondary font-semibold">{companyName || "Your Company"}</span>
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-secondary/80 w-full md:w-auto justify-between md:justify-end">
        <div className="text-left md:text-right hidden sm:block">
          <p className="font-medium text-secondary">{currentDate}</p>
          <p className="mt-0.5 text-xs">Last login: {lastLoginDate}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto text-xs sm:text-sm font-semibold bg-white/5 text-white border border-[#E4FD97]/30 shadow-none hover:bg-[#E4FD97] hover:text-[#2D3E2C] hover:border-[#E4FD97] hover:shadow-[0_0_15px_rgba(228,253,151,0.4)] hover:-translate-y-0.5 transition-all duration-300" asChild>
            <Link to="/company/profile">View Profile</Link>
          </Button>

        </div>
      </div>
    </div>
  );
};

