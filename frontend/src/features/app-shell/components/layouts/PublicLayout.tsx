import React from 'react';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-slate-900 text-xl tracking-tight">PracticeExam</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600">Features</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600">Solutions</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600">Pricing</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Log in</a>
            <a href="/register" className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Sign up</a>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <footer className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-white text-xl tracking-tight">PracticeExam</span>
          </div>
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} PracticeExam. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
