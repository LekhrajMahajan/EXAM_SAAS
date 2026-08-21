import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { StatisticsGrid } from '../components/StatisticsGrid';
import { CertificateTable } from '../components/CertificateTable';
import { useCertificates, useCertificateStats } from '../hooks/useCertificates';
import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ShieldCheck } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function CertificateDashboardPage() {
  const { data: statsData, isLoading: isLoadingStats } = useCertificateStats();
  const { data: certData, isLoading: isLoadingCerts } = useCertificates();

  const stats = statsData?.data;
  const certificates = certData?.data || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Certificate Management" 
          description="Generate, manage, and verify candidate certificates." 
        />
        <div className="flex flex-wrap items-center gap-2">
           <Button variant="outline" className="bg-card" asChild>
             <Link to="/company/certificates/verify">
                <ShieldCheck className="w-4 h-4 mr-2" /> Verify Certificate
             </Link>
           </Button>
           <Button asChild>
             <Link to="/company/certificates/generate">
               <PlusCircle className="w-4 h-4 mr-2" />
               Generate New
             </Link>
           </Button>
        </div>
      </div>

      {isLoadingStats || !stats ? (
        <div className="text-center p-12 text-muted-foreground border border-border border-dashed rounded-xl">
          Loading statistics...
        </div>
      ) : (
        <StatisticsGrid stats={stats} />
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-foreground">Recently Generated Certificates</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by candidate or certificate no..." 
                className="pl-9 bg-muted/50"
              />
            </div>
            <Button variant="link" asChild className="text-primary p-0 flex-shrink-0">
              <Link to="/company/certificates/list">View All</Link>
            </Button>
          </div>
        </div>
        
        {isLoadingCerts ? (
          <div className="text-center p-12 text-muted-foreground border border-border border-dashed rounded-xl">
            Loading certificates...
          </div>
        ) : (
          <CertificateTable records={certificates} />
        )}
      </div>
    </div>
  );
}
