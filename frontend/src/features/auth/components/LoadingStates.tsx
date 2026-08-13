import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const AuthLoadingState: React.FC<LoadingStateProps> = ({ message = 'Authenticating...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-600 font-medium">{message}</p>
      </div>
    </div>
  );
};
