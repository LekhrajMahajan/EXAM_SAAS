import React from 'react';
import { useAppShell } from '../../providers/AppShellProvider';
import { X } from 'lucide-react';
import { AppSidebar } from '../sidebar/AppSidebar';
import type { MenuGroup } from '../../types';

export function MobileDrawer({ menuGroups }: { menuGroups: MenuGroup[] }) {
  const { isMobileDrawerOpen, setMobileDrawerOpen } = useAppShell();

  if (!isMobileDrawerOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/60 z-40 md:hidden"
        onClick={() => setMobileDrawerOpen(false)}
      />
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-300 z-50 md:hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-white text-lg">PracticeExam</span>
          </div>
          <button 
            className="p-2 text-slate-400 hover:text-white rounded-md"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Reusing sidebar logic for mobile, but forced expanded width */}
          <div className="py-4">
            {menuGroups.map(group => (
              <div key={group.id} className="mb-6 px-2">
                <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map(item => (
                    <li key={item.id}>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors text-left text-sm font-medium">
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
