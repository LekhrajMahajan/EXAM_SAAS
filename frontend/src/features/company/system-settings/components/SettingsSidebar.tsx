import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { 
  Settings, Building2, Shield, KeyRound, 
  ClipboardCheck, BellRing, Mail, MessageSquare, 
  Palette, SunMoon, ToggleLeft, Plug, 
  Code2, Database, History 
} from 'lucide-react';

const SECTIONS = [
  {
    title: 'Core Configuration',
    items: [
      { name: 'Overview', path: '/company/system-settings', icon: Settings, end: true },
      { name: 'General', path: '/company/system-settings/general', icon: Settings },
      { name: 'Organization', path: '/company/system-settings/organization', icon: Building2 },
    ]
  },
  {
    title: 'Access & Security',
    items: [
      { name: 'Security Policies', path: '/company/system-settings/security', icon: Shield },
      { name: 'Authentication', path: '/company/system-settings/authentication', icon: KeyRound },
      { name: 'Exam Policy Default', path: '/company/system-settings/exam-policy', icon: ClipboardCheck },
    ]
  },
  {
    title: 'Communication',
    items: [
      { name: 'Notifications', path: '/company/system-settings/notification', icon: BellRing },
      { name: 'Email Config', path: '/company/system-settings/email', icon: Mail },
      { name: 'SMS Config', path: '/company/system-settings/sms', icon: MessageSquare },
    ]
  },
  {
    title: 'Appearance',
    items: [
      { name: 'Branding', path: '/company/system-settings/branding', icon: Palette },
      { name: 'Theme', path: '/company/system-settings/theme', icon: SunMoon },
    ]
  },
  {
    title: 'Developer & Advanced',
    items: [
      { name: 'Feature Flags', path: '/company/system-settings/feature-flags', icon: ToggleLeft },
      { name: 'Integrations', path: '/company/system-settings/integrations', icon: Plug },
      { name: 'API Keys', path: '/company/system-settings/api-keys', icon: Code2 },
      { name: 'Backup & Restore', path: '/company/system-settings/backup', icon: Database },
      { name: 'Audit Configuration', path: '/company/system-settings/audit', icon: History },
    ]
  }
];

export function SettingsSidebar() {
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
                    end={item.end}
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
