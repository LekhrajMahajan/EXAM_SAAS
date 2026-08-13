import React from 'react';
import { X, Search } from 'lucide-react';
import type { TabItem } from '../../types';

interface TabManagerProps {
  tabs: TabItem[];
  activeTabId: string | null;
  onTabChange: (id: string) => void;
  onTabClose: (id: string) => void;
}

export function TabManager({ tabs, activeTabId, onTabChange, onTabClose }: TabManagerProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center bg-white border-b border-slate-200 px-2 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div 
            key={tab.id}
            className={`group flex items-center gap-2 px-4 py-2 border-r border-slate-100 min-w-[120px] max-w-[200px] cursor-pointer transition-colors
              ${isActive ? 'bg-indigo-50/50 text-indigo-700 font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600' : 'text-slate-600 hover:bg-slate-50'}
            `}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="truncate text-sm flex-1 select-none">{tab.title}</span>
            {!tab.isPinned && (
              <button 
                className={`p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
