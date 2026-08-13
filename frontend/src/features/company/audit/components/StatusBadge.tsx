import React from 'react';
import type { AuditStatus } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';

export function StatusBadge({ status }: { status: AuditStatus }) {
  switch (status) {
    case 'Success': 
      return <span className="flex items-center gap-1 text-emerald-600 font-medium text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Success</span>;
    case 'Failure': 
      return <span className="flex items-center gap-1 text-red-600 font-medium text-xs"><XCircle className="w-3.5 h-3.5" /> Failure</span>;
    case 'Warning': 
      return <span className="flex items-center gap-1 text-amber-600 font-medium text-xs"><AlertTriangle className="w-3.5 h-3.5" /> Warning</span>;
    case 'Info': 
      return <span className="flex items-center gap-1 text-blue-600 font-medium text-xs"><Info className="w-3.5 h-3.5" /> Info</span>;
  }
  return null;
}
