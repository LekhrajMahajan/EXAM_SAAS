import React from 'react';
import type { FavoriteItem, RecentItem } from '../../types';
import { Star, Clock, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export function FavoritePanel({ items }: { items: FavoriteItem[] }) {
  if (items.length === 0) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-center text-sm text-slate-500">
        No favorites added yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        <h3 className="font-medium text-slate-800 text-sm">Favorites</h3>
      </div>
      <div className="p-2 space-y-1">
        {items.map(item => {
          const Icon = item.icon ? (Icons as any)[item.icon] || Icons.Circle : Icons.Circle;
          return (
            <button key={item.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-left group">
              <div className="p-1.5 bg-slate-100 text-slate-500 rounded group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-700 flex-1">{item.title}</span>
              <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function RecentPanel({ items }: { items: RecentItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
        <Clock className="w-4 h-4 text-sky-500" />
        <h3 className="font-medium text-slate-800 text-sm">Recently Visited</h3>
      </div>
      <div className="p-2 space-y-1">
        {items.map(item => {
          const Icon = item.icon ? (Icons as any)[item.icon] || Icons.Circle : Icons.Circle;
          return (
            <button key={item.id} className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 text-left group">
              <div className="p-1.5 bg-slate-100 text-slate-500 rounded group-hover:bg-white group-hover:text-sky-600 transition-colors">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-700 truncate">{item.title}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.timestamp}</div>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
