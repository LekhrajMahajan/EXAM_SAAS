import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Settings, Building2 } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Core Configuration',
    items: [
      { name: 'General', path: '/master-admin/settings/general', icon: Settings },
      { name: 'Organization', path: '/master-admin/settings/organization', icon: Building2 },
    ]
  }
];

export function MASettingsSidebar() {
  return (
    <nav className="space-y-6">
       {SECTIONS.map((section, idx) => (
         <div key={idx}>
            <h4 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
               {section.title}
            </h4>
            <div className="space-y-1">
               {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-indigo-50 text-indigo-700" 
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </NavLink>
               ))}
            </div>
         </div>
       ))}
    </nav>
  );
}
