import React, { useState } from 'react';
import { analyticsService } from '../api/analytics.service';
import type { GlobalSearchResult } from '../types/analytics.types';
import { Search, X, Building, MapPin, FileText, User, UserCheck, ArrowUpRight } from 'lucide-react';

interface GlobalAnalyticsSearchProps {
  onSelectResult: (type: string, id: string, label: string) => void;
  onClose?: () => void;
}

export const GlobalAnalyticsSearch: React.FC<GlobalAnalyticsSearchProps> = ({ onSelectResult, onClose }) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || query.trim().length < 2) return;
    setLoading(true);
    try {
      const res = await analyticsService.search(query);
      if (res.success) {
        setResults(res.data);
      }
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Branch': return <Building className="w-4 h-4 text-indigo-400" />;
      case 'Center': return <MapPin className="w-4 h-4 text-emerald-400" />;
      case 'Exam': return <FileText className="w-4 h-4 text-amber-400" />;
      case 'Employee': return <User className="w-4 h-4 text-cyan-400" />;
      default: return <UserCheck className="w-4 h-4 text-rose-400" />;
    }
  };

  const allItems = [
    ...(results?.branches || []),
    ...(results?.centers || []),
    ...(results?.exams || []),
    ...(results?.employees || []),
    ...(results?.candidates || []),
  ];

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl space-y-4 max-w-2xl w-full mx-auto relative">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-indigo-400" /> Global Enterprise Analytics Search
        </h3>
        {onClose && (
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across Branches, Centers, Exams, Staff, or Candidates..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 text-white rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm placeholder-slate-400"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {results && (
        <div className="space-y-3 mt-2 max-h-80 overflow-y-auto pr-1">
          <div className="text-xs text-slate-400 font-semibold">
            Found {results.resultsCount} matching record(s) for &quot;{results.query}&quot;
          </div>
          {allItems.length === 0 ? (
            <div className="p-6 text-center text-slate-400 bg-slate-800/40 rounded-xl">
              No matching records discovered across the enterprise organization.
            </div>
          ) : (
            <div className="space-y-2">
              {allItems.map((item, idx) => (
                <div
                  key={`${item.type}-${item.id}-${idx}`}
                  onClick={() => {
                    onSelectResult(item.type, item.id, item.name);
                    if (onClose) onClose();
                  }}
                  className="p-3 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">{item.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">{item.code}</span>
                      </div>
                      <span className="text-xs text-slate-400 mt-0.5 block">{item.type} &bull; {item.subtitle}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
