import React from 'react';
import { useAppShell } from '../../providers/AppShellProvider';
import { Menu, X, Command, Bell, Search, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function AppHeader() {
  const { isSidebarCollapsed, setSidebarCollapsed, setMobileDrawerOpen, setCommandPaletteOpen } = useAppShell();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          className="hidden md:flex p-2 text-slate-500 hover:bg-slate-100 rounded-md"
          onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
        >
          <Menu className="w-5 h-5" />
        </button>
        <button 
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
          onClick={() => setMobileDrawerOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-slate-900 text-lg">PracticeExam</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl px-8 hidden md:block">
        <button 
          className="w-full h-10 px-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between text-slate-400 transition-colors"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span className="text-sm">Search anywhere...</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-mono">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-500 font-mono">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="md:hidden p-2 text-slate-500" onClick={() => setCommandPaletteOpen(true)}>
          <Search className="w-5 h-5" />
        </button>
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 cursor-pointer">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
}
