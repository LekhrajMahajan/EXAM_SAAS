import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { CertificateTable } from '../components/CertificateTable';
import { DUMMY_CERT_STATS, DUMMY_CERTIFICATES } from '../utils/placeholder';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ShieldCheck } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function CertificateDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Certificate Management" 
          description="Generate, manage, and verify candidate certificates." 
        />
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" className="bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
             <Link to="/company/certificates/verify">
                <ShieldCheck className="w-4 h-4 mr-2" /> Verify Certificate
             </Link>
           </Button>
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
             <Link to="/company/certificates/generate">
               <PlusCircle className="w-4 h-4 mr-2" />
               Generate New
             </Link>
           </Button>
        </div>
      </div>

      <StatisticsGrid stats={DUMMY_CERT_STATS} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Recently Generated Certificates</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search by candidate or certificate no..." 
                className="pl-9 bg-white"
              />
            </div>
            <Button variant="link" asChild className="text-indigo-600 p-0 flex-shrink-0">
              <Link to="/company/certificates/list">View All</Link>
            </Button>
          </div>
        </div>
        
        <CertificateTable records={DUMMY_CERTIFICATES} />
      </div>
    </div>
  );
}
