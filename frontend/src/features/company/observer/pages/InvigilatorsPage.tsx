import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/page-header';
import { DUMMY_STAFF } from '../utils/placeholder';
import { InvigilatorCard } from '../components/InvigilatorCard';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, Plus, Filter } from 'lucide-react';

export function InvigilatorsPage() {
  const [search, setSearch] = useState('');
  
  const invigilators = DUMMY_STAFF.filter(s => s.role === 'Invigilator' && 
    (s.name.toLowerCase().includes(search.toLowerCase()) || 
     s.employeeId.toLowerCase().includes(search.toLowerCase())));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <PageHeader title="Invigilator Management" description="Manage invigilators and room-level staff for examinations." />
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Invigilator
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input className="pl-9" placeholder="Search invigilators by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600">
          <option value="">All Statuses</option>
          <option>Active</option><option>Inactive</option><option>On Leave</option>
        </select>
        <Button variant="outline" className="bg-white"><Filter className="w-4 h-4 mr-2" /> More Filters</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {invigilators.map(inv => <InvigilatorCard key={inv.id} invigilator={inv} />)}
      </div>
    </div>
  );
}
