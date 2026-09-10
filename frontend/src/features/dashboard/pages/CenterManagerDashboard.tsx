import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useRoleDashboard } from '../hooks/dashboard.hooks';
import { centerApi } from '@/features/company/center/api/center.api';
import { apiClient } from '@/core/api/http/axios-client';
import { toast } from 'react-hot-toast';
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
  Sparkles,
  Activity,
  Bell,
  CheckCircle2,
  Clock,
  Upload,
  UserPlus,
  CheckSquare,
  BookOpen,
} from 'lucide-react';

export function CenterManagerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading } = useRoleDashboard();
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);

  const [upiId, setUpiId] = useState('');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'BANK'>('UPI');
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: ''
  });
  const [savedPaymentDetails, setSavedPaymentDetails] = useState<any>(null);
  const [isSavingUpi, setIsSavingUpi] = useState(false);

  useEffect(() => {
    const fetchOnboardingAndUpi = async () => {
      try {
        const [res, upiRes] = await Promise.all([
          centerApi.getOnboardingStatus(),
          apiClient.get('/centers/me').catch(() => null)
        ]);
        setOnboardingData(res.data);
        if (upiRes?.data?.data?.paymentDetails) {
          const pd = upiRes.data.data.paymentDetails;
          setPaymentMode(pd.mode || 'UPI');
          if (pd.upiId) setUpiId(pd.upiId);
          setBankDetails({
            accountNumber: pd.accountNumber || '',
            ifscCode: pd.ifscCode || '',
            bankName: pd.bankName || '',
            accountHolderName: pd.accountHolderName || ''
          });
          setSavedPaymentDetails(pd);
        } else if (upiRes?.data?.data?.upiId) {
          setUpiId(upiRes.data.data.upiId);
          setPaymentMode('UPI');
          setSavedPaymentDetails({ mode: 'UPI', upiId: upiRes.data.data.upiId });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setIsOnboardingLoading(false);
      }
    };
    fetchOnboardingAndUpi();
  }, []);

  const handleSavePaymentDetails = async () => {
    let payload: any = { mode: paymentMode };
    if (paymentMode === 'UPI') {
      if (!upiId.trim()) {
        toast.error("Please enter a UPI ID");
        return;
      }
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(upiId.trim())) {
        toast.error("Please enter a valid UPI ID (e.g. name@bank)");
        return;
      }
      payload.upiId = upiId.trim();
    } else {
      if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.bankName || !bankDetails.accountHolderName) {
        toast.error("Please fill all bank details");
        return;
      }
      payload = { ...payload, ...bankDetails };
    }

    try {
      setIsSavingUpi(true);
      await apiClient.patch('/centers/me/payment-details', { paymentDetails: payload });
      setSavedPaymentDetails(payload);
      toast.success("Payment details saved successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save payment details");
      console.error("Failed to save payment details", err);
    } finally {
      setIsSavingUpi(false);
    }
  };

  const stats: any[] = (data as any)?.stats || [];
  const quickActions: any[] = (data as any)?.quickActions || [];
  const activeExamsList: any[] = (data as any)?.activeExamsList || [];

  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const lastLoginDate = useMemo(() => {
    // Prefer previousLoginAt if available, else lastLoginAt
    const userLastLogin = (user as any)?.previousLoginAt || user?.lastLoginAt;
    let lastLogin = "Just now";
    
    if (userLastLogin) {
      const loginDate = new Date(userLastLogin);
      const now = new Date();
      if (Math.abs(now.getTime() - loginDate.getTime()) > 60000) {
        lastLogin = loginDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
    }
    return lastLogin;
  }, [user]);

  const userName = useMemo(() => {
    if ((user as any)?.firstName || (user as any)?.lastName) {
      return `${(user as any).firstName || ''} ${(user as any).lastName || ''}`.trim();
    }
    return user?.name || "Center Manager";
  }, [user]);

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

  const statsCards: any[] = stats.map((stat: any) => ({
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

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background animate-in fade-in duration-300">
      {/* HEADER BANNER (Master Admin Style - Olive #2D3E2C & Light Green #E4FD97) */}
      <div className="bg-[#2D3E2C] text-[#E4FD97] rounded-2xl p-6 shadow-xl border border-[#E4FD97]/20 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-4 w-full max-w-xl">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              Welcome back, {userName}!
            </h1>
            <p className="text-sm text-[#E4FD97]/90 font-medium max-w-xl">
              Role: <span className="font-extrabold underline text-white">Center Manager</span> | Overseeing assigned exam sessions, staff readiness & classroom laboratory infrastructure.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 max-w-lg mt-4 bg-white/10 p-4 rounded-lg border border-[#E4FD97]/20">
            {savedPaymentDetails ? (
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">
                  {savedPaymentDetails.mode === 'UPI' ? (
                    <p>UPI: {savedPaymentDetails.upiId}</p>
                  ) : (
                    <div>
                      <p>Bank: {savedPaymentDetails.bankName}</p>
                      <p className="text-xs text-[#E4FD97]">A/C: {savedPaymentDetails.accountNumber} ({savedPaymentDetails.ifscCode})</p>
                    </div>
                  )}
                </div>
                <Button 
                  size="sm" 
                  onClick={() => setSavedPaymentDetails(null)}
                  className="bg-transparent border border-[#E4FD97] text-[#E4FD97] hover:bg-[#E4FD97] hover:text-[#2D3E2C] font-bold h-8 shrink-0 ml-4"
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setPaymentMode('UPI')}
                    className={paymentMode === 'UPI' ? "bg-[#E4FD97] border-transparent text-[#2D3E2C] hover:bg-white font-bold" : "text-white border-white/30 bg-transparent hover:bg-white/10 hover:text-white font-medium"}
                  >UPI</Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setPaymentMode('BANK')}
                    className={paymentMode === 'BANK' ? "bg-[#E4FD97] border-transparent text-[#2D3E2C] hover:bg-white font-bold" : "text-white border-white/30 bg-transparent hover:bg-white/10 hover:text-white font-medium"}
                  >Bank Transfer</Button>
                </div>
                
                {paymentMode === 'UPI' ? (
                  <input 
                    type="text" 
                    placeholder="Enter Payment UPI ID (e.g. name@bank)" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full bg-black/20 border border-white/20 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#E4FD97] px-3 py-2"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="Account Holder Name" value={bankDetails.accountHolderName} onChange={e => setBankDetails({...bankDetails, accountHolderName: e.target.value})} className="bg-black/20 border border-white/20 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#E4FD97] px-3 py-2" />
                    <input type="text" placeholder="Bank Name" value={bankDetails.bankName} onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})} className="bg-black/20 border border-white/20 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#E4FD97] px-3 py-2" />
                    <input type="text" placeholder="Account Number" value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} className="bg-black/20 border border-white/20 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#E4FD97] px-3 py-2" />
                    <input type="text" placeholder="IFSC Code" value={bankDetails.ifscCode} onChange={e => setBankDetails({...bankDetails, ifscCode: e.target.value})} className="bg-black/20 border border-white/20 rounded text-white placeholder-white/50 text-sm focus:outline-none focus:border-[#E4FD97] px-3 py-2" />
                  </div>
                )}
                
                <div className="flex justify-end pt-2">
                  <Button 
                    size="sm" 
                    onClick={handleSavePaymentDetails}
                    disabled={isSavingUpi}
                    className="bg-[#E4FD97] text-[#2D3E2C] hover:bg-white font-bold"
                  >
                    {isSavingUpi ? 'Saving...' : 'Save Details'}
                  </Button>
                </div>
              </div>
            )}
          </div>
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
          <Button 
            variant="outline" 
            className="text-white border-[#E4FD97]/30 hover:bg-[#E4FD97] hover:text-[#2D3E2C] hover:border-[#E4FD97] transition-all duration-300 shadow-[0_0_15px_rgba(228,253,151,0)] hover:shadow-[0_0_15px_rgba(228,253,151,0.4)] hover:-translate-y-0.5 font-semibold tracking-wide bg-white/5" 
            onClick={() => navigate('/dashboard/center-manager/profile')}
          >
            View Profile
          </Button>
        </div>
      </div>

      {/* QUICK ACTIONS WIDGET */}
      {quickActions && Array.isArray(quickActions) && quickActions.length > 0 ? (
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
      ) : null}

      {/* DYNAMIC STATS CARDS GRID */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
        {statsCards && Array.isArray(statsCards) ? statsCards.map((stat: any, i: number) => (
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
        )) : null}
      </div>

      {/* ACTIVE EXAMS SECTION */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Active Exams</h2>
        {activeExamsList && Array.isArray(activeExamsList) && activeExamsList.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {activeExamsList.map((exam: any) => (
              <Card key={exam.id} className="border border-slate-200 dark:border-slate-800 bg-card hover:shadow-md transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded">
                      {exam.candidateCount} Candidates
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1 truncate" title={exam.examName}>
                    {exam.examName}
                  </h3>
                  <div className="space-y-1 mt-3">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <CalendarCheck className="w-3.5 h-3.5" />
                      {new Date(exam.examDate).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {exam.shiftName} ({exam.startTime} - {exam.endTime})
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/90">
            <CardContent className="p-10 text-center flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-full text-slate-400">
                <BookOpen className="w-6 h-6 text-[#E4FD97]" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Active Exams Currently</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                There are no active exams scheduled for your center at this moment. You will see assigned exams appear here when they are scheduled.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}

export default CenterManagerDashboard;
