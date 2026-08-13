import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface FallbackUIProps {
  error: Error;
  resetErrorBoundary: () => void;
  type?: 'global' | 'route' | 'widget';
}

export const FallbackUI: React.FC<FallbackUIProps> = ({ error, resetErrorBoundary, type = 'widget' }) => {
  const isGlobal = type === 'global';

  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center ${isGlobal ? 'min-h-screen bg-slate-50' : 'h-full min-h-[200px] bg-white border border-red-100 rounded-lg'}`}>
      <div className={`rounded-full flex items-center justify-center mb-4 ${isGlobal ? 'w-20 h-20 bg-red-100' : 'w-12 h-12 bg-red-50'}`}>
        <AlertTriangle className={`${isGlobal ? 'w-10 h-10' : 'w-6 h-6'} text-red-600`} />
      </div>
      
      <h2 className={`font-bold text-slate-900 mb-2 ${isGlobal ? 'text-2xl' : 'text-lg'}`}>
        {isGlobal ? 'Application Error' : 'Component Error'}
      </h2>
      
      <p className="text-slate-600 mb-6 max-w-md text-sm">
        {error.message || 'An unexpected error occurred while rendering this view.'}
      </p>
      
      <Button 
        variant="default" 
        onClick={resetErrorBoundary}
        className="flex items-center gap-2"
      >
        <RefreshCcw className="w-4 h-4" />
        {isGlobal ? 'Reload Application' : 'Retry'}
      </Button>
    </div>
  );
};
