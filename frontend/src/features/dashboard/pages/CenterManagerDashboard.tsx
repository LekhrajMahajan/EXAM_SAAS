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
    badgeColor: 'bg-[#E4FD97] text-[#2D3E2C]',
    border: 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
    numColor: 'text-slate-900 dark:text-slate-100',
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
            Welcome back, Center Manager!
          </h1>
          <p className="text-sm text-[#E4FD97]/90 font-medium max-w-xl">
            Role: <span className="font-extrabold underline text-white">Center Manager</span> | Overseeing assigned exam sessions, staff readiness & classroom laboratory infrastructure.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          <Button 
            variant="outline" 
            className="text-white border-[#E4FD97]/30 hover:bg-[#E4FD97] hover:text-[#2D3E2C] hover:border-[#E4FD97] transition-all duration-300 shadow-[0_0_15px_rgba(228,253,151,0)] hover:shadow-[0_0_15px_rgba(228,253,151,0.4)] hover:-translate-y-0.5 font-semibold tracking-wide bg-white/5" 
            onClick={() => navigate('/dashboard/center-manager/profile')}
          >
            View Profile
          </Button>
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
            <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
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
                    className="flex-1 min-w-[180px] sm:flex-none justify-start transition-all font-bold bg-background text-primary border-primary hover:bg-primary hover:text-primary-foreground shadow-sm py-2.5 h-auto text-xs"
                  >
                    <ActionIcon className="mr-2.5 h-4 w-4 shrink-0" />
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
            className={`border ${stat.border} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-card`}
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 truncate">
                  {stat.title}
                </p>
                <h3 className={`text-2xl font-bold mb-1 ${stat.numColor}`}>
                  {stat.value}
                </h3>
                {stat.change && (
                  <p className="text-[11px] font-medium text-slate-400">
                    {stat.change}
                  </p>
                )}
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.badgeColor}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* RECENT ACTIVITIES & SYSTEM NOTIFICATIONS */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Activities */}
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between bg-white dark:bg-slate-900/90">
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
            <Button
              variant='outline'
              className='w-full border-primary/20 hover:bg-primary/5 text-primary'
              onClick={() => navigate('/dashboard/center-manager/audit-logs')}
            >
              View Full Audit Logs <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CenterManagerDashboard;
