import React from 'react';
import { useAppShell } from '../../providers/AppShellProvider';
import { X, Search } from 'lucide-react';

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppShell();
  const [query, setQuery] = React.useState('');

  if (!isCommandPaletteOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[60vh]">
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search commands, pages, or candidates..."
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            className="p-1 text-slate-400 hover:text-slate-600 rounded bg-slate-100 ml-2"
            onClick={() => setCommandPaletteOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {query.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p className="mb-2">Type to search across the platform.</p>
              <div className="flex justify-center gap-4 text-xs mt-4">
                <span className="flex items-center gap-1"><kbd className="bg-slate-100 px-1 rounded">↑</kbd><kbd className="bg-slate-100 px-1 rounded">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-slate-100 px-1 rounded">↵</kbd> to select</span>
                <span className="flex items-center gap-1"><kbd className="bg-slate-100 px-1 rounded">esc</kbd> to close</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              No results found for "{query}".
            </div>
          )}
        </div>
      </div>
    </>
  );
}
