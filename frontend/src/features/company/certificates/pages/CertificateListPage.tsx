import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { CertificateTable } from '../components/CertificateTable';
import { useCertificates } from '../hooks/useCertificates';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, Filter, DownloadCloud } from 'lucide-react';

export function CertificateListPage() {
  const { data: certData } = useCertificates();
  const certificates = certData?.data || [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="All Certificates" 
          description="View, search, and export the registry of all issued certificates." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-card text-primary border-primary/20 hover:bg-primary/10">
             <DownloadCloud className="w-4 h-4 mr-2" />
             Export Selected
           </Button>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by certificate number, candidate name, or application ID..." 
            className="pl-9 bg-muted/50"
          />
        </div>
        
        <Button variant="outline" className="w-full sm:w-auto bg-card">
           <Filter className="w-4 h-4 mr-2" />
           Advanced Filters
        </Button>
      </div>

      <CertificateTable records={certificates} />
    </div>
  );
}
