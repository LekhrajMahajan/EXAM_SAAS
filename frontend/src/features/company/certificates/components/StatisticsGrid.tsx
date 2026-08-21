import React from 'react';
import type { CertificateStatistics } from '../types';
import { Award, CheckCircle2, Download, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { MasterAdminStatCard } from '../../../master-admin/components/cards/MasterAdminStatCard';

interface StatisticsGridProps {
  stats: CertificateStatistics;
}

export function StatisticsGrid({ stats }: StatisticsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <MasterAdminStatCard
        title="Total Certificates"
        value={stats.totalCertificates}
        icon={Award}
        accent="slate"
      />
      
      <MasterAdminStatCard
        title="Generated"
        value={stats.generatedCertificates}
        icon={CheckCircle2}
        accent="green"
      />
      
      <MasterAdminStatCard
        title="Downloaded"
        value={stats.downloadedCertificates}
        icon={Download}
        accent="slate"
      />
      
      <MasterAdminStatCard
        title="Externally Verified"
        value={stats.verifiedCertificates}
        icon={ShieldCheck}
        accent="lime"
      />

      <MasterAdminStatCard
        title="Pending Generation"
        value={stats.pendingCertificates}
        icon={Clock}
        accent="amber"
      />

      <MasterAdminStatCard
        title="Expired / Revoked"
        value={stats.expiredCertificates}
        icon={AlertTriangle}
        accent="red"
      />
    </div>
  );
}
