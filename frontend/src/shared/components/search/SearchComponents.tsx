import React from 'react';
import { Search } from 'lucide-react';

interface GlobalSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export function GlobalSearch({ value, onChange, placeholder = 'Search...', className = '' }: GlobalSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-4 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
      />
    </div>
  );
}

export function DebouncedSearch({ value, onChange, placeholder = 'Search...', className = '', delay = 300 }: GlobalSearchProps & { delay?: number }) {
  const [localValue, setLocalValue] = React.useState(value);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, delay);
    return () => clearTimeout(handler);
  }, [localValue, value, delay, onChange]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-4 rounded-md border border-slate-200 bg-white text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
      />
    </div>
  );
}
