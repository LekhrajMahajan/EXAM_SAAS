import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserStore } from '@/stores/user/user.store';

interface SubscriptionGuardProps {
  children?: React.ReactNode;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const profile = useUserStore((state) => state.profile);

  if (profile?.role === 'MASTER_ADMIN' || profile?.role === 'SUPER_ADMIN') {
    return <>{children || <Outlet />}</>;
  }

  const paymentStatus = profile?.paymentStatus;
  const subscriptionEndDate = profile?.subscriptionEndDate;
  const isExpired = subscriptionEndDate && new Date(subscriptionEndDate) < new Date();

  if (paymentStatus === 'PENDING' || paymentStatus === 'FAILED' || isExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-slate-900/80 rounded-2xl border border-amber-500/20 shadow-2xl max-w-2xl mx-auto my-12">
        <div className="p-4 bg-amber-500/10 rounded-full mb-4 text-amber-400">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-xs uppercase tracking-widest font-bold px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20 mb-3">
          Subscription {isExpired ? 'Expired' : 'Payment Required'}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Active Subscription Required</h3>
        <p className="text-slate-300 max-w-md mb-6 text-sm leading-relaxed">
          {isExpired
            ? 'Your subscription cycle has ended. Please renew your enterprise license to continue utilizing platform capabilities and automated workflows.'
            : 'We were unable to process or verify your subscription payment. Please complete your billing information to unlock access.'}
        </p>
        <a
          href="/company/subscription"
          className="px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 transition duration-200 text-sm"
        >
          Manage Subscription & Billing
        </a>
      </div>
    );
  }

  return <>{children || <Outlet />}</>;
};

