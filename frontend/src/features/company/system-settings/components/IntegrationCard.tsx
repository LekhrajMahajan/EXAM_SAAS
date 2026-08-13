import React from 'react';
import type { Integration } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Settings, RefreshCw, XCircle } from 'lucide-react';

interface IntegrationCardProps {
  integration: Integration;
}

export function IntegrationCard({ integration }: IntegrationCardProps) {
  const isConnected = integration.status === 'Connected';
  const isError = integration.status === 'Error';

  return (
    <Card className={`border overflow-hidden transition-colors ${isConnected ? 'border-emerald-200 shadow-sm' : isError ? 'border-red-200' : 'border-slate-200'}`}>
       <div className={`p-4 flex items-center justify-between border-b ${isConnected ? 'bg-emerald-50 border-emerald-100' : isError ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center gap-3">
             <img src={integration.logo} alt={integration.name} className="w-10 h-10 rounded-md bg-white border border-slate-200 p-1" />
             <div>
                <h4 className="font-bold text-slate-900">{integration.name}</h4>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{integration.category}</p>
             </div>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-bold ${isConnected ? 'bg-emerald-100 text-emerald-700' : isError ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
             {integration.status}
          </span>
       </div>
       <CardContent className="p-4">
          <p className="text-sm text-slate-600 mb-4 h-10">{integration.description}</p>
          
          {isConnected && integration.lastSync && (
             <p className="text-xs text-slate-400 mb-4 flex items-center">
               <RefreshCw className="w-3 h-3 mr-1" /> Last Sync: {integration.lastSync}
             </p>
          )}

          {isError && integration.lastSync && (
             <p className="text-xs text-red-500 mb-4 flex items-center">
               <XCircle className="w-3 h-3 mr-1" /> Failed Sync: {integration.lastSync}
             </p>
          )}

          <div className="flex gap-2">
             {isConnected ? (
               <>
                 <Button variant="outline" size="sm" className="flex-1 bg-white border-slate-200">
                    <Settings className="w-4 h-4 mr-2" /> Configure
                 </Button>
                 <Button variant="outline" size="sm" className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700">
                    Disconnect
                 </Button>
               </>
             ) : (
               <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
                  Connect Account
               </Button>
             )}
          </div>
       </CardContent>
    </Card>
  );
}
