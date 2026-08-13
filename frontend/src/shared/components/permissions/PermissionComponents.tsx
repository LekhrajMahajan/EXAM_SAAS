import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function UnauthorizedState({ onLogin }: { onLogin?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
        <ShieldAlert className="w-10 h-10 text-rose-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Authentication Required</h2>
      <p className="text-slate-500 max-w-md mb-8">You need to be logged in to access this resource. Please sign in to continue.</p>
      {onLogin && <Button onClick={onLogin} className="bg-indigo-600 text-white hover:bg-indigo-700">Go to Login</Button>}
    </div>
  );
}

export function ForbiddenState({ onBack }: { onBack?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
        <Lock className="w-10 h-10 text-amber-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Access Denied</h2>
      <p className="text-slate-500 max-w-md mb-8">You don't have the necessary permissions to view this content or perform this action.</p>
      {onBack && <Button variant="outline" onClick={onBack} className="bg-white">Return to Previous Page</Button>}
    </div>
  );
}

export function PermissionWrapper({ hasPermission, fallback, children }: { hasPermission: boolean, fallback?: React.ReactNode, children: React.ReactNode }) {
  if (hasPermission) return <>{children}</>;
  return fallback ? <>{fallback}</> : null;
}
