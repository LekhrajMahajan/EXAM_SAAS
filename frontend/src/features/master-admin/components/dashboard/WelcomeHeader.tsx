import { useUserStore } from "@/stores/user/user.store";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useMemo } from "react";

export const WelcomeHeader = () => {
  const profile = useUserStore((state) => state.profile);
  const { user } = useAuthStore();
  
  const getDisplayName = () => {
    const p = profile as any;
    if (p?.firstName || p?.lastName) return `${p.firstName || ''} ${p.lastName || ''}`.trim();
    if (p?.name && p.name !== 'undefined undefined') return p.name;
    
    const u = user as any;
    if (u?.firstName || u?.lastName) return `${u.firstName || ''} ${u.lastName || ''}`.trim();
    if (u?.name && u.name !== 'undefined undefined') return u.name;
    
    return "User";
  };
  
  const name = getDisplayName();
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
    
    let lastLoginStr = "Just now";
    // Prefer previousLoginAt if available, else lastLoginAt, else lastLogin
    const u = user as any;
    const userLastLogin = u?.previousLoginAt || u?.lastLoginAt || u?.lastLogin;
    if (userLastLogin) {
      const lastLogin = new Date(userLastLogin);
      // Only show it if it's not exactly the current time (within 1 minute)
      if (Math.abs(now.getTime() - lastLogin.getTime()) > 60000) {
        lastLoginStr = loginFormatter.format(lastLogin);
      }
    }
    
    return {
      currentDate: formatter.format(now).replace(' at ', ' at '),
      lastLoginDate: lastLoginStr
    };
  }, [user]);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#2D3E2C] p-6 rounded-xl border border-[#2D3E2C]">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-secondary">
          Welcome back, {name}!
        </h1>
        <p className="text-secondary/70 mt-2 font-medium">
          Role: <span className="text-secondary capitalize">{role.toLowerCase()}</span>
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-6">
        <div className="text-sm text-secondary/70 text-left sm:text-right">
          <p className="font-medium text-secondary">{currentDate}</p>
          <p className="mt-1">
            Last login: {lastLoginDate}
          </p>
        </div>
      </div>
    </div>
  );
};
