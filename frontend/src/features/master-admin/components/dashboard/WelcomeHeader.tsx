import { useUserStore } from "@/stores/user/user.store";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useMemo } from "react";

export const WelcomeHeader = () => {
  const profile = useUserStore((state) => state.profile);
  const { user } = useAuthStore();
  
  const name = profile?.name || user?.name || "User";
  const role = profile?.roleId?.replace('_', ' ') || user?.role || "User";
  
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
      currentDate: formatter.format(now).replace(' at ', ' at '),
      lastLoginDate: loginFormatter.format(lastLogin)
    };
  }, []);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#2D3E2C] p-6 rounded-xl border border-[#2D3E2C]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary">
          Welcome back, {name}! 👋
        </h1>
        <p className="text-secondary/70 mt-2 font-medium">
          Role: <span className="text-secondary capitalize">{role.toLowerCase()}</span>
        </p>
      </div>
      <div className="text-sm text-secondary/70 text-left sm:text-right">
        <p className="font-medium text-secondary">{currentDate}</p>
        <p className="mt-1">
          Last login: {lastLoginDate}
        </p>
      </div>
    </div>
  );
};
