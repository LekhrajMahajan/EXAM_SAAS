import React, { useState } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Search } from 'lucide-react';
import { DUMMY_CANDIDATES } from '../utils/placeholder';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Badge } from '@/shared/components/ui/badge';
import { Label } from '@/shared/components/ui/label';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

export function CandidateSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = DUMMY_CANDIDATES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(c => c.id)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">Select Candidates</h3>
        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50">
          {selected.size} Selected
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search by name or app no..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-slate-200 rounded-md overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <Checkbox 
            id="selectAll" 
            checked={filtered.length > 0 && selected.size === filtered.length}
            onCheckedChange={toggleAll}
          />
          <Label htmlFor="selectAll" className="text-sm font-medium cursor-pointer">
            Select All ({filtered.length})
          </Label>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="divide-y divide-slate-100">
            {filtered.map(candidate => (
              <div key={candidate.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                <Checkbox 
                  id={candidate.id} 
                  checked={selected.has(candidate.id)}
                  onCheckedChange={() => toggleOne(candidate.id)}
                />
                <Label htmlFor={candidate.id} className="flex-1 cursor-pointer flex flex-col">
                  <span className="font-medium text-slate-900">{candidate.name}</span>
                  <span className="text-xs text-slate-500">{candidate.applicationNumber}</span>
                </Label>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No candidates found matching your search.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
