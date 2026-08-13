import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '../../types';

export function BreadcrumbBar({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center px-6 py-3 bg-white border-b border-slate-200 overflow-x-auto whitespace-nowrap">
      <ol className="flex items-center gap-2 text-sm">
        <li>
          <a href="#" className="text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <Home className="w-4 h-4" />
          </a>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.id} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-slate-400" />
              {isLast ? (
                <span className="font-medium text-slate-900">{item.title}</span>
              ) : (
                <a href={item.path || '#'} className="text-slate-500 hover:text-indigo-600 transition-colors">
                  {item.title}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
