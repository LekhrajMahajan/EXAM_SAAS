import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Files, 
  Ticket, 
  Calendar, 
  Laptop, 
  Trophy, 
  Medal, 
  Award, 
  Bell, 
  HelpCircle,
  LogOut
} from 'lucide-react';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

export function CandidateSidebar() {
  const routes = [
    { name: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/candidate/profile', icon: User },
    { name: 'Application', path: '/candidate/application', icon: FileText },
    { name: 'Documents', path: '/candidate/documents', icon: Files },
    { name: 'Admit Card', path: '/candidate/admit-card', icon: Ticket },
    { name: 'Exam Schedule', path: '/candidate/exam-schedule', icon: Calendar },
    { name: 'Mock Test', path: '/candidate/mock-test', icon: Laptop },
    { name: 'Results', path: '/candidate/results', icon: Trophy },
    { name: 'Merit List', path: '/candidate/merit', icon: Medal },
    { name: 'Certificates', path: '/candidate/certificates', icon: Award },
    { name: 'Notifications', path: '/candidate/notifications', icon: Bell },
    { name: 'Support', path: '/candidate/support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-slate-900 flex-shrink-0 flex flex-col border-r border-slate-800 hidden md:flex h-full">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900">
        <h1 className="text-xl font-bold tracking-tight text-white">Candidate Portal</h1>
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                )
              }
            >
              <route.icon className="w-4 h-4 flex-shrink-0" />
              {route.name}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-800">
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
