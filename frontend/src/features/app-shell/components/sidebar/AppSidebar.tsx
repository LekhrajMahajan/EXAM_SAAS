import React from 'react';
import { useAppShell } from '../../providers/AppShellProvider';
import type { MenuGroup } from '../../types';
import * as Icons from 'lucide-react';
import { ChevronRight } from 'lucide-react';

export function AppSidebar({ menuGroups }: { menuGroups: MenuGroup[] }) {
  const { isSidebarCollapsed } = useAppShell();
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className={`hidden md:flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 z-20 ${isSidebarCollapsed ? 'w-16' : 'w-64'} overflow-y-auto overflow-x-hidden border-r border-slate-800`}>
      <div className="py-4">
        {menuGroups.map(group => (
          <div key={group.id} className="mb-6">
            {!isSidebarCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </h3>
            )}
            <ul className="space-y-1 px-2">
              {group.items.map(item => {
                const Icon = item.icon ? (Icons as any)[item.icon] || Icons.Circle : Icons.Circle;
                const isExpanded = expandedItems.has(item.id);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <li key={item.id}>
                    <button 
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                      onClick={() => hasChildren ? toggleExpand(item.id) : undefined}
                      title={isSidebarCollapsed ? item.title : undefined}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {!isSidebarCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.title}</span>}
                      </div>
                      {!isSidebarCollapsed && hasChildren && (
                        <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      )}
                    </button>
                    {!isSidebarCollapsed && hasChildren && isExpanded && (
                      <ul className="mt-1 space-y-1 px-2 pb-2">
                        {item.children!.map(child => (
                          <li key={child.id}>
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white text-sm text-slate-400 transition-colors pl-9">
                              <span className="whitespace-nowrap">{child.title}</span>
                              {child.badge && <span className="ml-auto bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{child.badge}</span>}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
