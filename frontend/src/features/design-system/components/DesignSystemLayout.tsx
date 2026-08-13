import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Palette, Type, MousePointer2, FormInput, Table, Layout, MessageSquare, Layers, Navigation, Box, AlertCircle, PieChart, MonitorPlay, Code } from 'lucide-react';

const MENU_GROUPS = [
  {
    title: 'Getting Started',
    items: [
      { path: '/design-system', label: 'Introduction', icon: Box, exact: true },
      { path: '/design-system/playground', label: 'Component Playground', icon: Code },
    ]
  },
  {
    title: 'Foundations',
    items: [
      { path: '/design-system/colors', label: 'Colors & Tokens', icon: Palette },
      { path: '/design-system/typography', label: 'Typography', icon: Type },
      { path: '/design-system/icons', label: 'Icons', icon: MonitorPlay },
      { path: '/design-system/layout', label: 'Layout System', icon: Layout },
    ]
  },
  {
    title: 'Components',
    items: [
      { path: '/design-system/buttons', label: 'Buttons', icon: MousePointer2 },
      { path: '/design-system/forms', label: 'Forms', icon: FormInput },
      { path: '/design-system/tables', label: 'Tables', icon: Table },
      { path: '/design-system/cards', label: 'Cards', icon: Layers },
      { path: '/design-system/dialogs', label: 'Dialogs', icon: MessageSquare },
      { path: '/design-system/navigation', label: 'Navigation', icon: Navigation },
      { path: '/design-system/feedback', label: 'Feedback', icon: AlertCircle },
      { path: '/design-system/badges', label: 'Badges', icon: Box },
      { path: '/design-system/charts', label: 'Charts', icon: PieChart },
    ]
  },
  {
    title: 'Guidelines',
    items: [
      { path: '/design-system/accessibility', label: 'Accessibility', icon: AlertCircle },
      { path: '/design-system/responsive', label: 'Responsive Design', icon: MonitorPlay },
    ]
  }
];

export function DesignSystemLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-bold">DS</span>
            </div>
            <span className="font-bold text-white tracking-tight">Design System</span>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {MENU_GROUPS.map((group, idx) => (
            <div key={idx} className="mb-6">
              <h4 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {group.title}
              </h4>
              <ul className="space-y-0.5">
                {group.items.map(item => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-4 py-2 text-sm transition-colors ${isActive ? 'bg-slate-800 text-white font-medium border-r-2 border-indigo-500' : 'hover:bg-slate-800 hover:text-white'}`
                      }
                    >
                      <item.icon className="w-4 h-4 opacity-70" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden relative">
        <div className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Component Showcase</h1>
          <a href="/" className="text-sm text-indigo-600 hover:underline">Back to Application</a>
        </div>
        <div className="p-8 max-w-5xl mx-auto pb-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
