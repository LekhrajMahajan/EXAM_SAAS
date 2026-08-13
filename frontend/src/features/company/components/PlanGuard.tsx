import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserStore } from '@/stores/user/user.store';

type PlanTier = 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';

const PLAN_LEVELS: Record<string, number> = {
  STARTER: 1,
  PROFESSIONAL: 2,
  ENTERPRISE: 3,
};

interface PlanGuardProps {
  minPlan: PlanTier;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

export const PlanGuard: React.FC<PlanGuardProps> = ({
  minPlan,
  fallback,
  children,
}) => {
  const profile = useUserStore((state) => state.profile);

  if (profile?.role === 'MASTER_ADMIN' || profile?.role === 'SUPER_ADMIN') {
    return <>{children || <Outlet />}</>;
  }

  const currentPlanCode = profile?.subscriptionPlan || 'ENTERPRISE'; // default assumptions if not set
  const currentLevel = PLAN_LEVELS[currentPlanCode.toUpperCase()] || 3;
  const requiredLevel = PLAN_LEVELS[minPlan.toUpperCase()] || 1;

  if (currentLevel < requiredLevel) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="flex flex-col items-center justify-center p-10 bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl shadow-xl max-w-2xl mx-auto my-12 text-center">
        <div className="p-4 bg-indigo-500/10 text-indigo-400 rounded-full mb-4 border border-indigo-500/20">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20 mb-3">
          {minPlan} Tier Required
        </span>
        <h3 className="text-2xl font-bold text-white mb-2">Upgrade Your Subscription Plan</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-md leading-relaxed">
          This advanced module requires the <strong className="text-indigo-300 font-semibold">{minPlan}</strong> tier or higher. You are currently subscribed to the <span className="text-slate-300 uppercase">{currentPlanCode}</span> plan.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <a
            href="/company/subscription"
            className="w-full py-3 bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm block"
          >
            Upgrade Now
          </a>
        </div>
      </div>
    );
  }

  return <>{children || <Outlet />}</>;
};
