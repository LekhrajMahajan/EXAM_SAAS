import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { CertificateTable } from '../components/CertificateTable';
import { DUMMY_CERTIFICATES } from '../utils/placeholder';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, Filter, DownloadCloud } from 'lucide-react';

export function CertificateListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="All Certificates" 
          description="View, search, and export the registry of all issued certificates." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50">
             <DownloadCloud className="w-4 h-4 mr-2" />
             Export Selected
           </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by certificate number, candidate name, or application ID..." 
            className="pl-9 bg-slate-50"
          />
        </div>
        
        <Button variant="outline" className="w-full sm:w-auto bg-slate-50">
           <Filter className="w-4 h-4 mr-2" />
           Advanced Filters
        </Button>
      </div>

      <CertificateTable records={DUMMY_CERTIFICATES} />
    </div>
  );
}
