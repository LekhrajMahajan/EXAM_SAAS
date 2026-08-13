import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useRoleDashboard } from '../hooks/dashboard.hooks';
import { centerApi } from '@/features/company/center/api/center.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import {
  Building2,
  Users,
  Monitor,
  Award,
  ShieldCheck,
  CalendarCheck,
  CheckCircle,
  Smartphone,
  DoorOpen,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Activity,
  Bell,
  CheckCircle2,
  Info,
  Clock,
  Upload,
  UserPlus,
  CheckSquare,
} from 'lucide-react';

export function CenterManagerDashboard() {
  const navigate = useNavigate();
  const { data, isLoading } = useRoleDashboard();
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);

  useEffect(() => {
    const fetchOnboarding = async () => {
      try {
        const res = await centerApi.getOnboardingStatus();
        setOnboardingData(res.data);
      } catch (err) {
        console.error("Failed to fetch onboarding status", err);
      } finally {
        setIsOnboardingLoading(false);
      }
    };
    fetchOnboarding();
  }, []);

  const stats = data?.stats || [];
  const quickActions = data?.quickActions || [];
  const activities = data?.activities || [];
  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const lastLoginDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1); // Mock last login as 1 day ago for visual consistency
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'DoorOpen': return DoorOpen;
      case 'Users': return Users;
      case 'Monitor': return Monitor;
      case 'Calendar': return CalendarCheck;
      case 'Upload': return Upload;
      case 'UserPlus': return UserPlus;
      case 'CheckSquare': return CheckSquare;
      case 'Building2': return Building2;
      case 'Clock': return Clock;
      default: return Activity;
    }
  };

  const statsCards = stats.map((stat: any) => ({
    title: stat.label,
    value: stat.value,
    icon: getIconComponent(stat.iconName),
    badgeColor: stat.colorScheme === 'indigo' 
      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
      : stat.colorScheme === 'emerald'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
      : stat.colorScheme === 'sky'
      ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    border: 'border-slate-200 dark:border-slate-800',
    numColor: 'text-slate-900 dark:text-white',
    change: stat.change,
  }));

  if (isOnboardingLoading) {
    return <div className="flex h-screen items-center justify-center">Loading your workspace...</div>;
  }

  // If the center is not fully active or data failed to load, redirect to the onboarding wizard
  if (!onboardingData || onboardingData.setupStatus !== 'ACTIVE') {
    return <Navigate to="/center/onboarding-wizard" replace />;
  }

  const hasAnyData = activities.length > 0 || notifications.length > 0;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-slate-50 dark:bg-slate-950 animate-in fade-in duration-300">
      {/* HEADER BANNER (Master Admin Style - Olive #2D3E2C & Light Green #E4FD97) */}
      <div className="bg-[#2D3E2C] text-[#E4FD97] rounded-2xl p-6 shadow-xl border border-[#E4FD97]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            Welcome back, Center Manager! 👋
          </h1>
          <p className="text-sm text-[#E4FD97]/90 font-medium max-w-xl">
            Role: <span className="font-extrabold underline text-white">Center Manager</span> | Overseeing assigned exam sessions, staff readiness & classroom laboratory infrastructure.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          <div className="text-left md:text-right shrink-0 bg-slate-900/40 md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-700/50 md:border-0">
            <p className="text-sm font-extrabold text-white">
              {currentDate}
            </p>
            <p className="text-xs text-[#E4FD97]/80 font-mono mt-0.5">
              Last login: {lastLoginDate}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS WIDGET */}
      {quickActions.length > 0 && (
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-[#2D3E2C] dark:text-[#E4FD97] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2D3E2C] dark:text-[#E4FD97]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action: any) => {
                const ActionIcon = getIconComponent(action.iconName);
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    onClick={() => navigate(action.path)}
                    className="flex-1 min-w-[180px] sm:flex-none justify-start transition-all font-bold border-slate-300 dark:border-slate-700 text-[#2D3E2C] dark:text-slate-200 hover:bg-[#2D3E2C] hover:text-[#E4FD97] dark:hover:bg-[#E4FD97] dark:hover:text-[#2D3E2C] shadow-sm py-2.5 h-auto text-xs"
                  >
                    <ActionIcon className="mr-2.5 h-4 w-4 shrink-0 text-[#E4FD97]" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* DYNAMIC STATS CARDS GRID */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        {statsCards.map((stat: any, i: number) => (
          <Card
            key={i}
            className={`border ${stat.border} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white dark:bg-slate-900/90`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 line-clamp-1">
                    {stat.title}
                  </p>
                  <div className={`text-2xl font-black mt-1.5 ${stat.numColor}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">{stat.change}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${stat.badgeColor} shrink-0 shadow-sm`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITIES & SYSTEM NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between bg-white dark:bg-slate-900/90">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 py-4 px-5 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2D3E2C] dark:text-[#E4FD97]" />
              Recent Center Operations & Logs
            </CardTitle>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
              Live Sync
            </span>
          </CardHeader>

          <CardContent className="p-5 divide-y divide-slate-100 dark:divide-slate-800/80 space-y-4">
            {!hasAnyData ? (
              <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
                <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-full text-slate-400">
                  <Info className="w-6 h-6 text-[#E4FD97]" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Center Activity Recorded Yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  Operational logs and live audit entries will automatically populate here as soon as you register exam staff members, verify biometric entry, or when an exam session starts.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity: any, idx: number) => {
                  const ActIcon = getIconComponent(activity.iconName);
                  return (
                    <div key={idx} className="flex items-start gap-4 pt-1">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                        <ActIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-medium">
                          {activity.description}
                        </p>
                        <span className="text-[10px] font-bold text-slate-400 mt-1 block">{activity.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center rounded-b-lg">
            <button 
              onClick={() => navigate('/company/audit')}
              className="text-xs font-black text-[#2D3E2C] dark:text-[#E4FD97] hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              View Full Audit Logs <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>

        {/* System Notifications */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between bg-white dark:bg-slate-900/90">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 py-4 px-5">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              Live Notifications ({unreadCount > 0 ? `${unreadCount} Alerts` : '0 Alerts'})
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {notifications.length === 0 && (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                    System All Clear
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    No pending alerts or compliance actions required at this moment.
                  </p>
                </div>
              </div>
            )}

            {notifications.map((notif: any, idx: number) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${notif.priority === 'high' ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'}`}>
                {notif.priority === 'high' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
                ) : (
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`text-xs font-black uppercase tracking-wide ${notif.priority === 'high' ? 'text-amber-900 dark:text-amber-200' : 'text-slate-800 dark:text-slate-200'}`}>
                    {notif.title}
                  </h4>
                  <p className={`text-xs mt-1 leading-relaxed font-medium ${notif.priority === 'high' ? 'text-amber-800 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400'}`}>
                    {notif.message}
                  </p>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 block">{notif.timestamp}</span>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-center rounded-b-lg">
            <button 
              onClick={() => navigate('/company/notifications')}
              className="text-xs font-black text-[#2D3E2C] dark:text-[#E4FD97] hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              View All Notifications <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CenterManagerDashboard;
