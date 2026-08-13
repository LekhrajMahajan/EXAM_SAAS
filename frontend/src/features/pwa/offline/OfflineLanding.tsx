import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export const OfflineLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
        <WifiOff className="w-10 h-10 text-slate-500" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">No Internet Connection</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        It looks like you are offline. Please check your network connection and try again. 
        If you are in an active exam, your progress is safely saved locally.
      </p>
      <Button 
        variant="default" 
        onClick={() => window.location.reload()}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Connection
      </Button>
    </div>
  );
};
