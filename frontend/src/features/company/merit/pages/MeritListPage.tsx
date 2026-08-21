import React from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { MeritTable } from '../components/MeritTable';
import { useMeritLists } from '../hooks/merit.hooks';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';

export function MeritListPage() {
  const { data, isLoading } = useMeritLists();
  const records = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="All Ranked Candidates" 
          description="View, search, and export candidates across all generated merit lists." 
        />
        <div className="flex items-center gap-2">
           <Button variant="outline" className="bg-card text-primary border-primary/20 hover:bg-primary/10">
             <Download className="w-4 h-4 mr-2" />
             Export Selected
           </Button>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search candidates by name, app number, category, or state..." 
            className="pl-9 bg-muted/50"
          />
        </div>
        
        <Button variant="outline" className="w-full sm:w-auto bg-muted/50 border-border">
           <Filter className="w-4 h-4 mr-2" />
           Advanced Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center p-12 text-muted-foreground border border-border border-dashed rounded-xl">
          Loading ranked candidates...
        </div>
      ) : (
        <MeritTable records={records} />
      )}
    </div>
  );
}
