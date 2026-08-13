import React, { useState } from 'react';
import { DeveloperCard } from '../components/DeveloperComponents';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function IconBrowserPage() {
  const [query, setQuery] = useState('');
  
  // Extract all icon names from the Icons object (excluding non-icon exports)
  const allIconNames = Object.keys(Icons).filter(key => 
    typeof (Icons as any)[key] === 'function' && key !== 'createLucideIcon'
  );

  const filteredIcons = allIconNames.filter(name => 
    name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 100); // Limit to 100 for performance

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Icon Browser</h1>
        <p className="text-sm text-slate-500">Search and copy standard system icons.</p>
      </div>

      <DeveloperCard title="Search Icons">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              className="pl-9" 
              placeholder="Search icons (e.g., user, setting)..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 h-[600px] overflow-y-auto">
          {filteredIcons.map(name => {
            const Icon = (Icons as any)[name];
            return (
              <div 
                key={name} 
                className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-lg hover:border-indigo-500 hover:shadow-sm cursor-pointer transition-all group"
                onClick={() => navigator.clipboard.writeText(`<${name} />`)}
              >
                <Icon className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 mb-2" />
                <span className="text-[10px] font-mono text-slate-500 truncate w-full text-center">{name}</span>
              </div>
            );
          })}
          
          {filteredIcons.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No icons found matching "{query}"
            </div>
          )}
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
          Showing {filteredIcons.length} of {allIconNames.length} icons. Click an icon to copy its JSX component name.
        </div>
      </DeveloperCard>
    </div>
  );
}
