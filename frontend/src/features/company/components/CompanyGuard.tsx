import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserStore } from '@/stores/user/user.store';

interface CompanyGuardProps {
  children?: React.ReactNode;
}

export const CompanyGuard: React.FC<CompanyGuardProps> = ({ children }) => {
  const profile = useUserStore((state) => state.profile);

  if (profile?.role === 'MASTER_ADMIN' || profile?.role === 'SUPER_ADMIN') {
    return <>{children || <Outlet />}</>;
  }

  const companyStatus = profile?.companyStatus;
  const isLocked = companyStatus === 'INACTIVE' || companyStatus === false || profile?.isDeleted;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] p-8 text-center bg-slate-950 text-white">
        <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-full mb-6 text-rose-500">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="inline-block px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider border border-rose-500/20">
          Error 423 - Company Locked
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Organization Account Suspended</h2>
        <p className="text-slate-400 max-w-lg mb-8 text-sm leading-relaxed">
          Your organization account is currently disabled or suspended due to security policy enforcement or pending regulatory verification. Access to enterprise workflows has been restricted.
        </p>
        <div className="flex gap-4">
          <a
            href="mailto:support@examguard.pro"
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  return <>{children || <Outlet />}</>;
};
