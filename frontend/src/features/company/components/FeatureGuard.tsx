import React from 'react';
import { Outlet } from 'react-router-dom';
import { useUserStore } from '@/stores/user/user.store';

interface FeatureGuardProps {
  featureKey: string;
  fallback?: React.ReactNode;
  hideOnly?: boolean;
  children?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  featureKey,
  fallback,
  hideOnly = false,
  children,
}) => {
  const profile = useUserStore((state) => state.profile);

  // Master Admin always bypasses feature checks
  if (profile?.role === 'MASTER_ADMIN' || profile?.role === 'SUPER_ADMIN') {
    return <>{children || <Outlet />}</>;
  }

  const enabledFeatures: Record<string, unknown> = profile?.enabledFeatures || {};
  const isEnabled = enabledFeatures[featureKey] !== false && enabledFeatures[featureKey] !== undefined ? enabledFeatures[featureKey] : true;

  if (!isEnabled) {
    if (hideOnly) {
      return null;
    }
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center bg-slate-900/50 rounded-xl border border-amber-500/20 backdrop-blur-sm m-6">
        <div className="p-4 bg-amber-500/10 rounded-full mb-4 text-amber-400">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Feature Locked: {featureKey.replace(/([A-Z])/g, ' $1').trim()}</h3>
        <p className="text-slate-400 max-w-md mb-6 text-sm">
          This feature is not enabled on your current organization plan. Upgrade your subscription to gain immediate access to enterprise tools and workflows.
        </p>
        <a
          href="/company/subscription"
          className="px-5 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-amber-500/20 transition-all duration-200"
        >
          View Subscription Plans
        </a>
      </div>
    );
  }

  return <>{children || <Outlet />}</>;
};
