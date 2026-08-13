import React from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineNotice: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4 text-amber-600" />
      <span className="text-sm font-medium text-amber-800">
        You are currently offline. Some features may be restricted.
      </span>
    </div>
  );
};
