import React from 'react';
import { useAppShell } from '../../providers/AppShellProvider';
import { Bell, User, Menu, X, BookOpen, Clock, FileText } from 'lucide-react';

export function CandidateLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const candidateNav = [
    { label: 'Dashboard', icon: BookOpen },
    { label: 'My Exams', icon: Clock },
    { label: 'Results', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Candidate Header */}
      <header className="bg-indigo-700 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button 
                className="md:hidden p-2 hover:bg-indigo-600 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-indigo-700 font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">Candidate Portal</span>
            </div>

            <nav className="hidden md:flex space-x-1">
              {candidateNav.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button key={i} className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${i === 0 ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}>
                    <Icon className="w-4 h-4" /> {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-indigo-100 hover:bg-indigo-600 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-indigo-500">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-bold leading-none">John Doe</div>
                  <div className="text-xs text-indigo-200 mt-1">CAND-10293</div>
                </div>
                <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-indigo-700 border-2 border-indigo-300">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-indigo-800 text-white border-t border-indigo-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {candidateNav.map((item, i) => {
              const Icon = item.icon;
              return (
                <button key={i} className="w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 flex items-center gap-3">
                  <Icon className="w-5 h-5" /> {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} PracticeExam Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
