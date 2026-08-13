import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { AnalyticsCard } from '../components/AnalyticsCard';
import { DUMMY_CERT_STATS } from '../utils/placeholder';

export function CertificateAnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Certificate Analytics" 
        description="Monitor distribution, download rates, and verification metrics." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsCard title="Certificates by Exam" description="Volume of certificates generated across different examination batches.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Bar Chart)</p>
           </div>
        </AnalyticsCard>
        
        <AnalyticsCard title="Download vs Verified" description="Comparison of how many certificates were claimed vs authenticated externally.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Pie Chart)</p>
           </div>
           <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                 <p className="text-xl font-bold text-slate-800">{DUMMY_CERT_STATS.downloadedCertificates.toLocaleString()}</p>
                 <p className="text-xs text-slate-500">Downloads</p>
              </div>
              <div className="text-center">
                 <p className="text-xl font-bold text-slate-800">{DUMMY_CERT_STATS.verifiedCertificates.toLocaleString()}</p>
                 <p className="text-xs text-slate-500">Verifications</p>
              </div>
           </div>
        </AnalyticsCard>

        <AnalyticsCard title="Verification Failures" description="Reasons for authentication errors over time.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Line Graph)</p>
           </div>
        </AnalyticsCard>

        <AnalyticsCard title="Geographic Issuance" description="Certificates issued by test center regions.">
           <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
              <p className="text-slate-400 font-medium">Chart Placeholder (Map)</p>
           </div>
        </AnalyticsCard>
      </div>
    </div>
  );
}
