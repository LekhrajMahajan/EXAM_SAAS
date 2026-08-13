import React from 'react';
import { ShieldAlert, FileQuestion, ServerCrash } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function ErrorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {children}
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <ErrorLayout>
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200 border-t-4 border-t-amber-500">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-amber-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">403</h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Access Denied</h2>
        <p className="text-slate-500 mb-8">You do not have the required permissions to access this page. Please contact your administrator if you believe this is an error.</p>
        <Button className="w-full bg-slate-900 text-white hover:bg-slate-800">Return to Dashboard</Button>
      </div>
    </ErrorLayout>
  );
}

export function NotFoundPage() {
  return (
    <ErrorLayout>
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200 border-t-4 border-t-indigo-500">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-10 h-10 text-indigo-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-500 mb-8">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">Go to Homepage</Button>
      </div>
    </ErrorLayout>
  );
}

export function ServerErrorPage() {
  return (
    <ErrorLayout>
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-200 border-t-4 border-t-rose-500">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ServerCrash className="w-10 h-10 text-rose-500" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">500</h1>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Internal Server Error</h2>
        <p className="text-slate-500 mb-8">Oops, something went wrong on our end. Our technical team has been notified and is working to fix the issue.</p>
        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 bg-white">Reload Page</Button>
          <Button className="flex-1 bg-rose-600 text-white hover:bg-rose-700">Go Back</Button>
        </div>
      </div>
    </ErrorLayout>
  );
}
