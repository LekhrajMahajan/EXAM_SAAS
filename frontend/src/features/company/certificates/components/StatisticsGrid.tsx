import React from 'react';
import type { CertificateStatistics } from '../types';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Award, CheckCircle2, Download, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';

interface StatisticsGridProps {
  stats: CertificateStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <Award className="w-6 h-6 text-indigo-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.totalCertificates.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Total Certificates</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.generatedCertificates.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Generated</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <Download className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.downloadedCertificates.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Downloaded</p>
        </CardContent>
      </Card>
      
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <ShieldCheck className="w-6 h-6 text-teal-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.verifiedCertificates.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Externally Verified</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <Clock className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.pendingCertificates.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Pending Generation</p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-4 flex flex-col items-center text-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-slate-900">{stats.expiredCertificates.toLocaleString()}</p>
          <p className="text-xs font-medium text-slate-500 mt-1">Expired / Revoked</p>
        </CardContent>
      </Card>
    </div>
  );
}
